const express = require('express');
const router = express.Router({ mergeParams: true });

const { createChapter } = require('../controllers/chapters');

router.route('/').post(createChapter);

module.exports = router;
