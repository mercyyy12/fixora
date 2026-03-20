const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    homeowner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    score: {
      type: Number,
      required: [true, 'Rating score is required'],
      min: [1, 'Score must be at least 1'],
      max: [5, 'Score cannot exceed 5'],
    },
    comment: {
      type: String,
      maxlength: [500, 'Comment cannot exceed 500 characters'],
      default: '',
    },
  },
  { timestamps: true }
);

// Prevent duplicate ratings per job
ratingSchema.index({ job: 1, homeowner: 1 }, { unique: true });

// After saving a rating, update technician's average rating
ratingSchema.statics.updateTechnicianRating = async function (technicianId) {
  const stats = await this.aggregate([
    { $match: { technician: technicianId } },
    {
      $group: {
        _id: '$technician',
        avgScore: { $avg: '$score' },
        count: { $sum: 1 },
      },
    },
  ]);

  const User = require('./User');
  if (stats.length > 0) {
    await User.findByIdAndUpdate(technicianId, {
      'rating.average': Math.round(stats[0].avgScore * 10) / 10,
      'rating.count': stats[0].count,
    });
  }
};

ratingSchema.post('save', function () {
  this.constructor.updateTechnicianRating(this.technician);
});

module.exports = mongoose.model('Rating', ratingSchema);
