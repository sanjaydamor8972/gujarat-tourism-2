import { applyCatalogImages, PLACE_COVER_URLS } from './placeImageCatalog.js'

const FALLBACK = PLACE_COVER_URLS['statue-of-unity']

const LEGACY_CATEGORY_MAP = {
  temple: 'temple',
  wildlife: 'wildlife',
  beach: 'beach',
  'hill station': 'hill_station',
  hill_station: 'hill_station',
  heritage: 'heritage',
  museum: 'museum',
  nature: 'nature',
  other: 'other',
}

export function normalizeCategory(category) {
  if (!category) return 'other'
  const key = String(category).toLowerCase().trim().replace(/\s+/g, '_')
  return LEGACY_CATEGORY_MAP[key] || key
}

export function normalizeImageItem(item) {
  if (!item) return null
  if (typeof item === 'string') {
    const url = item.trim()
    if (!url) return null
    if (url.startsWith('C:\\') || url.startsWith('/Users/')) return null
    return { url, publicId: '', caption: '' }
  }
  if (item.url) {
    return {
      url: item.url,
      publicId: item.publicId || '',
      caption: item.caption || '',
    }
  }
  return null
}

export function normalizePlace(place) {
  if (!place) return place

  const doc = place.toObject ? place.toObject({ virtuals: false }) : { ...place }

  const images = (doc.images || [])
    .map(normalizeImageItem)
    .filter(Boolean)

  let coverImage = normalizeImageItem(doc.coverImage)
  if (!coverImage && images.length > 0) {
    coverImage = images[0]
  }
  if (!coverImage) {
    coverImage = { url: FALLBACK, publicId: '', caption: '' }
  }

  const pricePerPerson = Number(doc.pricePerPerson ?? doc.price ?? 0)
  const totalReviews = doc.totalReviews ?? doc.numReviews ?? 0

  const normalized = {
    ...doc,
    category: normalizeCategory(doc.category),
    images: images.length > 0 ? images : [coverImage],
    coverImage,
    pricePerPerson,
    price: pricePerPerson,
    totalReviews,
    numReviews: totalReviews,
    shortDescription:
      doc.shortDescription || (doc.description ? String(doc.description).slice(0, 120) : ''),
  }

  return applyCatalogImages(normalized)
}

export function normalizePlaces(places) {
  return places.map(normalizePlace)
}
