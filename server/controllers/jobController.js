const { validationResult } = require('express-validator');
const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Homeowner)
const createJob = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { title, description, category, address, lat, lng, budget } = req.body;

    // Collect uploaded image URLs from Cloudinary
    const images = req.files ? req.files.map((f) => f.path) : [];

    const job = await Job.create({
      title,
      description,
      category,
      images,
      budget: budget || 0,
      location: {
        address,
        // Replace with real Google Maps Geocoding API in production
        // "Replace with real Google Maps API key here"
        lat: lat || 27.7172,
        lng: lng || 85.324,
      },
      homeowner: req.user._id,
      statusHistory: [{ status: 'Open', changedBy: req.user._id }],
    });

    await job.populate('homeowner', 'name email profileImage location');

    // Emit real-time event to all connected technicians
    req.io.emit('job:new', { job });

    res.status(201).json({ success: true, message: 'Job created successfully', job });
  } catch (error) {
    next(error);
  }
};

// @desc    Get jobs (role-aware)
// @route   GET /api/jobs
// @access  Private
const getAllJobs = async (req, res, next) => {
  try {
    const { category, status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (category) query.category = category;

    if (req.user.role === 'homeowner') {
      // Homeowners always see only their own jobs
      query.homeowner = req.user._id;
      if (status) query.status = status;
    } else {
      // Technician query logic:
      // ?status=mine      → jobs assigned to this technician (their work history)
      // ?status=Open      → only open jobs available to accept
      // ?status=Assigned  → jobs assigned to them with that status
      // ?status=In Progress → same
      // ?status=Completed → same
      // no status param   → open jobs + ALL jobs assigned to them
      if (status === 'mine') {
        // Special virtual status — show all jobs assigned to this technician
        query.technician = req.user._id;
      } else if (status) {
        // Explicit real status filter
        query.status = status;
        // When filtering by non-Open status, scope to their own jobs
        if (status !== 'Open') {
          query.technician = req.user._id;
        }
      } else {
        // Default: open jobs browsable by anyone + jobs this tech is involved in
        query.$or = [
          { status: 'Open' },
          { technician: req.user._id },
        ];
      }
    }

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('homeowner', 'name profileImage location')
      .populate('technician', 'name profileImage rating')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single job
// @route   GET /api/jobs/:id
// @access  Private
const getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('homeowner', 'name email profileImage phone location')
      .populate('technician', 'name email profileImage phone skills experience rating');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept a job (Technician)
// @route   PUT /api/jobs/:id/accept
// @access  Private (Technician)
const acceptJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.status !== 'Open') {
      return res.status(400).json({ success: false, message: 'Job is no longer available' });
    }

    job.technician = req.user._id;
    job.status = 'Assigned';
    job.statusHistory.push({ status: 'Assigned', changedBy: req.user._id });
    await job.save();

    await job.populate('homeowner', 'name profileImage');
    await job.populate('technician', 'name profileImage rating');

    // Notify homeowner via socket
    req.io.to(`user:${job.homeowner._id}`).emit('job:accepted', {
      jobId: job._id,
      technician: req.user.name,
      message: `Your job "${job.title}" has been accepted by ${req.user.name}`,
    });

    await User.findByIdAndUpdate(job.homeowner._id, {
      $push: {
        notifications: {
          message: `Your job "${job.title}" was accepted by ${req.user.name}`,
        },
      },
    });

    res.json({ success: true, message: 'Job accepted successfully', job });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job status (Technician)
// @route   PUT /api/jobs/:id/status
// @access  Private (Technician)
const updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedTransitions = {
      Assigned: ['In Progress'],
      'In Progress': ['Completed'],
    };

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    if (!job.technician || job.technician.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this job' });
    }

    const allowed = allowedTransitions[job.status];
    if (!allowed || !allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot transition from '${job.status}' to '${status}'`,
      });
    }

    job.status = status;
    job.statusHistory.push({ status, changedBy: req.user._id });
    await job.save();

    await job.populate('homeowner', 'name profileImage');
    await job.populate('technician', 'name profileImage rating');

    // Notify homeowner via socket
    req.io.to(`user:${job.homeowner._id}`).emit('job:statusUpdate', {
      jobId: job._id,
      status,
      message: `Your job "${job.title}" is now ${status}`,
    });

    await User.findByIdAndUpdate(job.homeowner._id, {
      $push: {
        notifications: {
          message: `Your job "${job.title}" status updated to: ${status}`,
        },
      },
    });

    res.json({ success: true, message: `Job status updated to ${status}`, job });
  } catch (error) {
    next(error);
  }
};

// @desc    Edit a job (Homeowner only, only while still Open)
// @route   PUT /api/jobs/:id/edit
// @access  Private (Homeowner)
const editJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    if (job.homeowner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this job' });
    }

    if (job.status !== 'Open') {
      return res.status(400).json({
        success: false,
        message: 'Only open jobs can be edited. This job has already been assigned to a technician.',
      });
    }

    const { title, description, category, address, lat, lng, budget, keepImages } = req.body;

    // Update text fields
    if (title)       job.title       = title;
    if (description) job.description = description;
    if (category)    job.category    = category;
    if (budget !== undefined) job.budget = Number(budget) || 0;

    if (address) job.location.address = address;
    if (lat)     job.location.lat     = parseFloat(lat);
    if (lng)     job.location.lng     = parseFloat(lng);

    // Handle images:
    // Frontend sends existingImages as a JSON array of URLs to keep
    // New files are appended on top
    const newImages = req.files ? req.files.map((f) => f.path) : [];
    let surviving = job.images; // default: keep all existing

    if (req.body.existingImages !== undefined) {
      try {
        surviving = JSON.parse(req.body.existingImages);
      } catch {
        surviving = job.images;
      }
    }

    job.images = [...surviving, ...newImages].slice(0, 5);

    await job.save();
    await job.populate('homeowner', 'name email profileImage location');
    await job.populate('technician', 'name profileImage rating');

    // Broadcast update via socket so other clients refresh
    req.io.emit('job:updated', { jobId: job._id, job });

    res.json({ success: true, message: 'Job updated successfully', job });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a job (Homeowner only, only if Open)
// @route   DELETE /api/jobs/:id
// @access  Private (Homeowner)
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    if (job.homeowner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (job.status !== 'Open') {
      return res.status(400).json({ success: false, message: 'Only open jobs can be deleted' });
    }

    await job.deleteOne();
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createJob, getAllJobs, getJob, acceptJob, updateJobStatus, editJob, deleteJob };
