import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/dashboard/Sidebar'
import Loader from '../../components/common/Loader'
import bookingService from '../../services/bookingService'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

function ManageBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBookings()
  }, [])

  async function loadBookings() {
    setLoading(true)
    try {
      const data = await bookingService.getAllBookings()
      setBookings(data)
    } catch {
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(id, status) {
    try {
      await bookingService.updateBookingStatus(id, status)
      toast.success('Status updated')
      loadBookings()
    } catch {
      toast.error('Failed to update status')
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 ml-0 lg:ml-64 p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Manage Bookings</h1>

        {loading ? (
          <Loader />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Place</th>
                  <th className="px-4 py-3">Visit Date</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="px-4 py-3 font-mono text-sm">
                      {booking.bookingReference || booking._id.slice(-6)}
                    </td>
                    <td className="px-4 py-3">{booking.user?.name || '—'}</td>
                    <td className="px-4 py-3">{booking.place?.title || '—'}</td>
                    <td className="px-4 py-3">
                      {booking.visitDate
                        ? format(new Date(booking.visitDate), 'PPP')
                        : '—'}
                    </td>
                    <td className="px-4 py-3">₹{booking.totalPrice}</td>
                    <td className="px-4 py-3">
                      <select
                        className="input-field text-sm py-1"
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageBookings
