import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/dashboard/Sidebar'
import Loader from '../../components/common/Loader'
import PlaceFormModal from '../../components/forms/PlaceFormModal'
import placeService from '../../services/placeService'
import PlaceImage from '../../components/common/PlaceImage'
import toast from 'react-hot-toast'
import { FiTrash2, FiUpload, FiExternalLink, FiPlus, FiEdit2 } from 'react-icons/fi'

function ManagePlaces() {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploadingId, setUploadingId] = useState(null)
  const [formMode, setFormMode] = useState(null)
  const [editingPlace, setEditingPlace] = useState(null)

  useEffect(() => {
    loadPlaces()
  }, [])

  async function loadPlaces() {
    setLoading(true)
    try {
      const data = await placeService.getPlaces({ limit: 100 })
      setPlaces(data.places)
    } catch {
      toast.error('Failed to load places')
    } finally {
      setLoading(false)
    }
  }

  function openAddForm() {
    setEditingPlace(null)
    setFormMode('add')
  }

  function openEditForm(place) {
    setEditingPlace(place)
    setFormMode('edit')
  }

  function closeForm() {
    setFormMode(null)
    setEditingPlace(null)
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this place?')) return
    try {
      await placeService.deletePlace(id)
      toast.success('Place deleted')
      loadPlaces()
    } catch {
      toast.error('Failed to delete place')
    }
  }

  async function handleUpload(id, e) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploadingId(id)
    try {
      await placeService.uploadImages(id, files)
      toast.success('Images uploaded')
      loadPlaces()
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploadingId(null)
      e.target.value = ''
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 ml-0 lg:ml-64 p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Places</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Add, edit, upload photos, or remove destinations.
            </p>
          </div>
          <button
            type="button"
            onClick={openAddForm}
            className="btn-primary inline-flex items-center justify-center gap-2 px-4 py-2"
          >
            <FiPlus />
            Add new place
          </button>
        </div>

        {loading ? (
          <Loader />
        ) : places.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">No places yet. Add your first destination.</p>
            <button type="button" onClick={openAddForm} className="btn-primary inline-flex items-center gap-2 px-4 py-2">
              <FiPlus />
              Add place
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
            <table className="w-full text-left min-w-[640px]">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-gray-700 dark:text-gray-200">Place</th>
                  <th className="px-4 py-3 text-gray-700 dark:text-gray-200">Category</th>
                  <th className="px-4 py-3 text-gray-700 dark:text-gray-200">Price</th>
                  <th className="px-4 py-3 text-gray-700 dark:text-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {places.map((place) => (
                  <tr key={place._id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <PlaceImage
                          place={place}
                          alt={place.title}
                          className="w-12 h-12 rounded object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{place.title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{place.location}</p>
                          {(place.isFeatured || place.isPopular) && (
                            <p className="text-xs text-primary-600 dark:text-primary-400 mt-0.5">
                              {place.isFeatured && 'Featured'}
                              {place.isFeatured && place.isPopular && ' · '}
                              {place.isPopular && 'Popular'}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize">{place.category?.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-3 whitespace-nowrap">₹{place.pricePerPerson ?? place.price}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 flex-wrap">
                        <button
                          type="button"
                          onClick={() => openEditForm(place)}
                          className="p-2 text-amber-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          title="Edit place"
                          aria-label="Edit place"
                        >
                          <FiEdit2 />
                        </button>
                        <Link
                          to={`/places/${place.slug || place._id}`}
                          className="p-2 text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          title="View on site"
                          aria-label="View on site"
                        >
                          <FiExternalLink />
                        </Link>
                        <label
                          className="p-2 cursor-pointer text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          title="Upload images"
                        >
                          <FiUpload />
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingId === place._id}
                            onChange={(e) => handleUpload(place._id, e)}
                            aria-label="Upload images"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => handleDelete(place._id)}
                          className="p-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          title="Delete place"
                          aria-label="Delete place"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {formMode && (
        <PlaceFormModal
          mode={formMode}
          place={editingPlace}
          onClose={closeForm}
          onSuccess={() => loadPlaces()}
        />
      )}
    </div>
  )
}

export default ManagePlaces
