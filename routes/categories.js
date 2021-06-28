const express = require('express');
const router = express.Router();
const advancedResults = require('../middleware/advancedResults');
const Category = require('../models/Category');
const { protect } = require('../middleware/auth');

const { 
    getCategories, 
    getCategoryBySlug, 
    createCategory, 
    categoryPhotoUpload,
    updateCategory
 } = require('../controllers/categories');

// Include other resource routers
const courseRouter = require('./courses');
const Course = require('../models/Course');
const { populate } = require('../models/Course');

// Re-route into other resource routers
router.use('/:categoryId/courses', courseRouter);

router.route('/')
.get(advancedResults(Category), getCategories)
.post(createCategory);

router.route('/:categoryId').put(updateCategory);
router.route('/:id/photo').put(protect, categoryPhotoUpload);

router.route('/:slug').get(getCategoryBySlug);

module.exports = router;
