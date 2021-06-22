const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
require('dotenv/config');
const Lecture = require('../models/Lecture');

// @desc      Get single course by slug
// @route     Get /api/v1/course/:slug
// @access    Public
exports.getCourseBySlug = asyncHandler(async(req, res, next) => {
    const course = await Course.findOne({ slug: req.params.slug }).populate('coupon');
    await res.status(200).json({
        success: true,
        data: course
    })
})

// @desc      Get lecture by id
// @route     Get /api/v1/lectures/:id
// @access    Public
exports.getLectureById = asyncHandler(async(req, res, next) => {
    const lecture = await Lecture.findById({ _id: req.params.id });
    await res.status(200).json({
        success: true,
        data: lecture
    })
})
