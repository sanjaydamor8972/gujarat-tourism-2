import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/dashboard/Sidebar'
import Loader from '../../components/common/Loader'
import reviewService from '../../services/reviewService'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { FiTrash2 } from 'react-icons/fi'

function ManageReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReviews()
  }, [])

  async function loadReviews() {
    setLoading(true)
    try {
      const data = await reviewService.getAllReviews()
      setReviews(data)
    } catch {
      toast.error('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this review?')) return
    try {
      await reviewService.deleteReview(id)
      toast.success('Review deleted')
      loadReviews()
    } catch {
      toast.error('Failed to delete review')
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 ml-0 lg:ml-64 p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Manage Reviews</h1>

        {loading ? (
          <Loader />
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow flex justify-between gap-4"
              >
                <div>
                  <p className="font-semibold">{review.user?.name || 'Visitor'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {review.place?.title} · {review.rating}/5 ·{' '}
                    {format(new Date(review.createdAt), 'PPP')}
                  </p>
                  {review.title && <p className="font-medium mt-2">{review.title}</p>}
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{review.comment}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(review._id)}
                  className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded h-fit"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
            {reviews.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">No reviews yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageReviews
