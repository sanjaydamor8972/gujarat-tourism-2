import React from 'react'
import { FiStar, FiUser } from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'

function ReviewCard({ review }) {
  const userName = review.user?.name || review.userName || 'Visitor'
  const userAvatar = review.user?.avatar || review.userAvatar

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
            ) : (
              <FiUser className="text-primary-600" />
            )}
          </div>
          <div>
            <h4 className="font-semibold">{userName}</h4>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`${i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`}
                    size={14}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
      </div>
      {review.title && <h5 className="font-medium mb-2">{review.title}</h5>}
      <p className="text-gray-600 dark:text-gray-400 text-sm">{review.comment}</p>
    </div>
  )
}

export default ReviewCard
