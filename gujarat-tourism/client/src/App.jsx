import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { FavoritesProvider } from './context/FavoritesContext'
import AppLayout from './components/layout/AppLayout'
import PrivateRoute from './routes/PrivateRoute'
import AdminRoute from './routes/AdminRoute'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Places from './pages/Places'
import PlacePage from './pages/PlacePage'
import NotFound from './pages/NotFound'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'
import Bookings from './pages/Bookings'
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
            <AppLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/places" element={<Places />} />
                <Route path="/places/:id" element={<PlacePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

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

                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>

              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  className: '',
                  style: {
                    background: 'var(--toast-bg)',
                    color: 'var(--toast-color)',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: { primary: '#10b981', secondary: '#fff' },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: { primary: '#ef4444', secondary: '#fff' },
                  },
                }}
              />
          </FavoritesProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
