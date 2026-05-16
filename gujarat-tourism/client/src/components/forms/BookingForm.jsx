import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DatePicker from 'react-datepicker'
import { FiX, FiCalendar, FiUsers, FiDollarSign, FiPhone, FiMessageSquare } from 'react-icons/fi'
import bookingService from '../../services/bookingService'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import 'react-datepicker/dist/react-datepicker.css'

const BookingForm = ({ place, onClose, onSuccess }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    travelDate: new Date(),
    totalPeople: 1,
    specialRequests: '',
    contactNumber: user?.phone || ''
  })
  const [loading, setLoading] = useState(false)

  const pricePerPerson = place.pricePerPerson ?? place.price ?? 0
  const totalPrice = pricePerPerson * formData.totalPeople

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please login to book')
      return
    }
    setLoading(true)
    try {
      await bookingService.createBooking({
        placeId: place._id,
        travelDate: formData.travelDate,
        totalPeople: formData.totalPeople,
        specialRequests: formData.specialRequests,
        contactNumber: formData.contactNumber
      })
      toast.success('Booking confirmed successfully!')
      onSuccess()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Book Your Trip</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <FiX size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="bg-primary-50 dark:bg-primary-900 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">{place.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{place.location}</p>
              <div className="mt-2 text-2xl font-bold text-primary-600 dark:text-primary-400">
                ₹{pricePerPerson}
                <span className="text-sm font-normal">/person</span>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <FiCalendar /> Travel Date
              </label>
              <DatePicker
                selected={formData.travelDate}
                onChange={(date) => setFormData({ ...formData, travelDate: date })}
                minDate={new Date()}
                className="input-field w-full"
                dateFormat="MMMM d, yyyy"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <FiUsers /> Number of People
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.totalPeople}
                onChange={(e) => setFormData({ ...formData, totalPeople: parseInt(e.target.value) })}
                className="input-field w-full"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <FiPhone /> Contact Number
              </label>
              <input
                type="tel"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                className="input-field w-full"
                placeholder="Your phone number"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <FiMessageSquare /> Special Requests (Optional)
              </label>
              <textarea
                rows="3"
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                className="input-field w-full"
                placeholder="Any special requirements or preferences?"
              />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between mb-2">
                <span>Price per person:</span>
                <span>₹{pricePerPerson}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Number of people:</span>
                <span>{formData.totalPeople}</span>
              </div>
              <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <span>Total Amount:</span>
                <span className="text-primary-600">₹{totalPrice}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2 px-4"
            >
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default BookingForm