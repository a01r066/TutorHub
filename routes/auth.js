const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const {
    registerUser,
    getUsers,
    loginUser,
    getMe,
    addToCart,
    removeCartItem,
    clearCart,
    gLogin,
    updateProfile
} = require('../controllers/auth');

router.route('/').get(protect, getUsers);
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/gLogin').post(gLogin);
router.route('/me').get(protect, getMe);
router.route('/addToCart').put(addToCart);
router.route('/removeCartItem').put(removeCartItem);
router.route('/clearCart').put(clearCart);
router.route('/:id').put(updateProfile);

module.exports = router;
