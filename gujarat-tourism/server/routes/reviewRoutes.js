import express from 'express';
import {
  createReview,
  getPlaceReviews,
  getAllReviews,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/all', protect, admin, getAllReviews);
router.get('/:placeId', getPlaceReviews);
router.delete('/:id', protect, admin, deleteReview);

export default router;
