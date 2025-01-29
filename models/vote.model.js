const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election',
    required: true
  },
  voterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  }
}, {
  timestamps: true
});

// Ensure one vote per voter per election
voteSchema.index({ electionId: 1, voterId: 1 }, { unique: true });

// Create compound index for efficient querying
voteSchema.index({ electionId: 1, candidateId: 1 });

module.exports = mongoose.model('Vote', voteSchema);
