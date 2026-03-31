import React, { useState, useEffect } from 'react';
import { FiStar, FiSlash, FiSearch, FiMessageCircle, FiTrash2, FiFilter } from 'react-icons/fi';
import API from '../../utils/api';
import { toast } from 'react-hot-toast';

const RatingsManagement = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [scoreFilter, setScoreFilter] = useState('All');

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const { data } = await API.get('/ratings');
      setRatings(data.ratings || []);
    } catch (err) {
      toast.error('Failed to load platform reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRating = async (id) => {
    if (!window.confirm('Delete this user feedback permanently?')) return;
    try {
      await API.delete(`/ratings/${id}`); // I assume there's a delete route, if not I should add it
      toast.success('Feedback removed');
      fetchRatings();
    } catch (err) {
      toast.error('Failed to remove feedback');
    }
  };

  const filteredRatings = ratings.filter(r => {
    const matchesSearch = r.job?.title.toLowerCase().includes(search.toLowerCase()) || 
                         r.rater?.name.toLowerCase().includes(search.toLowerCase());
    const matchesScore = scoreFilter === 'All' || r.score === parseInt(scoreFilter);
    return matchesSearch && matchesScore;
  });

  if (loading) return <div className="text-center py-20 text-ink-3">Analyzing platform sentiment...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-surface p-4 rounded-xl border border-outline shadow-sm font-body">
        <div className="relative w-96">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
          <input 
            type="text" 
            placeholder="Search reviews by job or rater..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10 h-10 text-sm"
          />
        </div>
        <div className="flex gap-2">
           <div className="relative">
            <select 
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
              className="input h-10 pl-10 pr-8 text-xs appearance-none"
            >
              <option value="All">All Scores</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredRatings.length > 0 ? filteredRatings.map((rating) => (
          <div key={rating._id} className="card p-5 flex flex-col md:flex-row items-start justify-between border-l-4 border-l-brand/30 gap-6">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className={`w-3 h-3 ${i < rating.score ? 'fill-current' : 'text-slate-200'}`} />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-ink-3 uppercase tracking-wider">
                  {rating.job?.title} – {rating.job?.category}
                </span>
              </div>
              <p className="text-sm text-ink-2 leading-relaxed">"{rating.comment || 'No written feedback provided.'}"</p>
              <div className="flex items-center gap-4 text-[11px] text-ink-3">
                <div className="flex items-center gap-1.5 font-bold">
                  <span className="text-brand uppercase">By:</span> {rating.rater?.name}
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                   <span className="text-blue-500 uppercase">For:</span> {rating.ratedUser?.name} ({rating.ratedUser?.role})
                </div>
              </div>
            </div>
            <div className="flex md:flex-col gap-2">
               <button 
                onClick={() => handleDeleteRating(rating._id)}
                className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                title="Remove Feedback"
               >
                 <FiTrash2 />
               </button>
            </div>
          </div>
        )) : (
          <div className="card p-20 text-center text-ink-3 text-sm">
            No platform ratings recorded yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingsManagement;
