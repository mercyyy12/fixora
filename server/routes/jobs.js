const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createJob,
  getAllJobs,
  getJob,
  acceptJob,
  updateJobStatus,
  editJob,
  deleteJob,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');
const { uploadJobImages } = require('../config/cloudinary');

const jobValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('address').notEmpty().withMessage('Location address is required'),
];

// Wrap multer in a middleware to handle errors gracefully
const handleUpload = (req, res, next) => {
  uploadJobImages(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
};

router.get('/', protect, getAllJobs);
router.post('/', protect, authorize('homeowner'), handleUpload, jobValidation, createJob);
router.get('/:id', protect, getJob);
router.put('/:id/edit', protect, authorize('homeowner'), handleUpload, editJob);
router.put('/:id/accept', protect, authorize('technician'), acceptJob);
router.put('/:id/status', protect, authorize('technician'), updateJobStatus);
router.delete('/:id', protect, authorize('homeowner'), deleteJob);

module.exports = router;
