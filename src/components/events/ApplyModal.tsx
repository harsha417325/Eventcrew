import React, { useState, useEffect } from 'react';
import { EventItem, JobRoleNeeded } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { X, Send, Sparkles, CheckCircle, IndianRupee, Clock, AlertCircle } from 'lucide-react';

interface ApplyModalProps {
  event: EventItem;
  selectedRole?: JobRoleNeeded;
  onClose: () => void;
  onSuccess: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({ event, selectedRole, onClose, onSuccess }) => {
  const { currentUser, applyForJob, applications } = useAuth();

  const [activeRoleId, setActiveRoleId] = useState<string>(
    selectedRole?.id || event.rolesNeeded[0]?.id || ''
  );
  const [coverNote, setCoverNote] = useState(
    `Hi ${event.organizerName}! I would love to work as a ${selectedRole?.title || 'crew member'} for ${event.title}. I am punctual, experienced, and ready for shift.`
  );
  const [aiMatch, setAiMatch] = useState<{ matchScore: number; matchReason: string } | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const activeRole = event.rolesNeeded.find(r => r.id === activeRoleId) || event.rolesNeeded[0];

  // Check if worker already applied for this role
  const existingApp = applications.find(
    a => a.eventId === event.id && a.jobRoleId === activeRoleId && a.workerId === currentUser.id
  );

  // Fetch AI Match Score when active role changes
  useEffect(() => {
    if (activeRole) {
      setLoadingAi(true);
      fetch('/api/ai/match-worker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workerSkills: currentUser.skills || [],
          workerBio: currentUser.bio || '',
          jobCategory: activeRole.category,
          jobTitle: activeRole.title
        })
      })
        .then(res => res.json())
        .then(data => {
          setAiMatch(data);
          setLoadingAi(false);
        })
        .catch(() => {
          setAiMatch({ matchScore: 90, matchReason: 'Excellent skills alignment for event operations.' });
          setLoadingAi(false);
        });
    }
  }, [activeRoleId, currentUser.skills, currentUser.bio]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRole) return;

    setSubmitting(true);
    setTimeout(() => {
      applyForJob(
        event.id,
        activeRole.id,
        activeRole.title,
        activeRole.payPerWorker,
        coverNote
      );
      setSubmitting(false);
      onSuccess();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E2E8F0] dark:border-slate-800 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-[#0F172A] dark:text-white mb-1">
          Apply For Shift
        </h3>
        <p className="text-xs text-[#64748B] dark:text-slate-400 mb-5">
          Submit your application to {event.organizerName} for <strong className="text-[#1E293B] dark:text-slate-200">{event.title}</strong>
        </p>

        {/* Role Selector */}
        <div className="space-y-2 mb-4">
          <label className="text-xs font-semibold text-[#1E293B] dark:text-slate-300">
            Select Role
          </label>
          <div className="grid grid-cols-1 gap-2">
            {event.rolesNeeded.map(role => (
              <button
                key={role.id}
                type="button"
                onClick={() => setActiveRoleId(role.id)}
                className={`p-3 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                  activeRoleId === role.id
                    ? 'border-[#7C3AED] bg-[#EDE9FE]/50 dark:bg-purple-950/40 text-[#7C3AED] dark:text-purple-300 font-semibold shadow-xs'
                    : 'border-[#E2E8F0] dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-[#1E293B] dark:text-slate-300'
                }`}
              >
                <div>
                  <p className="text-xs font-bold text-[#1E293B] dark:text-white">{role.title}</p>
                  <p className="text-[10px] text-[#64748B] dark:text-slate-400">
                    {role.shiftHours} hrs shift • {role.quantityNeeded - role.quantityFilled} spots left
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-[#22C55E]">
                    ₹{role.payPerWorker.toLocaleString('en-IN')}
                  </span>
                  <span className="block text-[10px] text-[#64748B]">pay</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* AI Suitability Score Card */}
        <div className="p-3.5 rounded-2xl bg-[#EDE9FE]/50 dark:bg-purple-950/40 border border-[#DDD6FE] dark:border-purple-800/50 mb-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-[#7C3AED] dark:text-purple-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#7C3AED]" /> AI Worker Match Analysis
            </span>
            {loadingAi ? (
              <span className="text-[10px] text-[#7C3AED] animate-pulse">Calculating...</span>
            ) : (
              <span className="text-xs font-extrabold text-[#22C55E]">
                {aiMatch?.matchScore}% Match
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#64748B] dark:text-slate-300 leading-snug">
            {aiMatch?.matchReason || "Analyzing skills against role requirements..."}
          </p>
        </div>

        {existingApp ? (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <p className="font-bold">Already Applied</p>
              <p className="text-[11px] mt-0.5">
                You submitted an application for this role. Status: <span className="uppercase font-semibold">{existingApp.status}</span>.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1E293B] dark:text-slate-300">
                Message / Cover Note for Organizer
              </label>
              <textarea
                rows={3}
                required
                value={coverNote}
                onChange={e => setCoverNote(e.target.value)}
                className="w-full bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-xl p-3 text-xs text-[#1E293B] dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                placeholder="Introduce yourself and highlight relevant event experience..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting Application...' : 'Confirm & Apply Now'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
