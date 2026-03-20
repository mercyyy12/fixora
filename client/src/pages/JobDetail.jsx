import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiLocationMarker, HiClock, HiTrash, HiStar, HiRefresh, HiPencil } from 'react-icons/hi';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { formatDistanceToNow, getStatusClass } from '../utils/helpers';
import MockMap from '../components/MockMap';
import StarRating from '../components/StarRating';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const statusTransitions = { Assigned: 'In Progress', 'In Progress': 'Completed' };

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { jobUpdate } = useSocket();   // ← watch for live updates
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [liveIndicator, setLiveIndicator] = useState(false);

  // Rating state
  const [showRating, setShowRating] = useState(false);
  const [ratingScore, setRatingScore] = useState(0);
  const [ratingComment, setRatingComment] = useState('');

  const fetchJob = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const { data } = await API.get(`/jobs/${id}`);
      setJob(data.job);
    } catch {
      toast.error('Job not found');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  // Initial load
  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  // ── Live update via socket ──────────────────────────────────────────────
  useEffect(() => {
    if (!jobUpdate) return;
    // Only re-fetch if this update is about the job we're currently viewing
    if (jobUpdate.jobId === id) {
      // Flash the live indicator
      setLiveIndicator(true);
      setTimeout(() => setLiveIndicator(false), 2000);
      // Silently re-fetch without showing full-page loader
      fetchJob(true);
    }
  }, [jobUpdate, id, fetchJob]);

  const handleAccept = async () => {
    setActionLoading(true);
    try {
      const { data } = await API.put(`/jobs/${id}/accept`);
      setJob(data.job);
      toast.success('Job accepted! The homeowner has been notified.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept job');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setActionLoading(true);
    try {
      const { data } = await API.put(`/jobs/${id}/status`, { status: newStatus });
      setJob(data.job);
      toast.success(`Status updated to "${newStatus}"`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this job? This cannot be undone.')) return;
    try {
      await API.delete(`/jobs/${id}`);
      toast.success('Job deleted');
      navigate('/jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete job');
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (!ratingScore) return toast.error('Please select a star rating');
    try {
      await API.post('/ratings', { jobId: id, score: ratingScore, comment: ratingComment });
      toast.success('Thank you for your review!');
      setJob((prev) => ({ ...prev, isRated: true }));
      setShowRating(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit rating');
    }
  };

  if (loading) return <Loader />;
  if (!job) return null;

  const isHomeowner = user?.role === 'homeowner';
  const isTechnician = user?.role === 'technician';
  const isJobOwner = job.homeowner?._id === user?._id;
  const isAssignedTech = job.technician?._id === user?._id;
  const nextStatus = statusTransitions[job.status];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {/* Back */}
        <Link to="/jobs" className="inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-brand-600 dark:hover:text-brand-400 mb-5 transition-colors">
          ← Back to Jobs
        </Link>

        {/* Live indicator */}
        {liveIndicator && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Job updated in real-time
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Header card */}
            <div className="card p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={getStatusClass(job.status)}>{job.status}</span>
                    <span className="badge bg-canvas-alt text-ink-2">{job.category}</span>
                  </div>
                  <h1 className="font-display font-bold text-xl md:text-2xl text-ink">{job.title}</h1>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Manual refresh button */}
                  <button
                    onClick={() => fetchJob(true)}
                    title="Refresh"
                    className="p-1.5 text-ink-3 hover:text-brand-500 hover:bg-brand/10 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                  >
                    <HiRefresh className="w-4 h-4" />
                  </button>
                  {/* Edit — homeowner, open job only */}
                  {isJobOwner && job.status === 'Open' && (
                    <Link
                      to={`/jobs/${id}/edit`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-brand/10 dark:bg-brand-900/30 text-brand hover:text-brand-hover hover:bg-brand-100 dark:hover:bg-brand-900/50 rounded-lg text-sm font-semibold transition-colors"
                    >
                      <HiPencil className="w-4 h-4" /> Edit
                    </Link>
                  )}
                  {/* Delete — homeowner, open job only */}
                  {isJobOwner && job.status === 'Open' && (
                    <button onClick={handleDelete} className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <HiTrash className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-ink-2 leading-relaxed whitespace-pre-line">{job.description}</p>

              <div className="flex flex-wrap gap-4 mt-5 text-sm text-ink-2">
                <span className="flex items-center gap-1.5"><HiLocationMarker className="w-4 h-4 text-brand-500" />{job.location?.address}</span>
                <span className="flex items-center gap-1.5"><HiClock className="w-4 h-4" />Posted {formatDistanceToNow(job.createdAt)}</span>
                {job.budget > 0 && (
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span className="text-xs">Rs.</span> Budget: {job.budget.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Images */}
            {job.images?.length > 0 && (
              <div className="card p-4">
                <h3 className="font-display font-bold text-ink mb-3 text-sm uppercase tracking-wide">Photos</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {job.images.map((img, i) => (
                    <img key={i} src={img} alt={`Job ${i + 1}`} className="w-full h-32 object-cover rounded-xl" />
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <div className="card p-4">
              <h3 className="font-display font-bold text-ink mb-3 text-sm uppercase tracking-wide">Location</h3>
              <div className="h-52">
                <MockMap lat={job.location?.lat} lng={job.location?.lng} address={job.location?.address} />
              </div>
            </div>

            {/* Status history */}
            <div className="card p-5">
              <h3 className="font-display font-bold text-ink mb-3 text-sm uppercase tracking-wide">Job Timeline</h3>
              <div className="space-y-2">
                {job.statusHistory?.map((h, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-ink-2">{h.status}</span>
                      <span className="text-xs text-ink-3 dark:text-ink-2 ml-2">{formatDistanceToNow(h.changedAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Homeowner info */}
            <div className="card p-5">
              <p className="text-xs font-semibold text-ink-3 dark:text-ink-2 uppercase tracking-wide mb-3">Posted by</p>
              <div className="flex items-center gap-3">
                {job.homeowner?.profileImage ? (
                  <img src={job.homeowner.profileImage} alt="" className="w-12 h-12 rounded-2xl object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-lg">
                    {job.homeowner?.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-ink">{job.homeowner?.name}</p>
                  {job.homeowner?.phone && <p className="text-xs text-ink-2">{job.homeowner.phone}</p>}
                </div>
              </div>
            </div>

            {/* Assigned technician */}
            {job.technician && (
              <div className="card p-5">
                <p className="text-xs font-semibold text-ink-3 dark:text-ink-2 uppercase tracking-wide mb-3">Technician</p>
                <Link to={`/technicians/${job.technician._id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  {job.technician.profileImage ? (
                    <img src={job.technician.profileImage} alt="" className="w-12 h-12 rounded-2xl object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-lg">
                      {job.technician.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-ink">{job.technician.name}</p>
                    <div className="flex items-center gap-1 text-xs text-amber-500">
                      <HiStar className="w-3.5 h-3.5" />
                      {job.technician.rating?.average > 0 ? job.technician.rating.average.toFixed(1) : 'New'}
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-3">
              {/* Technician: Accept open job */}
              {isTechnician && job.status === 'Open' && (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAccept}
                  disabled={actionLoading}
                  className="btn-primary w-full"
                >
                  {actionLoading ? 'Accepting…' : 'Accept This Job'}
                </motion.button>
              )}

              {/* Technician: Update status */}
              {isTechnician && isAssignedTech && nextStatus && (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleStatusUpdate(nextStatus)}
                  disabled={actionLoading}
                  className="btn-primary w-full"
                >
                  {actionLoading ? 'Updating…' : `Mark as "${nextStatus}"`}
                </motion.button>
              )}

              {/* Homeowner: Rate after completion */}
              {isHomeowner && isJobOwner && job.status === 'Completed' && !job.isRated && (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowRating(true)}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <HiStar className="w-5 h-5" /> Rate Technician
                </motion.button>
              )}
              {job.isRated && (
                <div className="card p-3 text-center text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  You've rated this job
                </div>
              )}
            </div>

            {/* Rating form */}
            {showRating && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
                <h3 className="font-display font-bold text-ink mb-4">Rate Your Experience</h3>
                <form onSubmit={handleRatingSubmit} className="space-y-4">
                  <div>
                    <label className="label">Star Rating</label>
                    <StarRating value={ratingScore} onChange={setRatingScore} />
                  </div>
                  <div>
                    <label className="label">Comment (optional)</label>
                    <textarea
                      value={ratingComment}
                      onChange={(e) => setRatingComment(e.target.value)}
                      rows={3}
                      placeholder="How was your experience?"
                      className="input resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="btn-primary flex-1">Submit</button>
                    <button type="button" onClick={() => setShowRating(false)} className="btn-secondary flex-1">Cancel</button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default JobDetail;
