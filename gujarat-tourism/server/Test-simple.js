import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Check if .env file exists
const envPath = path.join(__dirname, '.env')
console.log('📁 Looking for .env at:', envPath)

if (fs.existsSync(envPath)) {
  console.log('✅ .env file found!')
  const content = fs.readFileSync(envPath, 'utf8')
  console.log('📄 File content preview:')
  console.log(content.substring(0, 100) + '...')
} else {
  console.log('❌ .env file NOT found!')
  console.log('Please create the .env file first.')
  process.exit(1)
}

// Load environment variables
dotenv.config({ path: envPath })

console.log('\n🔑 Environment variables loaded:')
console.log('PORT:', process.env.PORT || 'not set')
console.log('MONGO_URI:', process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 60) + '...' : 'not set')
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ set' : '❌ not set')

import mongoose from 'mongoose'

async function testConnection() {
  if (!process.env.MONGO_URI) {
    console.error('\n❌ MONGO_URI is still undefined!')
    console.log('Please check your .env file format.')
    return
  }
  
  console.log('\n🔄 Attempting to connect to MongoDB Atlas...')
  
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected successfully to MongoDB Atlas!')
    
    // Get connection info
    const db = mongoose.connection.db
    const collections = await db.listCollections().toArray()
    console.log(`📚 Database: ${db.databaseName}`)
    console.log(`📊 Collections: ${collections.length}`)
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
  } finally {
    await mongoose.disconnect()
    console.log('\n🔌 Disconnected')
  }
}

testConnection()