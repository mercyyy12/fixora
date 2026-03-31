import React from 'react';
import { FiSave, FiSettings, FiGlobe, FiLock, FiTerminal } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const AdminSettings = () => {
  const categories = [
    'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'HVAC', 
    'Cleaning', 'Roofing', 'Flooring', 'Landscaping'
  ];

  const handleCopyKey = () => {
    navigator.clipboard.writeText('FIXORA_ADMIN_SECRET_2026')
      .then(() => toast.success('Registration key copied to clipboard!'))
      .catch(() => toast.error('Failed to copy key'));
  };

  return (
    <div className="space-y-8 font-body max-w-4xl">
      <div className="card p-8 space-y-8">
        <div className="flex items-center justify-between border-b border-outline pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand/10 text-brand rounded-2xl">
              <FiGlobe />
            </div>
            <div>
              <h4 className="font-display font-bold text-xl text-ink italic">Platform Configuration</h4>
              <p className="text-sm text-ink-3">Manage global application rules and parameters</p>
            </div>
          </div>
          <button className="btn-primary flex items-center gap-2 px-6">
            <FiSave /> Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="label">Base Currency Symbol</label>
            <input type="text" value="Rs." className="input" disabled />
          </div>
          <div className="space-y-4">
            <label className="label">Verification Required</label>
            <div className="flex items-center gap-4 py-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
              </label>
              <span className="text-sm font-semibold text-ink-2">Enforce Technician Verification</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-outline">
          <label className="label">Service Categories</label>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <div key={cat} className="px-3 py-1.5 bg-canvas-alt border border-outline rounded-lg text-xs font-bold text-ink-2 flex items-center gap-2 group hover:border-brand transition-all">
                {cat}
                <button className="text-ink-3 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">×</button>
              </div>
            ))}
            <button className="px-3 py-1.5 border border-dashed border-outline rounded-lg text-xs font-bold text-brand hover:bg-brand/5 transition-all">
              + Add New
            </button>
          </div>
        </div>
      </div>

      <div className="card p-8 border-l-4 border-l-purple-500">
        <div className="flex items-center gap-4 mb-6">
           <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
              <FiLock />
            </div>
            <div>
              <h4 className="font-display font-bold text-xl text-ink">Access & Security</h4>
              <p className="text-sm text-ink-3">Manage administrative permissions</p>
            </div>
        </div>
        
        <div className="space-y-4">
           <label className="label">Admin Registration Key</label>
           <div className="p-3 bg-slate-900 rounded-xl flex items-center justify-between text-slate-400 font-mono text-sm border border-slate-800">
              <div className="flex items-center gap-3">
                <FiTerminal />
                <span>••••••••••••••••</span>
              </div>
              <button 
                onClick={handleCopyKey}
                className="text-xs text-brand hover:underline font-bold"
              >
                Copy Key
              </button>
           </div>
           <p className="text-[10px] text-ink-3">This key is required for registering new administrator accounts. Keep it secure.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
