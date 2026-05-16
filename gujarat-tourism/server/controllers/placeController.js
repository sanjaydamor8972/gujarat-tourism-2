import Place from '../models/Place.js';
import { cloudinary } from '../config/cloudinary.js';
import { normalizePlace, normalizePlaces } from '../utils/normalizePlace.js';
import { uploadImageFile } from '../utils/uploadImage.js';

const getPlaces = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = (page - 1) * limit;

    let query = {};

    if (req.query.search) {
      const searchRegex = { $regex: req.query.search, $options: 'i' };
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
        { shortDescription: searchRegex },
        { district: searchRegex },
        { nearbyAttractions: searchRegex },
      ];
    }

    if (req.query.category && req.query.category !== 'all') {
      const cat = req.query.category.toLowerCase();
      const alt = cat.replace('_', ' ');
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { category: { $regex: new RegExp(`^${cat}$`, 'i') } },
          { category: { $regex: new RegExp(`^${alt}$`, 'i') } },
        ],
      });
    }

    if (req.query.district && req.query.district !== 'all') {
      query.district = { $regex: req.query.district, $options: 'i' };
    }

    if (req.query.featured === 'true') {
      query.isFeatured = true;
    }

    if (req.query.popular === 'true') {
      query.isPopular = true;
    }

    let sort = {};
    if (req.query.sort === 'rating') {
      sort.rating = -1;
    } else if (req.query.sort === 'oldest') {
      sort.createdAt = 1;
    } else {
      sort.createdAt = -1;
    }

    const places = await Place.find(query).sort(sort).limit(limit).skip(startIndex).lean();
    const total = await Place.countDocuments(query);

    res.json({
      places: normalizePlaces(places),
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPlaceById = async (req, res) => {
  try {
    let place;

    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      place = await Place.findById(req.params.id);
    } else {
      place = await Place.findOne({ slug: req.params.id });
    }

    if (place) {
      res.json(normalizePlace(place));
    } else {
      res.status(404).json({ message: 'Place not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPlace = async (req, res) => {
  try {
    const {
      title,
      description,
      shortDescription,
      location,
      district,
      category,
      pricePerPerson,
      bestTimeToVisit,
      visitingHours,
      entryFee,
      mapLocation,
      nearbyAttractions,
      isFeatured,
      isPopular,
    } = req.body;

    const price = Number(pricePerPerson) || 0;
    const defaultCover = {
      url: 'https://images.unsplash.com/photo-1631983097767-099c77bf880d?fm=jpg&q=60&w=1200&auto=format&fit=crop',
      publicId: 'placeholder',
      caption: '',
    };

    const place = await Place.create({
      title,
      description,
      shortDescription: shortDescription || description?.slice(0, 120) || '',
      location,
      district: district || '',
      category: (category || 'other').toLowerCase(),
      pricePerPerson: price,
      price,
      bestTimeToVisit: bestTimeToVisit || '',
      visitingHours: visitingHours || '',
      entryFee: entryFee || 'Free',
      mapLocation: mapLocation || { lat: 23.0225, lng: 72.5714 },
      nearbyAttractions: nearbyAttractions || [],
      isFeatured: isFeatured === true || isFeatured === 'true',
      isPopular: isPopular === true || isPopular === 'true',
      coverImage: defaultCover,
      images: [defaultCover],
    });

    res.status(201).json(normalizePlace(place));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updatePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    const fields = [
      'title',
      'description',
      'shortDescription',
      'location',
      'district',
      'bestTimeToVisit',
      'visitingHours',
      'entryFee',
      'mapLocation',
      'nearbyAttractions',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) place[field] = req.body[field];
    });

    if (req.body.category) place.category = req.body.category.toLowerCase();
    if (req.body.pricePerPerson !== undefined) {
      place.pricePerPerson = req.body.pricePerPerson;
      place.price = req.body.pricePerPerson;
    }
    if (req.body.isPopular !== undefined) {
      place.isPopular = req.body.isPopular === true || req.body.isPopular === 'true';
    }
    if (req.body.isFeatured !== undefined) {
      place.isFeatured = req.body.isFeatured === true || req.body.isFeatured === 'true';
    }

    const updatedPlace = await place.save();
    res.json(normalizePlace(updatedPlace));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    const destroyIfCloudinary = async (publicId) => {
      if (publicId && !publicId.startsWith('local_') && publicId !== 'placeholder') {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.log('Cloudinary delete error:', err.message);
        }
      }
    };

    if (place.coverImage?.publicId) {
      await destroyIfCloudinary(place.coverImage.publicId);
    }

    for (const image of place.images || []) {
      if (image.publicId) await destroyIfCloudinary(image.publicId);
    }

    await place.deleteOne();
    res.json({ message: 'Place removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadPlaceImages = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadedImages = [];
    for (const file of req.files) {
      uploadedImages.push(await uploadImageFile(file));
    }

    place.images.push(...uploadedImages);

    if (
      !place.coverImage?.url ||
      place.coverImage.url.includes('placeholder') ||
      place.coverImage.url.includes('photo-1587474260584')
    ) {
      place.coverImage = uploadedImages[0];
    }

    await place.save();

    res.json({
      message: 'Images uploaded successfully',
      images: uploadedImages,
      place: normalizePlace(place),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePlaceImage = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    let imageIndex = place.images.findIndex(
      (img) => img._id && img._id.toString() === req.params.imageId
    );

    if (imageIndex === -1 && /^\d+$/.test(req.params.imageId)) {
      imageIndex = parseInt(req.params.imageId, 10);
    }

    if (imageIndex < 0 || imageIndex >= place.images.length) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const removed = place.images[imageIndex];
    const removedUrl = typeof removed === 'string' ? removed : removed?.url || '';

    place.images.splice(imageIndex, 1);

    if (place.images.length === 0) {
      const defaultCover = {
        url: 'https://images.unsplash.com/photo-1631983097767-099c77bf880d?fm=jpg&q=60&w=1200&auto=format&fit=crop',
        publicId: 'placeholder',
        caption: '',
      };
      place.images = [defaultCover];
      place.coverImage = defaultCover;
    } else {
      const coverUrl = place.coverImage?.url || '';
      if (!coverUrl || coverUrl === removedUrl || coverUrl.includes('placeholder')) {
        place.coverImage = place.images[0];
      }
    }

    await place.save();

    res.json({ message: 'Image deleted successfully', place: normalizePlace(place) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFeaturedPlaces = async (req, res) => {
  try {
    let places = await Place.find({ isFeatured: true }).limit(6).lean();
    if (places.length === 0) {
      places = await Place.find().sort({ rating: -1 }).limit(6).lean();
    }
    res.json(normalizePlaces(places));
  } catch (error) {
    console.error('getFeaturedPlaces error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getPopularPlaces = async (req, res) => {
  try {
    let places = await Place.find({ isPopular: true }).limit(8).lean();
    if (places.length === 0) {
      places = await Place.find().sort({ rating: -1 }).limit(8).lean();
    }
    res.json(normalizePlaces(places));
  } catch (error) {
    console.error('getPopularPlaces error:', error);
    res.status(500).json({ message: error.message });
  }
};

export {
  getPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
  uploadPlaceImages,
  deletePlaceImage,
  getFeaturedPlaces,
  getPopularPlaces,
};
