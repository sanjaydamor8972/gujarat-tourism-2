import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import Place from './models/Place.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '.env') })

const placesData = [
  {
    title: "Statue of Unity",
    description: "The Statue of Unity is the world's tallest statue, standing at 182 meters. It is dedicated to Sardar Vallabhbhai Patel, the Iron Man of India. Located near the Sardar Sarovar Dam, it offers breathtaking views of the surrounding valley and Narmada river.",
    location: "Kevadia, Narmada District",
    category: "Heritage",
    images: [
      "C:\\Users\\sanju\\OneDrive\\Documents\\Desktop\\GT DEEP SEEK\\gujarat-tourism\\client\\public\\images\\Interesting-Facts-about-Statue-of-Unity.jpg"
    ],
    rating: 4.8,
    numReviews: 1250,
    price: 500,
    discountPrice: 450,
    mapLocation: { lat: 21.8380, lng: 73.7191 },
    bestTimeToVisit: "October to March",
    howToReach: "By road from Vadodara (90 km) or Ahmedabad (200 km). Nearest railway station is Kevadia.",
    openingHours: "8:00 AM - 6:00 PM daily",
    contactInfo: "+91 1234567890",
    isFeatured: true
  },
  {
    title: "Gir National Park",
    description: "The only place outside Africa where Asiatic lions can be seen in their natural habitat. Home to over 500 lions and numerous other wildlife species including leopards, deer, and crocodiles.",
    location: "Junagadh District",
    category: "Wildlife",
    images: [
      "https://images.unsplash.com/photo-1566577134774-4fa5a90f2a6b?w=800"
    ],
    rating: 4.7,
    numReviews: 890,
    price: 800,
    discountPrice: 700,
    mapLocation: { lat: 21.1645, lng: 70.8028 },
    bestTimeToVisit: "December to March",
    howToReach: "Nearest airport: Keshod (65 km). Nearest railway: Junagadh (55 km).",
    openingHours: "6:00 AM - 9:00 AM, 3:00 PM - 6:00 PM",
    contactInfo: "+91 2877 285501",
    isFeatured: true
  },
  {
    title: "Somnath Temple",
    description: "One of the twelve Jyotirlinga shrines of Lord Shiva. The temple has been reconstructed several times and stands as a symbol of resilience and faith. Located at the shore of the Arabian Sea.",
    location: "Prabhas Patan, Gir Somnath",
    category: "Temple",
    images: [
      "https://images.unsplash.com/photo-1587925358603-c2eea5305bbc?w=800"
    ],
    rating: 4.9,
    numReviews: 2100,
    price: 300,
    discountPrice: 250,
    mapLocation: { lat: 20.8850, lng: 70.4007 },
    bestTimeToVisit: "October to February",
    howToReach: "Nearest airport: Diu (85 km). Nearest railway: Veraval (7 km).",
    openingHours: "6:00 AM - 9:00 PM daily",
    contactInfo: "+91 2876 233803",
    isFeatured: true
  },
  {
    title: "Rann of Kutch",
    description: "A seasonal salt desert that transforms into a white wonderland during the Rann Utsav festival. One of the largest salt deserts in the world, spanning over 7,500 square kilometers.",
    location: "Kutch District",
    category: "Heritage",
    images: [
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800"
    ],
    rating: 4.8,
    numReviews: 1500,
    price: 600,
    discountPrice: 550,
    mapLocation: { lat: 23.8290, lng: 69.6994 },
    bestTimeToVisit: "November to February",
    howToReach: "Nearest airport: Bhuj (85 km). Regular buses from Bhuj.",
    openingHours: "Sunrise to Sunset",
    contactInfo: "+91 2832 234567",
    isFeatured: true
  },
  {
    title: "Dwarkadhish Temple",
    description: "An ancient temple dedicated to Lord Krishna, believed to be over 2500 years old. It's one of the Char Dham pilgrimage sites and features intricate carvings and architecture.",
    location: "Dwarka, Devbhoomi Dwarka",
    category: "Temple",
    images: [
      "https://images.unsplash.com/photo-1587925358603-c2eea5305bbc?w=800"
    ],
    rating: 4.9,
    numReviews: 1800,
    price: 250,
    discountPrice: 200,
    mapLocation: { lat: 22.2396, lng: 68.9678 },
    bestTimeToVisit: "October to March",
    howToReach: "Nearest airport: Jamnagar (137 km). Well connected by road and rail.",
    openingHours: "6:30 AM - 1:00 PM, 5:00 PM - 9:00 PM",
    contactInfo: "+91 2892 234567",
    isFeatured: false
  },
  {
    title: "Sabarmati Ashram",
    description: "Former home of Mahatma Gandhi, now a museum showcasing his life and the Indian independence movement. Located on the banks of Sabarmati River in Ahmedabad.",
    location: "Ahmedabad",
    category: "Heritage",
    images: [
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800"
    ],
    rating: 4.6,
    numReviews: 950,
    price: 100,
    discountPrice: 80,
    mapLocation: { lat: 23.0600, lng: 72.5800 },
    bestTimeToVisit: "October to March",
    howToReach: "Located in central Ahmedabad. Easily accessible by bus, auto, or taxi.",
    openingHours: "8:30 AM - 6:30 PM daily",
    contactInfo: "+91 79 27557277",
    isFeatured: false
  },
  {
    title: "Adalaj Stepwell",
    description: "A magnificent five-story stepwell built in 1499, showcasing intricate Indian architecture and serving as a cool refuge during summer. Features exquisite carvings of geometric patterns and floral motifs.",
    location: "Adalaj, Gandhinagar",
    category: "Heritage",
    images: [
      "https://images.unsplash.com/photo-1587925358603-c2eea5305bbc?w=800"
    ],
    rating: 4.5,
    numReviews: 650,
    price: 50,
    discountPrice: 40,
    mapLocation: { lat: 23.1300, lng: 72.5800 },
    bestTimeToVisit: "October to March",
    howToReach: "15 km from Ahmedabad city center. Accessible by local buses and taxis.",
    openingHours: "8:00 AM - 6:00 PM",
    contactInfo: "+91 79 12345678",
    isFeatured: false
  },
  {
    title: "Saputara",
    description: "The only hill station in Gujarat, located in the Dang district. Known for its scenic beauty, lush green forests, pleasant climate, and tribal culture. Perfect for nature lovers and adventure enthusiasts.",
    location: "Saputara, Dang",
    category: "Hill Station",
    images: [
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800"
    ],
    rating: 4.4,
    numReviews: 520,
    price: 700,
    discountPrice: 650,
    mapLocation: { lat: 20.9500, lng: 73.7500 },
    bestTimeToVisit: "June to February",
    howToReach: "Nearest railway: Waghai (50 km). Regular buses from Surat (150 km).",
    openingHours: "24 hours",
    contactInfo: "+91 1234567890",
    isFeatured: false
  }
]

