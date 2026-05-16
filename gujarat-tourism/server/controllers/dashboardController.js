import User from '../models/User.js';
import Place from '../models/Place.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import { normalizePlaces } from '../utils/normalizePlace.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPlaces = await Place.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalReviews = await Review.countDocuments();

    const ratingAgg = await Place.aggregate([
      { $match: { rating: { $gt: 0 } } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } },
    ]);

    const revenue = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    res.json({
      totalUsers,
      totalPlaces,
      totalBookings,
      totalReviews,
      avgRating: ratingAgg[0]?.avgRating ? Number(ratingAgg[0].avgRating.toFixed(1)) : 0,
      revenue: revenue[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDashboardAnalytics = async (req, res) => {
  try {
    const revenue = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    const bookingStats = {
      pending: await Booking.countDocuments({ status: 'pending' }),
      confirmed: await Booking.countDocuments({ status: 'confirmed' }),
      completed: await Booking.countDocuments({ status: 'completed' }),
      cancelled: await Booking.countDocuments({ status: 'cancelled' }),
    };

    const monthlyBookings = await Booking.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthlyCounts = Array(12).fill(0);
    monthlyBookings.forEach((m) => {
      if (m._id >= 1 && m._id <= 12) {
        monthlyCounts[m._id - 1] = m.count;
      }
    });

    const popularPlacesRaw = await Booking.aggregate([
      { $group: { _id: '$place', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'places',
          localField: '_id',
          foreignField: '_id',
          as: 'place',
        },
      },
      { $unwind: '$place' },
    ]);

    const popularPlaces = popularPlacesRaw.map((item) => {
      const normalized = normalizePlaces([item.place])[0];
      return {
        ...item,
        title: normalized.title,
        coverImage: normalized.coverImage,
        place: normalized,
        count: item.count,
      };
    });

    const recentBookings = await Booking.find()
      .populate('user', 'name')
      .populate('place', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalRevenue: revenue[0]?.total || 0,
      bookingStats,
      monthlyBookings: monthlyCounts,
      popularPlaces,
      recentBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
