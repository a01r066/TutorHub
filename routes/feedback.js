const express = require('express');
const router = express.Router();

const { createFeedback } = require('../controllers/feedback');

router.route('/').post(createFeedback);

module.exports = router;