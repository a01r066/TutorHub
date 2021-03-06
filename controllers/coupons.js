const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Coupon = require('../models/Coupon');

// @desc      Create coupon
// @route     POST /api/v1/coupons
// @access    Private
exports.createCoupon = asyncHandler(async(req, res, next) => {
    await Coupon.create(req.body);
    await res.status(200).json({
        success: true
    })
})

// @desc      Update coupon
// @route     PUT /api/v1/coupons/:id
// @access    Private
exports.updateCoupon = asyncHandler(async(req, res, next) => {
    const couponId = req.params.id;

    await Coupon.findByIdAndUpdate({ _id: couponId }, req.body);
    await res.status(200).json({
        success: true
    })
})

// @desc      Get coupons
// @route     Get /api/v1/coupons
// @access    Private
exports.getCoupons = asyncHandler(async(req, res, next) => {
    const coupons = await Coupon.find();
    await res.status(200).json({
        success: true,
        data: coupons
    })
})

// @desc      Get coupon
// @route     Get /api/v1/coupons/:id
// @access    Private
exports.getCoupon = asyncHandler(async(req, res, next) => {
    const coupon = await Coupon.findById({ _id: req.params.id });
    await res.status(200).json({
        success: true,
        data: coupon
    })
})
