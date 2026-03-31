const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    rater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ratedUser: {
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

// Prevent duplicate ratings per job from same rater
ratingSchema.index({ job: 1, rater: 1 }, { unique: true });

// After saving a rating, update rated user's average rating
ratingSchema.statics.updateUserRating = async function (userId) {
  const stats = await this.aggregate([
    { $match: { ratedUser: userId } },
    {
      $group: {
         _id: '$ratedUser',
        avgScore: { $avg: '$score' },
        count: { $sum: 1 },
      },
    },
  ]);

  const User = require('./User');
  if (stats.length > 0) {
    await User.findByIdAndUpdate(userId, {
      'rating.average': Math.round(stats[0].avgScore * 10) / 10,
      'rating.count': stats[0].count,
    });
  } else {
    await User.findByIdAndUpdate(userId, {
      'rating.average': 0,
      'rating.count': 0,
    });
  }
};

ratingSchema.post('save', function () {
  this.constructor.updateUserRating(this.ratedUser);
});

module.exports = mongoose.model('Rating', ratingSchema);
