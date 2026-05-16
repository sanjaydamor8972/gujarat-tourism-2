import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    throw new Error('MONGO_URI is not defined in server/.env');
  }

  console.log('Connecting to MongoDB...');
  const conn = await mongoose.connect(mongoURI);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
  console.log(`Database: ${conn.connection.name}`);
  return conn;
};

export default connectDB;
