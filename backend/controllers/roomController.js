import Room from '../models/Room.js';

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
const getRooms = async (req, res) => {
  try {
    const { type, minPrice, maxPrice, isAvailable } = req.query;

    // Build query
    let query = {};

    if (type) {
      query.type = type;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }

    const rooms = await Room.find(query);

    res.json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public
const getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({
      success: true,
      data: room,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a room
// @route   POST /api/rooms
// @access  Private/Admin
const createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);

    res.status(201).json({
      success: true,
      data: room,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Room number already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
const updateRoom = async (req, res) => {
  try {
    let room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: room,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    await room.deleteOne();

    res.json({
      success: true,
      message: 'Room deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom
}
