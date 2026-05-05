import React from 'react'
import Sidebar from '../../components/dashboard/Sidebar'

const ManageReviews = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 ml-0 lg:ml-64 p-8">
        <h1 className="text-2xl font-bold mb-4">Manage Reviews</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <p>Review management interface will be here</p>
        </div>
      </div>
    </div>
  )
}

export default ManageReviews