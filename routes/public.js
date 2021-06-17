const express = require('express');
const router = express.Router();

const { getCourseBySlug, getLectureById } = require('../controllers/public');

router.route('/course/:slug').get(getCourseBySlug);
router.route('/lecture/:id').get(getLectureById);

module.exports = router;