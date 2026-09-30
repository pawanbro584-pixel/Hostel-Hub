const express = require('express');
const router = express.Router();
const {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom
} = require('../controllers/roomController');
const { createRoomRules, updateRoomRules } = require('../validators/roomValidator');
const validate = require('../middleware/validationMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadSingle } = require('../middleware/uploadMiddleware');

router.get('/', getRooms);
router.get('/:id', getRoomById);

router.post('/', protect, admin, uploadSingle, createRoomRules, validate, createRoom);
router.put('/:id', protect, admin, uploadSingle, updateRoomRules, validate, updateRoom);
router.delete('/:id', protect, admin, deleteRoom);

module.exports = router;
