const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const Vote = require('../models/vote.model');

// Cast a vote
router.post('/', protect, async (req, res) => {
  try {
    const { electionId, candidateId } = req.body;

    // Check if user has already voted in this election
    const existingVote = await Vote.findOne({
      electionId,
      voterId: req.user.id
    });

    if (existingVote) {
      return res.status(400).json({ message: 'You have already voted in this election' });
    }

    const vote = new Vote({
      electionId,
      voterId: req.user.id,
      candidateId
    });

    await vote.save();
    res.status(201).json(vote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all votes (admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const votes = await Vote.find()
      .populate('voterId', 'name email')
      .populate('candidateId', 'name');
    res.json(votes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get votes by election
router.get('/election/:electionId', protect, async (req, res) => {
  try {
    const votes = await Vote.find({ electionId: req.params.electionId })
      .populate('candidateId', 'name');
    res.json(votes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's vote history
router.get('/my-votes', protect, async (req, res) => {
  try {
    const votes = await Vote.find({ voterId: req.user.id })
      .populate('electionId')
      .populate('candidateId', 'name');
    res.json(votes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
