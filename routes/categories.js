const express = require('express');
const router = express.Router();

const { getCategories, createCategory } = require('../controllers/categories');

router.route('/')
.get(getCategories)
.post(createCategory);

module.exports = router;