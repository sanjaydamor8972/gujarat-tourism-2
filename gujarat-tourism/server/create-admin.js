import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './models/User.js'
import bcrypt from 'bcryptjs'

dotenv.config()

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')
    
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
    console.error('Error:', error)
  } finally {
    await mongoose.disconnect()
  }
}

createAdmin()