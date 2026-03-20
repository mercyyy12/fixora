const Rating = require('../models/Rating');
const Job = require('../models/Job');

// @desc    Submit a rating for a technician after job completion
// @route   POST /api/ratings
// @access  Private (Homeowner)
const createRating = async (req, res, next) => {
  try {
    const { jobId, score, comment } = req.body;

    if (!jobId || !score) {
      return res.status(400).json({ success: false, message: 'Job ID and score are required' });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    // Only the homeowner of the completed job can rate
    if (job.homeowner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to rate this job' });
    }

    if (job.status !== 'Completed') {
      return res.status(400).json({ success: false, message: 'Can only rate completed jobs' });
    }

    if (job.isRated) {
      return res.status(400).json({ success: false, message: 'This job has already been rated' });
    }

    const rating = await Rating.create({
      job: jobId,
      homeowner: req.user._id,
      technician: job.technician,
      score,
      comment: comment || '',
    });

    // Mark job as rated
    job.isRated = true;
    await job.save();

    res.status(201).json({ success: true, message: 'Rating submitted successfully', rating });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ratings for a technician
// @route   GET /api/ratings/technician/:technicianId
// @access  Public
const getTechnicianRatings = async (req, res, next) => {
  try {
    const ratings = await Rating.find({ technician: req.params.technicianId })
      .populate('homeowner', 'name profileImage')
      .populate('job', 'title category')
      .sort({ createdAt: -1 });

    res.json({ success: true, ratings });
  } catch (error) {
    next(error);
  }
};

module.exports = { createRating, getTechnicianRatings };
