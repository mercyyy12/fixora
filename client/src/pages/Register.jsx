import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { HiBriefcase, HiEye, HiEyeOff, HiLockClosed, HiMail, HiPhone, HiUser, HiHome, HiWrench, HiShieldCheck } from 'react-icons/hi';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SKILL_OPTIONS = ['Plumbing', 'Electrical', 'Carpentry', 'Painting', 'HVAC', 'Cleaning', 'Roofing', 'Flooring', 'Landscaping', 'General Repair'];

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const urlRole = searchParams.get('role');
    const defaultRole = ['technician', 'admin'].includes(urlRole) ? urlRole : 'homeowner';

    const [form, setForm] = useState({
        name: '', email: '', password: '', confirmPassword: '',
        role: defaultRole, phone: '', bio: '', experience: '',
        skills: [], adminSecret: '',
    });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const toggleSkill = (skill) => {
        setForm((prev) => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter((s) => s !== skill)
                : [...prev.skills, skill],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) return toast.error('Please fill in all required fields');
        if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
        if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
        if (form.role === 'technician' && form.skills.length === 0) return toast.error('Please select at least one skill');
        if (form.role === 'admin' && !form.adminSecret) return toast.error('Admin Secret Key is required');

        setLoading(true);
        try {
            await register({
                name: form.name,
                email: form.email,
                password: form.password,
                role: form.role,
                phone: form.phone,
                bio: form.bio,
                experience: form.experience ? Number(form.experience) : 0,
                skills: form.skills,
                adminSecret: form.adminSecret,
            });
            toast.success('Account created! Welcome to Fixora');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const isTech = form.role === 'technician';

    return (
        <div className="min-h-screen bg-canvas dark:bg-gray-950 flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="w-9 h-9 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center shadow">
                            <span className="text-white font-display font-bold">F</span>
                        </div>
                        <span className="font-display font-bold text-2xl text-ink">
                            Fix<span className="text-brand-500">ora</span>
                        </span>
                    </Link>
                    <h1 className="font-display font-bold text-2xl text-ink">Create your account</h1>
                    <p className="text-ink-2 mt-1 text-sm">Join Fixora today</p>
                </div>

                <div className="card p-8">
                    {/* Role toggle */}
                    {/* Show role toggle only for non-admin registrations */}
                    {form.role !== 'admin' ? (
                        <div className="flex bg-canvas-alt rounded-xl p-1 mb-6">
                            {['homeowner', 'technician'].map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setForm({ ...form, role: r })}
                                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 capitalize ${form.role === r
                                        ? 'bg-white dark:bg-gray-700 text-brand hover:text-brand-hover shadow-sm'
                                        : 'text-ink-2 hover:text-ink-2 dark:hover:text-gray-200'
                                        }`}
                                >
                                    {r === 'homeowner' ? (
                                        <span className="flex items-center justify-center gap-1.5 transform transition-transform duration-200 group-hover:scale-105">
                                            <HiHome className="w-4 h-4" /> Homeowner
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-1.5 transform transition-transform duration-200 group-hover:scale-105">
                                            <HiWrench className="w-4 h-4" /> Technician
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 mb-6 p-3 bg-canvas-alt rounded-xl">
                            <HiShieldCheck className="w-6 h-6 text-brand-500" />
                            <div>
                                <div className="text-sm font-semibold text-ink">Platform Administrator</div>
                                <div className="text-xs text-ink-3">Restricted access — requires secret key</div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Name */}
                            <div className="sm:col-span-2">
                                <label className="label">Full Name *</label>
                                <div className="relative">
                                    <HiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-3" />
                                    <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className="input pl-11" />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="sm:col-span-2">
                                <label className="label">Email *</label>
                                <div className="relative">
                                    <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-3" />
                                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="input pl-11" />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="label">Password *</label>
                                <div className="relative">
                                    <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-3" />
                                    <input
                                        type={showPw ? 'text' : 'password'}
                                        name="password" value={form.password} onChange={handleChange}
                                        placeholder="Min. 6 chars" className="input pl-11 pr-10"
                                    />
                                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3">
                                        {showPw ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm password */}
                            <div>
                                <label className="label">Confirm Password *</label>
                                <div className="relative">
                                    <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-3" />
                                    <input
                                        type="password"
                                        name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
                                        placeholder="Repeat password" className="input pl-11"
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="sm:col-span-2">
                                <label className="label">Phone (optional)</label>
                                <div className="relative">
                                    <HiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-3" />
                                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 555 000 0000" className="input pl-11" />
                                </div>
                            </div>
                        </div>

                        {/* Technician-only fields */}
                        <AnimatePresence>
                            {isTech && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-4 overflow-hidden"
                                >
                                    <div>
                                        <label className="label">Years of Experience</label>
                                        <div className="relative">
                                            <HiBriefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-3" />
                                            <input type="number" name="experience" value={form.experience} onChange={handleChange} placeholder="e.g. 5" min="0" max="50" className="input pl-11" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="label">Skills * <span className="font-normal text-ink-3">(select all that apply)</span></label>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {SKILL_OPTIONS.map((skill) => (
                                                <button
                                                    key={skill}
                                                    type="button"
                                                    onClick={() => toggleSkill(skill)}
                                                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${form.skills.includes(skill)
                                                        ? 'border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-500 line-through opacity-60'
                                                        : 'border-outline dark:border-gray-600 text-ink-2 hover:border-brand-400'
                                                        }`}
                                                >
                                                    {skill}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="label">Bio (optional)</label>
                                        <textarea
                                            name="bio" value={form.bio} onChange={handleChange}
                                            placeholder="Tell homeowners about your expertise…"
                                            rows={3}
                                            className="input resize-none"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Admin-only fields */}
                        <AnimatePresence>
                            {form.role === 'admin' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-4 overflow-hidden"
                                >
                                    <div>
                                        <label className="label">Admin Secret Key *</label>
                                        <div className="relative">
                                            <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-3" />
                                            <input
                                                type="password"
                                                name="adminSecret" value={form.adminSecret} onChange={handleChange}
                                                placeholder="Required for platform administrators" className="input pl-11"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileTap={{ scale: 0.98 }}
                            className="btn-primary w-full py-3 text-base mt-2"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                                        className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                                    Creating account…
                                </span>
                            ) : 'Create Account'}
                        </motion.button>
                    </form>
                </div>

                <p className="text-center text-sm text-ink-2 mt-5">
                    Already have an account?{' '}
                    <Link to="/login" className="text-brand hover:text-brand-hover font-semibold hover:underline">Sign in</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
