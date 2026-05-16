import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getFavorites, toggleFavorite } from '../controllers/favoriteController.js';
import { getAllUsers } from '../controllers/userController.js';

const router = express.Router();

router.get('/favorites', protect, getFavorites);
router.post('/favorites/:placeId', protect, toggleFavorite);
router.get('/', protect, admin, getAllUsers);

export default router;
