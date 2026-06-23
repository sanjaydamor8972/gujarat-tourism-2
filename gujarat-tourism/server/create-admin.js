import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.js';
import connectDB from './config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '.env.local'), override: true });

async function createAdmin() {
  try {
    await connectDB();    
    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'admin@gujarattourism.com' })
    
    if (existingAdmin) {
      console.log('Admin user already exists!')
      process.exit(0)
    }
    
    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@gujarattourism.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 9876543210'
    })
    
    console.log('✅ Admin user created successfully!')
    console.log('📧 Email: admin@gujarattourism.com')
    console.log('🔑 Password: admin123')
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}
createAdmin()