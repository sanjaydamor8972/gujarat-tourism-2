import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '.env') })

async function testConnection() {
  console.log('🔄 Testing MongoDB connection...')
  console.log('📡 Using connection string:', process.env.MONGO_URI?.substring(0, 50) + '...')
  
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected successfully to MongoDB Atlas!')
    
    // List databases
    const admin = mongoose.connection.db.admin()
    const dbs = await admin.listDatabases()
    console.log('\n📚 Available databases:')
    dbs.databases.forEach(db => {
      console.log(`   - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`)
    })
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    console.log('\n💡 Troubleshooting tips:')
    console.log('   1. Check if username "SanjuDamor" is correct')
    console.log('   2. Verify password "Sanju8972" is correct')
    console.log('   3. Make sure IP address is whitelisted in MongoDB Atlas')
    console.log('   4. Check Network Access tab in Atlas -> Add your current IP')
  } finally {
    await mongoose.disconnect()
    console.log('\n🔌 Disconnected')
  }
}

testConnection()