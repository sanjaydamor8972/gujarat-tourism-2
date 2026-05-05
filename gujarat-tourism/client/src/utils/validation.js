// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/
  return emailRegex.test(email)
}

// Phone number validation (Indian numbers)
export const isValidPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/
  const cleaned = phone?.replace(/\D/g, '')
  return phoneRegex.test(cleaned)
}

// Password validation (min 6 characters)
export const isValidPassword = (password) => {
  return password && password.length >= 6
}

// Name validation
export const isValidName = (name) => {
  return name && name.trim().length >= 2
}

// Date validation
export const isValidDate = (date) => {
  return date && !isNaN(new Date(date))
}

// Number of people validation
export const isValidNumberOfPeople = (count) => {
  return count && count >= 1 && count <= 50
}

// Booking date validation (can't book past dates)
export const isValidBookingDate = (date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(date) >= today
}

// Validate booking form
export const validateBookingForm = (data) => {
  const errors = {}
  
  if (!data.travelDate) {
    errors.travelDate = 'Travel date is required'
  } else if (!isValidBookingDate(data.travelDate)) {
    errors.travelDate = 'Travel date cannot be in the past'
  }
  
  if (!data.totalPeople) {
    errors.totalPeople = 'Number of people is required'
  } else if (!isValidNumberOfPeople(data.totalPeople)) {
    errors.totalPeople = 'Number of people must be between 1 and 50'
  }
  
  if (!data.contactNumber) {
    errors.contactNumber = 'Contact number is required'
  } else if (!isValidPhone(data.contactNumber)) {
    errors.contactNumber = 'Please enter a valid 10-digit phone number'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// Validate login form
export const validateLoginForm = (data) => {
  const errors = {}
  
  if (!data.email) {
    errors.email = 'Email is required'
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address'
  }
  
  if (!data.password) {
    errors.password = 'Password is required'
  } else if (!isValidPassword(data.password)) {
    errors.password = 'Password must be at least 6 characters'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// Validate register form
export const validateRegisterForm = (data) => {
  const errors = {}
  
  if (!data.name) {
    errors.name = 'Name is required'
  } else if (!isValidName(data.name)) {
    errors.name = 'Name must be at least 2 characters'
  }
  
  if (!data.email) {
    errors.email = 'Email is required'
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address'
  }
  
  if (!data.password) {
    errors.password = 'Password is required'
  } else if (!isValidPassword(data.password)) {
    errors.password = 'Password must be at least 6 characters'
  }
  
  if (!data.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}