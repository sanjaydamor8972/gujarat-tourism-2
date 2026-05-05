import React from 'react'
import { motion } from 'framer-motion'

const DashboardCard = ({ title, value, icon: Icon, color }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-full text-white`}>
          <Icon size={24} />
        </div>
      </div>
    </motion.div>
  )
}

export default DashboardCard