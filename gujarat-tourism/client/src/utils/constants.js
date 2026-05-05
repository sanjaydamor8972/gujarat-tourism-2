// Gujarat districts
export const DISTRICTS = [
  'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch',
  'Bhavnagar', 'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhoomi Dwarka',
  'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kutch', 'Kheda',
  'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal',
  'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar',
  'Tapi', 'Vadodara', 'Valsad', 'Vyara'
]

// Place categories
export const CATEGORIES = [
  { value: 'temple', label: '🛕 Temples', icon: '🛕' },
  { value: 'nature', label: '🌿 Nature', icon: '🌿' },
  { value: 'heritage', label: '🏛️ Heritage', icon: '🏛️' },
  { value: 'wildlife', label: '🦁 Wildlife', icon: '🦁' },
  { value: 'beach', label: '🏖️ Beaches', icon: '🏖️' },
  { value: 'hill_station', label: '⛰️ Hill Stations', icon: '⛰️' },
  { value: 'museum', label: '🏛️ Museums', icon: '🏛️' },
  { value: 'other', label: '📍 Other', icon: '📍' },
]

// Booking status options
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
}

// Booking status colors
export const BOOKING_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
}

// Sort options
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' },
]

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
  },
  PLACES: {
    GET_ALL: '/places',
    GET_FEATURED: '/places/featured',
    GET_POPULAR: '/places/popular',
    CREATE: '/places',
    UPDATE: (id) => `/places/${id}`,
    DELETE: (id) => `/places/${id}`,
    UPLOAD_IMAGES: (id) => `/places/${id}/upload`,
  },
  BOOKINGS: {
    CREATE: '/bookings',
    GET_USER: '/bookings/user',
    CANCEL: (id) => `/bookings/${id}`,
  },
  REVIEWS: {
    CREATE: '/reviews',
    GET_BY_PLACE: (placeId) => `/reviews/${placeId}`,
  },
}

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
}

// Default pagination
export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 9,
}

// Image upload config
export const IMAGE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  MAX_FILES: 10,
}

// Price range for filtering
export const PRICE_RANGES = [
  { min: 0, max: 500, label: 'Under ₹500' },
  { min: 500, max: 1000, label: '₹500 - ₹1000' },
  { min: 1000, max: 2000, label: '₹1000 - ₹2000' },
  { min: 2000, max: 5000, label: '₹2000 - ₹5000' },
  { min: 5000, max: Infinity, label: '₹5000+' },
]

// Gujarat tourism contact info
export const CONTACT_INFO = {
  ADDRESS: 'Block No. 11, 3rd Floor, Udyog Bhavan, Gandhinagar, Gujarat - 382010',
  PHONE: ['+91 79 2325 7676', '+91 79 2325 7677'],
  EMAIL: ['info@gujarattourism.com', 'support@gujarattourism.com'],
  OFFICE_HOURS: 'Monday - Friday: 9:00 AM - 7:00 PM',
  SOCIAL_MEDIA: {
    facebook: 'https://facebook.com/gujarattourism',
    twitter: 'https://twitter.com/gujarattourism',
    instagram: 'https://instagram.com/gujarattourism',
    youtube: 'https://youtube.com/gujarattourism',
  },
}