import { format, formatDistanceToNow, differenceInDays } from 'date-fns'

// Format date to readable string
export const formatDate = (date, formatString = 'PPP') => {
  if (!date) return 'N/A'
  return format(new Date(date), formatString)
}

// Format date to relative time (e.g., "2 days ago")
export const formatRelativeTime = (date) => {
  if (!date) return 'N/A'
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

// Check if date is in the past
export const isDateInPast = (date) => {
  return differenceInDays(new Date(), new Date(date)) > 0
}

// Format price to Indian Rupees
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Format phone number
export const formatPhoneNumber = (phone) => {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{5})(\d{5})/, '$1-$2')
  }
  return phone
}

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}