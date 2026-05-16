import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import Place from './models/Place.js'
import { imagesFor } from './utils/placeImageCatalog.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '.env') })

const placesData = [
  {
    title: 'Statue of Unity',
    slug: 'statue-of-unity',
    description:
      "The Statue of Unity is the world's tallest statue, standing at 182 meters. It is dedicated to Sardar Vallabhbhai Patel, the Iron Man of India.",
    shortDescription: "World's tallest statue dedicated to Sardar Patel.",
    location: 'Kevadia, Narmada District',
    district: 'Narmada',
    category: 'heritage',
    ...imagesFor('statue-of-unity'),
    rating: 4.8,
    totalReviews: 1250,
    numReviews: 1250,
    pricePerPerson: 500,
    price: 500,
    discountPrice: 450,
    mapLocation: { lat: 21.838, lng: 73.7191 },
    bestTimeToVisit: 'October to March',
    isFeatured: true,
    isPopular: true,
  },
  {
    title: 'Gir National Park',
    slug: 'gir-national-park',
    description:
      'The only place outside Africa where Asiatic lions can be seen in their natural habitat.',
    shortDescription: 'Home of the Asiatic lion.',
    location: 'Junagadh District',
    district: 'Junagadh',
    category: 'wildlife',
    ...imagesFor('gir-national-park'),
    rating: 4.7,
    totalReviews: 890,
    numReviews: 890,
    pricePerPerson: 800,
    price: 800,
    mapLocation: { lat: 21.1645, lng: 70.8028 },
    isFeatured: true,
    isPopular: true,
  },
  {
    title: 'Somnath Temple',
    slug: 'somnath-temple',
    description: 'One of the twelve Jyotirlinga shrines of Lord Shiva on the Arabian Sea coast.',
    shortDescription: 'Sacred Jyotirlinga by the sea.',
    location: 'Prabhas Patan, Gir Somnath',
    district: 'Gir Somnath',
    category: 'temple',
    ...imagesFor('somnath-temple'),
    rating: 4.9,
    totalReviews: 2100,
    numReviews: 2100,
    pricePerPerson: 300,
    price: 300,
    mapLocation: { lat: 20.885, lng: 70.4007 },
    isFeatured: true,
    isPopular: false,
  },
  {
    title: 'Rann of Kutch',
    slug: 'rann-of-kutch',
    description: 'A seasonal salt desert and white wonderland during the Rann Utsav festival.',
    shortDescription: 'White desert festival destination.',
    location: 'Kutch District',
    district: 'Kutch',
    category: 'heritage',
    ...imagesFor('rann-of-kutch'),
    rating: 4.8,
    totalReviews: 1500,
    numReviews: 1500,
    pricePerPerson: 600,
    price: 600,
    mapLocation: { lat: 23.829, lng: 69.6994 },
    isFeatured: true,
    isPopular: true,
  },
  {
    title: 'Dwarkadhish Temple',
    slug: 'dwarkadhish-temple',
    description: 'Ancient temple dedicated to Lord Krishna, one of the Char Dham sites.',
    shortDescription: 'Ancient Krishna temple in Dwarka.',
    location: 'Dwarka, Devbhoomi Dwarka',
    district: 'Dwarka',
    category: 'temple',
    ...imagesFor('dwarkadhish-temple'),
    rating: 4.9,
    totalReviews: 1800,
    numReviews: 1800,
    pricePerPerson: 250,
    price: 250,
    mapLocation: { lat: 22.2396, lng: 68.9678 },
    isFeatured: false,
    isPopular: true,
  },
  {
    title: 'Sabarmati Ashram',
    slug: 'sabarmati-ashram',
    description: "Former home of Mahatma Gandhi, now a museum on the Sabarmati riverfront.",
    shortDescription: "Gandhi's historic ashram in Ahmedabad.",
    location: 'Ahmedabad',
    district: 'Ahmedabad',
    category: 'heritage',
    ...imagesFor('sabarmati-ashram'),
    rating: 4.6,
    totalReviews: 950,
    numReviews: 950,
    pricePerPerson: 100,
    price: 100,
    mapLocation: { lat: 23.06, lng: 72.58 },
    isFeatured: false,
    isPopular: false,
  },
  {
    title: 'Adalaj Stepwell',
    slug: 'adalaj-stepwell',
    description: 'A magnificent five-story stepwell built in 1499 with intricate carvings.',
    shortDescription: 'Historic stepwell near Ahmedabad.',
    location: 'Adalaj, Gandhinagar',
    district: 'Gandhinagar',
    category: 'heritage',
    ...imagesFor('adalaj-stepwell'),
    rating: 4.5,
    totalReviews: 650,
    numReviews: 650,
    pricePerPerson: 50,
    price: 50,
    mapLocation: { lat: 23.13, lng: 72.58 },
    isFeatured: false,
    isPopular: false,
  },
  {
    title: 'Saputara',
    slug: 'saputara',
    description: 'The only hill station in Gujarat, known for scenic beauty and tribal culture.',
    shortDescription: "Gujarat's only hill station.",
    location: 'Saputara, Dang',
    district: 'Dang',
    category: 'hill_station',
    ...imagesFor('saputara'),
    rating: 4.4,
    totalReviews: 520,
    numReviews: 520,
    pricePerPerson: 700,
    price: 700,
    mapLocation: { lat: 20.95, lng: 73.75 },
    isFeatured: false,
    isPopular: true,
  },
]

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')

    const deletedCount = await Place.deleteMany({})
    console.log(`Cleared ${deletedCount.deletedCount} existing places`)

    const inserted = await Place.insertMany(placesData)
    console.log(`Successfully added ${inserted.length} places`)

    inserted.forEach((place, index) => {
      console.log(`${index + 1}. ${place.title} (${place.category})`)
    })
  } catch (error) {
    console.error('Error seeding database:', error.message)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

seedDatabase()
