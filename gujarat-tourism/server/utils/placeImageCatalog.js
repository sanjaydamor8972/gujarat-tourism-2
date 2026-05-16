/** Keep in sync with client/src/data/placeImageCatalog.js */

export const PLACE_COVER_URLS = {
  'statue-of-unity':
    'https://images.unsplash.com/photo-1631983097767-099c77bf880d?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'gir-national-park':
    'https://images.unsplash.com/photo-1730998373355-06625ff334bf?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'somnath-temple':
    'https://images.unsplash.com/photo-1735192683815-d8918aad53dc?q=80&w=524&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'rann-of-kutch':
    'https://images.unsplash.com/photo-1670406312373-6d4d1776e4aa?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'dwarkadhish-temple':
    'https://images.unsplash.com/photo-1711547979445-a72c87dfd004?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'sabarmati-ashram':
    'https://images.unsplash.com/photo-1624903715293-afe920c6adad?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'adalaj-stepwell':
    'https://images.unsplash.com/photo-1632820669774-9ab4f2121927?q=80&w=1103&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  saputara:
    'https://images.unsplash.com/photo-1640414072348-1fbc3acf7963?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
}

const TITLE_ALIASES = [
  ['statue of unity', 'statue-of-unity'],
  ['gir national', 'gir-national-park'],
  ['somnath', 'somnath-temple'],
  ['rann of kutch', 'rann-of-kutch'],
  ['dwarka', 'dwarkadhish-temple'],
  ['dwarkadhish', 'dwarkadhish-temple'],
  ['sabarmati', 'sabarmati-ashram'],
  ['adalaj', 'adalaj-stepwell'],
  ['saputara', 'saputara'],
]

export function resolvePlaceSlug(doc) {
  const slug = String(doc.slug || '').toLowerCase().trim()
  if (slug && PLACE_COVER_URLS[slug]) return slug

  const title = String(doc.title || '').toLowerCase()
  for (const [needle, key] of TITLE_ALIASES) {
    if (title.includes(needle)) return key
  }
  return null
}

export function imagesFor(slug) {
  const url =
    PLACE_COVER_URLS[slug] ||
    PLACE_COVER_URLS['statue-of-unity']
  const img = (imageUrl) => ({ url: imageUrl, publicId: '', caption: '' })
  return {
    coverImage: img(url),
    images: [img(url)],
  }
}

export function applyCatalogImages(doc) {
  const key = resolvePlaceSlug(doc)
  if (!key) return doc

  const url = PLACE_COVER_URLS[key]
  const image = { url, publicId: '', caption: '' }
  return {
    ...doc,
    coverImage: image,
    images: [image],
  }
}
