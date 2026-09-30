const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  approveBooking,
  rejectBooking,
  cancelBooking
} = require('../controllers/bookingController');
const { createBookingRules, updateBookingRules } = require('../validators/bookingValidator');
const validate = require('../middleware/validationMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createBookingRules, validate, createBooking);
router.get('/', protect, getBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id', protect, updateBookingRules, validate, updateBooking);
router.delete('/:id', protect, deleteBooking);

router.put('/:id/approve', protect, admin, approveBooking);
router.put('/:id/reject', protect, admin, rejectBooking);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
