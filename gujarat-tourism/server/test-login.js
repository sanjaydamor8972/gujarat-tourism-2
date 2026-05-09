import axios from 'axios'

async function testAdminLogin() {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gujarattourism.com',
      password: 'admin123'
    })
    
    console.log('✅ Login successful!')
    console.log('📧 Email:', response.data.email)
    console.log('👤 Name:', response.data.name)
    console.log('👑 Role:', response.data.role)
    console.log('🔑 Token:', response.data.token)
    
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data?.message || error.message)
  }
}

testAdminLogin()