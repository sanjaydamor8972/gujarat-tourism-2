import api from './api'

const bookingService = {
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData)
    return response.data
  },

  getUserBookings: async () => {
    const response = await api.get('/bookings/user')
    return response.data
  },

  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`)
    return response.data
  },

  cancelBooking: async (id) => {
    const response = await api.put(`/bookings/${id}/cancel`)
    return response.data
  },

  getAllBookings: async (params = {}) => {
    const response = await api.get('/bookings/all', { params })
    return response.data
  },

  updateBookingStatus: async (id, status, paymentStatus) => {
    const response = await api.put(`/bookings/${id}/status`, { status, paymentStatus })
    return response.data
  },
}

export default bookingService
