import api from './api'

const reviewService = {
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData)
    return response.data
  },

  getPlaceReviews: async (placeId, params = {}) => {
    const response = await api.get(`/reviews/${placeId}`, { params })
    return response.data
  },

  getAllReviews: async () => {
    const response = await api.get('/reviews/all')
    return response.data
  },

  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`)
    return response.data
  },
}

export default reviewService
