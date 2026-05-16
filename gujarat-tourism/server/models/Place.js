import mongoose from 'mongoose';
import { normalizePlace } from '../utils/normalizePlace.js';

const placeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
  },
  description: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    default: '',
  },
  // String (not enum) so legacy values like "Heritage" from old seeds still load
  category: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  // Mixed supports legacy string URLs and new { url, publicId } objects
  images: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
  coverImage: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  rating: {
    type: Number,
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  pricePerPerson: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    default: 0,
  },
  discountPrice: {
    type: Number,
    default: 0,
  },
  mapLocation: {
    lat: Number,
    lng: Number,
  },
  nearbyAttractions: [String],
  bestTimeToVisit: String,
  visitingHours: String,
  entryFee: {
    type: String,
    default: 'Free',
  },
  howToReach: String,
  openingHours: String,
  contactInfo: String,
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isPopular: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

placeSchema.pre('save', function (next) {
  if (!this.pricePerPerson && this.price) {
    this.pricePerPerson = this.price;
  }
  if (!this.price && this.pricePerPerson) {
    this.price = this.pricePerPerson;
  }
  if (this.totalReviews !== undefined) {
    this.numReviews = this.totalReviews;
  }
  if (this.category) {
    this.category = String(this.category).toLowerCase().replace(/\s+/g, '_');
    const legacyMap = {
      temple: 'temple',
      wildlife: 'wildlife',
      beach: 'beach',
      'hill station': 'hill_station',
      hill_station: 'hill_station',
      heritage: 'heritage',
      museum: 'museum',
      other: 'other',
    };
    this.category = legacyMap[this.category] || this.category;
  }
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

placeSchema.set('toJSON', {
  transform(_doc, ret) {
    return normalizePlace(ret);
  },
});

const Place = mongoose.model('Place', placeSchema);
export default Place;
