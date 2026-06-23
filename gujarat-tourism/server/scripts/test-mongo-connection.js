import dns from 'node:dns';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import {
  diagnoseMongoDns,
  maskMongoUri,
  printMongoConnectionHelp,
  resolveMongoUri,
} from '../utils/mongoDiagnostics.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.join(__dirname, '..');

dotenv.config({ path: path.join(serverRoot, '.env') });
dotenv.config({ path: path.join(serverRoot, '.env.local'), override: true });

dns.setDefaultResultOrder('ipv4first');

async function main() {
  const mongoURI = process.env.MONGO_URI_STANDARD || process.env.MONGO_URI;

  if (!mongoURI) {
    console.error('MONGO_URI is not set in server/.env or server/.env.local');
    process.exit(1);
  }

  console.log('Gujarat Tourism — MongoDB connection test\n');

  await diagnoseMongoDns(process.env.MONGO_URI || mongoURI);

  try {
    const { uri, strategy } = await resolveMongoUri(mongoURI);
    console.log(`Connect strategy: ${strategy}`);
    console.log(`Connecting with: ${maskMongoUri(uri)}`);

    await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });

    const { host, name, readyState } = mongoose.connection;
    console.log('\nConnection successful');
    console.log(`  Host: ${host}`);
    console.log(`  Database: ${name}`);
    console.log(`  Ready state: ${readyState}`);

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`  Collections (${collections.length}): ${collections.map((c) => c.name).join(', ') || '(none)'}`);
  } catch (error) {
    console.error(`\nConnection failed: ${error.message}`);
    if (error.code === 'MONGO_DNS_SRV_FAILED' || error.message?.includes('querySrv')) {
      printMongoConnectionHelp(error);
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected.');
  }
}

main();
