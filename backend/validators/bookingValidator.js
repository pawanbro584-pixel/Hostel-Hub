const { body } = require('express-validator');

const createBookingRules = [
  body('roomId').isMongoId().withMessage('Valid Room ID is required'),
  body('startDate').isISO8601().toDate().withMessage('Valid start date is required'),
  body('endDate')
    .isISO8601()
    .toDate()
    .withMessage('Valid end date is required')
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    })
];

const updateBookingRules = [
  body('startDate').optional().isISO8601().toDate().withMessage('Valid start date is required'),
  body('endDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Valid end date is required')
];

module.exports = {
  createBookingRules,
  updateBookingRules
};
