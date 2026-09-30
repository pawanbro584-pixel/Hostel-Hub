const { validationResult } = require('express-validator');
const sendResponse = require('../utils/response');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    return sendResponse(res, 400, false, errorMessages.join(', '), { errors: errors.array() });
  }
  next();
};

module.exports = validate;
