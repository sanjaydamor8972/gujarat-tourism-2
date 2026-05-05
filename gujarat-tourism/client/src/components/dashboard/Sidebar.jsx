import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiHome, FiMap, FiUsers, FiCalendar, FiMessageCircle, FiBarChart2, FiLogOut } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const Sidebar = () => {
  const location = useLocation()
  const { logout } = useAuth()

  const menuItems = [
    { path: '/admin', icon: FiBarChart2, label: 'Dashboard' },
    { path: '/admin/places', icon: FiMap, label: 'Manage Places' },
    { path: '/admin/users', icon: FiUsers, label: 'Manage Users' },
    { path: '/admin/bookings', icon: FiCalendar, label: 'Manage Bookings' },
    { path: '/admin/reviews', icon: FiMessageCircle, label: 'Manage Reviews' },
  ]

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary-400">Admin Panel</h2>
        <p className="text-gray-400 text-sm mt-1">Gujarat Tourism</p>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                isActive 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
        
        <div className="border-t border-gray-800 mt-4 pt-4">
          <Link
            to="/"
            className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <FiHome size={20} />
            <span>Back to Site</span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <FiLogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

export default Sidebar