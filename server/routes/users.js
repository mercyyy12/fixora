const express = require('express');
const router = express.Router();
const {
  getTechnicians,
  getUserProfile,
  updateProfile,
  uploadImage,
  getNotifications,
  markNotificationsRead,
  getAdminStats,
  getAllUsers,
  adminUpdateUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Admin routes (must come before /:id)
router.get('/', protect, getAllUsers);            // GET /api/users — admin: all users
router.patch('/:id', protect, adminUpdateUser);   // PATCH /api/users/:id — admin: update isVerified etc.

router.get('/technicians', protect, getTechnicians);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/read', protect, markNotificationsRead);
router.put('/profile', protect, updateProfile);
router.post('/profile/image', protect, uploadImage);
router.get('/admin/stats', protect, getAdminStats);
router.get('/:id', protect, getUserProfile);

module.exports = router;
