const Room = require('../models/Room');
const Booking = require('../models/Booking');
const sendResponse = require('../utils/response');
const { uploadToSupabase } = require('../middleware/uploadMiddleware');

const createRoom = async (req, res, next) => {
  try {
    const { roomNumber, roomType, pricePerMonth, capacity, description } = req.body;

    const roomExists = await Room.findOne({ roomNumber });
    if (roomExists) {
      return sendResponse(res, 400, false, `Room ${roomNumber} already exists`);
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = await uploadToSupabase(req.file.buffer, req.file.originalname, req.file.mimetype);
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const room = await Room.create({
      roomNumber,
      roomType,
      pricePerMonth: Number(pricePerMonth),
      capacity: Number(capacity),
      currentOccupancy: 0,
      description: description || '',
      image: imageUrl,
      availabilityStatus: 'Available'
    });

    return sendResponse(res, 201, true, 'Room created successfully', room);
  } catch (error) {
    next(error);
  }
};

const getRooms = async (req, res, next) => {
  try {
    const { search, roomType, availabilityStatus } = req.query;
    let query = {};

    if (search) {
      query.roomNumber = { $regex: search, $options: 'i' };
    }
    if (roomType) {
      query.roomType = roomType;
    }
    if (availabilityStatus) {
      query.availabilityStatus = availabilityStatus;
    }

    const rooms = await Room.find(query).sort({ createdAt: -1 });
    return sendResponse(res, 200, true, 'Rooms retrieved successfully', rooms);
  } catch (error) {
    next(error);
  }
};

const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return sendResponse(res, 404, false, 'Room not found');
    }
    return sendResponse(res, 200, true, 'Room retrieved successfully', room);
  } catch (error) {
    next(error);
  }
};

const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return sendResponse(res, 404, false, 'Room not found');
    }

    const { roomNumber, roomType, pricePerMonth, capacity, description, availabilityStatus } = req.body;

    if (roomNumber && roomNumber !== room.roomNumber) {
      const existing = await Room.findOne({ roomNumber });
      if (existing) {
        return sendResponse(res, 400, false, `Room number ${roomNumber} is already in use`);
      }
      room.roomNumber = roomNumber;
    }

    if (roomType) room.roomType = roomType;
    if (pricePerMonth !== undefined) room.pricePerMonth = Number(pricePerMonth);
    if (capacity !== undefined) {
      const newCapacity = Number(capacity);
      if (newCapacity < room.currentOccupancy) {
        return sendResponse(res, 400, false, `Capacity cannot be less than current occupancy (${room.currentOccupancy})`);
      }
      room.capacity = newCapacity;
      if (room.currentOccupancy >= room.capacity) {
        room.availabilityStatus = 'Full';
      } else if (room.availabilityStatus === 'Full') {
        room.availabilityStatus = 'Available';
      }
    }
    if (description !== undefined) room.description = description;
    if (availabilityStatus) room.availabilityStatus = availabilityStatus;

    if (req.file) {
      room.image = await uploadToSupabase(req.file.buffer, req.file.originalname, req.file.mimetype);
    } else if (req.body.image) {
      room.image = req.body.image;
    }

    await room.save();
    return sendResponse(res, 200, true, 'Room updated successfully', room);
  } catch (error) {
    next(error);
  }
};

const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return sendResponse(res, 404, false, 'Room not found');
    }

    const activeBookings = await Booking.findOne({
      roomId: req.params.id,
      status: 'Approved'
    });

    if (activeBookings) {
      return sendResponse(res, 409, false, 'Cannot delete room with active approved bookings. Please cancel or modify active bookings first.');
    }

    await Room.findByIdAndDelete(req.params.id);
    return sendResponse(res, 200, true, 'Room deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom
};
