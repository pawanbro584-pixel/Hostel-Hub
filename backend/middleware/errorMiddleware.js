const sendResponse = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error('Centralized Error Handler:', err.stack || err.message);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Resource not found or invalid ID format';
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate entry for ${field}. Please use a different value.`;
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  sendResponse(res, statusCode, false, message);
};

module.exports = errorHandler;
