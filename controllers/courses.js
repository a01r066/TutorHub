const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Course = require('../models/Course');
require('dotenv/config');
const path = require('path');

// @desc      Create new course
// @route     POST /api/v1/courses
// @access    Private
exports.createCourse = asyncHandler(async (req, res, next) => {
    await Course.create(req.body);
    await res.status(201).json({
        success: true
    })
})

// @desc      Get single course
// @route     Get /api/v1/courses/:id
// @access    Public
exports.getCourse = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const course = await Course.findById({ _id: id }).populate('coupon');
        if(!course){
            return next(new ErrorResponse(`No course with the id ${req.params.id}`, 404));
        }
    
        await res.status(200).json({
            success: true,
            data: course
        })
})

// @desc      Get courses
// @route     Get /api/v1/courses
// @access    Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    if(req.params.categoryId){
        const courses = await Course.find({ category: req.params.categoryId }).populate('coupon instructor');

        await res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        })
    } else {
        await res.status(200).json(res.advancedResults);
    }
})


// @desc      Update course
// @route     Put /api/v1/courses/:id
// @access    Private
exports.updateCourse = asyncHandler(async (req, res, next) => {    
    let course = await Course.findById(req.params.id);

    if (!course) {
        return next(new ErrorResponse(`No course with the id ${req.params.id}`, 404));
    }

    // Make sure user is course owner
    // if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    //     errorResponse(`User ${req.user.id} is not authorized to update course ${course._id}`,
    //         401, res);
    // }

    await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        // runValidators: true
    });

    await res.status(200).json({
        success: true
    });
})

// @desc      Delete course
// @route     Delete /api/v1/courses/:d
// @access    Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById({ _id: req.params.id });

    if (!course) {
        return next(new ErrorResponse(`No course with the id ${req.params.id}`, 404));
    }

    await course.remove();

    await res.status(200).json({
        success: true
    })
})

// @desc      Update course photo
// @route     PUT /api/v1/courses/:courseId/photo
// @access    Private
exports.coursePhotoUpload = asyncHandler(async (req, res, next) => {
    const course = await Course.findById({ _id: req.params.id });
    if(!course){
        return next(new ErrorResponse(`No course with the id ${req.params.id}`, 404));
    }

    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file!`, 400));
    }

    const file = req.files.file;

    // Make sure the image is a photo
    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse(`Please upload an image file!`, 400));
    }

    // Check filesize
    if(file.size > process.env.PHOTO_UPLOAD_FILE_SIZE){
        return next(new ErrorResponse(`File size must be less than ${process.env.PHOTO_UPLOAD_FILE_SIZE}`, 400));
    }

    // Create custom filename
    file.name = `photo_${course._id}${path.parse(file.name).ext}`;

    const filePath = `${process.env.UPLOAD_PATH}/courses/${file.name}`;
    await file.mv(filePath, err => {
        if(err){
            return next(err);
        }
    })

    await Course.findByIdAndUpdate({ _id: req.params.id }, { photo: file.name });

    await res.status(200).json({
        success: true,
        message: `Photo updated to course id: ${course._id}`
    })
})
