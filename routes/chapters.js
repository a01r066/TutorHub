const express = require('express');
const router = express.Router({ mergeParams: true });

const Chapter = require('../models/Chapter');
const advancedResults = require('../middleware/advancedResults');
const { protect } = require('../middleware/auth');

const { 
    createChapter, 
    updateChapter,
    getChapters, 
    chapterFileUpload,
    deleteChapter
 } = require('../controllers/chapters');

router.route('/')
    .post(protect, createChapter)
    .get(advancedResults(Chapter), getChapters);
router.route('/:id/file').put(protect, chapterFileUpload);
router.route('/:id').put(protect, updateChapter).delete(protect, deleteChapter);
module.exports = router;
