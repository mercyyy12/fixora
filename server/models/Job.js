const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Plumbing',
        'Electrical',
        'Carpentry',
        'Painting',
        'HVAC',
        'Cleaning',
        'Roofing',
        'Flooring',
        'Landscaping',
        'General Repair',
        'Other',
      ],
    },
    images: [{ type: String }],

    // Job lifecycle: Open → Assigned → In Progress → Completed
    status: {
      type: String,
      enum: ['Open', 'Assigned', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Open',
    },

    // ── Location ─────────────────────────────────────────────────────────────
    location: {
      address: { type: String, required: [true, 'Location address is required'] },
      // Mock coordinates — Replace with real Google Maps geocoding in production
      // Comment: "Replace with real Google Maps API key here"
      lat: { type: Number, default: 27.7172 },
      lng: { type: Number, default: 85.3240 },
    },

    budget: {
      type: Number,
      default: 0,
    },

    // ── Relationships ─────────────────────────────────────────────────────────
    homeowner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    isRated: {
      type: Boolean,
      default: false,
    },

    // Status history for audit trail
    statusHistory: [
      {
        status: String,
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        changedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Index for faster queries
jobSchema.index({ status: 1, category: 1 });
jobSchema.index({ homeowner: 1 });
jobSchema.index({ technician: 1 });

module.exports = mongoose.model('Job', jobSchema);
