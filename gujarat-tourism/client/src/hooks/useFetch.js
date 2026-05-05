import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

export const useFetch = (fetchFunction, options = {}) => {
  const { immediate = true, showError = true, errorMessage } = options
  
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await fetchFunction(...args)
      setData(result)
      return result
    } catch (err) {
      setError(err)
      if (showError) {
        toast.error(errorMessage || err.response?.data?.message || 'Something went wrong')
      }
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchFunction, showError, errorMessage])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [immediate, execute])

  return { data, loading, error, execute, setData }
}

export default useFetch