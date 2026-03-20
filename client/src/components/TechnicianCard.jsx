import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiStar, HiBriefcase, HiCheckCircle } from 'react-icons/hi';

const TechnicianCard = ({ technician, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Link to={`/technicians/${technician._id}`} className="block">
        <div className="card p-5 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {technician.profileImage ? (
                <img
                  src={technician.profileImage}
                  alt={technician.name}
                  className="w-14 h-14 rounded-2xl object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xl font-bold">
                  {technician.name?.[0]?.toUpperCase()}
                </div>
              )}
              {technician.isAvailable && (
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white dark:border-gray-900" title="Available" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-ink truncate">
                {technician.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1.5 mt-0.5">
                <HiStar className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold text-ink-2">
                  {technician.rating?.average > 0 ? technician.rating.average.toFixed(1) : 'New'}
                </span>
                {technician.rating?.count > 0 && (
                  <span className="text-xs text-ink-3">({technician.rating.count})</span>
                )}
              </div>

              {/* Experience */}
              <div className="flex items-center gap-1 mt-1 text-xs text-ink-2">
                <HiBriefcase className="w-3.5 h-3.5" />
                {technician.experience > 0 ? `${technician.experience}+ yrs experience` : 'New technician'}
              </div>
            </div>
          </div>

          {/* Skills */}
          {technician.skills?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {technician.skills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-brand/10 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-full"
                >
                  <HiCheckCircle className="w-3 h-3" />
                  {skill}
                </span>
              ))}
              {technician.skills.length > 4 && (
                <span className="text-xs px-2 py-0.5 bg-canvas-alt text-ink-2 rounded-full">
                  +{technician.skills.length - 4} more
                </span>
              )}
            </div>
          )}

          {/* Bio snippet */}
          {technician.bio && (
            <p className="mt-2.5 text-xs text-ink-2 line-clamp-2">
              {technician.bio}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default TechnicianCard;
