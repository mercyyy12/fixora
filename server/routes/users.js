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
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/technicians', protect, getTechnicians);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/read', protect, markNotificationsRead);
router.put('/profile', protect, updateProfile);
router.post('/profile/image', protect, uploadImage);
router.get('/admin/stats', protect, getAdminStats);
router.get('/:id', protect, getUserProfile);

module.exports = router;
