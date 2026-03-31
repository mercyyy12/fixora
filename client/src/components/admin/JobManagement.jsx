import React, { useState, useEffect } from 'react';
import { FiSearch, FiTrash2, FiEye, FiFilter } from 'react-icons/fi';
import API from '../../utils/api'; // Use authenticated API utility
import { toast } from 'react-hot-toast';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await API.get('/jobs');
      setJobs(data.jobs || []);
    } catch (err) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job record?')) return;
    try {
      await API.delete(`/jobs/${id}`);
      toast.success('Job record deleted');
      fetchJobs();
    } catch (err) {
      toast.error('Failed to remove job');
    }
  };

  const filteredJobs = jobs.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(search.toLowerCase()) || 
                         j.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || j.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="text-center py-20 text-ink-3">Accessing job database...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-surface p-4 rounded-xl border border-outline shadow-sm font-body">
        <div className="relative w-96">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
          <input 
            type="text" 
            placeholder="Search by title or specialty..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10 h-10 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input h-10 pl-10 pr-8 text-xs appearance-none"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-alt border-b border-outline">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-ink-3">Job Details</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-ink-3">Category</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-ink-3">Budget</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-ink-3">Status</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-ink-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.length > 0 ? filteredJobs.map((job) => (
              <tr key={job._id} className="border-b border-outline hover:bg-canvas-alt transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-ink">{job.title}</p>
                    <p className="text-xs text-ink-3 mt-0.5 line-clamp-1">{job.description}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-ink-2 font-medium">
                  {job.category}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-ink">
                  Rs. {job.budget?.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                    job.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                    job.status === 'Open' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-surface rounded-lg text-ink-3 hover:text-brand transition-all">
                      <FiEye />
                    </button>
                    <button 
                      className="p-2 hover:bg-red-50 rounded-lg text-ink-3 hover:text-red-500 transition-all"
                      onClick={() => handleDeleteJob(job._id)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-ink-3 text-xs">
                  No records found matching current parameters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobManagement;
