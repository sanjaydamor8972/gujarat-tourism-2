import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCalendar, FiMapPin, FiUsers, FiDollarSign, FiClock, FiXCircle, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import { format } from 'date-fns'
import bookingService from '../services/bookingService'
import Loader from '../components/common/Loader'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'

const Bookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getUserBookings()
      setBookings(data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return
    
    setCancelling(true)
    try {
      await bookingService.cancelBooking(bookingId)
      toast.success('Booking cancelled successfully')
      fetchBookings()
      setSelectedBooking(null)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking')
    } finally {
      setCancelling(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <FiCheckCircle className="text-green-600" />
      case 'pending':
        return <FiClock className="text-yellow-600" />
      case 'cancelled':
        return <FiXCircle className="text-red-600" />
      default:
        return <FiAlertCircle />
    }
  }

  if (loading) return <Loader />

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Bookings</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              View and manage all your trip bookings
            </p>
          </motion.div>

          {/* Bookings List */}
          {bookings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-lg"
            >
              <FiCalendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Bookings Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start exploring Gujarat and book your first trip!
              </p>
              <Link to="/places" className="btn-primary inline-block">
                Browse Places
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="md:w-48 h-48 md:h-auto">
                      <img
                        src={booking.place?.coverImage?.url || 'https://via.placeholder.com/200'}
                        alt={booking.place?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-bold mb-2">{booking.place?.title}</h2>
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                            <FiMapPin size={16} />
                            <span className="text-sm">{booking.place?.location}</span>
                          </div>
                          <div className="flex flex-wrap gap-4 mt-3">
                            <div className="flex items-center gap-2 text-sm">
                              <FiCalendar />
                              <span>{format(new Date(booking.travelDate), 'PPP')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <FiUsers />
                              <span>{booking.totalPeople} persons</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <FiDollarSign />
                              <span>₹{booking.totalPrice}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span className="capitalize">{booking.status}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Booking ID: {booking.bookingReference}
                          </p>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="text-primary-600 hover:text-primary-700 text-sm font-semibold"
                        >
                          View Details
                        </button>
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            disabled={cancelling}
                            className="text-red-600 hover:text-red-700 text-sm font-semibold"
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Booking Details</h2>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <FiXCircle size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{selectedBooking.place?.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedBooking.place?.location}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Booking Reference</span>
                    <span className="font-mono text-sm">{selectedBooking.bookingReference}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Travel Date</span>
                    <span>{format(new Date(selectedBooking.travelDate), 'PPP')}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Booking Date</span>
                    <span>{format(new Date(selectedBooking.createdAt), 'PPP')}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Number of People</span>
                    <span>{selectedBooking.totalPeople}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Price per Person</span>
                    <span>₹{selectedBooking.place?.pricePerPerson}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b font-bold">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="text-primary-600">₹{selectedBooking.totalPrice}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Status</span>
                    <span className={`capitalize ${getStatusColor(selectedBooking.status)} px-2 py-1 rounded-full text-xs`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Payment Status</span>
                    <span className={`capitalize ${selectedBooking.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {selectedBooking.paymentStatus}
                    </span>
                  </div>
                </div>
                
                {selectedBooking.specialRequests && (
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Special Requests</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedBooking.specialRequests}</p>
                  </div>
                )}
                
                {selectedBooking.status === 'pending' && (
                  <button
                    onClick={() => {
                      handleCancelBooking(selectedBooking._id)
                    }}
                    disabled={cancelling}
                    className="w-full btn-primary bg-red-600 hover:bg-red-700"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Bookings