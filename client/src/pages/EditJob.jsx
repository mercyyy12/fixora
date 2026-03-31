import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiPhotograph, HiLocationMarker,
  HiX, HiCursorClick, HiCheckCircle, HiRefresh, HiArrowLeft, HiChevronDown,
} from 'react-icons/hi';
import API from '../utils/api';
import LeafletMap from '../components/LeafletMap';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Plumbing','Electrical','Carpentry','Painting','HVAC',
  'Cleaning','Roofing','Flooring','Landscaping','General Repair','Other',
];

const buildCleanAddress = (data) => {
  const a = data.address || {};
  const parts = [
    a.road || a.pedestrian || a.footway,
    a.suburb || a.neighbourhood || a.quarter,
    a.city || a.town || a.village || a.municipality,
    a.state || a.county,
    a.country,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : data.display_name;
};

const reverseGeocode = async (lat, lng) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=18&addressdetails=1`,
    { headers: { 'Accept-Language': 'en' } }
  );
  if (!res.ok) throw new Error('Geocode failed');
  return res.json();
};

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const watchIdRef = useRef(null);

  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Existing images from DB
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages]   = useState([]);

  // New images selected by user
  const [newFiles, setNewFiles]     = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  const [form, setForm] = useState({
    title: '', description: '', category: '',
    address: '', lat: '', lng: '', budget: '',
  });

  const [locating, setLocating]       = useState(false);
  const [accuracy, setAccuracy]       = useState(null);
  const [locationSet, setLocationSet] = useState(false);

  const hasCoords = form.lat !== '' && form.lng !== '';

  // ── Load existing job data ───────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await API.get(`/jobs/${id}`);
        const job = data.job;

        if (job.status !== 'Open') {
          toast.error('Only open jobs can be edited');
          navigate(`/jobs/${id}`);
          return;
        }

        setForm({
          title:       job.title       || '',
          description: job.description || '',
          category:    job.category    || '',
          address:     job.location?.address || '',
          lat:         job.location?.lat?.toString() || '',
          lng:         job.location?.lng?.toString() || '',
          budget:      job.budget?.toString() || '',
        });

        setExistingImages(job.images || []);
        if (job.location?.lat) setLocationSet(true);
      } catch {
        toast.error('Could not load job');
        navigate('/jobs');
      } finally {
        setPageLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Remove an existing image (just marks it for removal — not sent to server)
  const removeExistingImage = (url) => {
    setExistingImages((prev) => prev.filter((u) => u !== url));
    setRemovedImages((prev) => [...prev, url]);
  };

  const stopWatch = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  // GPS re-detection
  const handleGetLocation = () => {
    if (!navigator.geolocation) return toast.error('Geolocation not supported');
    stopWatch();
    setLocating(true);
    setAccuracy(null);
    const toastId = toast.loading('Getting your location…', { duration: 20000 });
    const timeout = setTimeout(() => {
      stopWatch(); setLocating(false); toast.dismiss(toastId);
    }, 15000);

    watchIdRef.current = navigator.geolocation.watchPosition(
      async ({ coords: { latitude, longitude, accuracy: acc } }) => {
        setAccuracy(Math.round(acc));
        setForm((prev) => ({ ...prev, lat: latitude.toFixed(6), lng: longitude.toFixed(6) }));
        setLocationSet(true);

        if (acc <= 50) {
          stopWatch(); clearTimeout(timeout);
          setLocating(false); toast.dismiss(toastId);
          try {
            const gdata = await reverseGeocode(latitude, longitude);
            const addr  = buildCleanAddress(gdata);
            setForm((prev) => ({ ...prev, address: addr }));
            toast.success(`Location updated! ±${Math.round(acc)}m`);
          } catch {
            toast.success('Coordinates updated');
          }
        }
      },
      (err) => {
        stopWatch(); clearTimeout(timeout); setLocating(false); toast.dismiss(toastId);
        const msgs = { 1: 'Permission denied.', 2: 'Location unavailable.', 3: 'Timed out.' };
        toast.error(msgs[err.code] || 'Location failed');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // Map click/drag correction
  const handleMapPick = async (lat, lng) => {
    setForm((prev) => ({ ...prev, lat: lat.toFixed(6), lng: lng.toFixed(6) }));
    try {
      const gdata = await reverseGeocode(lat, lng);
      setForm((prev) => ({ ...prev, address: buildCleanAddress(gdata) }));
    } catch { /* silent */ }
  };

  const handleNewImages = (e) => {
    const total = existingImages.length + newFiles.length;
    const slots = Math.max(0, 5 - total);
    if (slots === 0) return toast.error('Maximum 5 photos allowed. Remove some first.');
    const files = Array.from(e.target.files).slice(0, slots);
    setNewFiles((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeNewImage = (idx) => {
    setNewFiles((prev)    => prev.filter((_, i) => i !== idx));
    setNewPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category || !form.address) {
      return toast.error('Please fill in all required fields');
    }

    const formData = new FormData();
    formData.append('title',       form.title);
    formData.append('description', form.description);
    formData.append('category',    form.category);
    formData.append('address',     form.address);
    formData.append('budget',      form.budget || '0');
    if (form.lat) formData.append('lat', form.lat);
    if (form.lng) formData.append('lng', form.lng);

    // Tell server whether to keep existing images
    // (we send the surviving URLs as a JSON array)
    formData.append('keepImages',      'true');
    formData.append('existingImages',  JSON.stringify(existingImages));

    // New image files
    newFiles.forEach((f) => formData.append('images', f));

    setSaving(true);
    try {
      await API.put(`/jobs/${id}/edit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Job updated successfully!');
      navigate(`/jobs/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update job');
    } finally {
      setSaving(false);
    }
  };

  if (pageLoading) return <Loader />;

  const totalImages = existingImages.length + newFiles.length;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

        {/* Header */}
        <div className="mb-6">
          <Link to={`/jobs/${id}`} className="text-sm text-ink-2 hover:text-brand-600 dark:hover:text-brand-400 mb-3 inline-flex items-center gap-1 transition-colors">
            <HiArrowLeft className="w-4 h-4" /> Back to Job
          </Link>
          <h1 className="font-display font-bold text-2xl text-ink">Edit Job</h1>
          <p className="text-sm text-ink-2 mt-0.5">
            You can only edit jobs that haven't been accepted yet.
          </p>
        </div>

        {/* Notice */}
        <div className="mb-5 flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">Editing an open job</p>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
              Once a technician accepts this job, it can no longer be edited. Make your changes now.
            </p>
          </div>
        </div>

        <div className="card p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Title */}
            <div>
              <label className="label">Job Title *</label>
              <input name="title" value={form.title} onChange={handleChange}
                placeholder="e.g. Fix leaking kitchen sink" className="input" />
            </div>

            {/* Category */}
            <div>
              <label className="label">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} className="input appearance-none">
                <option value="">Select a category…</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="label">Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange}
                placeholder="Describe the problem in detail…" rows={5} className="input resize-none" />
              <p className="text-xs text-ink-3 dark:text-ink-2 mt-1 text-right">
                {form.description.length}/2000
              </p>
            </div>

            {/* Location */}
            <div className="space-y-3">
              <label className="label">
                <HiLocationMarker className="inline w-4 h-4 mr-1 text-brand-500" />
                Location *
              </label>

              <input name="address" value={form.address} onChange={handleChange}
                placeholder="e.g. 123 Main St, Kathmandu" className="input" />

              {/* GPS button */}
              <motion.button
                type="button"
                onClick={handleGetLocation}
                disabled={locating}
                whileTap={{ scale: 0.97 }}
                className={`w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border-2 border-dashed font-semibold text-sm transition-all duration-200 ${
                  locationSet
                    ? 'border-brand bg-brand-50/50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300'
                    : 'border-outline dark:border-gray-600 bg-canvas-alt/50 text-ink-2 hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400'
                }`}
              >
                {locating ? (
                  <span className="flex items-center gap-2">
                    <motion.span animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-block w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full" />
                    {accuracy !== null ? `Improving… ±${accuracy}m` : 'Detecting…'}
                  </span>
                ) : locationSet ? (
                  <span className="flex items-center gap-2">
                    <HiCheckCircle className="w-5 h-5" />
                    {accuracy !== null ? `±${accuracy}m` : 'Location set'}
                    — {parseFloat(form.lat).toFixed(4)}, {parseFloat(form.lng).toFixed(4)}
                    <HiRefresh className="w-4 h-4 opacity-60" />
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <HiCursorClick className="w-5 h-5" /> Re-detect My Location (GPS)
                  </span>
                )}
              </motion.button>

              {/* Accuracy badge */}
              {locationSet && accuracy !== null && (
                <p className={`text-xs px-3 py-1.5 rounded-lg border ${
                  accuracy <= 20   ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' :
                  accuracy <= 100  ? 'border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' :
                                     'border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                }`}>
                  {accuracy <= 20  && 'Excellent accuracy'}
                  {accuracy > 20  && accuracy <= 100 && 'Moderate — drag the pin to fine-tune'}
                  {accuracy > 100 && 'Low accuracy — drag the pin to your exact location'}
                  {' '}(±{accuracy}m)
                </p>
              )}

              {/* Manual coords */}
              <details className="group">
                <summary className="text-xs text-ink-3 dark:text-ink-2 cursor-pointer hover:text-ink-2 dark:hover:text-gray-300 select-none flex items-center gap-1 list-none">
                  <HiChevronDown className="transition-transform group-open:rotate-180 inline-block w-4 h-4" />
                  Edit coordinates manually
                </summary>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="label text-xs">Latitude</label>
                    <input name="lat" type="number" step="any" value={form.lat}
                      onChange={(e) => { handleChange(e); setLocationSet(!!e.target.value); }}
                      placeholder="27.7172" className="input text-sm" />
                  </div>
                  <div>
                    <label className="label text-xs">Longitude</label>
                    <input name="lng" type="number" step="any" value={form.lng}
                      onChange={(e) => { handleChange(e); setLocationSet(!!e.target.value); }}
                      placeholder="85.3240" className="input text-sm" />
                  </div>
                </div>
              </details>

              {/* Interactive map */}
              <AnimatePresence>
                {hasCoords && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-1 rounded-xl overflow-hidden shadow-sm">
                      <LeafletMap
                        lat={parseFloat(form.lat)}
                        lng={parseFloat(form.lng)}
                        address={form.address || 'Job location'}
                        height={230}
                        interactive={true}
                        onLocationPick={handleMapPick}
                      />
                    </div>
                    <p className="text-xs text-center text-ink-3 dark:text-ink-2 mt-1.5">
                      Click map or drag pin to adjust location
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Budget */}
            <div>
              <label className="label">
                <span className="inline mr-1 text-emerald-500 font-bold">Rs.</span>
                Budget (optional)
              </label>
              <input name="budget" type="number" min="0" value={form.budget}
                onChange={handleChange} placeholder="0 = open to quotes" className="input" />
            </div>

            {/* Photos */}
            <div>
              <label className="label">
                <HiPhotograph className="inline w-4 h-4 mr-1" />
                Photos ({totalImages}/5)
              </label>

              {/* Existing images */}
              {existingImages.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-ink-2 mb-2">Current photos — click X to remove</p>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {existingImages.map((url, i) => (
                      <div key={i} className="relative group">
                        <img src={url} alt="" className="w-full h-20 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(url)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                        >
                          <HiX className="w-3 h-3" />
                        </button>
                        {/* "existing" badge */}
                        <span className="absolute bottom-1 left-1 text-[9px] bg-black/50 text-white px-1 rounded">saved</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload new images */}
              {totalImages < 5 && (
                <>
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-outline dark:border-gray-600 rounded-xl cursor-pointer hover:border-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 transition-colors bg-canvas-alt/50">
                    <HiPhotograph className="w-6 h-6 text-ink-3 mb-1" />
                    <span className="text-sm text-ink-2">
                      Add more photos ({5 - totalImages} slot{5 - totalImages !== 1 ? 's' : ''} left)
                    </span>
                    <input type="file" multiple accept="image/*" onChange={handleNewImages} className="hidden" />
                  </label>

                  {/* New image previews */}
                  {newPreviews.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
                      {newPreviews.map((src, i) => (
                        <div key={i} className="relative group">
                          <img src={src} alt="" className="w-full h-20 object-cover rounded-lg opacity-90 ring-2 ring-brand-400" />
                          <button type="button" onClick={() => removeNewImage(i)}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">
                            <HiX className="w-3 h-3" />
                          </button>
                          <span className="absolute bottom-1 left-1 text-[9px] bg-brand/100/80 text-white px-1 rounded">new</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {totalImages >= 5 && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  Maximum 5 photos reached. Remove existing ones to add new.
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Link to={`/jobs/${id}`} className="btn-secondary flex-1 text-center">
                Cancel
              </Link>
              <motion.button type="submit" disabled={saving} whileTap={{ scale: 0.97 }} className="btn-primary flex-1">
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                    Saving…
                  </span>
                ) : 'Save Changes'}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default EditJob;
