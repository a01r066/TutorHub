const express = require('express');
const router = express.Router();
const advancedResults = require('../middleware/advancedResults');
const Course = require('../models/Course');

const {
    createCourse,
    getCourses,
    updateCourse,
    deleteCourse,
    coursePhotoUpload
} = require('../controllers/courses');

router.route('/').post(createCourse).get(advancedResults(Course, {}), getCourses);

router.route('/:id').put(updateCourse).delete(deleteCourse);

router.route('/:id/photo').put(coursePhotoUpload);

module.exports = router;
