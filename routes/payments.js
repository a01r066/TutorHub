const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { processPayment } = require('../controllers/payments');

router.route('/payment').post(processPayment);

module.exports = router;
