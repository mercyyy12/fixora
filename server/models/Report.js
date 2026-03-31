const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    required: [true, 'Please provide a reason for the report'],
    enum: ['Fraud', 'Abuse', 'Poor Quality', 'Late', 'No Show', 'Other']
  },
  description: {
    type: String,
    required: [true, 'Please provide details']
  },
  status: {
    type: String,
    enum: ['Pending', 'Resolved', 'Dismissed'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', reportSchema);
