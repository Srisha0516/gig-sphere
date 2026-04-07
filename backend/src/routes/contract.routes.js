const express = require('express');
const { createContract, checkout, completeContract } = require('../controllers/contract.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', authMiddleware, createContract);
router.get('/checkout/:contractId', authMiddleware, checkout);
router.put('/:id/complete', authMiddleware, completeContract);

module.exports = router;