async function seedDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to MongoDB successfully!')
    
    // Clear existing places
    const deletedCount = await Place.deleteMany({})
    console.log(`🗑️  Cleared ${deletedCount.deletedCount} existing places`)
    
    // Insert new places
    const inserted = await Place.insertMany(placesData)
    console.log(`\n✅ Successfully added ${inserted.length} places to database!\n`)
    
    console.log('📋 Added places:')
    console.log('─'.repeat(60))
    inserted.forEach((place, index) => {
      console.log(`${index + 1}. ${place.title}`)
      console.log(`   📍 Location: ${place.location}`)
      console.log(`   🏷️  Category: ${place.category}`)
      console.log(`   💰 Price: ₹${place.price}/person`)
      if (place.discountPrice) console.log(`   🎉 Discount: ₹${place.discountPrice}/person`)
      console.log(`   ⭐ Rating: ${place.rating}/5 (${place.numReviews} reviews)`)
      console.log('')
    })
    
    console.log('─'.repeat(60))
    console.log('🎉 Database seeding completed successfully!')
    console.log('\n🌐 Visit http://localhost:5173/places to see your places!')
    
  } catch (error) {
    console.error('❌ Error seeding database:', error.message)
    if (error.errors) {
      console.log('\n📝 Validation errors:')
      Object.keys(error.errors).forEach(key => {
        console.log(`   - ${key}: ${error.errors[key].message}`)
      })
    }
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Disconnected from MongoDB')
  }
}

seedDatabase()