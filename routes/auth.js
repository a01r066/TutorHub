const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const { registerUser, getUsers, loginUser, getMe } = require('../controllers/auth');

router.route('/').get(getUsers);
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/me').get(protect, getMe);

module.exports = router;
