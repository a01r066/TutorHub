const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/auth');

const { 
    createInstructor,
    getInstructor,
    updateObject,
    // getInstructorsByCategoryId,
    getAllInstructors,
    photoUpload,
    addToCourses
 } = require('../controllers/instructors');

 router.route('/').post(createInstructor).get(getAllInstructors);
//  router.route('/:categoryId').get(getInstructorsByCategoryId);
 router.route('/addToCourses').put(addToCourses);
 router.route('/:id').put(updateObject).get(getInstructor);
 router.route('/:instructorId/photo').put(protect, photoUpload);


 module.exports = router;