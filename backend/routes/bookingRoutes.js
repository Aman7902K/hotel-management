import { Router } from 'express';
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBooking,
  cancelBooking,
} from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/auth.js';

const router = Router();

router.route('/')
  .post(protect, createBooking)
  .get(protect, admin, getAllBookings);

router.get('/user', protect, getUserBookings);

router.route('/:id')
  .put(protect, admin, updateBooking)
  .delete(protect, cancelBooking);

export default router
