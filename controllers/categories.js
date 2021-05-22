const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Category = require('../models/Category');

// @desc      Get categories
// @route     Get /api/v1/categories
// @access    Public
exports.getCategories = asyncHandler(async(req, res, next) => {
    const categories = await Category.find();
    await res.status(200).json({
        success: true,
        data: categories
    })
})

// @desc      Create new category
// @route     POST /api/v1/categories
// @access    Private
exports.createCategory = asyncHandler(async(req, res, next) => {
    const category = await Category.create(req.body);
    res.status(200).json({
        success: true,
        data: category
    })
})