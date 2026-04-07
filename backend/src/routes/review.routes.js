const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { createReview } = require('../controllers/review.controller');

router.post('/', authMiddleware, createReview);

module.exports = router;
