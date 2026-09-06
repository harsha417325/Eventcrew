import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Star, CheckCircle, X, ThumbsUp, Heart } from 'lucide-react';

interface ReviewModalProps {
  eventId: string;
  eventTitle: string;
  targetId: string;
  targetName: string;
  targetRole: 'worker' | 'organizer';
  onClose: () => void;
  onSuccess?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  eventId,
  eventTitle,
  targetId,
  targetName,
  targetRole,
  onClose,
  onSuccess
}) => {
  const { postReview } = useAuth();
  
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [punctualityScore, setPunctualityScore] = useState(5);
  const [communicationScore, setCommunicationScore] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      postReview(eventId, eventTitle, targetId, targetName, rating, comment.trim());
      setSubmitting(false);
      setSubmitted(true);
      if (onSuccess) onSuccess();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold">Leave Shift Feedback</h3>
            <p className="text-xs text-slate-400">Rate your experience with {targetName}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Review Published!</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Thank you for helping keep the EventCrew community transparent and reliable.
              </p>
              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Star Rating selector */}
              <div className="text-center space-y-2 py-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Overall Rating
                </span>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star 
                        className={`w-8 h-8 ${
                          (hoverRating || rating) >= star 
                            ? 'text-amber-400 fill-amber-400 drop-shadow' 
                            : 'text-slate-200 dark:text-slate-700'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {rating === 5 ? 'Exceptional 🌟' : rating === 4 ? 'Very Good 👍' : rating === 3 ? 'Average Shift' : rating === 2 ? 'Below Expectation' : 'Unsatisfactory'}
                </p>
              </div>

              {/* Specific attribute metrics */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {targetRole === 'worker' ? 'Punctuality' : 'Accurate Shift Briefing'}
                  </label>
                  <select
                    value={punctualityScore}
                    onChange={e => setPunctualityScore(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  >
                    <option value={5}>5 - Arrived Early / Prompt</option>
                    <option value={4}>4 - Right on Time</option>
                    <option value={3}>3 - Slightly Late (5-10m)</option>
                    <option value={1}>1 - Major Delay</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Communication & Etiquette
                  </label>
                  <select
                    value={communicationScore}
                    onChange={e => setCommunicationScore(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  >
                    <option value={5}>5 - Highly Courteous</option>
                    <option value={4}>4 - Professional</option>
                    <option value={3}>3 - Satisfactory</option>
                    <option value={1}>1 - Needs Improvement</option>
                  </select>
                </div>
              </div>

              {/* Written review textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Review & Comments
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder={`Share your experience with ${targetName}. Were they reliable, cooperative, and respectful?`}
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !comment.trim()}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all"
                >
                  {submitting ? 'Publishing...' : 'Post Public Review'}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
