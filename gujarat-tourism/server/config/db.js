import dns from 'node:dns';
import mongoose from 'mongoose';
import {
  diagnoseMongoDns,
  maskMongoUri,
  printMongoConnectionHelp,
  resolveMongoUri,
} from '../utils/mongoDiagnostics.js';

dns.setDefaultResultOrder('ipv4first');

const connectionOptions = {
  serverSelectionTimeoutMS: 15000,
  socketTimeoutMS: 45000,
};

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI_STANDARD || process.env.MONGO_URI;

  if (!mongoURI) {
    throw new Error('MONGO_URI is not defined in server/.env or server/.env.local');
  }

  const isDebug = process.env.MONGO_DEBUG === 'true' || process.env.NODE_ENV !== 'production';

  if (isDebug) {
    await diagnoseMongoDns(process.env.MONGO_URI || mongoURI);
  } else {
    console.log(`Connecting to MongoDB (${maskMongoUri(mongoURI)})...`);
  }

  try {
    const { uri, strategy, hosts } = await resolveMongoUri(mongoURI);

    if (strategy !== 'direct') {
      console.log(`MongoDB connect strategy: ${strategy}`);
      if (hosts?.length) {
        console.log(`Resolved hosts: ${hosts.join(', ')}`);
      }
    }

    const conn = await mongoose.connect(uri, connectionOptions);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    if (error.code === 'MONGO_DNS_SRV_FAILED' || error.message?.includes('querySrv')) {
      printMongoConnectionHelp(error);
    } else {
      console.error('\n--- MongoDB connection error ---');
      console.error(`Message: ${error.message}`);
      if (error.reason) console.error(`Reason: ${error.reason}`);
      console.error(`URI used: ${maskMongoUri(mongoURI)}`);
      console.error('--------------------------------\n');
    }
    throw error;
  }
};

export default connectDB;
