import React, { useState } from 'react';
import { X, ShieldCheck, FileText, CheckCircle2, AlertCircle, Scale, Lock, IndianRupee } from 'lucide-react';

interface TermsModalProps {
  onClose: () => void;
  onAccept?: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ onClose, onAccept }) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'escrow' | 'crew_policy' | 'privacy'>('terms');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Platform Terms, Policy & Escrow Agreement
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                EventCrew Official Operating Guidelines & Legal Disclosures
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex items-center gap-1 p-2 bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 overflow-x-auto text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'terms'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1. Terms of Service</span>
          </button>

          <button
            onClick={() => setActiveTab('escrow')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'escrow'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <IndianRupee className="w-3.5 h-3.5" />
            <span>2. Escrow & Wallet Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('crew_policy')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'crew_policy'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>3. Crew Code of Conduct</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'privacy'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>4. Privacy & Data</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto text-xs space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed grow">
          
          {activeTab === 'terms' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/50 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-xs">Agreement Overview</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                    By registering on EventCrew, you represent that you are at least 18 years of age and agree to comply with all platform rules as an Event Organizer or Independent Part-Time Crew member.
                  </p>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-sm">1. Platform Scope & Account Registration</h3>
              <p>
                EventCrew connects independent part-time event professionals (hospitality servers, registration hosts, stage decor staff, security officers, photographers) with event organizers and agencies. All users must maintain true, accurate, and verified identity credentials.
              </p>

              <h3 className="font-bold text-slate-900 dark:text-white text-sm">2. Non-Circumvention Policy</h3>
              <p>
                Organizers and Crew members agree not to solicit or accept off-platform payments or hire crew members discovered via EventCrew without processing through the EventCrew Escrow system. Violations result in permanent account suspension and loss of wallet features.
              </p>

              <h3 className="font-bold text-slate-900 dark:text-white text-sm">3. Independent Contractor Status</h3>
              <p>
                Crew members are independent freelancers and not direct employees of EventCrew. Crew members manage their own shift bookings, taxes, and venue arrival timings.
              </p>
            </div>
          )}

          {activeTab === 'escrow' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50 flex items-start gap-3">
                <IndianRupee className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-xs">100% Guaranteed Escrow Protection</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                    Organizers pre-lock 100% shift budgets in Escrow prior to event start. Crew earnings are guaranteed upon shift check-in and completion.
                  </p>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-sm">1. Event Organizer Escrow Pre-Funding</h3>
              <p>
                When an Organizer posts an event job, total payroll budget (e.g. ₹14,400) is locked into an automated Escrow vault. Funds cannot be unilaterally withdrawn after crew selection.
              </p>

              <h3 className="font-bold text-slate-900 dark:text-white text-sm">2. Shift Completion & Payout Release</h3>
              <p>
                Upon shift conclusion, the Organizer clicks "Release Payout". Funds immediately transfer into the Crew member's active Wallet, available for instant payout. If an Organizer fails to confirm completion within 24 hours of event end, Escrow funds auto-release to confirmed crew.
              </p>

              <h3 className="font-bold text-slate-900 dark:text-white text-sm">3. Cancellation & Refund Terms</h3>
              <ul className="list-disc pl-5 space-y-1 text-[11px]">
                <li><strong>Cancellation &gt; 48 Hours Before Event:</strong> 100% Escrow refund to Organizer.</li>
                <li><strong>Cancellation &lt; 24 Hours Before Event:</strong> 50% compensation paid to accepted Crew members for reserved shift time.</li>
              </ul>
            </div>
          )}

          {activeTab === 'crew_policy' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/50 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-xs">Punctuality & Professional Uniform Standards</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                    Crew members agree to arrive 15 minutes prior to scheduled shift start time and wear specified attire.
                  </p>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-sm">1. Attendance & No-Show Penalties</h3>
              <p>
                Accepting a shift is a binding commitment. Failing to show up without 12-hour prior notice results in a 1-star rating penalty and temporary shift bidding suspension.
              </p>

              <h3 className="font-bold text-slate-900 dark:text-white text-sm">2. Professional Uniform & Hospitality Ethics</h3>
              <p>
                Crew members must strictly adhere to the requested attire specified on the job posting (e.g. All-Black formal, White Collared Shirt, Black Trousers, Black Non-Slip Shoes). Courteous guest interaction and sobriety on site are mandatory.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Data Protection & Privacy Policy</h3>
              <p>
                EventCrew respects user privacy. Mobile phone numbers and email addresses are only shared between accepted crew members and organizers for active shift coordination. Your financial data is securely protected by Firebase Firestore security encryption.
              </p>
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Updated & Enforced: 2026</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Close
            </button>
            {onAccept && (
              <button
                type="button"
                onClick={() => {
                  onAccept();
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Accept Terms & Proceed</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
