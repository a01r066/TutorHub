const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Course = require('../models/Course');
require('dotenv/config');
const path = require('path');

// @desc      Get single course by slug
// @route     Get /api/v1/course/:slug
// @access    Public
exports.getCourseBySlug = asyncHandler(async(req, res, next) => {
    const course = await Course.findOne({ slug: req.params.slug });
    await res.status(200).json({
        success: true,
        data: course
    })
})