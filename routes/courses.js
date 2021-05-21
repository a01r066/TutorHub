const express = require('express');
const router = express.Router();
const advancedResults = require('../middleware/advancedResults');
const Course = require('../models/Course');

const {
    createCourse,
    getCourse,
    getCourses,
    updateCourse,
    deleteCourse,
    coursePhotoUpload
} = require('../controllers/courses');

router.route('/').post(createCourse).get(advancedResults(Course, {
    path: 'user',
    select: 'name email'
}), getCourses);

router.route('/:id').put(updateCourse).get(getCourse).delete(deleteCourse);

router.route('/:id/photo').put(coursePhotoUpload);

module.exports = router;
