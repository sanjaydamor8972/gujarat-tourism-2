import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/dashboard/Sidebar'
import Loader from '../../components/common/Loader'
import placeService from '../../services/placeService'
import PlaceImage from '../../components/common/PlaceImage'
import toast from 'react-hot-toast'
import { FiTrash2, FiUpload, FiExternalLink } from 'react-icons/fi'

function ManagePlaces() {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploadingId, setUploadingId] = useState(null)

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
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 ml-0 lg:ml-64 p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Manage Places</h1>

        {loading ? (
          <Loader />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
            <table className="w-full text-left">
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
                  <tr key={place._id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <PlaceImage
                          place={place}
                          alt={place.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium">{place.title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{place.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize">{place.category}</td>
                    <td className="px-4 py-3">₹{place.pricePerPerson ?? place.price}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          to={`/places/${place.slug || place._id}`}
                          className="p-2 text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          title="View"
                        >
                          <FiExternalLink />
                        </Link>
                        <label className="p-2 cursor-pointer text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                          <FiUpload />
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingId === place._id}
                            onChange={(e) => handleUpload(place._id, e)}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => handleDelete(place._id)}
                          className="p-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
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
    </div>
  )
}

export default ManagePlaces
