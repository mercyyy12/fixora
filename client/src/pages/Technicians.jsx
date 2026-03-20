import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HiSearch, HiRefresh } from 'react-icons/hi';
import API from '../utils/api';
import TechnicianCard from '../components/TechnicianCard';
import Loader from '../components/Loader';

const SKILLS = ['All','Plumbing','Electrical','Carpentry','Painting','HVAC','Cleaning','Roofing','Flooring','Landscaping','General Repair'];

const Technicians = () => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [skill, setSkill] = useState('All');

  const fetchTechnicians = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 20 });
      if (skill !== 'All') params.append('skill', skill);
      const { data } = await API.get(`/users/technicians?${params}`);
      setTechnicians(data.technicians);
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTechnicians(); }, [skill]);

  const filtered = search
    ? technicians.filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.skills?.some((s) => s.toLowerCase().includes(search.toLowerCase()))
      )
    : technicians;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="font-display font-bold text-2xl text-ink">Find Technicians</h1>
        <p className="text-sm text-ink-2 mt-0.5">Browse skilled local technicians for your repair jobs</p>
      </motion.div>

      {/* Filters */}
      <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or skill…"
            className="input pl-11"
          />
        </div>
        <select value={skill} onChange={(e) => setSkill(e.target.value)} className="input appearance-none min-w-[160px]">
          {SKILLS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button onClick={fetchTechnicians} className="btn-secondary p-2.5 flex-shrink-0" title="Refresh">
          <HiRefresh className="w-5 h-5" />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader fullScreen={false} /></div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-16 text-center">
          <p className="font-display font-bold text-ink mb-2">No technicians found</p>
          <p className="text-sm text-ink-2">Try adjusting your search or filter.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((tech, i) => <TechnicianCard key={tech._id} technician={tech} index={i} />)}
        </div>
      )}
    </div>
  );
};

export default Technicians;
