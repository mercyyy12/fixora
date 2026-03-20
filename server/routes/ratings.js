const express = require('express');
const router = express.Router();
const { createRating, getTechnicianRatings } = require('../controllers/ratingController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('homeowner'), createRating);
router.get('/technician/:technicianId', getTechnicianRatings);

module.exports = router;
