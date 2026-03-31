import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiPhotograph, HiLocationMarker,
  HiX, HiCursorClick, HiCheckCircle, HiRefresh, HiChevronDown,
} from 'react-icons/hi';
import API from '../utils/api';
import LeafletMap from '../components/LeafletMap';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Plumbing','Electrical','Carpentry','Painting','HVAC',
  'Cleaning','Roofing','Flooring','Landscaping','General Repair','Other',
];

// Build a clean readable address from Nominatim response
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

// Reverse-geocode lat/lng → human address via Nominatim (free, no key)
const reverseGeocode = async (lat, lng) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=18&addressdetails=1`,
    { headers: { 'Accept-Language': 'en' } }
  );
  if (!res.ok) throw new Error('Geocode failed');
  return res.json();
};

const CreateJob = () => {
  const navigate = useNavigate();
  const watchIdRef = useRef(null);

  const [form, setForm] = useState({
    title: '', description: '', category: '',
    address: '', lat: '', lng: '', budget: '',
  });

  const [images, setImages]   = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading]   = useState(false);

  // Location state
  const [locating, setLocating]     = useState(false);
  const [accuracy, setAccuracy]     = useState(null);   // metres
  const [locationSet, setLocationSet] = useState(false);
  const [showMap, setShowMap]       = useState(false);

  const hasCoords = form.lat !== '' && form.lng !== '';

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Stop any running watchPosition
  const stopWatch = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  // ── GPS with progressive accuracy improvement ────────────────────────────
  // watchPosition keeps refining — we stop once accuracy < 50m or after 15s
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      return toast.error('Geolocation is not supported by your browser');
    }

    stopWatch(); // clear any previous watch
    setLocating(true);
    setAccuracy(null);

    const toastId = toast.loading('Getting your location…', { duration: 20000 });

    // Timeout safety: stop after 15 seconds regardless
    const timeout = setTimeout(() => {
      stopWatch();
      setLocating(false);
      toast.dismiss(toastId);
      if (!locationSet) toast.error('Could not get precise location. Try again or pin manually on the map.');
    }, 15000);

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude, accuracy: acc } = pos.coords;
        setAccuracy(Math.round(acc));

        // Update coords live as accuracy improves
        setForm((prev) => ({
          ...prev,
          lat: latitude.toFixed(6),
          lng: longitude.toFixed(6),
        }));
        setLocationSet(true);
        setShowMap(true);

        // Good enough accuracy (≤ 50m) or very high accuracy — stop watching
        if (acc <= 50) {
          stopWatch();
          clearTimeout(timeout);
          setLocating(false);
          toast.dismiss(toastId);

          // Reverse-geocode the accurate position
          try {
            const data = await reverseGeocode(latitude, longitude);
            const cleanAddr = buildCleanAddress(data);
            setForm((prev) => ({
              ...prev,
              lat: latitude.toFixed(6),
              lng: longitude.toFixed(6),
              address: prev.address.trim() === '' ? cleanAddr : prev.address,
            }));
            toast.success(`Location found! Accuracy: ±${Math.round(acc)}m`);
          } catch {
            toast.success(`Coordinates set. Please verify the address.`);
          }
        }
        // else keep watching for a better fix — UI shows live accuracy
      },
      (err) => {
        stopWatch();
        clearTimeout(timeout);
        setLocating(false);
        toast.dismiss(toastId);
        const messages = {
          1: 'Permission denied. Please allow location access in browser settings.',
          2: 'Location unavailable. Try again or pin on the map manually.',
          3: 'Location timed out. Try again.',
        };
        toast.error(messages[err.code] || 'Failed to get location');
      },
      {
        enableHighAccuracy: true,  // use GPS chip if available
        timeout: 15000,
        maximumAge: 0,             // never use cached position
      }
    );
  };

  // ── Map click/drag — user manually corrects the pin ─────────────────────
  const handleMapPick = async (lat, lng) => {
    setForm((prev) => ({
      ...prev,
      lat: lat.toFixed(6),
      lng: lng.toFixed(6),
    }));
    setLocationSet(true);

    try {
      const data = await reverseGeocode(lat, lng);
      const cleanAddr = buildCleanAddress(data);
      setForm((prev) => ({ ...prev, address: cleanAddr }));
    } catch {
      // address update fails silently — user can type it
    }
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category || !form.address) {
      return toast.error('Please fill in all required fields');
    }

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v !== '') formData.append(k, v); });
    images.forEach((img) => formData.append('images', img));

    setLoading(true);
    try {
      const { data } = await API.post('/jobs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Job posted successfully!');
      navigate(`/jobs/${data.job._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl text-ink">Post a New Job</h1>
          <p className="text-sm text-ink-2 mt-0.5">
            Describe your repair need and get matched with local technicians.
          </p>
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

            {/* ── Location ─────────────────────────────────────────── */}
            <div className="space-y-3">
              <label className="label">
                <HiLocationMarker className="inline w-4 h-4 mr-1 text-brand-500" />
                Location *
              </label>

              {/* Address text */}
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
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-block w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full"
                    />
                    {accuracy !== null
                      ? `Improving accuracy… ±${accuracy}m`
                      : 'Detecting location…'}
                  </span>
                ) : locationSet ? (
                  <span className="flex items-center gap-2">
                    <HiCheckCircle className="w-5 h-5" />
                    {accuracy !== null ? `Located ±${accuracy}m` : 'Location set'}
                    — {parseFloat(form.lat).toFixed(4)}, {parseFloat(form.lng).toFixed(4)}
                    <HiRefresh className="w-4 h-4 opacity-60" title="Click to re-detect" />
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <HiCursorClick className="w-5 h-5" />
                    Use My Current Location (GPS)
                  </span>
                )}
              </motion.button>

              {/* Accuracy hint */}
              {locationSet && accuracy !== null && (
                <p className={`text-xs px-3 py-1.5 rounded-lg border ${
                  accuracy <= 20
                    ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                    : accuracy <= 100
                    ? 'border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                    : 'border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                }`}>
                  {accuracy <= 20 && 'Excellent accuracy'}
                  {accuracy > 20 && accuracy <= 100 && 'Moderate accuracy — you can drag the pin to fine-tune'}
                  {accuracy > 100 && 'Low accuracy — please drag the pin on the map to your exact location'}
                  {' '}(±{accuracy}m)
                </p>
              )}

              {/* Manual coordinates — collapsed by default */}
              <details className="group">
                <summary className="text-xs text-ink-3 dark:text-ink-2 cursor-pointer hover:text-ink-2 dark:hover:text-gray-300 select-none flex items-center gap-1 list-none">
                  <HiChevronDown className="transition-transform group-open:rotate-180 inline-block w-4 h-4" />
                  Enter coordinates manually
                </summary>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="label text-xs">Latitude</label>
                    <input name="lat" type="number" step="any" value={form.lat}
                      onChange={(e) => { handleChange(e); setLocationSet(!!e.target.value); setShowMap(!!e.target.value); }}
                      placeholder="27.7172" className="input text-sm" />
                  </div>
                  <div>
                    <label className="label text-xs">Longitude</label>
                    <input name="lng" type="number" step="any" value={form.lng}
                      onChange={(e) => { handleChange(e); setLocationSet(!!e.target.value); setShowMap(!!e.target.value); }}
                      placeholder="85.3240" className="input text-sm" />
                  </div>
                </div>
              </details>

              {/* Interactive map — appears once we have coords */}
              <AnimatePresence>
                {showMap && hasCoords && (
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
                      Click the map or drag the pin to correct your exact location
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
                onChange={handleChange} placeholder="Leave 0 for open to quotes" className="input" />
            </div>

            {/* Photos */}
            <div>
              <label className="label">
                <HiPhotograph className="inline w-4 h-4 mr-1" />
                Photos (up to 5)
              </label>
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-outline dark:border-gray-600 rounded-xl cursor-pointer hover:border-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 transition-colors bg-canvas-alt/50">
                <HiPhotograph className="w-7 h-7 text-ink-3 mb-1.5" />
                <span className="text-sm text-ink-2">Click to upload photos</span>
                <span className="text-xs text-ink-3 dark:text-ink-2 mt-0.5">JPG, PNG, WebP · max 5MB each</span>
                <input type="file" multiple accept="image/*" onChange={handleImages} className="hidden" />
              </label>
              {previews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3">
                  {previews.map((src, i) => (
                    <div key={i} className="relative group">
                      <img src={src} alt="" className="w-full h-20 object-cover rounded-lg" />
                      <button type="button" onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">
                        <HiX className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">
                Cancel
              </button>
              <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.97 }} className="btn-primary flex-1">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                    Posting…
                  </span>
                ) : 'Post Job'}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateJob;
