const express = require('express');
const router = express.Router();

const { createCoupon, getCoupon, getCoupons } = require('../controllers/coupons');

router.route('/').get(getCoupons).post(createCoupon);
router.route('/:id').get(getCoupon);

module.exports = router;
