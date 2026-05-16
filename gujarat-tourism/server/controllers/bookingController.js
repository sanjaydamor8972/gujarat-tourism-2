import Booking from '../models/Booking.js';
import Place from '../models/Place.js';

export const createBooking = async (req, res) => {
  try {
    const {
      placeId,
      travelDate,
      visitDate,
      totalPeople,
      specialRequests,
      contactNumber,
    } = req.body;

    const resolvedVisitDate = visitDate || travelDate;
    if (!resolvedVisitDate) {
      return res.status(400).json({ message: 'Travel date is required' });
    }

    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    const pricePerPerson = place.pricePerPerson ?? place.price ?? 0;
    const totalPrice = pricePerPerson * totalPeople;

    const booking = await Booking.create({
      user: req.user._id,
      place: placeId,
      bookingDate: new Date(),
      visitDate: resolvedVisitDate,
      totalPeople,
      totalPrice,
      specialRequests,
      contactNumber,
    });

    const populated = await Booking.findById(booking._id)
      .populate('place', 'title images location pricePerPerson coverImage');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('place', 'title images location pricePerPerson coverImage')
      .sort({ createdAt: -1 });

    const mapped = bookings.map((b) => {
      const doc = b.toObject();
      return {
        ...doc,
        travelDate: doc.visitDate,
      };
    });

    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email')
      .populate('place', 'title location')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (booking) {
      booking.status = req.body.status;
      if (req.body.paymentStatus) {
        booking.paymentStatus = req.body.paymentStatus;
      }
      await booking.save();
      res.json(booking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (booking && booking.user.toString() === req.user._id.toString()) {
      booking.status = 'cancelled';
      await booking.save();
      res.json({ message: 'Booking cancelled' });
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
