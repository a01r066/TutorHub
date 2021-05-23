const express = require('express');
const router = express.Router();
const advancedResults = require('../middleware/advancedResults');
const Category = require('../models/Category');

const { getCategories, createCategory, categoryPhotoUpload } = require('../controllers/categories');

// Include other resource routers
const courseRouter = require('./courses');

// Re-route into other resource routers
router.use('/:categoryId/courses', courseRouter);

router.route('/')
.get(advancedResults(Category), getCategories)
.post(createCategory);

router.route('/:id/photo').put(categoryPhotoUpload);

module.exports = router;
