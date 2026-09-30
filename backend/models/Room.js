const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      unique: true,
      trim: true
    },
    roomType: {
      type: String,
      required: [true, 'Room type is required'],
      enum: ['Single', 'Double', 'Triple']
    },
    pricePerMonth: {
      type: Number,
      required: [true, 'Monthly price is required'],
      min: [0, 'Price must be a positive number']
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1']
    },
    currentOccupancy: {
      type: Number,
      default: 0,
      min: [0, 'Occupancy cannot be negative']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    availabilityStatus: {
      type: String,
      enum: ['Available', 'Full', 'Unavailable'],
      default: 'Available'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Room', roomSchema);
