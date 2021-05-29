const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createPayment, getPayments } = require('../controllers/payments');

router.route('/').post(createPayment);
router.route('/:userId').get(getPayments);

module.exports = router;
