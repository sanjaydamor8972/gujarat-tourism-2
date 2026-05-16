import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiStar, FiMapPin, FiHeart } from 'react-icons/fi'
import { useFavorites } from '../../context/FavoritesContext'
import PlaceImage from '../common/PlaceImage'

const PlaceCard = ({ place }) => {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(place._id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="card group"
    >
      <Link to={`/places/${place.slug || place._id}`}>
        <div className="relative overflow-hidden h-48">
          <PlaceImage
            place={place}
            alt={place.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-2 right-2">
            <button
              onClick={(e) => {
                e.preventDefault()
                toggleFavorite(place._id)
              }}
              className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
            >
              <FiHeart
                className={`${favorite ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300'}`}
                size={18}
              />
            </button>
          </div>
          {place.isPopular && (
            <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
              Popular
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1 text-yellow-500">
              <FiStar className="fill-current" size={16} />
              <span className="text-sm font-semibold">{place.rating || 0}</span>
              <span className="text-gray-500 text-sm">({place.totalReviews ?? place.numReviews ?? 0})</span>
            </div>
            <span className="text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full">
              {place.category}
            </span>
          </div>
          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary-600 transition-colors">
            {place.title}
          </h3>
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-2">
            <FiMapPin size={14} className="mr-1" />
            <span>{place.location}</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
            {place.shortDescription}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-primary-600 dark:text-primary-400 font-bold">
              ₹{place.pricePerPerson ?? place.price ?? 0}
            </span>
            <span className="text-gray-500 text-xs">per person</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default PlaceCard