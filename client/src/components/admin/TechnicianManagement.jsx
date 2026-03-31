import React, { useState, useEffect } from 'react';
import { FiCheck, FiStar, FiShield, FiUserX, FiUserCheck, FiFilter } from 'react-icons/fi';
import API from '../../utils/api';
import { toast } from 'react-hot-toast';
import UserRatingsModal from './UserRatingsModal';

const TechnicianManagement = () => {
  const [techs, setTechs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedUserForRatings, setSelectedUserForRatings] = useState(null);

  useEffect(() => {
    fetchTechs();
  }, []);

  const fetchTechs = async () => {
    try {
      const { data } = await API.get('/users');
      setTechs(data.filter(u => u.role === 'technician') || []);
    } catch (err) {
      toast.error('Failed to load professional database');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, status) => {
    try {
      await API.patch(`/users/${id}`, { isVerified: status });
      toast.success(status ? 'Verification approved' : 'Verification revoked');
      fetchTechs();
    } catch (err) {
      toast.error('Verification update failed');
    }
  };

  const handleBlock = async (id, isBlocked) => {
    const action = isBlocked ? 'unblock' : 'block';
    try {
      await API.patch(`/users/${id}`, { isBlocked: !isBlocked });
      toast.success(`Technician ${action}ed`);
      fetchTechs();
    } catch (err) {
      toast.error(`Failed to ${action} technician`);
    }
  };

  const filteredTechs = techs.filter(t => {
    if (filter === 'Verified') return t.isVerified;
    if (filter === 'Pending') return !t.isVerified;
    if (filter === 'Blocked') return t.isBlocked;
    return true;
  });

  if (loading) return <div className="text-center py-20 text-ink-3">Synchronizing professional directory...</div>;

  return (
    <div className="space-y-6 font-body">
      <div className="flex items-center justify-between bg-surface p-4 rounded-xl border border-outline shadow-sm">
        <h3 className="text-sm font-bold text-ink flex items-center gap-2">
          <FiShield className="text-brand" /> 
          Technician Oversight
        </h3>
        <div className="relative">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input h-10 pl-10 pr-8 text-xs appearance-none"
          >
            <option value="All">All Professionals</option>
            <option value="Verified">Verified Only</option>
            <option value="Pending">Pending Verification</option>
            <option value="Blocked">Blocked</option>
          </select>
          <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTechs.length > 0 ? filteredTechs.map((tech) => (
          <div key={tech._id} className={`card p-6 flex flex-col items-center text-center relative overflow-hidden border-t-4 ${tech.isBlocked ? 'border-t-red-500' : tech.isVerified ? 'border-t-emerald-500' : 'border-t-amber-500'}`}>
            <div className="w-16 h-16 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-2xl text-brand font-bold mb-4">
              {tech.name.charAt(0)}
            </div>
            
            <h4 className="font-bold text-ink">{tech.name}</h4>
            <p className="text-[10px] text-ink-3 uppercase font-bold tracking-widest mb-4">
              {tech.skills?.[0] || 'General Maintenance'}
            </p>
            
            <div className="flex gap-4 mb-6 w-full">
              <div className="flex-1 bg-canvas-alt p-2 rounded-xl border border-outline">
                <p className="text-[9px] text-ink-3 uppercase font-bold">Exp</p>
                <p className="text-xs font-bold text-ink">{tech.experience || 0} Y</p>
              </div>
              <div className="flex-1 bg-canvas-alt p-2 rounded-xl border border-outline">
                <p className="text-[9px] text-ink-3 uppercase font-bold">Rating</p>
                <div className="flex items-center justify-center gap-1">
                  <FiStar className="text-amber-500 fill-amber-500 text-[10px]" />
                  <p className="text-xs font-bold text-ink">{tech.rating?.average?.toFixed(1) || '0.0'}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full mt-auto">
              <button 
                onClick={() => setSelectedUserForRatings(tech)}
                className="flex-[0.8] btn-secondary py-2 text-[10px] uppercase font-bold text-ink-2 hover:text-brand shadow-sm"
                title="View Ratings"
              >
                Ratings
              </button>
              {!tech.isVerified ? (
                <button 
                  onClick={() => handleVerify(tech._id, true)}
                  className="flex-[1.2] btn-primary py-2 text-[10px] uppercase font-bold flex items-center justify-center gap-1.5"
                >
                  <FiCheck /> Verify
                </button>
              ) : (
                <button 
                  onClick={() => handleVerify(tech._id, false)}
                  className="flex-[1.2] btn-secondary py-2 text-[10px] uppercase font-bold text-amber-600 hover:bg-amber-50"
                >
                  Revoke
                </button>
              )}
              <button 
                onClick={() => handleBlock(tech._id, tech.isBlocked)}
                className={`flex-1 py-2 rounded-xl text-[10px] uppercase font-bold transition-all shadow-sm ${tech.isBlocked ? 'bg-red-600 text-white shadow-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'}`}
                title={tech.isBlocked ? 'Unblock Access' : 'Block Access'}
              >
                {tech.isBlocked ? 'Unblock' : 'Block'}
              </button>
            </div>
          </div>
        )) : (
          <div className="col-span-full card p-20 text-center text-ink-3 text-xs">
            No technicians matching the selected criteria.
          </div>
        )}
      </div>

      {selectedUserForRatings && (
        <UserRatingsModal 
          user={selectedUserForRatings} 
          onClose={() => setSelectedUserForRatings(null)} 
        />
      )}
    </div>
  );
};

export default TechnicianManagement;
