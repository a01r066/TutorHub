const express = require('express');
const router = express.Router();
const advancedResults = require('../middleware/advancedResults');
const Course = require('../models/Course');
const { protect } = require('../middleware/auth');

const {
    createCourse,
    getCourse,
    getCourses,
    updateCourse,
    deleteCourse,
    coursePhotoUpload
} = require('../controllers/courses');

router.route('/')
.post(protect, createCourse)
.get(advancedResults(Course, {
    path: 'user',
    select: 'name email'
}), getCourses);

router.route('/:id')
.put(protect, updateCourse)
.get(getCourse)
.delete(protect, deleteCourse);

router.route('/:id/photo')
.put(protect, coursePhotoUpload);

module.exports = router;
