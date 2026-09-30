const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { registerRules, loginRules } = require('../validators/authValidator');
const validate = require('../middleware/validationMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerRules, validate, registerUser);
router.post('/login', loginRules, validate, loginUser);
router.get('/me', protect, getMe);

module.exports = router;
