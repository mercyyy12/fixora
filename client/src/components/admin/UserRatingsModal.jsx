import React, { useState, useEffect } from 'react';
import { FiX, FiStar } from 'react-icons/fi';
import API from '../../utils/api';

const UserRatingsModal = ({ user, onClose }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const { data } = await API.get(`/ratings/user/${user._id}`);
        setRatings(data.ratings || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRatings();
  }, [user]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm">
      <div className="bg-surface rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-outline flex justify-between items-center bg-canvas-alt">
          <h3 className="font-bold text-ink flex items-center gap-2">
            <FiStar className="text-amber-500 fill-amber-500" />
            Ratings & Reviews: {user.name}
          </h3>
          <button onClick={onClose} className="p-2 text-ink-3 hover:text-red-500 rounded-lg hover:bg-surface transition-all">
            <FiX />
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {loading ? (
            <p className="text-center text-ink-3 text-sm py-8 font-semibold">Loading platform feedback...</p>
          ) : ratings.length > 0 ? (
            ratings.map(r => (
              <div key={r._id} className="p-4 border border-outline rounded-xl bg-canvas">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className={`w-3.5 h-3.5 ${i < r.score ? 'fill-current' : 'text-outline'}`} />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-ink-3 uppercase tracking-wider">{r.job?.title || 'General Service'}</span>
                </div>
                <p className="text-sm text-ink-2 leading-relaxed">&quot;{r.comment || 'No written feedback provided.'}&quot;</p>
                <div className="mt-3 text-[10px] text-ink-3 uppercase font-bold tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
                  From: {r.rater?.name}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-ink-3 text-sm py-8 font-semibold">No ratings recorded for this user.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRatingsModal;
