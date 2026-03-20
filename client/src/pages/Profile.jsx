import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiCamera, HiPencil, HiCheck, HiX, HiStar, HiBriefcase, HiPhone } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';

const SKILL_OPTIONS = ['Plumbing','Electrical','Carpentry','Painting','HVAC','Cleaning','Roofing','Flooring','Landscaping','General Repair'];

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    experience: user?.experience || '',
    skills: user?.skills || [],
    address: user?.location?.address || '',
    isAvailable: user?.isAvailable ?? true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const toggleSkill = (skill) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data } = await API.put('/users/profile', form);
      updateUser(data.user);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('profileImage', file);
    try {
      const { data } = await API.post('/users/profile/image', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser(data.user);
      toast.success('Profile photo updated!');
    } catch {
      toast.error('Image upload failed');
    }
  };

  const isTech = user?.role === 'technician';
  const isAdmin = user?.role === 'admin';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display font-bold text-2xl text-ink mb-6">My Profile</h1>

        <div className="card p-6 md:p-8">
          {/* Avatar section */}
          <div className="flex items-start gap-5 mb-8">
            <div className="relative flex-shrink-0">
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="w-20 h-20 rounded-2xl object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-3xl font-bold">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
              )}
              <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand/100 hover:bg-brand-600 text-white rounded-full flex items-center justify-center cursor-pointer shadow-md transition-colors">
                <HiCamera className="w-4 h-4" />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display font-bold text-xl text-ink">{user?.name}</h2>
                <span className="badge bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 capitalize">
                  {user?.role}
                </span>
                {isAdmin && (
                  <span className="badge bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                    🛡️ System Administrator
                  </span>
                )}
                {isTech && (
                  <span className={`badge ${user.isAvailable ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {user.isAvailable ? '● Available' : '○ Unavailable'}
                  </span>
                )}
              </div>
              <p className="text-sm text-ink-2 mt-1">{user?.email}</p>
              {isTech && user?.rating?.count > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <StarRating value={Math.round(user.rating.average)} readonly size="sm" />
                  <span className="text-sm text-ink-2">
                    {user.rating.average.toFixed(1)} ({user.rating.count} review{user.rating.count !== 1 ? 's' : ''})
                  </span>
                </div>
              )}
            </div>

            {!editing ? (
              <button onClick={() => setEditing(true)} className="btn-secondary flex items-center gap-2 self-start">
                <HiPencil className="w-4 h-4" /> Edit
              </button>
            ) : (
              <div className="flex gap-2 self-start">
                <button onClick={handleSave} disabled={loading} className="btn-primary flex items-center gap-1.5 py-2 px-3">
                  <HiCheck className="w-4 h-4" /> {loading ? 'Saving…' : 'Save'}
                </button>
                <button onClick={() => setEditing(false)} className="btn-secondary p-2">
                  <HiX className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Form fields */}
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="label">Full Name</label>
                {editing ? (
                  <input name="name" value={form.name} onChange={handleChange} className="input" />
                ) : (
                  <p className="text-ink-2 py-2">{user?.name || '—'}</p>
                )}
              </div>
              <div>
                <label className="label"><HiPhone className="inline w-4 h-4 mr-1" />Phone</label>
                {editing ? (
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 555 000 0000" className="input" />
                ) : (
                  <p className="text-ink-2 py-2">{user?.phone || '—'}</p>
                )}
              </div>
            </div>

            {!isAdmin && (
              <div>
                <label className="label">Location</label>
                {editing ? (
                  <input name="address" value={form.address} onChange={handleChange} placeholder="Your city or neighborhood" className="input" />
                ) : (
                  <p className="text-ink-2 py-2">{user?.location?.address || '—'}</p>
                )}
              </div>
            )}

            {/* Technician-only fields */}
            {isTech && (
              <>
                <div>
                  <label className="label"><HiBriefcase className="inline w-4 h-4 mr-1" />Bio</label>
                  {editing ? (
                    <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} placeholder="Tell clients about your expertise…" className="input resize-none" />
                  ) : (
                    <p className="text-ink-2 py-2">{user?.bio || '—'}</p>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="label">Years of Experience</label>
                    {editing ? (
                      <input type="number" name="experience" value={form.experience} onChange={handleChange} min="0" max="50" className="input" />
                    ) : (
                      <p className="text-ink-2 py-2">
                        {user?.experience ? `${user.experience} year${user.experience !== 1 ? 's' : ''}` : '—'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="label">Availability</label>
                    {editing ? (
                      <label className="flex items-center gap-2 mt-2 cursor-pointer">
                        <input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={handleChange} className="w-4 h-4 accent-brand-500" />
                        <span className="text-sm text-ink-2">Available for new jobs</span>
                      </label>
                    ) : (
                      <p className="text-ink-2 py-2">
                        {user?.isAvailable ? '✅ Available' : '❌ Unavailable'}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="label">Skills</label>
                  {editing ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {SKILL_OPTIONS.map((skill) => (
                        <button key={skill} type="button" onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                            form.skills.includes(skill)
                              ? 'bg-brand/100 border-brand-500 text-white'
                              : 'border-outline dark:border-gray-600 text-ink-2 hover:border-brand-400'
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {user?.skills?.length > 0
                        ? user.skills.map((s) => (
                            <span key={s} className="px-3 py-1 bg-brand/10 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-full text-sm font-medium">
                              {s}
                            </span>
                          ))
                        : <p className="text-ink-2 py-1">No skills listed</p>}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
