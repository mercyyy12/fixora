import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiStar, HiBriefcase, HiPhone, HiMail, HiCheckCircle, HiLocationMarker, HiFlag, HiArrowLeft, HiXCircle } from 'react-icons/hi';
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
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({ reason: 'Fraud', description: '' });
  const [submittingReport, setSubmittingReport] = useState(false);

  const handleReport = async (e) => {
    e.preventDefault();
    setSubmittingReport(true);
    try {
      await API.post('/reports', {
        reportedUser: id,
        reason: reportForm.reason,
        description: reportForm.description
      });
      toast.success('Report submitted successfully');
      setShowReportModal(false);
      setReportForm({ reason: 'Fraud', description: '' });
    } catch (err) {
      toast.error('Failed to submit report');
    } finally {
      setSubmittingReport(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, ratingsRes] = await Promise.all([
          API.get(`/users/${id}`),
          API.get(`/ratings/user/${id}`),
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
    <>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {/* Back */}
        <button onClick={() => navigate(-1)} className="text-sm text-ink-2 hover:text-brand-600 dark:hover:text-brand-400 mb-5 flex items-center gap-1 transition-colors">
          <HiArrowLeft className="w-4 h-4" /> Back
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
              <span className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                tech.isAvailable
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {tech.isAvailable ? (
                  <><HiCheckCircle className="w-3.5 h-3.5" /> Available for work</>
                ) : (
                  <><HiXCircle className="w-3.5 h-3.5" /> Currently unavailable</>
                )}
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
                
                <button 
                  onClick={() => setShowReportModal(true)}
                  className="w-full mt-4 flex items-center justify-center gap-2 text-xs font-bold text-red-500 hover:text-red-600 border border-red-500/20 hover:border-red-500/50 py-2 rounded-xl transition-all"
                >
                  <HiFlag className="w-3 h-3" /> Report Technician
                </button>
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
                        {r.rater?.profileImage ? (
                          <img src={r.rater.profileImage} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                            {r.rater?.name?.[0]?.toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="font-semibold text-sm text-ink">{r.rater?.name}</span>
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

    {/* Report Modal */}
    {showReportModal && (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card w-full max-w-md p-6">
          <h3 className="font-display font-bold text-xl text-ink mb-2">Report User</h3>
          <p className="text-sm text-ink-3 mb-6">Your report will be reviewed by Fixora administrators.</p>
          
          <form onSubmit={handleReport} className="space-y-4">
            <div>
              <label className="label">Reason</label>
              <select 
                className="input" 
                value={reportForm.reason}
                onChange={(e) => setReportForm({...reportForm, reason: e.target.value})}
              >
                <option value="Fraud">Fraud</option>
                <option value="Abuse">Abuse</option>
                <option value="Poor Quality">Poor Quality</option>
                <option value="Late">Late</option>
                <option value="No Show">No Show</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="label">Description</label>
              <textarea 
                className="input resize-none" 
                rows={4}
                required
                placeholder="Give us more details about what happened..."
                value={reportForm.description}
                onChange={(e) => setReportForm({...reportForm, description: e.target.value})}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setShowReportModal(false)}
                className="flex-1 btn-secondary py-3"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={submittingReport}
                className="flex-1 btn-primary py-3 bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700 shadow-red-500/20"
              >
                {submittingReport ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    )}
    </>
  );
};

export default TechnicianProfile;
