import express from "express";
import {
  getPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
  uploadPlaceImages,
  deletePlaceImage,
  getFeaturedPlaces,
  getPopularPlaces,
} from "../controllers/placeController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getPlaces);
router.get("/featured", getFeaturedPlaces);
router.get("/popular", getPopularPlaces);
router.get("/:id", getPlaceById);

// Admin routes
router.post("/", protect, admin, createPlace);
router.put("/:id", protect, admin, updatePlace);
router.delete("/:id", protect, admin, deletePlace);
router.post("/:id/upload", protect, admin, upload.array("images", 10), uploadPlaceImages);
router.delete("/:id/images/:imageId", protect, admin, deletePlaceImage);

export default router;