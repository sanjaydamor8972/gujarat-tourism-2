import dns from 'node:dns';
import { promisify } from 'node:util';

const PUBLIC_DNS = ['8.8.8.8', '1.1.1.1', '8.8.4.4'];

export function maskMongoUri(uri) {
  if (!uri) return '(not set)';
  return uri.replace(/(mongodb(?:\+srv)?:\/\/)([^:]+):([^@]+)@/, '$1$2:***@');
}

function parseSrvUri(uri) {
  if (!uri.startsWith('mongodb+srv://')) return null;

  const withoutScheme = uri.slice('mongodb+srv://'.length);
  const atIndex = withoutScheme.lastIndexOf('@');
  if (atIndex === -1) return null;

  const credentials = withoutScheme.slice(0, atIndex);
  const remainder = withoutScheme.slice(atIndex + 1);
  const [hostPart, query = ''] = remainder.split('?');
  const slashIndex = hostPart.indexOf('/');
  const host = slashIndex === -1 ? hostPart : hostPart.slice(0, slashIndex);
  const dbPath = slashIndex === -1 ? '' : hostPart.slice(slashIndex);

  return { credentials, host, dbPath, query };
}

function createResolver(servers) {
  const resolver = new dns.Resolver();
  resolver.setServers(servers);
  return resolver;
}

function resolveSrv(resolver, hostname) {
  return promisify(resolver.resolveSrv.bind(resolver))(`_mongodb._tcp.${hostname}`);
}

function resolveTxt(resolver, hostname) {
  return promisify(resolver.resolveTxt.bind(resolver))(`_mongodb._tcp.${hostname}`).catch(
    () => []
  );
}

async function lookupSrv(hostname, servers, label) {
  const resolver = createResolver(servers);
  const [srvRecords, txtRecords] = await Promise.all([
    resolveSrv(resolver, hostname),
    resolveTxt(resolver, hostname),
  ]);

  return {
    label,
    servers,
    srvRecords,
    txtOptions: txtRecords.flat().join('&'),
  };
}

export async function diagnoseMongoDns(uri) {
  const parsed = parseSrvUri(uri);
  const systemServers = dns.getServers();

  console.log('\n--- MongoDB connection diagnostics ---');
  console.log(`URI: ${maskMongoUri(uri)}`);
  console.log(`System DNS servers: ${systemServers.length ? systemServers.join(', ') : '(none configured)'}`);

  if (!parsed) {
    console.log('Connection type: standard mongodb:// (no SRV lookup required)');
    console.log('--------------------------------------\n');
    return { isSrv: false, systemServers };
  }

  console.log(`Atlas host: ${parsed.host}`);
  console.log('Connection type: mongodb+srv (requires DNS SRV lookup)');
  console.log(`SRV target: _mongodb._tcp.${parsed.host}`);

  const attempts = [
    { label: 'system DNS', servers: systemServers.length ? systemServers : PUBLIC_DNS },
    { label: 'public DNS (8.8.8.8, 1.1.1.1)', servers: PUBLIC_DNS },
  ];

  for (const attempt of attempts) {
    try {
      const result = await lookupSrv(parsed.host, attempt.servers, attempt.label);
      console.log(`SRV lookup via ${attempt.label}: OK (${result.srvRecords.length} host(s))`);
      result.srvRecords.forEach((record) => {
        console.log(`  - ${record.name}:${record.port} (priority ${record.priority})`);
      });
      if (result.txtOptions) {
        console.log(`TXT options: ${result.txtOptions}`);
      }
      console.log('--------------------------------------\n');
      return { isSrv: true, parsed, ...result, systemServers };
    } catch (error) {
      console.log(`SRV lookup via ${attempt.label}: FAILED (${error.code || error.message})`);
    }
  }

  console.log('--------------------------------------\n');
  return { isSrv: true, parsed, systemServers, srvLookupFailed: true };
}

export async function resolveMongoUri(uri) {
  if (!uri.startsWith('mongodb+srv://')) {
    return { uri, strategy: 'direct' };
  }

  const parsed = parseSrvUri(uri);
  if (!parsed) {
    throw new Error('Invalid mongodb+srv URI format');
  }

  const lookupOrder = [
    { label: 'system DNS', servers: dns.getServers().length ? dns.getServers() : PUBLIC_DNS },
    { label: 'public DNS', servers: PUBLIC_DNS },
  ];

  for (const attempt of lookupOrder) {
    try {
      const { srvRecords, txtOptions } = await lookupSrv(parsed.host, attempt.servers, attempt.label);
      const hosts = srvRecords.map((record) => `${record.name}:${record.port}`).join(',');
      const params = new URLSearchParams(parsed.query);

      if (txtOptions) {
        for (const part of txtOptions.split('&')) {
          const [key, value] = part.split('=');
          if (key && !params.has(key)) params.set(key, value ?? '');
        }
      }

      if (!params.has('ssl') && !params.has('tls')) params.set('ssl', 'true');

      const query = params.toString();
      const standardUri = `mongodb://${parsed.credentials}@${hosts}${parsed.dbPath}${query ? `?${query}` : ''}`;

      return {
        uri: standardUri,
        strategy: `srv-converted (${attempt.label})`,
        hosts: srvRecords.map((record) => `${record.name}:${record.port}`),
      };
    } catch {
      // try next resolver
    }
  }

  if (process.env.MONGO_URI_STANDARD) {
    return {
      uri: process.env.MONGO_URI_STANDARD,
      strategy: 'MONGO_URI_STANDARD fallback',
    };
  }

  const error = new Error(
    `DNS SRV lookup failed for _mongodb._tcp.${parsed.host} (querySrv ECONNREFUSED). ` +
      'Your network or DNS server is blocking MongoDB Atlas SRV records.'
  );
  error.code = 'MONGO_DNS_SRV_FAILED';
  error.host = parsed.host;
  throw error;
}

export function printMongoConnectionHelp(error) {
  console.error('\n--- How to fix MongoDB connection ---');
  console.error('Issue: mongodb+srv:// needs a DNS SRV lookup. Your PC/network DNS refused it.');
  console.error('');
  console.error('Try these fixes (in order):');
  console.error('  1. Switch to a public DNS on your PC (8.8.8.8 or 1.1.1.1), then restart the server.');
  console.error('  2. Disable VPN / corporate proxy temporarily, or allow DNS to _mongodb._tcp.*.mongodb.net.');
  console.error('  3. In MongoDB Atlas -> Connect -> Drivers, copy the "Standard connection string"');
  console.error('     and set it as MONGO_URI_STANDARD in server/.env (keeps MONGO_URI as backup).');
  console.error('  4. In Atlas -> Network Access, add your current IP address.');
  console.error('');
  if (error?.host) {
    console.error(`Atlas host: ${error.host}`);
    console.error(`SRV record: _mongodb._tcp.${error.host}`);
  }
  console.error('Run: npm run test:db   (full DNS + connection test)');
  console.error('--------------------------------------\n');
}
