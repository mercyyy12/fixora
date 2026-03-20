import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiLocationMarker, HiClock, HiTag } from 'react-icons/hi';
import { formatDistanceToNow } from '../utils/helpers';

const statusClass = {
  Open: 'status-open',
  Assigned: 'status-assigned',
  'In Progress': 'status-in-progress',
  Completed: 'status-completed',
  Cancelled: 'status-cancelled',
};

const categoryColors = {
  Plumbing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Electrical: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  Carpentry: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Painting: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  HVAC: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  Cleaning: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  default: 'bg-gray-100 text-ink-2 dark:bg-gray-700 dark:text-gray-300',
};

const JobCard = ({ job, index = 0 }) => {
  const catColor = categoryColors[job.category] || categoryColors.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Link to={`/jobs/${job._id}`} className="block h-full">
        <div className="card p-5 hover:shadow-lg transition-shadow duration-300 group flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-ink text-base truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {job.title}
              </h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={`badge inline-flex items-center gap-1 ${catColor} text-xs`}>
                  <HiTag className="w-3 h-3 flex-shrink-0" />
                  {job.category}
                </span>
                <span className={statusClass[job.status] || 'badge bg-gray-100 text-ink-2'}>
                  {job.status}
                </span>
              </div>
            </div>
            {job.images?.[0] && (
              <img
                src={job.images[0]}
                alt={job.title}
                className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
              />
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-ink-2 line-clamp-2 mb-4 flex-grow">
            {job.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-ink-3 dark:text-ink-2 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <HiLocationMarker className="w-3.5 h-3.5 text-brand-400" />
                {job.location?.address || 'Location TBD'}
              </span>
              <span className="flex items-center gap-1">
                <HiClock className="w-3.5 h-3.5" />
                {formatDistanceToNow(job.createdAt)}
              </span>
            </div>
            {job.budget > 0 && (
              <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="text-xs mt-0.5">Rs.</span>
                {job.budget.toLocaleString()}
              </span>
            )}
          </div>

          {/* Homeowner info */}
          {job.homeowner && (
            <div className="mt-3 pt-3 border-t border-outline flex items-center gap-2">
              {job.homeowner.profileImage ? (
                <img src={job.homeowner.profileImage} alt="" className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-brand/100 flex items-center justify-center text-white text-xs font-bold">
                  {job.homeowner.name?.[0]?.toUpperCase()}
                </div>
              )}
              <span className="text-xs text-ink-2">{job.homeowner.name}</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default JobCard;
