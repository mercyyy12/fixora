import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiStar, HiBriefcase, HiPhone, HiMail, HiCheckCircle, HiLocationMarker } from 'react-icons/hi';
import API from '../utils/api';
import StarRating from '../components/StarRating';
import Loader from '../components/Loader';
import { formatDistanceToNow } from '../utils/helpers';
import toast from 'react-hot-toast';

const TechnicianProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tech, setTech] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, ratingsRes] = await Promise.all([
          API.get(`/users/${id}`),
          API.get(`/ratings/technician/${id}`),
        ]);
        setTech(userRes.data.user);
        setRatings(ratingsRes.data.ratings);
      } catch {
        toast.error('Technician not found');
        navigate('/technicians');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  if (loading) return <Loader />;
  if (!tech) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {/* Back */}
        <button onClick={() => navigate(-1)} className="text-sm text-ink-2 hover:text-brand-600 dark:hover:text-brand-400 mb-5 flex items-center gap-1 transition-colors">
          ← Back
        </button>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-5">
            <div className="card p-6 text-center">
              {/* Avatar */}
              <div className="flex justify-center mb-4">
                {tech.profileImage ? (
                  <img src={tech.profileImage} alt={tech.name} className="w-24 h-24 rounded-3xl object-cover shadow-lg" />
                ) : (
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {tech.name?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>

              <h1 className="font-display font-bold text-xl text-ink">{tech.name}</h1>

              {/* Availability badge */}
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                tech.isAvailable
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {tech.isAvailable ? '● Available for work' : '○ Currently unavailable'}
              </span>

              {/* Rating */}
              <div className="mt-4 flex flex-col items-center gap-1">
                <StarRating value={Math.round(tech.rating?.average || 0)} readonly />
                <p className="text-sm text-ink-2">
                  {tech.rating?.average > 0
                    ? `${tech.rating.average.toFixed(1)} out of 5 (${tech.rating.count} review${tech.rating.count !== 1 ? 's' : ''})`
                    : 'No reviews yet'}
                </p>
              </div>

              {/* Contact info */}
              <div className="mt-5 space-y-2 text-sm text-left">
                <div className="flex items-center gap-2 text-ink-2">
                  <HiMail className="w-4 h-4 flex-shrink-0 text-brand-400" />
                  <span className="truncate">{tech.email}</span>
                </div>
                {tech.phone && (
                  <div className="flex items-center gap-2 text-ink-2">
                    <HiPhone className="w-4 h-4 flex-shrink-0 text-brand-400" />
                    <span>{tech.phone}</span>
                  </div>
                )}
                {tech.location?.address && (
                  <div className="flex items-center gap-2 text-ink-2">
                    <HiLocationMarker className="w-4 h-4 flex-shrink-0 text-brand-400" />
                    <span>{tech.location.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Experience */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <HiBriefcase className="w-5 h-5 text-brand-500" />
                <h3 className="font-display font-bold text-ink">Experience</h3>
              </div>
              <p className="text-2xl font-bold text-brand hover:text-brand-hover">
                {tech.experience > 0 ? `${tech.experience}+` : '< 1'}
              </p>
              <p className="text-sm text-ink-2">years of experience</p>
            </div>
          </div>

          {/* Main content */}
          <div className="md:col-span-2 space-y-5">
            {/* Bio */}
            {tech.bio && (
              <div className="card p-6">
                <h2 className="font-display font-bold text-ink mb-3">About</h2>
                <p className="text-ink-2 leading-relaxed">{tech.bio}</p>
              </div>
            )}

            {/* Skills */}
            {tech.skills?.length > 0 && (
              <div className="card p-6">
                <h2 className="font-display font-bold text-ink mb-4">Skills & Specialties</h2>
                <div className="flex flex-wrap gap-2">
                  {tech.skills.map((skill) => (
                    <span key={skill} className="flex items-center gap-1.5 px-3 py-1.5 bg-brand/10 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-full text-sm font-medium">
                      <HiCheckCircle className="w-4 h-4" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="card p-6">
              <h2 className="font-display font-bold text-ink mb-4">
                Reviews ({ratings.length})
              </h2>
              {ratings.length === 0 ? (
                <div className="text-center py-8">
                  <HiStar className="w-10 h-10 text-gray-300 dark:text-ink-2 mx-auto mb-2" />
                  <p className="text-ink-2 text-sm">No reviews yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {ratings.map((r, i) => (
                    <motion.div
                      key={r._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="border-b border-outline pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start gap-3">
                        {r.homeowner?.profileImage ? (
                          <img src={r.homeowner.profileImage} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                            {r.homeowner?.name?.[0]?.toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="font-semibold text-sm text-ink">{r.homeowner?.name}</span>
                            <span className="text-xs text-ink-3">{formatDistanceToNow(r.createdAt)}</span>
                          </div>
                          <StarRating value={r.score} readonly size="sm" />
                          {r.job?.title && (
                            <p className="text-xs text-ink-3 dark:text-ink-2 mt-0.5">Job: {r.job.title}</p>
                          )}
                          {r.comment && (
                            <p className="text-sm text-ink-2 mt-1.5 leading-relaxed">{r.comment}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TechnicianProfile;
