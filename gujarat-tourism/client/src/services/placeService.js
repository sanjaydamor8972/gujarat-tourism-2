import api from './api'
import { cachePlaces, cachePlace, removePlaceFromCache } from '../utils/placesCache'

const placeService = {
  getPlaces: async (params = {}) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(
        ([, value]) => value !== '' && value !== undefined && value !== null && value !== 'all'
      )
    )
    const response = await api.get('/places', { params: cleanParams })
    if (response.data?.places) cachePlaces(response.data.places)
    return response.data
  },

  getPlaceById: async (id) => {
    const response = await api.get(`/places/${id}`)
    cachePlace(response.data)
    return response.data
  },

  getFeaturedPlaces: async () => {
    const response = await api.get('/places/featured')
    if (Array.isArray(response.data)) cachePlaces(response.data)
    return response.data
  },

  getPopularPlaces: async () => {
    const response = await api.get('/places/popular')
    if (Array.isArray(response.data)) cachePlaces(response.data)
    return response.data
  },

  createPlace: async (placeData) => {
    const response = await api.post('/places', placeData)
    cachePlace(response.data)
    return response.data
  },

  updatePlace: async (id, placeData) => {
    const response = await api.put(`/places/${id}`, placeData)
    cachePlace(response.data)
    return response.data
  },

  deletePlace: async (id) => {
    const response = await api.delete(`/places/${id}`)
    removePlaceFromCache(id)
    return response.data
  },

  uploadImages: async (id, files) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('images', file))
    const response = await api.post(`/places/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    if (response.data?.place) cachePlace(response.data.place)
    return response.data
  },

  deleteImage: async (placeId, imageId) => {
    const response = await api.delete(`/places/${placeId}/images/${imageId}`)
    if (response.data?.place) cachePlace(response.data.place)
    return response.data
  },
}

export default placeService
