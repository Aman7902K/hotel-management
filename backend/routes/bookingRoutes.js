const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBooking,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .post(protect, createBooking)
  .get(protect, admin, getAllBookings);

router.get('/user', protect, getUserBookings);

router.route('/:id')
  .put(protect, admin, updateBooking)
  .delete(protect, cancelBooking);

module.exports = router;
