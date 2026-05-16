import React from 'react'
import { motion } from 'framer-motion'
import { FiMap, FiUsers, FiAward, FiGlobe, FiHeart, FiCamera, FiCompass, FiSun } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { PLACE_IMAGE_CATALOG } from '../data/placeImageCatalog'

const About = () => {
  const stats = [
    { icon: FiMap, value: '15+', label: 'Tourist Destinations' },
    { icon: FiUsers, value: '10+', label: 'Happy Travelers' },
    { icon: FiAward, value: '0', label: 'Awards Received' },
    { icon: FiGlobe, value: '0', label: 'International Awards' },
  ]

  const values = [
    {
      icon: FiHeart,
      title: 'Authentic Experiences',
      description: 'We provide genuine cultural experiences that showcase the true essence of Gujarat'
    },
    {
      icon: FiCamera,
      title: 'Memorable Moments',
      description: 'Creating unforgettable memories through carefully curated travel experiences'
    },
    {
      icon: FiCompass,
      title: 'Expert Guidance',
      description: 'Our local experts ensure you discover hidden gems and local treasures'
    },
    {
      icon: FiSun,
      title: 'Sustainable Tourism',
      description: 'Committed to eco-friendly practices and supporting local communities'
    }
  ]

  const team = [
    {
      name: 'Sanjay Damor',
      role: 'Developer',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      bio: '1 year in tourism industry'
    },
    {
      name: 'Akash chauhan',
      role: 'Developer',
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
      bio: 'Expert in cultural tourism'
    },
    {
      name: 'Ansh Tripathi',
      role: 'Operations Head',
      image: 'https://randomuser.me/api/portraits/men/3.jpg',
      bio: 'Ensuring smooth travel experiences'
    }

  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section - FIXED: removed h-[400px] and bg-gradient-to-r */}
      <div className="gradient-hero relative min-h-88 bg-linear-to-r from-primary-600 to-secondary-700">
        <div className="absolute inset-0 bg-black/40" aria-hidden />
        <div className="relative z-10 flex min-h-88 items-center justify-center py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="container-custom"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">About Gujarat Vision</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Discover the vibrant culture, rich heritage, and warm hospitality of Gujarat
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container-custom -mt-16 relative z-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-12 h-12 text-primary-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-800 dark:text-white">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <div className="w-20 h-1 bg-primary-600 mb-6"></div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              Gujarat vision is dedicated to showcasing the incredible diversity and rich cultural heritage 
              of Gujarat - a land of vibrant festivals, ancient temples, wildlife sanctuaries, and stunning landscapes.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              From the white desert of Kutch to the Gir forests, from the ancient stepwells to modern marvels 
              like the Statue of Unity, we help travelers discover the magic of Gujarat.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Our mission is to provide authentic, memorable, and sustainable travel experiences that 
              showcase the best of Gujarat's hospitality and culture.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <img
              src={PLACE_IMAGE_CATALOG['statue-of-unity'].cover}
              alt="Gujarat Tourism"
              className="rounded-2xl shadow-xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-primary-600 text-white p-4 rounded-xl shadow-lg">
              <p className="font-bold">Since 1975</p>
              <p className="text-sm">Serving travelers</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Our Values */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The principles that guide us in serving you better
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-gray-50 dark:bg-gray-900 rounded-xl hover:shadow-lg transition-shadow"
              >
                <value.icon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Dedicated professionals committed to making your Gujarat experience unforgettable
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-primary-600"
              />
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-primary-600 mb-2">{member.role}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section - FIXED: changed bg-gradient-to-r to bg-gradient-to-r */}
      <div className="gradient-hero bg-linear-to-r from-primary-600 to-secondary-700 py-16">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Start Your Journey Today</h2>
            <p className="text-white text-opacity-90 mb-8 max-w-2xl mx-auto">
              Let us help you plan the perfect trip to explore the wonders of Gujarat
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/places" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                Explore Places
              </Link>
              <Link to="/contact" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default About