import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-orange-400">Gujarat Tourism</h3>
            <p className="text-gray-400">
              Experience the vibrant culture, rich heritage, and breathtaking landscapes of Gujarat.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-orange-400">Home</Link></li>
              <li><Link to="/places" className="text-gray-400 hover:text-orange-400">Tourist Places</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-orange-400">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-orange-400">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <p className="text-gray-400">Block No. 11, 3rd Floor, Udyog Bhavan</p>
            <p className="text-gray-400">Gandhinagar, Gujarat - 382010</p>
            <p className="text-gray-400 mt-2">📞 +91 79 2325 7676</p>
            <p className="text-gray-400">✉️ info@gujarattourism.com</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-400">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-orange-400">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-orange-400">Instagram</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} Gujarat Tourism. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer