const express = require('express');
const router = express.Router({ mergeParams: true });

const Chapter = require('../models/Chapter');
const advancedResults = require('../middleware/advancedResults');
const { protect } = require('../middleware/auth');

const { createChapter, getChapters, chapterFileUpload } = require('../controllers/chapters');

router.route('/')
    .post(protect, createChapter)
    .get(advancedResults(Chapter), getChapters);
router.route('/:id/file').put(protect, chapterFileUpload);

module.exports = router;
