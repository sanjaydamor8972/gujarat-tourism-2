import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiPlus, FiSave, FiTrash2 } from 'react-icons/fi'
import placeService from '../../services/placeService'
import { CATEGORIES, DISTRICTS } from '../../utils/constants'
import {
  parseNearbyAttractions,
  formatNearbyAttractions,
  cachePlace,
} from '../../utils/placesCache'
import toast from 'react-hot-toast'

const EMPTY_FORM = {
  title: '',
  description: '',
  shortDescription: '',
  location: '',
  district: '',
  category: 'heritage',
  pricePerPerson: '',
  bestTimeToVisit: '',
  visitingHours: '',
  entryFee: 'Free',
  nearbyAttractions: '',
  lat: '',
  lng: '',
  isFeatured: false,
  isPopular: false,
}

function placeToForm(place) {
  if (!place) return { ...EMPTY_FORM }
  return {
    title: place.title || '',
    description: place.description || '',
    shortDescription: place.shortDescription || '',
    location: place.location || '',
    district: place.district || '',
    category: place.category || 'heritage',
    pricePerPerson: place.pricePerPerson ?? place.price ?? '',
    bestTimeToVisit: place.bestTimeToVisit || '',
    visitingHours: place.visitingHours || '',
    entryFee: place.entryFee || 'Free',
    nearbyAttractions: formatNearbyAttractions(place.nearbyAttractions),
    lat: place.mapLocation?.lat ?? '',
    lng: place.mapLocation?.lng ?? '',
    isFeatured: Boolean(place.isFeatured),
    isPopular: Boolean(place.isPopular),
  }
}

function buildPayload(form) {
  const lat = parseFloat(form.lat)
  const lng = parseFloat(form.lng)

  return {
    title: form.title.trim(),
    description: form.description.trim(),
    shortDescription: form.shortDescription.trim(),
    location: form.location.trim(),
    district: form.district,
    category: form.category,
    pricePerPerson: Number(form.pricePerPerson) || 0,
    bestTimeToVisit: form.bestTimeToVisit.trim(),
    visitingHours: form.visitingHours.trim(),
    entryFee: form.entryFee.trim() || 'Free',
    nearbyAttractions: parseNearbyAttractions(form.nearbyAttractions),
    mapLocation: {
      lat: Number.isFinite(lat) ? lat : 23.0225,
      lng: Number.isFinite(lng) ? lng : 72.5714,
    },
    isFeatured: form.isFeatured,
    isPopular: form.isPopular,
  }
}

function getImageKey(img, index) {
  if (img?._id) return String(img._id)
  return String(index)
}

function resolveImageUrl(img) {
  if (!img) return ''
  return typeof img === 'string' ? img : img.url || ''
}

