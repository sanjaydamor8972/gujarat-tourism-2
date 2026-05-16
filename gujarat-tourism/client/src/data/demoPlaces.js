/** Offline sample places (Unsplash images) when the API / MongoDB is unavailable */

import { PLACE_IMAGE_CATALOG } from './placeImageCatalog'

const img = (slug, index = 0) => {
  const entry = PLACE_IMAGE_CATALOG[slug]
  const url = entry?.gallery?.[index] ?? entry?.cover
  return { url, publicId: '', caption: '' }
}

function buildPlace(slug, fields) {
  const entry = PLACE_IMAGE_CATALOG[slug]
  const images = entry?.gallery?.map((url) => ({ url, publicId: '', caption: '' })) ?? [
    img(slug, 0),
  ]
  return {
    _id: `demo-${slug}`,
    slug,
    images,
    coverImage: img(slug, 0),
    ...fields,
  }
}

export const DEMO_PLACES = [
  buildPlace('statue-of-unity', {
    title: 'statue of Unity',
    shortDescription: "World's tallest statue dedicated to Sardar Patel.",
    description: 'The Statue of Unity stands at 182 meters on the Narmada riverbank.',
    location: 'Kevadia, Narmada District',
    district: 'Narmada',
    category: 'heritage',
    rating: 4.8,
    totalReviews: 1250,
    numReviews: 1250,
    pricePerPerson: 500,
    price: 500,
    isFeatured: true,
    isPopular: true,
  }),
  buildPlace('gir-national-park', {
    title: 'Gir National Park',
    shortDescription: 'Home of the Asiatic lion.',
    description: 'The only place outside Africa where Asiatic lions live in the wild.',
    location: 'Junagadh District',
    district: 'Junagadh',
    category: 'wildlife',
    rating: 4.7,
    totalReviews: 890,
    numReviews: 890,
    pricePerPerson: 800,
    price: 800,
    isFeatured: true,
    isPopular: true,
  }),
  buildPlace('somnath-temple', {
    title: 'Somnath Temple',
    shortDescription: 'Sacred Jyotirlinga by the sea.',
    description: 'One of the twelve Jyotirlinga shrines of Lord Shiva.',
    location: 'Prabhas Patan, Gir Somnath',
    district: 'Gir Somnath',
    category: 'temple',
    rating: 4.9,
    totalReviews: 2100,
    numReviews: 2100,
    pricePerPerson: 300,
    price: 300,
    isFeatured: true,
    isPopular: false,
  }),
  buildPlace('rann-of-kutch', {
    title: 'Rann of Kutch',
    shortDescription: 'White desert festival destination.',
    description: 'A seasonal salt desert famous for Rann Utsav.',
    location: 'Kutch District',
    district: 'Kutch',
    category: 'heritage',
    rating: 4.8,
    totalReviews: 1500,
    numReviews: 1500,
    pricePerPerson: 600,
    price: 600,
    isFeatured: true,
    isPopular: true,
  }),
  buildPlace('dwarkadhish-temple', {
    title: 'Dwarkadhish Temple',
    shortDescription: 'Ancient Krishna temple in Dwarka.',
    description: 'One of the Char Dham pilgrimage sites.',
    location: 'Dwarka',
    district: 'Dwarka',
    category: 'temple',
    rating: 4.9,
    totalReviews: 1800,
    numReviews: 1800,
    pricePerPerson: 250,
    price: 250,
    isFeatured: false,
    isPopular: true,
  }),
  buildPlace('sabarmati-ashram', {
    title: 'Sabarmati Ashram',
    shortDescription: "Gandhi's historic ashram in Ahmedabad.",
    description: 'Former home of Mahatma Gandhi, now a museum on the Sabarmati riverfront.',
    location: 'Ahmedabad',
    district: 'Ahmedabad',
    category: 'heritage',
    rating: 4.6,
    totalReviews: 950,
    numReviews: 950,
    pricePerPerson: 100,
    price: 100,
    isFeatured: false,
    isPopular: false,
  }),
  buildPlace('adalaj-stepwell', {
    title: 'Adalaj Stepwell',
    shortDescription: 'Historic stepwell near Ahmedabad.',
    description: 'A five-story stepwell built in 1499 with intricate stone carvings.',
    location: 'Adalaj, Gandhinagar',
    district: 'Gandhinagar',
    category: 'heritage',
    rating: 4.5,
    totalReviews: 650,
    numReviews: 650,
    pricePerPerson: 50,
    price: 50,
    isFeatured: false,
    isPopular: false,
  }),
  buildPlace('saputara', {
    title: 'Saputara',
    shortDescription: "Gujarat's only hill station.",
    description: 'Scenic hills, lakes, and tribal culture in the Dang district.',
    location: 'Saputara, Dang',
    district: 'Dang',
    category: 'hill_station',
    rating: 4.4,
    totalReviews: 520,
    numReviews: 520,
    pricePerPerson: 700,
    price: 700,
    isFeatured: false,
    isPopular: true,
  })
]

export function getDemoFeaturedPlaces() {
  return DEMO_PLACES.filter((p) => p.isFeatured).slice(0, 6)
}

export function getDemoPopularPlaces() {
  return DEMO_PLACES.filter((p) => p.isPopular).slice(0, 8)
}

export function getDemoPlacesList() {
  return [...DEMO_PLACES]
}

export function getDemoPlaceById(id) {
  return DEMO_PLACES.find((p) => p._id === id || p.slug === id) || null
}
