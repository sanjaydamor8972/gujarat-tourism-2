import {
  DEFAULT_UNSPLASH_FALLBACKS,
  getCatalogCoverUrl,
  getCatalogGallery,
  resolvePlaceImageKey,
} from '../data/placeImageCatalog'

export const UNSPLASH_FALLBACKS = DEFAULT_UNSPLASH_FALLBACKS

function resolveUrl(item) {
  if (!item) return null
  if (typeof item === 'string') {
    const trimmed = item.trim()
    if (!trimmed) return null
    if (trimmed.startsWith('C:\\') || trimmed.startsWith('/Users/')) return null
    if (trimmed.includes('placeholder.com')) return null
    return trimmed
  }
  return item.url || null
}

export function getUnsplashFallback(index = 0, place = null) {
  const gallery = place ? getCatalogGallery(place) : null
  if (gallery?.length) {
    return gallery[Math.abs(index) % gallery.length]
  }
  return UNSPLASH_FALLBACKS[Math.abs(index) % UNSPLASH_FALLBACKS.length]
}

export function getPlaceImageUrl(place, index = 0) {
  if (!place) return getUnsplashFallback(index)

  // Use verified catalog URLs for known places (overrides stale/wrong DB links)
  if (resolvePlaceImageKey(place)) {
    const gallery = getCatalogGallery(place)
    const cover = getCatalogCoverUrl(place)
    if (index === 0 && cover) return cover
    if (gallery?.[index]) return gallery[index]
    return cover || getUnsplashFallback(index, place)
  }

  const cover = resolveUrl(place.coverImage)
  const fromGallery = resolveUrl(place.images?.[index])
  const firstImage = resolveUrl(place.images?.[0])

  return (
    cover ||
    fromGallery ||
    firstImage ||
    getCatalogCoverUrl(place) ||
    getUnsplashFallback(index, place)
  )
}

export function getPlaceGallery(place) {
  if (!place) return UNSPLASH_FALLBACKS.slice(0, 3)

  const catalogGallery = getCatalogGallery(place)
  if (resolvePlaceImageKey(place) && catalogGallery?.length) {
    return catalogGallery
  }

  const urls = (place.images || [])
    .map((img) => resolveUrl(img))
    .filter(Boolean)

  const cover = resolveUrl(place.coverImage)
  if (cover && !urls.includes(cover)) {
    urls.unshift(cover)
  }

  if (urls.length > 0) return urls

  if (catalogGallery?.length) return catalogGallery

  const coverOnly = getCatalogCoverUrl(place)
  if (coverOnly) return [coverOnly]

  return [
    getUnsplashFallback(0, place),
    getUnsplashFallback(1, place),
    getUnsplashFallback(2, place),
  ]
}
