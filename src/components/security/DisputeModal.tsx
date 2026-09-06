import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Dispute, DisputeReason } from '../../types';
import { Scale, AlertCircle, CheckCircle2, Clock, X, ArrowRight, ShieldAlert, DollarSign } from 'lucide-react';

interface DisputeModalProps {
  onClose: () => void;
  preselectedEventId?: string;
  preselectedAppId?: string;
  preselectedAgainstId?: string;
}

export const DisputeModal: React.FC<DisputeModalProps> = ({
  onClose,
  preselectedEventId,
  preselectedAppId,
  preselectedAgainstId
}) => {
  const { currentUser, disputes, events, users, fileDispute, resolveDispute } = useAuth();

  const [activeTab, setActiveTab] = useState<'list' | 'file'>(preselectedEventId ? 'file' : 'list');
  
  // Form State
  const [eventId, setEventId] = useState<string>(preselectedEventId || (events[0]?.id ?? ''));
  const [reason, setReason] = useState<DisputeReason>('non_payment');
  const [amount, setAmount] = useState<number>(2500);
  const [details, setDetails] = useState<string>('');
  const [againstId, setAgainstId] = useState<string>(preselectedAgainstId || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resolveNotes, setResolveNotes] = useState<Record<string, string>>({});

  // Filter disputes relevant to current user, or all if admin
  const visibleDisputes = currentUser.role === 'admin' 
    ? disputes 
    : disputes.filter(d => d.raisedById === currentUser.id || d.againstId === currentUser.id);

  const selectedEvent = events.find(e => e.id === eventId);

  const handleFileDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim() || !selectedEvent) return;

    setIsSubmitting(true);

    const opponentId = againstId || (currentUser.role === 'worker' ? selectedEvent.organizerId : (selectedEvent.roles[0]?.id || 'org_1'));
    const opponent = users.find(u => u.id === opponentId) || {
      id: opponentId,
      name: currentUser.role === 'worker' ? selectedEvent.organizerName : 'Shift Worker',
      role: currentUser.role === 'worker' ? 'organizer' : 'worker'
    };

    setTimeout(() => {
      fileDispute({
        eventId: selectedEvent.id,
        eventTitle: selectedEvent.title,
        applicationId: preselectedAppId || 'app_general',
        raisedById: currentUser.id,
        raisedByName: currentUser.name,
        raisedByRole: currentUser.role,
        againstId: opponent.id,
        againstName: opponent.name,
        againstRole: opponent.role as 'worker' | 'organizer',
        reason,
        details: details.trim(),
        amountDisputed: Number(amount)
      });
      setIsSubmitting(false);
      setActiveTab('list');
    }, 600);
  };

  const formatReason = (r: DisputeReason) => {
    switch (r) {
      case 'non_payment': return 'Delayed or Non-Payment';
      case 'no_show': return 'Worker No-Show at Venue';
      case 'late_arrival': return 'Significant Late Arrival';
      case 'unprofessional_conduct': return 'Unprofessional Conduct / Dispute';
      case 'breach_of_terms': return 'Breach of Agreement / Shift Terms';
      default: return 'Other Dispute';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500 text-white">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Dispute Resolution & Escrow Mediation</h3>
              <p className="text-xs text-slate-400">Neutral admin arbitration for shift payments, shifts, and conduct</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 pt-3 shrink-0">
          <button
            onClick={() => setActiveTab('list')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'list'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Active & Resolved Cases ({visibleDisputes.length})
          </button>
          <button
            onClick={() => setActiveTab('file')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'file'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            + File New Claim
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">

          {activeTab === 'list' ? (
            <div className="space-y-4">
              {visibleDisputes.length === 0 ? (
                <div className="p-10 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 space-y-3">
                  <ShieldAlert className="w-10 h-10 text-slate-400 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Open Disputes</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    All transactions and shifts are proceeding with high satisfaction. Need admin mediation for an issue?
                  </p>
                  <button
                    onClick={() => setActiveTab('file')}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-colors shadow"
                  >
                    File a Formal Claim
                  </button>
                </div>
              ) : (
                visibleDisputes.map(disp => (
                  <div 
                    key={disp.id}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            disp.status === 'open' 
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' 
                              : disp.status === 'under_review'
                              ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}>
                            {disp.status.replace('_', ' ')}
                          </span>
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            Claim #{disp.id} • {disp.createdAt}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                          {formatReason(disp.reason)}
                        </h4>
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                          Event: {disp.eventTitle}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Disputed Amount</span>
                        <p className="text-base font-extrabold text-amber-600 dark:text-amber-400">
                          ₹{disp.amountDisputed.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {/* Parties involved */}
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Claimant</span>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{disp.raisedByName} ({disp.raisedByRole})</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Opposing Party</span>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{disp.againstName} ({disp.againstRole})</p>
                      </div>
                    </div>

                    {/* Details */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-100/50 dark:bg-slate-800/40 p-3 rounded-xl">
                      "{disp.details}"
                    </p>

                    {/* Resolution notes if resolved */}
                    {disp.resolutionNotes && (
                      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs">
                        <p className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Resolution Recorded:
                        </p>
                        <p className="text-emerald-800 dark:text-emerald-300 mt-1">{disp.resolutionNotes}</p>
                      </div>
                    )}

                    {/* Admin Mediation Controls */}
                    {currentUser.role === 'admin' && disp.status !== 'resolved_worker' && disp.status !== 'resolved_organizer' && disp.status !== 'resolved_split' && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2">
                        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                          Admin Mediation Actions
                        </span>
                        <input
                          type="text"
                          placeholder="Resolution rationale & evidence summary..."
                          value={resolveNotes[disp.id] || ''}
                          onChange={e => setResolveNotes({ ...resolveNotes, [disp.id]: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                        />
                        <div className="flex flex-wrap gap-2 pt-1">
                          <button
                            onClick={() => resolveDispute(disp.id, 'resolved_worker', resolveNotes[disp.id] || 'Worker satisfied duties based on checked-in timesheet.')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-500"
                          >
                            Payout Worker (₹{disp.amountDisputed})
                          </button>
                          <button
                            onClick={() => resolveDispute(disp.id, 'resolved_organizer', resolveNotes[disp.id] || 'Organizer sustained substantiated losses due to worker default.')}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-500"
                          >
                            Refund Organizer
                          </button>
                          <button
                            onClick={() => resolveDispute(disp.id, 'resolved_split', resolveNotes[disp.id] || 'Settled with mutual 50/50 compromise.')}
                            className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold text-[11px] hover:bg-amber-500"
                          >
                            Split 50 / 50
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                ))
              )}
            </div>
          ) : (
            <form onSubmit={handleFileDispute} className="space-y-4">
              
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
                Filing a dispute pauses payout release from escrow and assigns an EventCrew Platform Arbitrator within 6 hours.
              </div>

              {/* Event Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Select Associated Event
                </label>
                <select
                  value={eventId}
                  onChange={e => setEventId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  {events.map(evt => (
                    <option key={evt.id} value={evt.id}>
                      {evt.title} ({evt.city} • {evt.date})
                    </option>
                  ))}
                </select>
              </div>

              {/* Reason */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Grounds for Claim
                </label>
                <select
                  value={reason}
                  onChange={e => setReason(e.target.value as DisputeReason)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="non_payment">Delayed or Non-Payment</option>
                  <option value="no_show">No-Show / Unreported Absence</option>
                  <option value="late_arrival">Late Arrival (Over 30 mins)</option>
                  <option value="unprofessional_conduct">Unprofessional Conduct</option>
                  <option value="breach_of_terms">Breach of Shift Agreement</option>
                  <option value="other">Other Issue</option>
                </select>
              </div>

              {/* Amount */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Disputed Amount (INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    min={100}
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold"
                  />
                </div>
              </div>

              {/* Explanation statement */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Detailed Explanation & Evidence Summary
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide precise details: check-in time, organizer directions, supervisor name, photos, or shift agreements..."
                  value={details}
                  onChange={e => setDetails(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !details.trim()}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  {isSubmitting ? 'Submitting Claim...' : 'Lodge Formal Dispute'}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
