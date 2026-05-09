import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { FavoritesProvider } from './context/FavoritesContext'

// Layout Components
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'

// Route Protection Components
import PrivateRoute from './routes/PrivateRoute'
import AdminRoute from './routes/AdminRoute'

// Public Pages
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Places from './pages/Places'
import PlacePage from './pages/PlacePage'
import NotFound from './pages/NotFound'

// User Pages (Protected - require login)
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'
import Bookings from './pages/Bookings'

// Admin Pages (Protected - require admin login)
import AdminDashboard from './pages/admin/AdminDashboard'
import ManagePlaces from './pages/admin/ManagePlaces'
import ManageUsers from './pages/admin/ManageUsers'
import ManageBookings from './pages/admin/ManageBookings'
import ManageReviews from './pages/admin/ManageReviews'

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <FavoritesProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
              {/* Navbar - Shows on all pages */}
              <Navbar />
              
              {/* Main Content Area */}
              <main className="grow">
                <Routes>
                  {/* ==================== PUBLIC ROUTES ==================== */}
                  {/* Anyone can access these pages */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/places" element={<Places />} />
                  <Route path="/places/:id" element={<PlacePage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* ==================== PROTECTED USER ROUTES ==================== */}
                  {/* Only logged-in users can access these */}
                  <Route 
                    path="/favorites" 
                    element={
                      <PrivateRoute>
                        <Favorites />
                      </PrivateRoute>
                    } 
                  />
                  
                  <Route 
                    path="/profile" 
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    } 
                  />
                  
                  <Route 
                    path="/bookings" 
                    element={
                      <PrivateRoute>
                        <Bookings />
                      </PrivateRoute>
                    } 
                  />
                  
                  {/* ==================== ADMIN ROUTES ==================== */}
                  {/* Only admin users can access these */}
                  <Route 
                    path="/admin" 
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    } 
                  />
                  
                  <Route 
                    path="/admin/places" 
                    element={
                      <AdminRoute>
                        <ManagePlaces />
                      </AdminRoute>
                    } 
                  />
                  
                  <Route 
                    path="/admin/users" 
                    element={
                      <AdminRoute>
                        <ManageUsers />
                      </AdminRoute>
                    } 
                  />
                  
                  <Route 
                    path="/admin/bookings" 
                    element={
                      <AdminRoute>
                        <ManageBookings />
                      </AdminRoute>
                    } 
                  />
                  
                  <Route 
                    path="/admin/reviews" 
                    element={
                      <AdminRoute>
                        <ManageReviews />
                      </AdminRoute>
                    } 
                  />
                  
                  {/* ==================== 404 PAGE ==================== */}
                  {/* Always keep this at the end - catches any undefined routes */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              
              {/* Footer - Shows on all pages */}
              <Footer />
              
              {/* Toast Notifications */}
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </div>
          </FavoritesProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App