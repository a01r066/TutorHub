const express = require('express');
const router = express.Router();

const Lecture = require('../models/Lecture');

const { createLecture, getLectures } = require('../controllers/lectures');
const advancedResults = require('../middleware/advancedResults');

// Include other resource routers
const chapterRouter = require('./chapters');

// Re-route into other resource routers
router.use('/:lectureId/chapters', chapterRouter);

router.route('/')
    .post(createLecture)
    .get(advancedResults(Lecture), getLectures);

module.exports = router;
