/**
 * Verified Unsplash URLs per Gujarat destination (by slug).
 * Prefer these over DB URLs so cards stay correct even before re-seed.
 */

export const PLACE_IMAGE_CATALOG = {
  'statue-of-unity': {
    cover:
      'https://images.unsplash.com/photo-1631983097767-099c77bf880d?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    gallery: [
      'https://images.unsplash.com/photo-1631983097767-099c77bf880d?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
  },
  'gir-national-park': {
    cover:
      'https://images.unsplash.com/photo-1730998373355-06625ff334bf?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    gallery: [
      'https://images.unsplash.com/photo-1730998373355-06625ff334bf?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
  },
  'somnath-temple': {
    cover:
      'https://images.unsplash.com/photo-1735192683815-d8918aad53dc?q=80&w=524&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    gallery: [
      'https://images.unsplash.com/photo-1735192683815-d8918aad53dc?q=80&w=524&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
  },
  'rann-of-kutch': {
    cover:
      'https://images.unsplash.com/photo-1670406312373-6d4d1776e4aa?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    gallery: [
      'https://images.unsplash.com/photo-1670406312373-6d4d1776e4aa?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
  },
  'dwarkadhish-temple': {
    cover:
      'https://images.unsplash.com/photo-1711547979445-a72c87dfd004?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    gallery: [
      'https://images.unsplash.com/photo-1711547979445-a72c87dfd004?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
  },
  'sabarmati-ashram': {
    cover:
      'https://images.unsplash.com/photo-1624903715293-afe920c6adad?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    gallery: [
      'https://images.unsplash.com/photo-1624903715293-afe920c6adad?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
  },
  'adalaj-stepwell': {
    cover:
      'https://images.unsplash.com/photo-1632820669774-9ab4f2121927?q=80&w=1103&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    gallery: [
      'https://images.unsplash.com/photo-1632820669774-9ab4f2121927?q=80&w=1103&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
  },
  saputara: {
    cover:
      'https://images.unsplash.com/photo-1640414072348-1fbc3acf7963?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    gallery: [
      'https://images.unsplash.com/photo-1640414072348-1fbc3acf7963?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
  },
}

/** Title keywords → catalog slug when slug is missing from API */
const TITLE_ALIASES = [
  ['statue of unity', 'statue-of-unity'],
  ['gir national', 'gir-national-park'],
  ['gir park', 'gir-national-park'],
  ['somnath', 'somnath-temple'],
  ['rann of kutch', 'rann-of-kutch'],
  ['rann', 'rann-of-kutch'],
  ['dwarka', 'dwarkadhish-temple'],
  ['dwarkadhish', 'dwarkadhish-temple'],
  ['sabarmati', 'sabarmati-ashram'],
  ['ashram', 'sabarmati-ashram'],
  ['adalaj', 'adalaj-stepwell'],
  ['stepwell', 'adalaj-stepwell'],
  ['saputara', 'saputara'],
]

export function resolvePlaceImageKey(place) {
  if (!place) return null

  const slug = String(place.slug || '')
    .toLowerCase()
    .trim()
  if (slug && PLACE_IMAGE_CATALOG[slug]) return slug

  const id = String(place._id || '').toLowerCase()
  if (id.startsWith('demo-')) {
    const fromId = id.replace(/^demo-/, '')
    if (PLACE_IMAGE_CATALOG[fromId]) return fromId
  }

  const title = String(place.title || '').toLowerCase()
  for (const [needle, key] of TITLE_ALIASES) {
    if (title.includes(needle)) return key
  }

  return null
}

export function getCatalogImages(place) {
  const key = resolvePlaceImageKey(place)
  if (!key) return null
  return PLACE_IMAGE_CATALOG[key]
}

export function getCatalogCoverUrl(place) {
  return getCatalogImages(place)?.cover ?? null
}

export function getCatalogGallery(place) {
  const entry = getCatalogImages(place)
  return entry?.gallery?.length ? [...entry.gallery] : null
}

export const DEFAULT_UNSPLASH_FALLBACKS = Object.values(PLACE_IMAGE_CATALOG).map(
  (entry) => entry.cover
)
