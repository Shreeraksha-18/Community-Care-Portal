import express from 'express';
import {
  createDonation,
  getMyDonations,
  getAllDonations
} from '../controllers/donationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect); // All donation routes require authentication

router.post('/', createDonation);
router.get('/my-donations', getMyDonations);
router.get('/', authorize('admin'), getAllDonations);

export default router;
