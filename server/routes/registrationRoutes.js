import express from 'express';
import {
  registerForEvent,
  getMyRegistrations,
  getAllRegistrations,
  approveRegistration,
  markAttendance
} from '../controllers/registrationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', registerForEvent);                              // volunteer registers
router.get('/my', getMyRegistrations);                          // volunteer views own
router.get('/', authorize('admin'), getAllRegistrations);        // admin views all
router.put('/:id/approve', authorize('admin'), approveRegistration); // admin approve/reject
router.put('/:id/attend', authorize('admin'), markAttendance);  // admin mark attended + hours

export default router;
