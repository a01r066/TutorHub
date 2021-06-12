const asyncHandler = require('../middleware/async');
require('dotenv/config');
const path = require('path');
const slugify = require('slugify');

const Chapter = require('../models/Chapter');

const ErrorResponse = require('../utils/errorResponse');

// @desc      Create new chapter
// @route     POST /api/v1/chapters
// @access    Private
exports.createChapter = asyncHandler(async (req, res, next) => {
    await Chapter.create(req.body);
    await res.status(200).json({
        success: true
    })
})

// @desc      Update chapter
// @route     PUT /api/v1/chapters/:id
// @access    Private
exports.updateChapter = asyncHandler(async(req, res, next) => {
    const chapterId = req.params.id;
    await Chapter.findByIdAndUpdate({ _id: chapterId }, req.body);
    res.status(200).json({
        success: true
    })
})


// @desc      Get chapters
// @route     Get /api/v1/chapters
// @access    Public
exports.getChapters = asyncHandler(async (req, res, next) => {
    if(req.params.lectureId){
        const chapters = await Chapter.find({ lecture: req.params.lectureId });
        await res.status(200).json({
            success: true,
            count: chapters.length,
            data: chapters
        })
    } else {
        await res.status(200).json(res.advancedResults);
    }
})

// @desc      Update chapter
// @route     PUT /api/v1/chapters/:id/file
// @access    Private
exports.chapterFileUpload = asyncHandler(async (req, res, next) => {
    const chapterId = req.params.id;
    const chapter = await Chapter.findById({ _id: chapterId });

    if(!chapter){
        return next(new ErrorResponse(`No course with the id ${req.params.id}`, 404));
    }

    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file!`, 400));
    }

    const file = req.files.file;

    // Make sure the file is video/html
    if(!file.mimetype.startsWith('video') && !file.mimetype.startsWith('text/html')){
        return next(new ErrorResponse(`Please upload an video | html file!`, 400));
    }

    // Check filesize
    // if(file.size > process.env.PHOTO_UPLOAD_FILE_SIZE){
    //     return next(new ErrorResponse(`File size must be less than ${process.env.PHOTO_UPLOAD_FILE_SIZE}`, 400));
    // }

    // Create custom filename with slugify
    let filename = slugify(`${path.parse(file.name).name}`, { lower: true });
    file.name = `${filename}${path.parse(file.name).ext}`;

    const filePath = `${process.env.UPLOAD_PATH}/courses/5d725cfec4ded7bcb480eaa7/${file.name}`;

    await file.mv(filePath, err => {
        if(err){
            return next(err);
        }
    })

    await Chapter.findByIdAndUpdate({ _id: req.params.id }, { file: file.name });

    await res.status(200).json({
        success: true,
        message: `File updated to chapter id: ${chapter._id}`
    })
})
