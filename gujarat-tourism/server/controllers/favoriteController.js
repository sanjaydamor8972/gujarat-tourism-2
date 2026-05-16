import Favorite from '../models/Favorite.js';
import Place from '../models/Place.js';
import { normalizePlace, normalizePlaces } from '../utils/normalizePlace.js';

export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).populate('place');
    const places = favorites
      .map((f) => f.place)
      .filter(Boolean);
    res.json(normalizePlaces(places));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const { placeId } = req.params;
    const place = await Place.findById(placeId);

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    const existing = await Favorite.findOne({
      user: req.user._id,
      place: placeId,
    });

    if (existing) {
      await existing.deleteOne();
      return res.json({
        message: 'Removed from favorites',
        added: false,
      });
    }

    await Favorite.create({
      user: req.user._id,
      place: placeId,
    });

    res.json({
      message: 'Added to favorites',
      added: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
