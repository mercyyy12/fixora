const Report = require('../models/Report');

// @desc    Create a new report
// @route   POST /api/reports
// @access  Private
exports.createReport = async (req, res, next) => {
  try {
    const { reportedUser, reason, description } = req.body;
    
    const report = await Report.create({
      reporter: req.user.id,
      reportedUser,
      reason,
      description
    });

    res.status(201).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reports (Admin only)
// @route   GET /api/reports
// @access  Private (Admin)
exports.getReports = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const reports = await Report.find()
      .populate('reporter', 'name email')
      .populate('reportedUser', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    next(error);
  }
};

// @desc    Update report status (Admin only)
// @route   PUT /api/reports/:id
// @access  Private (Admin)
exports.updateReportStatus = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { status } = req.body;
    const report = await Report.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};
// @desc    Delete a report (Admin only)
// @route   DELETE /api/reports/:id
// @access  Private (Admin)
exports.deleteReport = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.status(200).json({ success: true, message: 'Report removed' });
  } catch (error) {
    next(error);
  }
};
