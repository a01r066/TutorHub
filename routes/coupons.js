const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');
const { createCoupon, updateCoupon, getCoupon, getCoupons } = require('../controllers/coupons');

router.route('/').get(getCoupons).post(protect, createCoupon);
router.route('/:id').get(getCoupon).put(protect, updateCoupon);

module.exports = router;
