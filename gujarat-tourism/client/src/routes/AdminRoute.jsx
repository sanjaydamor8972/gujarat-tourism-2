import { Navigate } from 'react-router-dom'

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  const userJson = localStorage.getItem('user')
  
  // Check if user is admin
  let isAdmin = false
  if (userJson) {
    try {
      const user = JSON.parse(userJson)
      isAdmin = user.role === 'admin'
    } catch (error) {
      console.error('Error parsing user data:', error)
    }
  }
  
  // If not logged in, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  // If logged in but not admin, redirect to home
  if (!isAdmin) {
    return <Navigate to="/" replace />
  }
  
  // If user is admin, show the admin page
  return children
}

export default AdminRoute