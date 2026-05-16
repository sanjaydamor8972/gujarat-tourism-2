import express from 'express';
import { getDashboardStats, getDashboardAnalytics } from '../controllers/dashboardController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, admin, getDashboardStats);
router.get('/analytics', protect, admin, getDashboardAnalytics);

export default router;
