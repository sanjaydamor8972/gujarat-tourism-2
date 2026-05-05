import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { FavoritesProvider } from './context/FavoritesContext'

// Import Layout Components
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'

// Import all your pages
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Places from './pages/Places'
import PlacePage from './pages/PlacePage'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'
import Bookings from './pages/Bookings'
import NotFound from './pages/NotFound'

// Import Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import ManagePlaces from './pages/admin/ManagePlaces'
import ManageUsers from './pages/admin/ManageUsers'
import ManageBookings from './pages/admin/ManageBookings'
import ManageReviews from './pages/admin/ManageReviews'

// Protected Route Components
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')
  let isAdmin = false
  
  if (user) {
    try {
      const userData = JSON.parse(user)
      isAdmin = userData.role === 'admin'
    } catch (error) {
      console.error('Error parsing user data:', error)
    }
  }
  
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  if (!isAdmin) {
    return <Navigate to="/" replace />
  }
  
  return children
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <FavoritesProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
              <Navbar />
              
              <main className="grow">
                <Routes>
                  {/* Public Routes - Everyone can access */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/places" element={<Places />} />
                  <Route path="/places/:id" element={<PlacePage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Protected User Routes - Only logged-in users can access */}
                  <Route path="/favorites" element={
                    <PrivateRoute>
                      <Favorites />
                    </PrivateRoute>
                  } />
                  
                  <Route path="/profile" element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  } />
                  
                  <Route path="/bookings" element={
                    <PrivateRoute>
                      <Bookings />
                    </PrivateRoute>
                  } />
                  
                  {/* Admin Routes - Only admin users can access */}
                  <Route path="/admin" element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } />
                  
                  <Route path="/admin/places" element={
                    <AdminRoute>
                      <ManagePlaces />
                    </AdminRoute>
                  } />
                  
                  <Route path="/admin/users" element={
                    <AdminRoute>
                      <ManageUsers />
                    </AdminRoute>
                  } />
                  
                  <Route path="/admin/bookings" element={
                    <AdminRoute>
                      <ManageBookings />
                    </AdminRoute>
                  } />
                  
                  <Route path="/admin/reviews" element={
                    <AdminRoute>
                      <ManageReviews />
                    </AdminRoute>
                  } />
                  
                  {/* 404 Page - Always put this last */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              
              <Footer />
              <Toaster position="top-right" />
            </div>
          </FavoritesProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App