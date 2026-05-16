import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Thumbs } from 'swiper/modules'
import { 
  FiStar, FiMapPin, FiClock, FiCalendar, FiUsers, FiDollarSign, 
  FiHeart, FiShare2, FiChevronLeft, FiThumbsUp, FiMessageCircle
} from 'react-icons/fi'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import Loader from '../components/common/Loader'
import ReviewCard from '../components/places/ReviewCard'
import BookingForm from '../components/forms/BookingForm'
import placeService from '../services/placeService'
import reviewService from '../services/reviewService'
import { useFavorites } from '../context/FavoritesContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { getPlaceGallery } from '../utils/placeImages'
import PlaceImage from '../components/common/PlaceImage'

const PlacePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [place, setPlace] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [userReview, setUserReview] = useState({ rating: 5, title: '', comment: '' })
  const [submitting, setSubmitting] = useState(false)
  
  const { isFavorite, toggleFavorite } = useFavorites()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    fetchPlaceData()
  }, [id])

  const fetchPlaceData = async () => {
    setLoading(true)
    try {
      const [placeData, reviewsData] = await Promise.all([
        placeService.getPlaceById(id),
        reviewService.getPlaceReviews(id, { page: 1, limit: 10 })
      ])
      setPlace(placeData)
      setReviews(Array.isArray(reviewsData) ? reviewsData : reviewsData.reviews || [])
    } catch (error) {
      console.error('Error fetching place data:', error)
      toast.error('Failed to load place details')
      navigate('/places')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please login to submit a review')
      return
    }
    setSubmitting(true)
    try {
      await reviewService.createReview({
        placeId: place._id,
        ...userReview
      })
      toast.success('Review submitted successfully!')
      fetchPlaceData()
      setUserReview({ rating: 5, title: '', comment: '' })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  }

  const center = {
    lat: place?.mapLocation?.lat || 23.0225,
    lng: place?.mapLocation?.lng || 72.5714
  }

  if (loading) return <Loader />
  if (!place) return null

  const gallery = getPlaceGallery(place)
  const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Back Button */}
      <div className="container-custom py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600"
        >
          <FiChevronLeft /> Back
        </button>
      </div>

      {/* Image Gallery */}
      <div className="bg-white dark:bg-gray-800">
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Gallery */}
            <div className="lg:col-span-2">
              <Swiper
                modules={[Navigation, Thumbs]}
                thumbs={{ swiper: thumbsSwiper }}
                navigation
                className="mb-4 rounded-lg overflow-hidden"
              >
                {gallery.map((url, index) => (
                  <SwiperSlide key={index}>
                    <PlaceImage
                      src={url}
                      place={place}
                      index={index}
                      alt={`${place.title} - ${index + 1}`}
                      className="w-full h-125 object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <Swiper
                modules={[Thumbs]}
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                className="h-24"
              >
                {gallery.map((url, index) => (
                  <SwiperSlide key={index}>
                    <PlaceImage
                      src={url}
                      place={place}
                      index={index}
                      alt={`Thumb ${index + 1}`}
                      className="w-full h-20 object-cover rounded cursor-pointer"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Info Card */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 sticky top-24">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{place.title}</h1>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <FiMapPin />
                      <span>{place.location}, {place.district}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFavorite(place._id)}
                    className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md"
                  >
                    <FiHeart className={`${isFavorite(place._id) ? 'fill-red-500 text-red-500' : ''}`} size={24} />
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <FiStar className="text-yellow-500 fill-current" />
                    <span className="font-semibold">{place.rating}</span>
                    <span className="text-gray-500">({place.totalReviews ?? place.numReviews ?? 0} reviews)</span>
                  </div>
                  <div className="text-2xl font-bold text-primary-600">
                    ₹{place.pricePerPerson ?? place.price ?? 0}
                    <span className="text-sm font-normal text-gray-500">/person</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <FiClock className="text-gray-500" />
                    <span>Best Time: {place.bestTimeToVisit}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiCalendar className="text-gray-500" />
                    <span>Visiting Hours: {place.visitingHours}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiDollarSign className="text-gray-500" />
                    <span>Entry Fee: {place.entryFee}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowBookingForm(true)}
                  className="btn-primary w-full mb-3"
                >
                  Book Now
                </button>
                <button className="btn-outline w-full flex items-center justify-center gap-2">
                  <FiShare2 /> Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">About {place.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              {place.description}
            </p>

            {/* Nearby Attractions */}
            {place.nearbyAttractions?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">Nearby Attractions</h3>
                <div className="flex flex-wrap gap-2">
                  {place.nearbyAttractions.map((attraction, index) => (
                    <span key={index} className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-sm">
                      {attraction}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Map */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Location Map</h3>
            {mapsApiKey ? (
              <LoadScript googleMapsApiKey={mapsApiKey}>
                <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={13}>
                  <Marker position={center} />
                </GoogleMap>
              </LoadScript>
            ) : (
              <div className="h-[400px] bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 p-4 text-center">
                Map unavailable — add VITE_GOOGLE_MAPS_API_KEY
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white dark:bg-gray-800 py-12">
        <div className="container-custom">
          <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
          
          {/* Review Form */}
          {isAuthenticated && (
            <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
              <div className="mb-4">
                <label className="block mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserReview({ ...userReview, rating: star })}
                      className="text-2xl focus:outline-none"
                    >
                      <FiStar className={`${star <= userReview.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Review Title"
                  className="input-field"
                  value={userReview.title}
                  onChange={(e) => setUserReview({ ...userReview, title: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <textarea
                  rows="4"
                  placeholder="Share your experience..."
                  className="input-field"
                  value={userReview.comment}
                  onChange={(e) => setUserReview({ ...userReview, comment: e.target.value })}
                  required
                />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingForm && (
        <BookingForm
          place={place}
          onClose={() => setShowBookingForm(false)}
          onSuccess={() => {
            setShowBookingForm(false)
            navigate('/bookings')
          }}
        />
      )}
    </div>
  )
}

export default PlacePage