import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: true,
  },
  bookingReference: {
    type: String,
    unique: true,
    sparse: true,
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
  visitDate: {
    type: Date,
    required: true,
  },
  totalPeople: {
    type: Number,
    required: true,
    min: 1,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  specialRequests: String,
  contactNumber: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

bookingSchema.pre('save', function (next) {
  if (!this.bookingReference) {
    const shortId = this._id
      ? this._id.toString().slice(-6).toUpperCase()
      : Date.now().toString(36).toUpperCase();
    this.bookingReference = `GT-${shortId}`;
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
