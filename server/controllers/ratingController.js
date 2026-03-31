const Rating = require('../models/Rating');
const Job = require('../models/Job');

// @desc    Submit a rating (Homeowner rates Tech OR Tech rates Homeowner)
// @route   POST /api/ratings
// @access  Private
const createRating = async (req, res, next) => {
  try {
    const { jobId, score, comment, ratedUserId } = req.body;

    if (!jobId || !score || !ratedUserId) {
      return res.status(400).json({ success: false, message: 'Job ID, score, and rated user ID are required' });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    if (job.status !== 'Completed') {
      return res.status(400).json({ success: false, message: 'Can only rate completed jobs' });
    }

    // Check if the requester is part of this job
    const isHomeowner = job.homeowner.toString() === req.user._id.toString();
    const isTechnician = job.technician && job.technician.toString() === req.user._id.toString();

    if (!isHomeowner && !isTechnician) {
      return res.status(403).json({ success: false, message: 'Not authorized to rate this job' });
    }

    // Determine target based on who is rating
    // Correctly handle potential populated or unpopulated fields
    const homeownerId = job.homeowner._id ? job.homeowner._id.toString() : job.homeowner.toString();
    const technicianId = job.technician?._id ? job.technician._id.toString() : job.technician?.toString();

    const expectedTarget = isHomeowner ? technicianId : homeownerId;
    if (ratedUserId.toString() !== expectedTarget) {
      return res.status(400).json({ success: false, message: 'Invalid rating target for this job' });
    }

    // Check for existing rating by this rater for this job
    const existing = await Rating.findOne({ job: jobId, rater: req.user._id });
    if (existing) {
      // Auto-patch the job to fix corrupted old data or UI desyncs
      const updateField = isHomeowner ? { isRatedByHomeowner: true } : { isRatedByTech: true };
      await Job.findByIdAndUpdate(jobId, updateField);
      
      return res.status(200).json({ 
        success: true, 
        message: 'Rating was already recorded. Job status synchronized.', 
        rating: existing 
      });
    }

    const rating = await Rating.create({
      job: jobId,
      rater: req.user._id,
      ratedUser: ratedUserId,
      score,
      comment: comment || '',
    });

    // Update job status to reflect rating completion
    const updateField = isHomeowner ? { isRatedByHomeowner: true } : { isRatedByTech: true };
    await Job.findByIdAndUpdate(jobId, updateField);

    res.status(201).json({ success: true, message: 'Rating submitted successfully', rating });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ratings for a user
// @route   GET /api/ratings/user/:userId
// @access  Public
const getUserRatings = async (req, res, next) => {
  try {
    const ratings = await Rating.find({ ratedUser: req.params.userId })
      .populate('rater', 'name profileImage')
      .populate('job', 'title category')
      .sort({ createdAt: -1 });

    res.json({ success: true, ratings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ALL ratings (Admin only)
// @route   GET /api/ratings
// @access  Private (Admin)
const getAllRatings = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const ratings = await Rating.find({})
      .populate('rater', 'name profileImage email')
      .populate('ratedUser', 'name role')
      .populate('job', 'title category')
      .sort({ createdAt: -1 });

    res.json({ success: true, ratings });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a rating (Admin only)
// @route   DELETE /api/ratings/:id
// @access  Private (Admin)
const deleteRating = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const rating = await Rating.findByIdAndDelete(req.params.id);
    if (!rating) return res.status(404).json({ success: false, message: 'Rating not found' });
    res.json({ success: true, message: 'Rating removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createRating, getUserRatings, getAllRatings, deleteRating };
