const express = require('express');
const router = express.Router({ mergeParams: true });

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
.post(createCourse)
.get(advancedResults(Course, {
    path: 'user coupon',
    select: 'name email code discount'
}), 
getCourses);

router.route('/:id')
.put(updateCourse)
.get(getCourse)
.delete(protect, deleteCourse);

router.route('/:id/photo')
.put(protect, coursePhotoUpload);

module.exports = router;
