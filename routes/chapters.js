const express = require('express');
const router = express.Router({ mergeParams: true });

const Chapter = require('../models/Chapter');

const advancedResults = require('../middleware/advancedResults');

const { createChapter, getChapters } = require('../controllers/chapters');

router.route('/')
    .post(createChapter)
    .get(advancedResults(Chapter), getChapters);

module.exports = router;
