import React, { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSearch, HiFilter, HiPlus, HiRefresh } from 'react-icons/hi';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import JobCard from '../components/JobCard';
import Loader from '../components/Loader';

const CATEGORIES = ['All','Plumbing','Electrical','Carpentry','Painting','HVAC','Cleaning','Roofing','Flooring','Landscaping','General Repair','Other'];
const STATUSES_HOMEOWNER  = ['All','Open','Assigned','In Progress','Completed'];
const STATUSES_TECH_BROWSE = ['Open']; // browse tab always shows open
const STATUSES_TECH_MINE  = ['All','Assigned','In Progress','Completed'];

const JobList = () => {
  const { user } = useAuth();
  const { jobUpdate } = useSocket();
  const [searchParams] = useSearchParams();
  const isHomeowner = user?.role === 'homeowner';

  // Technician has two tabs: "Browse" (open jobs) and "My Jobs" (their work)
  const defaultTab = searchParams.get('tab') === 'mine' ? 'mine' : 'browse';
  const [activeTab, setActiveTab] = useState(defaultTab);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchJobs = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 9 });
      if (category !== 'All') params.append('category', category);

      if (isHomeowner) {
        if (status !== 'All') params.append('status', status);
      } else {
        // Technician tabs
        if (activeTab === 'mine') {
          params.append('status', 'mine'); // virtual status — backend handles this
        } else {
          params.append('status', 'Open'); // browse tab always shows open jobs
        }
      }

      const { data } = await API.get(`/jobs?${params}`);
      setJobs(data.jobs);
      setTotalPages(data.pages);
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  }, [category, status, page, activeTab, isHomeowner]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  // Re-fetch silently on socket update
  useEffect(() => {
    if (!jobUpdate) return;
    fetchJobs(true);
  }, [jobUpdate]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset page when filters/tab change
  useEffect(() => { setPage(1); }, [category, status, activeTab]);

  const filtered = search
    ? jobs.filter((j) =>
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.description.toLowerCase().includes(search.toLowerCase())
      )
    : jobs;

  const statusOptions = isHomeowner
    ? STATUSES_HOMEOWNER
    : activeTab === 'mine'
    ? STATUSES_TECH_MINE
    : STATUSES_TECH_BROWSE;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="font-display font-bold text-2xl text-ink">
            {isHomeowner ? 'My Jobs' : 'Jobs'}
          </h1>
          <p className="text-sm text-ink-2 mt-0.5">
            {jobs.length} job{jobs.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => fetchJobs(false)} className="btn-secondary p-2.5" title="Refresh">
            <HiRefresh className="w-5 h-5" />
          </button>
          {isHomeowner && (
            <Link to="/jobs/new" className="btn-primary flex items-center gap-2">
              <HiPlus className="w-5 h-5" /> Post Job
            </Link>
          )}
        </div>
      </motion.div>

      {/* Technician tabs */}
      {!isHomeowner && (
        <div className="flex bg-canvas-alt rounded-xl p-1 mb-5 w-fit">
          {[
            { key: 'browse', label: 'Browse Open Jobs' },
            { key: 'mine',   label: 'My Jobs' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setStatus('All'); }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === key
                  ? 'bg-white dark:bg-gray-700 text-brand hover:text-brand-hover shadow-sm'
                  : 'text-ink-2 hover:text-ink-2 dark:hover:text-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs…"
            className="input pl-11"
          />
        </div>
        <div className="relative">
          <HiFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-3" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input pl-9 pr-8 appearance-none min-w-[150px]"
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        {/* Status filter — only shown for homeowner or technician "My Jobs" tab */}
        {(isHomeowner || activeTab === 'mine') && (
          <div className="relative">
            <HiFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-3" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input pl-9 pr-8 appearance-none min-w-[130px]"
            >
              {statusOptions.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Empty state for technician My Jobs */}
      {!isHomeowner && activeTab === 'mine' && filtered.length === 0 && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-16 text-center">
          <p className="font-display font-bold text-lg text-ink mb-2">No jobs yet</p>
          <p className="text-sm text-ink-2 mb-4">
            You haven't accepted any jobs yet. Browse open jobs to get started.
          </p>
          <button onClick={() => setActiveTab('browse')} className="btn-primary">
            Browse Open Jobs
          </button>
        </motion.div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader fullScreen={false} /></div>
      ) : filtered.length === 0 && (isHomeowner || activeTab === 'browse') ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-16 text-center">
          <p className="font-display font-bold text-lg text-ink mb-2">No jobs found</p>
          <p className="text-sm text-ink-2 mb-4">Try changing your filters or search term.</p>
          {isHomeowner && (
            <Link to="/jobs/new" className="btn-primary inline-flex items-center gap-2">
              <HiPlus className="w-4 h-4" /> Post a Job
            </Link>
          )}
        </motion.div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((job, i) => <JobCard key={job._id} job={job} index={i} />)}
        </div>
      ) : null}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-secondary px-4 py-2 text-sm disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="text-sm text-ink-2 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-secondary px-4 py-2 text-sm disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default JobList;
