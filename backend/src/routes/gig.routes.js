const express = require('express');
const { createGig, getGigs, submitProposal, getRankedProposals } = require('../controllers/gig.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', getGigs);
router.post('/', authMiddleware, createGig);
router.post('/:id/proposals', authMiddleware, submitProposal);
router.get('/:id/proposals', authMiddleware, getRankedProposals);

module.exports = router;
