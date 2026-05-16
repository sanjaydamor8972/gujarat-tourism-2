import { DEMO_PLACES } from '../data/demoPlaces'

const CACHE_KEY = 'gujarat_tourism_places_v1'

export function parseNearbyAttractions(value) {
  if (Array.isArray(value)) return value.map((s) => String(s).trim()).filter(Boolean)
  return String(value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export function formatNearbyAttractions(value) {
  if (Array.isArray(value)) return value.join(', ')
  return ''
}

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeCache(places) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(places))
  } catch (error) {
    console.warn('Could not save places cache', error)
  }
}

export function cachePlaces(places) {
  if (!Array.isArray(places) || places.length === 0) return
  const map = new Map(readCache().map((p) => [p._id, p]))
  places.forEach((p) => {
    if (p?._id) map.set(p._id, p)
  })
  writeCache([...map.values()])
}

export function cachePlace(place) {
  if (place?._id) cachePlaces([place])
}

export function removePlaceFromCache(placeId) {
  if (!placeId) return
  writeCache(readCache().filter((p) => p._id !== placeId))
}

export function getMergedOfflinePlaces() {
  const map = new Map()
  DEMO_PLACES.forEach((p) => map.set(p._id, p))
  readCache().forEach((p) => {
    if (p?._id) map.set(p._id, p)
  })
  return [...map.values()]
}

export function getOfflineFeaturedPlaces() {
  const merged = getMergedOfflinePlaces()
  const featured = merged.filter((p) => p.isFeatured)
  return (featured.length ? featured : merged).slice(0, 6)
}

export function getOfflinePopularPlaces() {
  const merged = getMergedOfflinePlaces()
  const popular = merged.filter((p) => p.isPopular)
  return (popular.length ? popular : merged).slice(0, 8)
}

export function getOfflinePlaceById(idOrSlug) {
  const key = String(idOrSlug || '').toLowerCase()
  return getMergedOfflinePlaces().find(
    (p) => p._id === idOrSlug || String(p.slug || '').toLowerCase() === key
  ) || null
}

export function filterCachedPlaces(places, { search = '', category = 'all', district = 'all', sort = 'newest' } = {}) {
  let list = [...places]

  if (category && category !== 'all') {
    list = list.filter((p) => p.category === category)
  }
  if (district && district !== 'all') {
    list = list.filter((p) => String(p.district || '').toLowerCase() === district.toLowerCase())
  }
  if (search.trim()) {
    const q = search.trim().toLowerCase()
    list = list.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q) ||
        p.district?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.shortDescription?.toLowerCase().includes(q) ||
        (Array.isArray(p.nearbyAttractions) &&
          p.nearbyAttractions.some((a) => String(a).toLowerCase().includes(q)))
    )
  }

  switch (sort) {
    case 'oldest':
      list.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
      break
    case 'rating':
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      break
    case 'popular':
      list.sort((a, b) => (b.totalReviews || 0) - (a.totalReviews || 0))
      break
  default:
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
  }

  return list
}

export function paginatePlaces(places, page = 1, limit = 9) {
  const total = places.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * limit
  return {
    places: places.slice(start, start + limit),
    totalPages,
    total,
    page: safePage,
  }
}
