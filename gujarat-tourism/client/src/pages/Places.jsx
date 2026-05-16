import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PlaceCard from '../components/places/PlaceCard'
import Loader from '../components/common/Loader'
import placeService from '../services/placeService'
import useDebounce from '../hooks/useDebounce'
import { CATEGORIES, DISTRICTS } from '../utils/constants'
import {
  getMergedOfflinePlaces,
  filterCachedPlaces,
  paginatePlaces,
} from '../utils/placesCache'
import toast from 'react-hot-toast'
import { FiSearch, FiFilter, FiGrid, FiList, FiX } from 'react-icons/fi'

function Places() {
  const [searchParams] = useSearchParams()
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('search') || '')
  const [activeSearch, setActiveSearch] = useState(() => searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get('category') || 'all')
  const [selectedDistrict, setSelectedDistrict] = useState(() => searchParams.get('district') || 'all')
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)

  const debouncedSearch = useDebounce(searchTerm, 400)

  useEffect(() => {
    setActiveSearch(debouncedSearch.trim())
  }, [debouncedSearch])

  useEffect(() => {
    const q = searchParams.get('search') || ''
    const cat = searchParams.get('category') || 'all'
    const dist = searchParams.get('district') || 'all'
    setSearchTerm(q)
    setActiveSearch(q)
    setSelectedCategory(cat)
    setSelectedDistrict(dist)
    setCurrentPage(1)
  }, [searchParams])

  const categories = ['all', ...CATEGORIES.map((c) => c.value)]
  const districts = ['all', ...DISTRICTS]

  const fetchPlaces = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        page: currentPage,
        limit: 9,
        sort: sortBy,
        category: selectedCategory,
        district: selectedDistrict,
        search: activeSearch,
      }
      const data = await placeService.getPlaces(params)
      setPlaces(data.places)
      setTotalPages(data.totalPages)
      setTotalCount(data.total ?? data.places.length)
    } catch (error) {
      console.error('Error fetching places:', error)
      const offline = filterCachedPlaces(getMergedOfflinePlaces(), {
        search: activeSearch,
        category: selectedCategory,
        district: selectedDistrict,
        sort: sortBy,
      })
      const paged = paginatePlaces(offline, currentPage, 9)
      setPlaces(paged.places)
      setTotalPages(paged.totalPages)
      setTotalCount(paged.total)
      toast('Showing saved places — server unavailable', { icon: 'ℹ️' })
    } finally {
      setLoading(false)
    }
  }, [currentPage, selectedCategory, selectedDistrict, sortBy, activeSearch])

  useEffect(() => {
    fetchPlaces()
  }, [fetchPlaces])

  function handleSearch(e) {
    e.preventDefault()
    const query = searchTerm.trim()
    setActiveSearch(query)
    setCurrentPage(1)
  }

  function clearFilters() {
    setSelectedCategory('all')
    setSelectedDistrict('all')
    setSortBy('newest')
    setSearchTerm('')
    setActiveSearch('')
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Explore Gujarat
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover the vibrant culture, heritage, and natural beauty of Gujarat
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, location, or description..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <FiFilter />
                Filters
              </button>
              <button type="submit" className="btn-primary">
                Search
              </button>
            </div>
          </form>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      className="input-field"
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value)
                        setCurrentPage(1)
                      }}
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat === 'all' ? 'All Categories' : cat.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">District</label>
                    <select
                      className="input-field"
                      value={selectedDistrict}
                      onChange={(e) => {
                        setSelectedDistrict(e.target.value)
                        setCurrentPage(1)
                      }}
                    >
                      {districts.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist === 'all' ? 'All Districts' : dist}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Sort By</label>
                    <select
                      className="input-field"
                      value={sortBy}
                      onChange={(e) => {
                        setSortBy(e.target.value)
                        setCurrentPage(1)
                      }}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-gray-500 hover:text-primary-600 flex items-center gap-1"
                  >
                    <FiX /> Clear all filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {activeSearch ? (
              <>Found {totalCount} place{totalCount === 1 ? '' : 's'} for &ldquo;{activeSearch}&rdquo;</>
            ) : (
              <>Found {totalCount} place{totalCount === 1 ? '' : 's'}</>
            )}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              <FiGrid />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              <FiList />
            </button>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : places.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No places found. Try different filters.</p>
          </div>
        ) : (
          <div
            className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}
          >
            {places.map((place) => (
              <PlaceCard key={place._id} place={place} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Places
