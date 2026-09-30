const { body } = require('express-validator');

const createRoomRules = [
  body('roomNumber').trim().notEmpty().withMessage('Room number is required'),
  body('roomType')
    .isIn(['Single', 'Double', 'Triple'])
    .withMessage('Room type must be Single, Double, or Triple'),
  body('pricePerMonth')
    .isFloat({ min: 0 })
    .withMessage('Price per month must be a positive number'),
  body('capacity')
    .isInt({ min: 1 })
    .withMessage('Capacity must be an integer of at least 1')
];

const updateRoomRules = [
  body('roomNumber').optional().trim().notEmpty().withMessage('Room number cannot be empty'),
  body('roomType')
    .optional()
    .isIn(['Single', 'Double', 'Triple'])
    .withMessage('Room type must be Single, Double, or Triple'),
  body('pricePerMonth')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price per month must be a positive number'),
  body('capacity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Capacity must be an integer of at least 1'),
  body('availabilityStatus')
    .optional()
    .isIn(['Available', 'Full', 'Unavailable'])
    .withMessage('Invalid availability status')
];

module.exports = {
  createRoomRules,
  updateRoomRules
};
