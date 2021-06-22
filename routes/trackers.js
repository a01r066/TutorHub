const express = require('express');
const router = express.Router();

const { addTracker } = require('../controllers/trackers');

router.route('/').post(addTracker);

module.exports = router;