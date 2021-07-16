const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

const { 
    createInstructor,
    getInstructor,
    updateObject,
    getInstructors,
    photoUpload,
    addToCourses
 } = require('../controllers/instructors');
const Instructor = require('../models/Instructor');

 router.route('/').post(createInstructor).get(advancedResults(Instructor, {
    path: 'courses',
    populate: {
        path: 'courseId',
        select: 'title tuition coupon photo slug',
        populate: {
            path: 'coupon'
        }
    }
 }), getInstructors);
//  router.route('/:categoryId').get(getInstructorsByCategoryId);
 router.route('/addToCourses').put(addToCourses);
 router.route('/:id').put(updateObject).get(getInstructor);
 router.route('/:instructorId/photo').put(protect, photoUpload);


 module.exports = router;