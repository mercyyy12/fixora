import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiTool, 
  FiStar, 
  FiAlertCircle, 
  FiSettings, 
  FiPieChart, 
  FiLogOut,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiMoreVertical
} from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Admin Components
import StatsOverview from '../components/admin/StatsOverview';
import UserManagement from '../components/admin/UserManagement';
import JobManagement from '../components/admin/JobManagement';
import TechnicianManagement from '../components/admin/TechnicianManagement';
import ReportSystem from '../components/admin/ReportSystem';
import AdminSettings from '../components/admin/AdminSettings';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path === 'admin-fixora-dashboard') {
      setActiveTab('dashboard');
    } else {
      setActiveTab(path);
    }
  }, [location]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiHome />, path: '' },
    { id: 'users', label: 'User Management', icon: <FiUsers />, path: 'users' },
    { id: 'jobs', label: 'Job Management', icon: <FiTool />, path: 'jobs' },
    { id: 'technicians', label: 'Technicians', icon: <FiCheckCircle />, path: 'technicians' },
    { id: 'reports', label: 'Reports & Issues', icon: <FiAlertCircle />, path: 'reports' },
    { id: 'settings', label: 'System Settings', icon: <FiSettings />, path: 'settings' },
  ];

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-outline flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-outline">
          <h1 className="text-xl font-display font-bold text-brand flex items-center gap-2">
            <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center">
              <FiSettings className="text-brand w-5 h-5" />
            </div>
            Fixora Admin
          </h1>
          <p className="text-xs text-ink-3 mt-1 uppercase tracking-widest font-semibold">System Control</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path === '' ? '/admin-fixora-dashboard' : `/admin-fixora-dashboard/${item.path}`}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === item.id 
                  ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                  : 'text-ink-2 hover:bg-surface-alt hover:text-ink'
              }`}
            >
              <span className={`text-lg ${activeTab === item.id ? 'text-white' : 'text-ink-3 group-hover:text-brand'}`}>
                {item.icon}
              </span>
              <span className="font-semibold text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-outline">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 w-full px-4 py-3 text-ink-2 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 font-semibold text-sm"
          >
            <FiLogOut />
            Exit Admin
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        <header className="h-16 bg-surface border-b border-outline flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-bold text-ink flex items-center gap-2 capitalize">
            {activeTab.replace('-', ' ')}
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
              <input 
                type="text" 
                placeholder="Global Search..." 
                className="pl-10 pr-4 py-1.5 bg-canvas border border-outline rounded-lg text-sm focus:ring-2 focus:ring-brand outline-none transition-all w-64"
              />
            </div>
            <div className="w-8 h-8 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-bold text-xs">
              AD
            </div>
          </div>
        </header>

        <div className="p-8 pb-16">
          <Routes>
            <Route path="/" element={<StatsOverview />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="jobs" element={<JobManagement />} />
            <Route path="technicians" element={<TechnicianManagement />} />
            <Route path="reports" element={<ReportSystem />} />
            <Route path="settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