function PlaceFormModal({ mode = 'add', place = null, onClose, onSuccess }) {
  const isEdit = mode === 'edit' && place
  const [form, setForm] = useState(() => placeToForm(place))
  const [imageFiles, setImageFiles] = useState([])
  const [existingImages, setExistingImages] = useState(place?.images || [])
  const [loading, setLoading] = useState(false)
  const [deletingImageId, setDeletingImageId] = useState(null)

  useEffect(() => {
    setForm(placeToForm(place))
    setExistingImages(place?.images || [])
    setImageFiles([])
  }, [place])

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  async function handleDeleteImage(imageKey, index) {
    if (!isEdit) return
    if (!window.confirm('Remove this image?')) return

    setDeletingImageId(imageKey)
    try {
      let updated
      try {
        updated = await placeService.deleteImage(place._id, imageKey)
      } catch {
        updated = await placeService.deleteImage(place._id, String(index))
      }
      setExistingImages(updated.place?.images || [])
      cachePlace(updated.place)
      toast.success('Image removed')
    } catch {
      toast.error('Failed to delete image')
    } finally {
      setDeletingImageId(null)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.title.trim() || !form.description.trim() || !form.location.trim()) {
      toast.error('Title, description, and location are required')
      return
    }

    setLoading(true)
    try {
      const payload = buildPayload(form)
      let saved

      if (isEdit) {
        saved = await placeService.updatePlace(place._id, payload)
        if (imageFiles.length > 0) {
          const uploadResult = await placeService.uploadImages(place._id, imageFiles)
          saved = uploadResult.place || saved
        }
        toast.success('Place updated successfully')
      } else {
        saved = await placeService.createPlace(payload)
        if (imageFiles.length > 0) {
          const uploadResult = await placeService.uploadImages(saved._id, imageFiles)
          saved = uploadResult.place || saved
        }
        toast.success('Place added successfully')
      }

      cachePlace(saved)
      onSuccess?.(saved)
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'add'} place`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="place-form-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
            <h2 id="place-form-title" className="text-xl font-bold text-gray-900 dark:text-white">
              {isEdit ? `Edit: ${place.title}` : 'Add New Place'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Close"
            >
              <FiX size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="input-field w-full"
                  placeholder="e.g. Lothal Archaeological Site"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">Short description</label>
                <input
                  name="shortDescription"
                  value={form.shortDescription}
                  onChange={handleChange}
                  className="input-field w-full"
                  placeholder="One line summary for cards"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="input-field w-full"
                  placeholder="Full description of the place"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Location *</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="input-field w-full"
                  placeholder="City, district"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">District</label>
                <select
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  className="input-field w-full"
                >
                  <option value="">Select district</option>
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category *</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="input-field w-full"
                  required
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Price per person (₹)</label>
                <input
                  name="pricePerPerson"
                  type="number"
                  min="0"
                  value={form.pricePerPerson}
                  onChange={handleChange}
                  className="input-field w-full"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Entry fee</label>
                <input
                  name="entryFee"
                  value={form.entryFee}
                  onChange={handleChange}
                  className="input-field w-full"
                  placeholder="Free"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Best time to visit</label>
                <input
                  name="bestTimeToVisit"
                  value={form.bestTimeToVisit}
                  onChange={handleChange}
                  className="input-field w-full"
                  placeholder="October to March"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Visiting hours</label>
                <input
                  name="visitingHours"
                  value={form.visitingHours}
                  onChange={handleChange}
                  className="input-field w-full"
                  placeholder="9:00 AM – 6:00 PM"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">Nearby attractions</label>
                <input
                  name="nearbyAttractions"
                  value={form.nearbyAttractions}
                  onChange={handleChange}
                  className="input-field w-full"
                  placeholder="Museum, Garden, Market (comma-separated)"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Separate multiple attractions with commas.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Latitude</label>
                <input
                  name="lat"
                  type="number"
                  step="any"
                  value={form.lat}
                  onChange={handleChange}
                  className="input-field w-full"
                  placeholder="23.0225"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Longitude</label>
                <input
                  name="lng"
                  type="number"
                  step="any"
                  value={form.lng}
                  onChange={handleChange}
                  className="input-field w-full"
                  placeholder="72.5714"
                />
              </div>

              {isEdit && existingImages.length > 0 && (
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-2">Current photos</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {existingImages.map((img, index) => {
                      const key = getImageKey(img, index)
                      const url = resolveImageUrl(img)
                      if (!url) return null
                      return (
                        <div key={key} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(key, index)}
                            disabled={deletingImageId === key}
                            className="absolute top-1 right-1 p-1.5 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity disabled:opacity-50"
                            title="Delete image"
                            aria-label="Delete image"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  {isEdit ? 'Add more photos' : 'Photos (optional)'}
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="input-field w-full"
                  onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
                />
              </div>

              <div className="sm:col-span-2 flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={form.isFeatured}
                    onChange={handleChange}
                    className="rounded"
                  />
                  <span className="text-sm">Show on home (featured)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPopular"
                    checked={form.isPopular}
                    onChange={handleChange}
                    className="rounded"
                  />
                  <span className="text-sm">Mark as popular</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
              <button type="button" onClick={onClose} className="btn-outline flex-1 py-2">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 py-2 flex items-center justify-center gap-2"
              >
                {isEdit ? <FiSave /> : <FiPlus />}
                {loading ? 'Saving...' : isEdit ? 'Save changes' : 'Add place'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default PlaceFormModal
