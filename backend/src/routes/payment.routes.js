const express = require('express');
const router = express.Router();
const { verifyPayment } = require('../controllers/payment.controller');

router.post('/verify', verifyPayment);

module.exports = router;
