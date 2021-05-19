const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/ErrorResponse');
const Course = require('../models/Course');
require('dotenv/config');
const path = require('path');

exports.createCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.create(req.body);
    await res.status(200).json({
        success: true,
        data: course
    })
})

exports.getCourses = asyncHandler(async (req, res, next) => {
    await res.status(200).json(res.advancedResults);
})

exports.updateCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id);

    if (!course) {
        errorResponse(`No course with the id of ${req.params.id}`,
            404, res);
    }

    // Make sure user is course owner
    // if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    //     errorResponse(`User ${req.user.id} is not authorized to update course ${course._id}`,
    //         401, res);
    // }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        // runValidators: true
    });

    await res.status(200).json({
        success: true,
        data: course
    });
})

exports.deleteCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById({ _id: req.params.id });

    if (!course) {
        errorResponse(`No course with the id of ${req.params.id}`,
            404, res);
    }

    await course.remove();

    await res.status(200).json({
        success: true,
        message: `Course id ${req.params.id} is deleted!`,
        data: {}
    })
})

// @desc      Update course photo
// @route     PUT /api/v1/courses/:courseId/photo
// @access    Private
exports.coursePhotoUpload = asyncHandler(async (req, res, next) => {
    const course = await Course.findById({ _id: req.params.id });
    if(!course){
        return errorResponse(`Course id ${req.params.id} not found!`, 404, res);
    }

    if (!req.files) {
        return errorResponse('`Please upload a file', 400, res);
    }

    const file = req.files.file;

    // Make sure the image is a photo
    if(!file.mimetype.startsWith('image')){
        return errorResponse('Please upload an image file!', 400, res);
    }

    // Check filesize
    if(file.size > process.env.PHOTO_UPLOAD_FILE_SIZE){
        return errorResponse(`File size must be less than ${process.env.PHOTO_UPLOAD_FILE_SIZE}`, 400, res);
    }

    // Create custom filename
    file.name = `photo_${course._id}${path.parse(file.name).ext}`;

    const filePath = `${process.env.UPLOAD_PATH}/courses/${file.name}`;
    await file.mv(filePath, err => {
        if(err){
            return errorResponse('Problem with file upload', 500, res);
        }
    })

    await Course.findByIdAndUpdate({ _id: req.params.id }, { photo: file.name });

    await res.status(200).json({
        success: true,
        message: `Photo updated to course id: ${course._id}`
    })
})
