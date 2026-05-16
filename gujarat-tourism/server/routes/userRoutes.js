import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getFavorites, toggleFavorite } from '../controllers/favoriteController.js';
import {
  getAllUsers,
  updateUserByAdmin,
  setUserBanned,
  deleteUserByAdmin,
} from '../controllers/userController.js';

const router = express.Router();

router.get('/favorites', protect, getFavorites);
router.post('/favorites/:placeId', protect, toggleFavorite);
router.get('/', protect, admin, getAllUsers);
router.put('/:id', protect, admin, updateUserByAdmin);
router.patch('/:id/ban', protect, admin, setUserBanned);
router.delete('/:id', protect, admin, deleteUserByAdmin);

export default router;
