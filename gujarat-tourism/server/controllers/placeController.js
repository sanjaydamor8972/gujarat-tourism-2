import Place from "../models/Place.js";
import { cloudinary } from "../config/cloudinary.js";

// @desc    Get all places with filtering
// @route   GET /api/places
// @access  Public
const getPlaces = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = (page - 1) * limit;
    
    let query = {};
    
    // Search
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
        { location: { $regex: req.query.search, $options: "i" } },
      ];
    }
    
    // Filter by category
    if (req.query.category && req.query.category !== "all") {
      query.category = req.query.category;
    }
    
    // Filter by district
    if (req.query.district && req.query.district !== "all") {
      query.district = req.query.district;
    }
    
    // Featured places
    if (req.query.featured === "true") {
      query.isFeatured = true;
    }
    
    // Popular places
    if (req.query.popular === "true") {
      query.isPopular = true;
    }
    
    // Sorting
    let sort = {};
    if (req.query.sort === "rating") {
      sort.rating = -1;
    } else if (req.query.sort === "newest") {
      sort.createdAt = -1;
    } else if (req.query.sort === "oldest") {
      sort.createdAt = 1;
    } else {
      sort.createdAt = -1;
    }
    
    const places = await Place.find(query)
      .sort(sort)
      .limit(limit)
      .skip(startIndex);
    
    const total = await Place.countDocuments(query);
    
    res.json({
      places,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single place by slug or id
// @route   GET /api/places/:id
// @access  Public
const getPlaceById = async (req, res) => {
  try {
    let place;
    
    // Check if param is slug or id
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      place = await Place.findById(req.params.id);
    } else {
      place = await Place.findOne({ slug: req.params.id });
    }
    
    if (place) {
      res.json(place);
    } else {
      res.status(404).json({ message: "Place not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a place
// @route   POST /api/places
// @access  Private/Admin
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
    } = req.body;
    
    const place = await Place.create({
      title,
      description,
      shortDescription,
      location,
      district,
      category,
      pricePerPerson,
      bestTimeToVisit: bestTimeToVisit || "",
      visitingHours: visitingHours || "",
      entryFee: entryFee || "Free",
      mapLocation: mapLocation || { lat: 0, lng: 0 },
      nearbyAttractions: nearbyAttractions || [],
      coverImage: {
        url: "https://via.placeholder.com/800x600?text=Gujarat+Tourism",
        publicId: "placeholder",
      },
      images: [],
    });
    
    res.status(201).json(place);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a place
// @route   PUT /api/places/:id
// @access  Private/Admin
const updatePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    
    place.title = req.body.title || place.title;
    place.description = req.body.description || place.description;
    place.shortDescription = req.body.shortDescription || place.shortDescription;
    place.location = req.body.location || place.location;
    place.district = req.body.district || place.district;
    place.category = req.body.category || place.category;
    place.pricePerPerson = req.body.pricePerPerson || place.pricePerPerson;
    place.bestTimeToVisit = req.body.bestTimeToVisit || place.bestTimeToVisit;
    place.visitingHours = req.body.visitingHours || place.visitingHours;
    place.entryFee = req.body.entryFee || place.entryFee;
    place.mapLocation = req.body.mapLocation || place.mapLocation;
    place.nearbyAttractions = req.body.nearbyAttractions || place.nearbyAttractions;
    place.isPopular = req.body.isPopular !== undefined ? req.body.isPopular : place.isPopular;
    place.isFeatured = req.body.isFeatured !== undefined ? req.body.isFeatured : place.isFeatured;
    
    const updatedPlace = await place.save();
    res.json(updatedPlace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a place
// @route   DELETE /api/places/:id
// @access  Private/Admin
const deletePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    
    // Delete images from Cloudinary if they exist
    if (place.coverImage && place.coverImage.publicId && place.coverImage.publicId !== "placeholder") {
      try {
        await cloudinary.uploader.destroy(place.coverImage.publicId);
      } catch (err) {
        console.log("Cloudinary delete error:", err.message);
      }
    }
    
    for (const image of place.images) {
      if (image.publicId && image.publicId !== "placeholder") {
        try {
          await cloudinary.uploader.destroy(image.publicId);
        } catch (err) {
          console.log("Cloudinary delete error:", err.message);
        }
      }
    }
    
    await place.deleteOne();
    res.json({ message: "Place removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload place images
// @route   POST /api/places/:id/upload
// @access  Private/Admin
const uploadPlaceImages = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    
    const uploadedImages = [];
    
    for (const file of req.files) {
      // Convert buffer to base64
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = `data:${file.mimetype};base64,${b64}`;
      
      // Use placeholder if cloudinary not configured
      const imageUrl = `https://via.placeholder.com/800x600?text=${encodeURIComponent(file.originalname)}`;
      
      uploadedImages.push({
        url: imageUrl,
        publicId: `local_${Date.now()}_${file.originalname}`,
        caption: "",
      });
    }
    
    place.images.push(...uploadedImages);
    
    // If no cover image, set first image as cover
    if ((!place.coverImage || place.coverImage.url.includes("placeholder")) && uploadedImages.length > 0) {
      place.coverImage = uploadedImages[0];
    }
    
    await place.save();
    
    res.json({ message: "Images uploaded successfully", images: uploadedImages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete place image
// @route   DELETE /api/places/:id/images/:imageId
// @access  Private/Admin
const deletePlaceImage = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    
    const imageIndex = place.images.findIndex(img => img._id.toString() === req.params.imageId);
    
    if (imageIndex === -1) {
      return res.status(404).json({ message: "Image not found" });
    }
    
    place.images.splice(imageIndex, 1);
    
    await place.save();
    
    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured places for homepage
// @route   GET /api/places/featured
// @access  Public
const getFeaturedPlaces = async (req, res) => {
  try {
    const places = await Place.find({ isFeatured: true }).limit(6);
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get popular places
// @route   GET /api/places/popular
// @access  Public
const getPopularPlaces = async (req, res) => {
  try {
    const places = await Place.find({ isPopular: true }).limit(8);
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export all functions
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