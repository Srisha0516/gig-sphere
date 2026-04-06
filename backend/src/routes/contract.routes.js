const express = require('express');
const { createContract, checkout } = require('../controllers/contract.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', authMiddleware, createContract);
router.get('/checkout/:contractId', authMiddleware, checkout);

module.exports = router;
