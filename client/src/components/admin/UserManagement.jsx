import React, { useState, useEffect } from 'react';
import { FiSearch, FiUserX, FiUserCheck, FiMail, FiShield, FiFilter } from 'react-icons/fi';
import API from '../../utils/api';
import { toast } from 'react-hot-toast';
import UserRatingsModal from './UserRatingsModal';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedUserForRatings, setSelectedUserForRatings] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/users');
      setUsers(data || []);
    } catch (err) {
      toast.error('Failed to load user database');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (id, isCurrentlyBlocked) => {
    const action = isCurrentlyBlocked ? 'unblock' : 'block';
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;
    
    try {
      await API.patch(`/users/${id}`, { isBlocked: !isCurrentlyBlocked });
      toast.success(`User ${action}ed successfully`);
      fetchUsers();
    } catch (err) {
      toast.error(`Failed to ${action} user`);
    }
  };

  const handleVerifyTech = async (id, isCurrentlyVerified) => {
    try {
      await API.patch(`/users/${id}`, { isVerified: !isCurrentlyVerified });
      toast.success(isCurrentlyVerified ? 'Verification removed' : 'Technician verified');
      fetchUsers();
    } catch (err) {
      toast.error('Verification update failed');
    }
  };

  const filteredUsers = (users || []).filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                         u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) return <div className="text-center py-20 text-ink-3">Accessing user administration interface...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-surface p-4 rounded-xl border border-outline shadow-sm font-body">
        <div className="relative w-96">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
          <input 
            type="text" 
            placeholder="Search by identity or contact..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10 h-10 text-sm"
          />
        </div>
        <div className="flex gap-2">
           <div className="relative">
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input h-10 pl-10 pr-8 text-xs appearance-none"
            >
              <option value="All">All Roles</option>
              <option value="homeowner">Homeowners</option>
              <option value="technician">Technicians</option>
              <option value="admin">Administrators</option>
            </select>
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-alt border-b border-outline">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-ink-3">User Profile</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-ink-3">Role / Access</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-ink-3">Security Status</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-ink-3 text-right">Administrative Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? filteredUsers.map((user) => (
              <tr key={user._id} className="border-b border-outline hover:bg-canvas-alt transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-ink">{user.name}</p>
                      <p className="text-xs text-ink-3 flex items-center gap-1">
                        <FiMail className="text-[10px]" /> {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                    user.role === 'admin' ? 'bg-purple-50 text-purple-700' : 
                    user.role === 'technician' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${user.isBlocked ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                    <span className={`text-xs font-bold ${user.isBlocked ? 'text-red-600' : 'text-emerald-600'}`}>
                      {user.isBlocked ? 'ACCESS DENIED' : 'ACTIVE'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => setSelectedUserForRatings(user)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold btn-secondary text-ink-2 hover:bg-brand/10 hover:text-brand transition-all"
                      title="View Ratings"
                    >
                      Ratings
                    </button>
                    {user.role === 'technician' && (
                      <button 
                        onClick={() => handleVerifyTech(user._id, user.isVerified)}
                        className={`p-2 rounded-lg transition-all ${user.isVerified ? 'text-emerald-500 hover:bg-emerald-50' : 'text-ink-3 hover:bg-surface'}`}
                        title={user.isVerified ? 'Verified' : 'Verify Technician'}
                      >
                        <FiShield />
                      </button>
                    )}
                    <button 
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${user.isBlocked ? 'bg-red-500 text-white shadow-md' : 'btn-secondary text-red-500 hover:bg-red-50'}`} 
                      title={user.isBlocked ? 'Unblock User' : 'Revoke Access'}
                      onClick={() => handleBlockUser(user._id, user.isBlocked)}
                    >
                      {user.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-ink-3 text-xs">
                  No comprehensive matches found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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

export default UserManagement;
