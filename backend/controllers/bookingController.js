const Booking = require('../models/Booking');
const Room = require('../models/Room');
const sendResponse = require('../utils/response');

const createBooking = async (req, res, next) => {
  try {
    const { roomId, startDate, endDate, notes } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return sendResponse(res, 404, false, 'Room not found');
    }

    if (room.availabilityStatus === 'Unavailable') {
      return sendResponse(res, 400, false, 'This room is currently marked unavailable for bookings');
    }

    if (room.currentOccupancy >= room.capacity) {
      return sendResponse(res, 400, false, 'Room is already at full capacity');
    }

    const booking = await Booking.create({
      userId: req.user._id,
      roomId,
      startDate,
      endDate,
      notes: notes || '',
      status: 'Pending'
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('roomId', 'roomNumber roomType pricePerMonth image availabilityStatus capacity currentOccupancy')
      .populate('userId', 'name email phone');

    return sendResponse(res, 201, true, 'Booking request created successfully', populatedBooking);
  } catch (error) {
    next(error);
  }
};

const getBookings = async (req, res, next) => {
  try {
    let query = {};
    if (!req.user.isAdmin) {
      query.userId = req.user._id;
    }

    const bookings = await Booking.find(query)
      .populate('roomId', 'roomNumber roomType pricePerMonth image availabilityStatus capacity currentOccupancy')
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, 'Bookings retrieved successfully', bookings);
  } catch (error) {
    next(error);
  }
};

const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('roomId', 'roomNumber roomType pricePerMonth image availabilityStatus capacity currentOccupancy description')
      .populate('userId', 'name email phone');

    if (!booking) {
      return sendResponse(res, 404, false, 'Booking not found');
    }

    if (!req.user.isAdmin && booking.userId._id.toString() !== req.user._id.toString()) {
      return sendResponse(res, 403, false, 'Not authorized to view this booking');
    }

    return sendResponse(res, 200, true, 'Booking retrieved successfully', booking);
  } catch (error) {
    next(error);
  }
};

const updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return sendResponse(res, 404, false, 'Booking not found');
    }

    if (!req.user.isAdmin && booking.userId.toString() !== req.user._id.toString()) {
      return sendResponse(res, 403, false, 'Not authorized to update this booking');
    }

    if (booking.status !== 'Pending') {
      return sendResponse(res, 400, false, `Cannot modify booking that is already ${booking.status}`);
    }

    const { startDate, endDate, notes } = req.body;
    if (startDate) booking.startDate = startDate;
    if (endDate) booking.endDate = endDate;
    if (notes !== undefined) booking.notes = notes;

    await booking.save();

    const updated = await Booking.findById(booking._id)
      .populate('roomId', 'roomNumber roomType pricePerMonth image availabilityStatus capacity currentOccupancy')
      .populate('userId', 'name email phone');

    return sendResponse(res, 200, true, 'Booking updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return sendResponse(res, 404, false, 'Booking not found');
    }

    if (!req.user.isAdmin && booking.userId.toString() !== req.user._id.toString()) {
      return sendResponse(res, 403, false, 'Not authorized to delete this booking');
    }

    if (booking.status === 'Approved') {
      const room = await Room.findById(booking.roomId);
      if (room) {
        room.currentOccupancy = Math.max(0, room.currentOccupancy - 1);
        if (room.currentOccupancy < room.capacity) {
          room.availabilityStatus = 'Available';
        }
        await room.save();
      }
    }

    await Booking.findByIdAndDelete(req.params.id);
    return sendResponse(res, 200, true, 'Booking deleted successfully');
  } catch (error) {
    next(error);
  }
};

const approveBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return sendResponse(res, 404, false, 'Booking not found');
    }

    if (booking.status === 'Approved') {
      return sendResponse(res, 400, false, 'Booking is already approved');
    }

    if (booking.status === 'Rejected' || booking.status === 'Cancelled') {
      return sendResponse(res, 400, false, `Cannot approve a booking that has been ${booking.status.toLowerCase()}`);
    }

    // Atomic / safe capacity update check
    const room = await Room.findById(booking.roomId);
    if (!room) {
      return sendResponse(res, 404, false, 'Associated room not found');
    }

    if (room.currentOccupancy >= room.capacity) {
      booking.status = 'Rejected';
      booking.notes = (booking.notes ? booking.notes + ' ' : '') + '[Auto-rejected: Room reached full capacity]';
      await booking.save();
      return sendResponse(res, 400, false, 'Room is already at full capacity. Booking was automatically rejected.');
    }

    room.currentOccupancy += 1;
    if (room.currentOccupancy >= room.capacity) {
      room.availabilityStatus = 'Full';
    } else {
      room.availabilityStatus = 'Available';
    }
    await room.save();

    booking.status = 'Approved';
    await booking.save();

    const updated = await Booking.findById(booking._id)
      .populate('roomId', 'roomNumber roomType pricePerMonth image availabilityStatus capacity currentOccupancy')
      .populate('userId', 'name email phone');

    return sendResponse(res, 200, true, 'Booking approved successfully', updated);
  } catch (error) {
    next(error);
  }
};

const rejectBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return sendResponse(res, 404, false, 'Booking not found');
    }

    if (booking.status !== 'Pending') {
      return sendResponse(res, 400, false, `Cannot reject booking with status '${booking.status}'`);
    }

    booking.status = 'Rejected';
    await booking.save();

    const updated = await Booking.findById(booking._id)
      .populate('roomId', 'roomNumber roomType pricePerMonth image availabilityStatus capacity currentOccupancy')
      .populate('userId', 'name email phone');

    return sendResponse(res, 200, true, 'Booking rejected successfully', updated);
  } catch (error) {
    next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return sendResponse(res, 404, false, 'Booking not found');
    }

    if (!req.user.isAdmin && booking.userId.toString() !== req.user._id.toString()) {
      return sendResponse(res, 403, false, 'Not authorized to cancel this booking');
    }

    if (booking.status === 'Cancelled') {
      return sendResponse(res, 400, false, 'Booking is already cancelled');
    }

    if (booking.status === 'Approved') {
      const room = await Room.findById(booking.roomId);
      if (room) {
        room.currentOccupancy = Math.max(0, room.currentOccupancy - 1);
        if (room.currentOccupancy < room.capacity) {
          room.availabilityStatus = 'Available';
        }
        await room.save();
      }
    }

    booking.status = 'Cancelled';
    await booking.save();

    const updated = await Booking.findById(booking._id)
      .populate('roomId', 'roomNumber roomType pricePerMonth image availabilityStatus capacity currentOccupancy')
      .populate('userId', 'name email phone');

    return sendResponse(res, 200, true, 'Booking cancelled successfully', updated);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  approveBooking,
  rejectBooking,
  cancelBooking
};
