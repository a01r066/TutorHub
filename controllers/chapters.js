const asyncHandler = require('../middleware/async');
const Chapter = require('../models/Chapter');
const ErrorResponse = require('../utils/errorResponse');

// @desc      Create new chapter
// @route     POST /api/v1/chapters
// @access    Private
exports.createChapter = asyncHandler(async (req, res, next) => {
    const chapter = await Chapter.create(req.body);
    await res.status(200).json({
        success: true,
        data: chapter
    })
})

// @desc      Get chapters
// @route     Get /api/v1/:lectureId/chapters
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