import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiPlus, HiClipboardList, HiCheckCircle, HiClock, HiUsers, HiRefresh, HiArrowRight, HiStar, HiHome, HiWrench } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import API from '../utils/api';
import JobCard from '../components/JobCard';
import Loader from '../components/Loader';

const StatCard = ({ icon: Icon, label, value, color, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="card p-5 flex items-center gap-4"
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-2xl font-display font-bold text-ink">{value}</p>
      <p className="text-sm text-ink-2">{label}</p>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { jobUpdate } = useSocket();
  const isHomeowner = user?.role === 'homeowner';
  const isAdmin = user?.role === 'admin';

  // Homeowners: all their posted jobs
  // Technicians: open jobs (for browsing) + their own jobs (for stats)
  // Admin: global jobs + global stats
  const [recentJobs, setRecentJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]); // technician's accepted/in-progress/completed jobs
  const [adminStats, setAdminStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      if (isAdmin) {
        const [statsRes, jobsRes] = await Promise.all([
          API.get('/users/admin/stats'),
          API.get('/jobs?limit=6')
        ]);
        setAdminStats(statsRes.data.stats);
        setRecentJobs(jobsRes.data.jobs);
      } else if (isHomeowner) {
        // Homeowners: just their jobs
        const { data } = await API.get('/jobs?limit=6');
        setRecentJobs(data.jobs);
      } else {
        // Technicians: fetch open jobs for display + their own jobs for stats — parallel
        const [openRes, mineRes] = await Promise.all([
          API.get('/jobs?status=Open&limit=6'),
          API.get('/jobs?status=mine&limit=100'),
        ]);
        setRecentJobs(openRes.data.jobs);
        setMyJobs(mineRes.data.jobs);
      }
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  }, [isHomeowner, isAdmin]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Live socket refresh
  useEffect(() => {
    if (!jobUpdate) return;
    fetchData(true);
  }, [jobUpdate]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = isAdmin 
      ? [
          { icon: HiUsers,         label: 'Total Homeowners',   value: adminStats?.totalHomeowners || 0,        color: 'bg-emerald-500' },
          { icon: HiUsers,         label: 'Total Technicians',  value: adminStats?.totalTechnicians || 0,       color: 'bg-blue-500' },
          { icon: HiClipboardList, label: 'Total Active Jobs',  value: adminStats?.totalActiveJobs || 0,        color: 'bg-purple-500' },
          { icon: HiClock,         label: 'Pending Reports',    value: adminStats?.reportsComplaints || 0,      color: 'bg-amber-500' },
        ]
    : isHomeowner
    ? [
        { icon: HiClipboardList, label: 'Total Jobs Posted',  value: recentJobs.length,                                                              color: 'bg-brand'   },
        { icon: HiClock,         label: 'Open Jobs',          value: recentJobs.filter((j) => j.status === 'Open').length,                           color: 'bg-amber-500'   },
        { icon: HiCheckCircle,   label: 'Completed',          value: recentJobs.filter((j) => j.status === 'Completed').length,                      color: 'bg-emerald-500' },
        { icon: HiUsers,         label: 'In Progress',        value: recentJobs.filter((j) => j.status === 'Assigned' || j.status === 'In Progress').length, color: 'bg-blue-500' },
      ]
    : [
        { icon: HiClipboardList, label: 'Jobs Accepted',      value: myJobs.length,                                                                  color: 'bg-brand'   },
        { icon: HiClock,         label: 'In Progress',        value: myJobs.filter((j) => j.status === 'In Progress').length,                        color: 'bg-amber-500'   },
        { icon: HiCheckCircle,   label: 'Completed by Me',    value: myJobs.filter((j) => j.status === 'Completed').length,                          color: 'bg-emerald-500' },
        { icon: HiUsers,         label: 'My Rating',          value: user?.rating?.average > 0 ? (
          <span className="flex items-center gap-1">
            {user.rating.average.toFixed(1)}
            <HiStar className="w-5 h-5 text-amber-400 fill-current" />
          </span>
        ) : '—',        color: 'bg-purple-500'  },
      ];

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="font-display font-bold text-2xl text-ink">
            Good day, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-ink-2 mt-0.5 text-sm capitalize flex items-center gap-1.5">
            {isHomeowner ? <HiHome className="w-4 h-4 text-brand-500" /> : <HiWrench className="w-4 h-4 text-brand-500" />}
            {user?.role} Dashboard
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => fetchData(false)} className="btn-secondary p-2.5" title="Refresh">
            <HiRefresh className="w-5 h-5" />
          </button>
          {isHomeowner && (
            <Link to="/jobs/new" className="btn-primary flex items-center gap-2">
              <HiPlus className="w-5 h-5" /> Post a Job
            </Link>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
      </div>

      {/* My active jobs — technician only */}
      {!isHomeowner && myJobs.filter((j) => j.status === 'Assigned' || j.status === 'In Progress').length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-lg text-ink">
              My Active Jobs
            </h2>
            <Link to="/jobs?tab=mine" className="text-sm text-brand hover:text-brand-hover font-semibold hover:underline flex items-center gap-1">
              View all <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {myJobs
              .filter((j) => j.status === 'Assigned' || j.status === 'In Progress')
              .map((job, i) => <JobCard key={job._id} job={job} index={i} />)}
          </div>
        </div>
      )}

      {/* Open/recent jobs */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-lg text-ink">
            {isAdmin ? 'Recent Platform Hub' : isHomeowner ? 'Recent Jobs' : 'Open Jobs Near You'}
          </h2>
          <Link to="/jobs" className="text-sm text-brand hover:text-brand-hover font-semibold hover:underline flex items-center gap-1">
            View all <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentJobs.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-12 text-center">
            <HiClipboardList className="w-12 h-12 text-ink-3 mx-auto mb-3" />
            <p className="font-display font-bold text-ink mb-1">No jobs yet</p>
            <p className="text-sm text-ink-2 mb-4">
              {isAdmin ? 'No jobs have been posted on the platform yet.' : isHomeowner ? 'Post your first job to get started.' : 'No open jobs in your area right now.'}
            </p>
            {isHomeowner && (
              <Link to="/jobs/new" className="btn-primary inline-flex items-center gap-2">
                <HiPlus className="w-4 h-4" /> Post a Job
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {recentJobs.map((job, i) => <JobCard key={job._id} job={job} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
