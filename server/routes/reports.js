const express = require('express');
const router = express.Router();
const { createReport, getReports, updateReportStatus, deleteReport } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createReport);
router.get('/', protect, getReports);
router.put('/:id', protect, updateReportStatus);
router.delete('/:id', protect, deleteReport);

module.exports = router;
