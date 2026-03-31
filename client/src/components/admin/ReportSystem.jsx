import React, { useState, useEffect } from 'react';
import { FiFlag, FiTrash2, FiMessageSquare, FiCheck, FiFilter } from 'react-icons/fi';
import API from '../../utils/api';
import { toast } from 'react-hot-toast';

const ReportSystem = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data } = await API.get('/reports');
      setReports(data.data || []);
    } catch (err) {
      toast.error('Failed to load platform reports');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      if (status === 'Deleted') {
        if (!window.confirm('Permanently remove this report record?')) return;
        await API.delete(`/reports/${id}`);
        toast.success('Report record removed');
      } else {
        await API.put(`/reports/${id}`, { status });
        toast.success(`Report status updated to ${status}`);
      }
      fetchReports();
    } catch (err) {
      toast.error('Failed to modify report status');
    }
  };

  const filteredReports = [...reports].sort((a,b) => {
    // Sort logic: Pending first, then Resolved, then others
    const order = { 'Pending': 0, 'Resolved': 1, 'Dismissed': 2 };
    return (order[a.status] ?? 3) - (order[b.status] ?? 3);
  }).filter(r => statusFilter === 'All' || r.status === statusFilter);

  if (loading) return <div className="text-center py-20 text-ink-3">Analyzing platform security reports...</div>;

  return (
    <div className="space-y-6 font-body">
      <div className="flex items-center justify-between bg-surface p-4 rounded-xl border border-outline shadow-sm">
        <div className="flex items-center gap-2">
           <FiFlag className="text-red-500" />
           <span className="text-sm font-bold text-ink">Platform Moderation Hub</span>
        </div>
        <div className="relative">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input h-10 pl-10 pr-8 text-xs appearance-none"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Unresolved</option>
            <option value="Resolved">Resolved</option>
            <option value="Dismissed">Dismissed</option>
          </select>
          <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredReports.length > 0 ? filteredReports.map((report) => (
          <div key={report._id} className="card p-5 flex flex-col md:flex-row items-start justify-between border-l-4 border-l-red-500 shadow-sm gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h4 className="font-bold text-ink">{report.reason}</h4>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  report.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 
                  report.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  {report.status}
                </span>
              </div>
              <p className="text-[11px] text-ink-3 mt-1.5 uppercase font-semibold flex items-center gap-2">
                FROM: <span className="text-ink-2">{report.reporter?.name}</span> 
                <span className="text-slate-300">|</span> 
                TARGET: <span className="text-brand">{report.reportedUser?.name} ({report.reportedUser?.role})</span>
              </p>
              <div className="mt-4 bg-canvas-alt p-4 rounded-xl border border-outline border-dashed text-sm text-ink-2">
                "{report.description}"
              </div>
            </div>
            
            <div className="flex gap-2 min-w-[120px]">
              {report.status === 'Pending' && (
                <button 
                  onClick={() => handleUpdateStatus(report._id, 'Resolved')}
                  className="flex-1 btn-secondary py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 border-emerald-100 text-emerald-600 hover:bg-emerald-50"
                  title="Mark as Resolved"
                >
                  <FiCheck className="w-4 h-4" /> Resolve
                </button>
              )}
              <button 
                onClick={() => handleUpdateStatus(report._id, 'Deleted')}
                className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all flex items-center justify-center"
                title="Remove Record"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )) : (
          <div className="card p-20 text-center text-ink-3 italic text-sm">
            No moderation reports requiring attention.
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportSystem;
