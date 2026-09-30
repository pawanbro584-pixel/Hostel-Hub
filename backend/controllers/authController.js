const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendResponse = require('../utils/response');

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, isAdmin } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return sendResponse(res, 400, false, 'User with this email already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      isAdmin: Boolean(isAdmin)
    });

    if (user) {
      return sendResponse(res, 201, true, 'User registered successfully', {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
      });
    } else {
      return sendResponse(res, 400, false, 'Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      return sendResponse(res, 200, true, 'Login successful', {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
      });
    } else {
      return sendResponse(res, 401, false, 'Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }
    return sendResponse(res, 200, true, 'User profile retrieved', user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};
