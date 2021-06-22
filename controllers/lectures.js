const asyncHandler = require('../middleware/async');
const Lecture = require('../models/Lecture');

// @desc      Create new lecture
// @route     POST /api/v1/lectures
// @access    Private
exports.createLecture = asyncHandler(async (req, res, next) => {
    await Lecture.create(req.body);
    await res.status(200).json({
        success: true,
    })
})

// @desc      Get lectures
// @route     Get /api/v1/lectures
// @access    Public
exports.getLectures = asyncHandler(async (req, res, next) => {
    await res.status(200).json(res.advancedResults);
})


// @desc      Get lectures by courseId
// @route     Get /api/v1/lectures/:courseId
// @access    Public
exports.getLecturesByCourseId = asyncHandler(async(req, res, next) => {
    const lectures = await Lecture.find({ course: req.params.courseId });
    await res.status(200).json({
        success: true,
        count: lectures.length, 
        data: lectures
    })
})


// @desc      Update lecture
// @route     Get /api/v1/lectures/:id
// @access    Public
exports.updateLecture = asyncHandler(async(req, res, next) => {
    const lectureId = req.params.id;
    await Lecture.findByIdAndUpdate({ _id: lectureId }, req.body);
    await res.status(200).json({
        success: true,
    })
})
