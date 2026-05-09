import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  
  // If user is not logged in, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  // If user is logged in, show the protected page
  return children
}

export default PrivateRoute