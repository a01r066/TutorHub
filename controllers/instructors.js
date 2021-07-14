const express = require('express');
const Instructor = require('../models/Instructor');
const asyncHandler = require('../middleware/async');
const fs = require('fs');
const path = require('path');

// @desc      CREATE instructor
// @route     POST /api/v1/instructors
// @access    Private
exports.createInstructor = asyncHandler(async(req, res, next) => {
    await Instructor.create(req.body);
    await res.status(200).json({
        success: true
    })
})

// @desc      Update instructor
// @route     PUT /api/v1/instructors/:id
// @access    Private
exports.updateObject = asyncHandler(async(req, res, next) => {
    await Instructor.findOneAndUpdate({ _id: req.params.id }, req.body);
    await res.status(200).json({
        success: true
    })
})

// @desc      Add course to courses
// @route     Put /api/v1/instructors/addToCourses
// @access    Public
exports.addToCourses = asyncHandler(async(req, res, next) => {
    const { instructorId, courseId } = req.body;

    const instructor = await Instructor.findById({ _id: instructorId });
    const courseIndex = await instructor.courses.findIndex(p => {
        return p.courseId.toString() === courseId.toString();
    })
    let updatedCourses = [...instructor.courses];
    if(courseIndex >= 0){
        return next(new ErrorResponse(`This course already added to courses`, 400));
    } else {
        updatedCourses.push({ courseId: courseId});
    }

    await Instructor.updateOne({ _id: instructorId }, { $set: { courses: updatedCourses }});
    await res.status(200).json({
        success: true
    })
})

// @desc      Get instructor by id
// @route     Get /api/v1/instructors/:id
// @access    Public
exports.getInstructor = asyncHandler(async(req, res, next) => {
    const instructor = await Instructor.findById({ _id: req.params.id }).populate({
        path: 'courses',
        populate: {
            path: 'courseId',
            select: 'title tuition coupon photo slug',
            populate: {
                path: 'coupon'
            }
        }
    });
    await res.status(200).json({
        success: true,
        data: instructor
    })
})


// @desc      Get instructors by categoryId
// @route     Get /api/v1/instructors/:categoryId
// @access    Public
exports.getInstructorsByCategoryId = asyncHandler(async(req, res, next) => {
    const instructors = await Instructor.find({ categoryId: req.params.categoryId });
    await res.status(200).json({
        success: true,
        data: instructors
    })
})

// @desc      Get all instructors
// @route     Get /api/v1/instructors/:categoryId
// @access    Public
exports.getAllInstructors = asyncHandler(async(req, res, next) => {
    const instructors = await Instructor.find({});
    await res.status(200).json({
        success: true,
        data: instructors
    })
})

// @desc      Update category photo
// @route     POST /api/v1/instructors/:instructorId/photo
// @access    Private
exports.photoUpload = asyncHandler(async (req, res, next) => {
    const objectId = req.params.instructorId;
    const object = await Instructor.findById({ _id: objectId });
    if(!object){
        return next(new ErrorResponse(`No object with the id ${objectId}`, 404));
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
    file.name = `photo_${object._id}${path.parse(file.name).ext}`;

    // Check if directory exist
    const targetDir = `${process.env.UPLOAD_PATH}/instructors`;
    if(!fs.existsSync(targetDir)){
        fs.mkdirSync(targetDir, { recursive: true });
    }

    let filePath = `${targetDir}/${file.name}`;
    await file.mv(filePath, err => {
        if(err){
            return next(err);
        }
    })

    await Instructor.findByIdAndUpdate({ _id: objectId }, { photoURL: file.name });

    await res.status(200).json({
        success: true,
        message: `Photo updated to object id: ${object._id}`
    })
})