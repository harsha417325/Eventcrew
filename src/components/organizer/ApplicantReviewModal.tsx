import React from 'react';
import { JobApplication } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { X, Star, Check, XCircle, MessageSquare, ShieldCheck, IndianRupee } from 'lucide-react';

interface ApplicantReviewModalProps {
  application: JobApplication;
  onClose: () => void;
  onStartChat: (workerId: string, eventId: string) => void;
}

export const ApplicantReviewModal: React.FC<ApplicantReviewModalProps> = ({ application, onClose, onStartChat }) => {
  const { updateApplicationStatus, releasePayout } = useAuth();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in fade-in zoom-in-95 duration-200">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          Applicant Profile Review
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Role: <strong className="text-slate-700 dark:text-slate-200">{application.jobRoleTitle}</strong>
        </p>

        {/* Worker Header Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3 mb-5">
          <img
            src={application.workerAvatar}
            alt={application.workerName}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/30"
          />
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-1.5">
              {application.workerName}
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
            </h4>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> {application.workerRating}
              </span>
              <span>•</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                ₹{application.payAmount.toLocaleString('en-IN')} payout
              </span>
            </div>
          </div>
        </div>

        {/* Worker Skills */}
        <div className="space-y-2 mb-5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Specialized Categories
          </label>
          <div className="flex flex-wrap gap-1.5">
            {application.workerSkills.map((s, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Cover Note */}
        <div className="space-y-1.5 mb-6">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Worker Pitch / Cover Note
          </label>
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
            "{application.coverNote}"
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {application.status === 'pending' && (
            <>
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 text-[11px] text-amber-800 dark:text-amber-300">
                💡 Accepting worker locks escrow pay and automatically unlocks direct shift chat.
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    updateApplicationStatus(application.id, 'accepted');
                    onClose();
                  }}
                  className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Accept Worker
                </button>

                <button
                  onClick={() => {
                    updateApplicationStatus(application.id, 'rejected');
                    onClose();
                  }}
                  className="py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-slate-700 dark:text-slate-300 hover:text-rose-600 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            </>
          )}

          {application.status === 'accepted' && application.payoutStatus !== 'released' && (
            <button
              onClick={() => {
                releasePayout(application.id);
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <IndianRupee className="w-4 h-4" /> Release ₹{application.payAmount.toLocaleString('en-IN')} Wallet Payout
            </button>
          )}

          {(application.status === 'accepted' || application.status === 'completed') ? (
            <button
              onClick={() => {
                onStartChat(application.workerId, application.eventId);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" /> Chat with Accepted Worker (Unlocked)
            </button>
          ) : (
            <button
              onClick={() => {
                onStartChat(application.workerId, application.eventId);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4 text-slate-400" /> Pre-Shift Inquiry Message
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
