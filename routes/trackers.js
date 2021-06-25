const express = require('express');
const router = express.Router();

const { 
    addTracker,
    getTracker
 } = require('../controllers/trackers');

router.route('/').post(addTracker);
router.route('/:userId/:courseId').get(getTracker);

module.exports = router;