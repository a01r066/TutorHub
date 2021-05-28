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
    clearCart
} = require('../controllers/auth');

router.route('/').get(getUsers);
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/me').get(protect, getMe);
router.route('/addToCart').put(addToCart);
router.route('/removeCartItem').put(removeCartItem);
router.route('/clearCart').put(clearCart);

module.exports = router;
