import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiHeart, FiTrash2, FiMapPin, FiStar } from 'react-icons/fi'
import { useFavorites } from '../context/FavoritesContext'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/common/Loader'
import { toast } from 'react-hot-toast'

const Favorites = () => {
  const { favorites, fetchFavorites, toggleFavorite } = useFavorites()
  const { isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated])

  const loadFavorites = async () => {
    setLoading(true)
    await fetchFavorites()
    setLoading(false)
  }

  const handleRemoveFavorite = async (placeId, placeTitle) => {
    await toggleFavorite(placeId)
    toast.success(`Removed ${placeTitle} from favorites`)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12">
        <div className="text-center">
          <FiHeart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Login to View Favorites</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please login to see your favorite places
          </p>
          <Link to="/login" className="btn-primary inline-block">
            Login Now
          </Link>
        </div>
      </div>
    )
  }

  if (loading) return <Loader />

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <FiHeart className="w-8 h-8 text-red-500" />
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Favorites</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Your collection of favorite places to visit in Gujarat
            </p>
          </motion.div>

          {/* Favorites Grid */}
          {favorites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-lg"
            >
              <FiHeart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Favorites Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start exploring and add places to your favorites list!
              </p>
              <Link to="/places" className="btn-primary inline-block">
                Explore Places
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((place, index) => (
                <motion.div
                  key={place._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all group"
                >
                  <Link to={`/places/${place.slug || place._id}`}>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={place.coverImage?.url || place.images[0]?.url || 'https://via.placeholder.com/400x300'}
                        alt={place.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          handleRemoveFavorite(place._id, place.title)
                        }}
                        className="absolute top-2 right-2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                      >
                        <FiTrash2 className="text-red-500" size={18} />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1 text-yellow-500">
                          <FiStar className="fill-current" size={16} />
                          <span className="text-sm font-semibold">{place.rating || 0}</span>
                        </div>
                        <span className="text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full">
                          {place.category}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-primary-600 transition-colors">
                        {place.title}
                      </h3>
                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-3">
                        <FiMapPin size={14} className="mr-1" />
                        <span>{place.location}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                        {place.shortDescription}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-primary-600 dark:text-primary-400 font-bold">
                          ₹{place.pricePerPerson}
                        </span>
                        <span className="text-gray-500 text-xs">per person</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Favorites