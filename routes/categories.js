const express = require('express');
const router = express.Router();
const advancedResults = require('../middleware/advancedResults');
const Category = require('../models/Category');
const { protect } = require('../middleware/auth');

const { getCategories, getCategoryBySlug, createCategory, categoryPhotoUpload } = require('../controllers/categories');

// Include other resource routers
const courseRouter = require('./courses');

// Re-route into other resource routers
router.use('/:categoryId/courses', courseRouter);

router.route('/')
.get(advancedResults(Category), getCategories)
.post(protect, createCategory);

router.route('/:id/photo').put(protect, categoryPhotoUpload);

router.route('/:slug').get(getCategoryBySlug);

module.exports = router;
