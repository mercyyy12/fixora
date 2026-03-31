const User = require('../models/User');
const { uploadProfileImage } = require('../config/cloudinary');

// @desc    Get all technicians (for homeowner to browse)
// @route   GET /api/users/technicians
// @access  Private
const getTechnicians = async (req, res, next) => {
  try {
    const { skill, page = 1, limit = 10 } = req.query;
    const query = { role: 'technician', isVerified: true };

    if (skill) query.skills = { $in: [new RegExp(skill, 'i')] };

    const total = await User.countDocuments(query);
    const technicians = await User.find(query)
      .select('-password -notifications')
      .sort({ 'rating.average': -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, technicians });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single user profile
// @route   GET /api/users/:id
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password -notifications');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user's profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, bio, skills, experience, address, isAvailable } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (bio !== undefined) updateData.bio = bio;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;
    if (address) updateData['location.address'] = address;

    if (req.user.role === 'technician') {
      if (skills) {
        updateData.skills = Array.isArray(skills) ? skills : skills.split(',').map((s) => s.trim());
      }
      if (experience !== undefined) updateData.experience = experience;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json({ success: true, message: 'Profile updated successfully', user });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload profile image
// @route   POST /api/users/profile/image
// @access  Private
const uploadImage = (req, res, next) => {
  uploadProfileImage(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });

    try {
      if (!req.file) return res.status(400).json({ success: false, message: 'No image provided' });

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { profileImage: req.file.path },
        { new: true }
      ).select('-password');

      res.json({ success: true, message: 'Profile image updated', user });
    } catch (error) {
      next(error);
    }
  });
};

// @desc    Get user notifications
// @route   GET /api/users/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('notifications');
    const notifications = user.notifications.sort((a, b) => b.createdAt - a.createdAt);
    res.json({ success: true, notifications });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notifications as read
// @route   PUT /api/users/notifications/read
// @access  Private
const markNotificationsRead = async (req, res, next) => {
  try {
    await User.updateOne(
      { _id: req.user._id },
      { $set: { 'notifications.$[].read': true } }
    );
    res.json({ success: true, message: 'Notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin platform stats
// @route   GET /api/users/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized as admin' });
    }

    const http = require('http');
    const analyticsPort = process.env.ANALYTICS_PORT || 6000;
    
    const fetchGoStats = () => new Promise((resolve, reject) => {
      const request = http.get(`http://localhost:${analyticsPort}/api/admin/stats`, (response) => {
        if (response.statusCode !== 200) {
          return reject(new Error('Status code: ' + response.statusCode));
        }
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => resolve(JSON.parse(data)));
      });
      request.on('error', reject);
      request.setTimeout(2000, () => {
        request.destroy();
        reject(new Error('Request timed out'));
      });
    });

    try {
      const stats = await fetchGoStats();
      return res.json({ success: true, stats });
    } catch (err) {
      console.error('Go Analytics Service unavailable, falling back to local counts:', err.message);
      
      const totalHomeowners = await User.countDocuments({ role: 'homeowner' });
      const totalTechnicians = await User.countDocuments({ role: 'technician' });
      
      const Job = require('../models/Job');
      const totalActiveJobs = await Job.countDocuments({ status: { $in: ['Accepted', 'In Progress'] } });
      const completedJobs = await Job.countDocuments({ status: 'Completed' });
      
      const pendingApprovals = await User.countDocuments({ role: 'technician', isVerified: false });
      
      const Report = require('../models/Report');
      const reportsComplaints = await Report.countDocuments({ status: 'Pending' });

      // Override real aggregation with requested fake placeholder data
      const revenue = 1245000;

      res.json({
        success: true,
        stats: {
          totalUsers: totalHomeowners + totalTechnicians,
          totalHomeowners,
          totalTechnicians,
          totalActiveJobs,
          completedJobs,
          pendingApprovals,
          reportsComplaints,
          revenue
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get ALL users (admin only)
// @route   GET /api/users
// @access  Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const users = await User.find({}).select('-password -notifications').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Admin update a user (isVerified, isBlocked, etc.)
// @route   PATCH /api/users/:id
// @access  Private (Admin)
const adminUpdateUser = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const allowed = ['isVerified', 'isBlocked', 'role'];
    const update = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k]; });
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTechnicians,
  getUserProfile,
  updateProfile,
  uploadImage,
  getNotifications,
  markNotificationsRead,
  getAdminStats,
  getAllUsers,
  adminUpdateUser,
};
