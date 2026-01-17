import Booking from '../models/Booking.js';
import Room from '../models/Room.js';

// Helper function to check room availability
const checkRoomAvailability = async (roomId, checkInDate, checkOutDate, excludeBookingId = null) => {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  // Find overlapping bookings
  const query = {
    room: roomId,
    status: { $nin: ['cancelled', 'completed'] },
    $or: [
      {
        checkInDate: { $lte: checkOut },
        checkOutDate: { $gte: checkIn },
      },
    ],
  };

  // Exclude current booking when updating
  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const overlappingBookings = await Booking.find(query);

  return overlappingBookings.length === 0;
};

const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, numberOfGuests, totalPrice } = req.body;

    // Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      return res.status(400).json({ message: 'Check-in date cannot be in the past' });
    }

    if (checkOut <= checkIn) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    // Check if room exists
    const roomExists = await Room.findById(room);
    if (!roomExists) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if room is available
    if (!roomExists.isAvailable) {
      return res.status(400).json({ message: 'Room is not available' });
    }

    // Check room availability for the dates
    const isAvailable = await checkRoomAvailability(room, checkInDate, checkOutDate);
    if (!isAvailable) {
      return res.status(400).json({ message: 'Room is not available for selected dates' });
    }

    // Check capacity
    if (numberOfGuests > roomExists.capacity) {
      return res.status(400).json({ 
        message: `Room capacity is ${roomExists.capacity} guests` 
      });
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      room,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      totalPrice,
      status: 'pending',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email phone')
      .populate('room');

    res.status(201).json({
      success: true,
      data: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/user
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('room')
      .sort('-createdAt');

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('room')
      .sort('-createdAt');

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private/Admin
const updateBooking = async (req, res) => {
  try {
    const { status } = req.body;

    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('user', 'name email phone')
      .populate('room');

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns the booking or is admin
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    // Check if booking can be cancelled
    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export {cancelBooking,updateBooking,getAllBookings,getUserBookings,createBooking,checkRoomAvailability}