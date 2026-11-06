import express from 'express';
import {
  getEvents,
  createEvent,
  registerForEvent
} from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', getEvents);
router.post('/', protect, authorize('admin'), createEvent);
router.post('/:id/register', protect, registerForEvent);

export default router;
