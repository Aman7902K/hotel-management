import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: [true, 'Please add a room number'],
    unique: true,
    trim: true,
  },
  type: {
    type: String,
    required: [true, 'Please add a room type'],
    enum: ['single', 'double', 'suite', 'deluxe'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: 0,
  },
  capacity: {
    type: Number,
    required: [true, 'Please add capacity'],
    min: 1,
  },
  amenities: {
    type: [String],
    default: [],
  },
  images: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Room = mongoose.model('Room', roomSchema);

export default Room