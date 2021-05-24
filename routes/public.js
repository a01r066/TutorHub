const express = require('express');
const router = express.Router();

const { getCourseBySlug } = require('../controllers/public');

router.route('/course/:slug').get(getCourseBySlug);

module.exports = router;