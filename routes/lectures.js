const express = require('express');
const router = express.Router();

const Lecture = require('../models/Lecture');

const { protect } = require('../middleware/auth');
const { 
    createLecture, 
    getLectures, 
    getLecturesByCourseId,
    updateLecture
 } = require('../controllers/lectures');
const advancedResults = require('../middleware/advancedResults');

// Include other resource routers
const chapterRouter = require('./chapters');

// Re-route into other resource routers
router.use('/:lectureId/chapters', chapterRouter);

router.route('/')
    .post(protect, createLecture)
    .get(advancedResults(Lecture), getLectures);

router.route('/:courseId').get(getLecturesByCourseId);
router.route('/:id').put(updateLecture);

module.exports = router;
