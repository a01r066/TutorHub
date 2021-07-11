const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const { 
    getCourseBySlug, 
    getLectureById,
    updateDuration
 } = require('../controllers/public');

router.route('/course/:slug').get(getCourseBySlug);
router.route('/lecture/:id').get(getLectureById);
router.route('/chapter/:id').put(updateDuration);
module.exports = router;