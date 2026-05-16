import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import { FiSearch, FiMapPin, FiCamera, FiUsers, FiAward, FiHeart } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import { CATEGORIES } from '../utils/constants'
import PlaceCard from '../components/places/PlaceCard'
import Loader from '../components/common/Loader'
import placeService from '../services/placeService'
import { getOfflineFeaturedPlaces, getOfflinePopularPlaces } from '../utils/placesCache'
import { PLACE_IMAGE_CATALOG } from '../data/placeImageCatalog'
import toast from 'react-hot-toast'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const HOME_DISTRICTS = ['Kutch', 'Ahmedabad', 'Vadodara', 'Surat', 'Rajkot', 'Junagadh', 'Gandhinagar', 'Gir Somnath']

const Home = () => {
  const navigate = useNavigate()
  const [featuredPlaces, setFeaturedPlaces] = useState([])
  const [popularPlaces, setPopularPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchDistrict, setSearchDistrict] = useState('')
  const [searchCategory, setSearchCategory] = useState('')

  function handleHeroSearch(e) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery.trim()) params.set('search', searchQuery.trim())
    if (searchDistrict) params.set('district', searchDistrict)
    if (searchCategory) params.set('category', searchCategory)
    const query = params.toString()
    navigate(query ? `/places?${query}` : '/places')
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featured, popular] = await Promise.all([
          placeService.getFeaturedPlaces(),
          placeService.getPopularPlaces()
        ])
        setFeaturedPlaces(featured)
        setPopularPlaces(popular)
      } catch (error) {
        console.error('Error fetching data:', error)
        setFeaturedPlaces(getOfflineFeaturedPlaces())
        setPopularPlaces(getOfflinePopularPlaces())
        toast('Showing saved destinations — server unavailable', { icon: 'ℹ️' })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const stats = [
    { icon: FiMapPin, value: '15+', label: 'Tourist Places' },
    { icon: FiUsers, value: '10+', label: 'Happy Visitors' },
    { icon: FiCamera, value: '50+', label: 'Photo Spots' },
    { icon: FiAward, value: '0', label: 'Awards Won' },
  ]

  const heroSlides = [
    {
      image: PLACE_IMAGE_CATALOG['statue-of-unity'].cover,
      title: 'Statue of Unity',
      subtitle: "World's Tallest Statue",
    },
    {
      image: PLACE_IMAGE_CATALOG['rann-of-kutch'].cover,
      title: 'Rann of Kutch',
      subtitle: 'White Desert Festival',
    },
    {
      image: PLACE_IMAGE_CATALOG['gir-national-park'].cover,
      title: 'Gir National Park',
      subtitle: 'Home of Asiatic Lions',
    },
  ]

  if (loading) return <Loader />

  return (
    <div>
      {/* Hero Slider */}
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        className="h-150"
      >
        {heroSlides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="gradient-hero absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center">
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl md:text-7xl font-bold mb-4"
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-xl md:text-2xl"
                  >
                    {slide.subtitle}
                  </motion.p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Search Section */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg -mt-16 relative z-10 mx-4 md:mx-auto max-w-4xl">
        <form onSubmit={handleHeroSearch} className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="search"
                placeholder="Search tourist places..."
                className="input-field w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search tourist places"
              />
            </div>
            <div className="flex-1">
              <select
                className="input-field w-full"
                value={searchDistrict}
                onChange={(e) => setSearchDistrict(e.target.value)}
                aria-label="Filter by district"
              >
                <option value="">All districts</option>
                {HOME_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <select
                className="input-field w-full"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                aria-label="Filter by category"
              >
                <option value="">All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-primary flex items-center justify-center gap-2 px-6">
              <FiSearch /> Search
            </button>
          </div>
        </form>
      </div>

      {/* Stats Section */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <stat.icon className="w-12 h-12 text-primary-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-800 dark:text-white">{stat.value}</div>
              <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Featured Places */}
      <div className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Featured Destinations</h2>
            <p className="section-subtitle">
              Discover the most popular tourist attractions in Gujarat
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPlaces.map((place, index) => (
              <PlaceCard key={place._id} place={place} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Popular Places */}
      <div className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Most Popular Places</h2>
          <p className="section-subtitle">
            Loved by thousands of travelers
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularPlaces.map((place, index) => (
            <PlaceCard key={place._id} place={place} index={index} />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="gradient-hero bg-linear-to-r from-primary-600 to-secondary-700 py-16">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Plan Your Perfect Trip to Gujarat
            </h2>
            <p className="text-white text-opacity-90 mb-8 max-w-2xl mx-auto">
              Experience the vibrant culture, delicious cuisine, and warm hospitality of Gujarat
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/places" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                Explore Now
              </Link>
              <Link to="/contact" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Home