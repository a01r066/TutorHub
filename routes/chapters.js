const express = require('express');
const router = express.Router({ mergeParams: true });

const Chapter = require('../models/Chapter');

const advancedResults = require('../middleware/advancedResults');

const { createChapter, getChapters, chapterFileUpload } = require('../controllers/chapters');

router.route('/')
    .post(createChapter)
    .get(advancedResults(Chapter), getChapters);

router.route('/:id/file').put(chapterFileUpload);
module.exports = router;
