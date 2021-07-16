const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const User = require('../models/User');

const {
    registerUser,
    getUsers,
    loginUser,
    getMe,
    addToCart,
    removeCartItem,
    clearCart,
    updateProfile,
    userPhotoUpload,
    updateWishlist
} = require('../controllers/auth');
// const { populate } = require('../models/Instructor');

router.route('/').get(protect, advancedResults(User, {
    path: 'purchased_courses',
    populate: {
        path: 'courseId',
        select: 'title'
    }
}), getUsers);

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/me').get(protect, getMe);
router.route('/addToCart').put(protect, addToCart);
router.route('/updateWishlist').put(protect, updateWishlist);
router.route('/removeCartItem').put(protect, removeCartItem);
router.route('/clearCart').put(clearCart);
router.route('/:id').put(updateProfile);
router.route('/:id/photo').put(userPhotoUpload);

module.exports = router;
