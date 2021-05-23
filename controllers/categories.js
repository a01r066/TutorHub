const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

const Category = require('../models/Category');

require('dotenv/config');
const path = require('path');

// @desc      Get categories
// @route     Get /api/v1/categories
// @access    Public
exports.getCategories = asyncHandler(async(req, res, next) => {
    await res.status(200).json(res.advancedResults);
})

// @desc      Create new category
// @route     POST /api/v1/categories
// @access    Private
exports.createCategory = asyncHandler(async(req, res, next) => {
    const category = await Category.create(req.body);
    await res.status(200).json({
        success: true,
        data: category
    })
})

// @desc      Update category photo
// @route     POST /api/v1/categories/:categoryId/photo
// @access    Private
exports.categoryPhotoUpload = asyncHandler(async (req, res, next) => {
    const category = await Category.findById({ _id: req.params.id });
    if(!category){
        return next(new ErrorResponse(`No category with the id ${req.params.id}`, 404));
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
    file.name = `photo_${category._id}${path.parse(file.name).ext}`;

    const filePath = `${process.env.UPLOAD_PATH}/categories/${file.name}`;
    await file.mv(filePath, err => {
        if(err){
            return next(err);
        }
    })

    await Category.findByIdAndUpdate({ _id: req.params.id }, { photo: file.name });

    await res.status(200).json({
        success: true,
        message: `Photo updated to category id: ${category._id}`
    })
})
