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
