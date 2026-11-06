import express from 'express';
import {
  logActivity,
  getMyActivities,
  getAllActivities,
  reviewActivity
} from '../controllers/activityController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', logActivity);
router.get('/my-activities', getMyActivities);
router.get('/', authorize('admin'), getAllActivities);
router.put('/:id/review', authorize('admin'), reviewActivity);

export default router;
