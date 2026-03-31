const express = require('express');
const router = express.Router();
const { createRating, getUserRatings, getAllRatings, deleteRating } = require('../controllers/ratingController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAllRatings); // GET /api/ratings (Admin)
router.post('/', protect, createRating);
router.get('/user/:userId', getUserRatings);
router.delete('/:id', protect, deleteRating); // DELETE /api/ratings/:id (Admin)

module.exports = router;
