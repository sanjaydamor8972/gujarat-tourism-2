import React, { createContext, useState, useEffect, useContext } from 'react'
import api from '../services/api'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const FavoritesContext = createContext()

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([])
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites()
    } else {
      setFavorites([])
    }
  }, [isAuthenticated])

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/users/favorites')
      setFavorites(response.data)
    } catch (error) {
      console.error('Failed to fetch favorites:', error)
    }
  }

  const toggleFavorite = async (placeId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add favorites')
      return false
    }

    try {
      const response = await api.post(`/users/favorites/${placeId}`)
      await fetchFavorites()
      toast.success(response.data.message)
      return true
    } catch (error) {
      toast.error('Failed to update favorites')
      return false
    }
  }

  const isFavorite = (placeId) => {
    return favorites.some(place => place._id === placeId)
  }

  return (
    <FavoritesContext.Provider value={{
      favorites,
      toggleFavorite,
      isFavorite,
      fetchFavorites,
    }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export { FavoritesContext }