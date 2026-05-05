import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/common/Loader'

const AdminRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return <Loader />
  }

  return isAuthenticated && isAdmin ? <Outlet /> : <Navigate to="/login" replace />
}

export default AdminRoute