import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FiUsers, FiMap, FiCalendar, FiMessageCircle, FiDollarSign, 
  FiTrendingUp, FiStar, FiBookOpen
} from 'react-icons/fi'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Sidebar from '../../components/dashboard/Sidebar'
import DashboardCard from '../../components/dashboard/DashboardCard'
import Loader from '../../components/common/Loader'
import api from '../../services/api'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, analyticsRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/analytics')
      ])
      setStats(statsRes.data)
      setAnalytics(analyticsRes.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Could not load dashboard data. Is the server running?')
    } finally {
      setLoading(false)
    }
  }

  const cardData = [
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: FiUsers, color: 'bg-blue-500' },
    { title: 'Total Places', value: stats?.totalPlaces || 0, icon: FiMap, color: 'bg-green-500' },
    { title: 'Total Bookings', value: stats?.totalBookings || 0, icon: FiCalendar, color: 'bg-purple-500' },
    { title: 'Total Reviews', value: stats?.totalReviews || 0, icon: FiMessageCircle, color: 'bg-yellow-500' },
    { title: 'Total Revenue', value: `₹${analytics?.totalRevenue?.toLocaleString() || 0}`, icon: FiDollarSign, color: 'bg-red-500' },
    { title: 'Avg Rating', value: stats?.avgRating ?? 0, icon: FiStar, color: 'bg-indigo-500' },
  ]

  const bookingStatsData = analytics?.bookingStats ? [
    { name: 'Pending', value: analytics.bookingStats.pending, color: '#f59e0b' },
    { name: 'Confirmed', value: analytics.bookingStats.confirmed, color: '#10b981' },
    { name: 'Completed', value: analytics.bookingStats.completed, color: '#3b82f6' },
    { name: 'Cancelled', value: analytics.bookingStats.cancelled, color: '#ef4444' },
  ] : []

  if (loading) return <Loader />

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 ml-0 lg:ml-64">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening with your tourism platform.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            {cardData.map((card, index) => (
              <DashboardCard key={index} {...card} />
            ))}
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Monthly Bookings Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiTrendingUp /> Monthly Bookings
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics?.monthlyBookings?.map((count, index) => ({ month: `Month ${index + 1}`, bookings: count }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="bookings" stroke="#d97706" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Booking Status Pie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiBookOpen /> Booking Status Distribution
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={bookingStatsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {bookingStatsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Popular Places Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">Most Popular Places</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Place</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Bookings</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reviews</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {analytics?.popularPlaces?.map((place, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img src={place.coverImage?.url || place.place?.coverImage?.url} alt={place.title} className="w-10 h-10 rounded-full object-cover mr-3" />
                          <span className="font-medium">{place.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{place.count}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiStar className="text-yellow-500 mr-1" />
                          {place.place?.rating || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{place.place?.totalReviews || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Booking ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Place</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {analytics?.recentBookings?.map((booking, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{booking.bookingReference}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{booking.user?.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{booking.place?.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">₹{booking.totalPrice}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard