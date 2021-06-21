const express = require('express');
const router = express.Router();

const { shareCourse } = require('../controllers/share');

router.route('/share/:courseId').get(shareCourse);

module.exports = router;