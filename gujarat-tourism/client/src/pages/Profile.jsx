import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave, FiEdit2, FiCamera, FiHeart, FiCalendar } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      })
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const success = await updateProfile(formData)
    setLoading(false)
    if (success) {
      setIsEditing(false)
    }
  }

  const stats = [
    { icon: FiHeart, label: 'Favorites', value: user?.favorites?.length || 0, link: '/favorites' },
    { icon: FiCalendar, label: 'Bookings', value: 'View All', link: '/bookings' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header - FIXED: changed bg-gradient-to-r to bg-linear-to-r */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-linear-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 mb-8 text-white"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <img
                  src={user?.avatar || 'https://via.placeholder.com/120'}
                  alt={user?.name}
                  className="w-24 h-24 rounded-full border-4 border-white object-cover"
                />
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 text-primary-600">
                  <FiCamera size={16} />
                </button>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold">{user?.name}</h1>
                <p className="opacity-90">{user?.email}</p>
                <p className="text-sm opacity-75 mt-1">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white text-primary-600 px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <FiEdit2 />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              >
                <Link to={stat.link} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full">
                      <stat.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
                    </div>
                  </div>
                  <div className="text-primary-600">→</div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Profile Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <FiUser className="inline mr-2" /> Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 disabled:dark:bg-gray-800"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  <FiMail className="inline mr-2" /> Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 disabled:cursor-not-allowed"
                  value={formData.email}
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  <FiPhone className="inline mr-2" /> Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 disabled:dark:bg-gray-800"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  placeholder="+91 1234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  <FiMapPin className="inline mr-2" /> Address
                </label>
                <textarea
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 disabled:dark:bg-gray-800"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Your full address"
                />
              </div>
              {isEditing && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSave />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Profile