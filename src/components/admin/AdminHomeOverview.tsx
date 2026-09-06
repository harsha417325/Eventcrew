import React from 'react';
import { 
  ShieldCheck, 
  Users, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  FileCheck, 
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminHomeOverviewProps {
  onOpenAdminPanel: () => void;
  onOpenEscrow: () => void;
  onOpenMessages: () => void;
}

export const AdminHomeOverview: React.FC<AdminHomeOverviewProps> = ({
  onOpenAdminPanel,
  onOpenEscrow,
  onOpenMessages
}) => {
  const { users, events, complaints } = useAuth();

  const totalWorkers = users.filter(u => u.role === 'worker').length;
  const totalOrganizers = users.filter(u => u.role === 'organizer').length;
  const activeEvents = events.filter(e => e.status !== 'completed' && e.status !== 'cancelled');
  const completedEvents = events.filter(e => e.status === 'completed');
  const pendingComplaints = complaints.filter(c => c.status === 'open' || c.status === 'in_review');
  const totalEscrowBudget = events.reduce((sum, e) => sum + e.budgetTotal, 0);

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Platform Real-Time Metrics */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#7C3AED]">
              Operational Live Status
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Platform Command Summary
            </h2>
          </div>
          <button
            onClick={onOpenAdminPanel}
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Open Full Admin Panel</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Active Events */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Scheduled Gigs</span>
              <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#7C3AED]" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {activeEvents.length}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{completedEvents.length} completed</span> to date
              </p>
            </div>
          </div>

          {/* Registered Crew & Organizers */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Verified Users</span>
              <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-[#F97316]" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {users.length}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {totalWorkers} workers • {totalOrganizers} organizers
              </p>
            </div>
          </div>

          {/* Escrow Protected Total */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Protected Escrow Volume</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Lock className="w-5 h-5 text-[#22C55E]" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                ₹{totalEscrowBudget.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> 100% Escrow Collateralized
              </p>
            </div>
          </div>

          {/* Pending Action Items */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Disputes & Complaints</span>
              <div className={`w-9 h-9 rounded-xl ${pendingComplaints.length > 0 ? 'bg-rose-100 dark:bg-rose-900/30' : 'bg-slate-100 dark:bg-slate-800'} flex items-center justify-center`}>
                <AlertCircle className={`w-5 h-5 ${pendingComplaints.length > 0 ? 'text-rose-500' : 'text-slate-400'}`} />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {pendingComplaints.length}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {pendingComplaints.length > 0 ? (
                  <span className="text-rose-500 font-semibold">Requires admin investigation</span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">All complaints resolved</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Modules Fast Nav */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Shift & Event Auditing */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="w-11 h-11 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
              <Activity className="w-6 h-6 text-[#7C3AED]" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Event Shift Audits
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Supervise all live shifts, check worker check-ins, verify organizer venue requirements, and track shift completions.
            </p>
          </div>
          <button
            onClick={onOpenAdminPanel}
            className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-[#7C3AED] hover:text-[#6D28D9] cursor-pointer"
          >
            <span>Review Shift Pipeline</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 2: Escrow & Financial Control */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-[#22C55E]" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Escrow Vault & Payouts
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Inspect automated UPI and wallet releases, arbitrate withheld escrows during disputes, and monitor platform transaction ledgers.
            </p>
          </div>
          <button
            onClick={onOpenEscrow}
            className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-[#22C55E] hover:text-emerald-700 cursor-pointer"
          >
            <span>Inspect Escrow Ledgers</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 3: User Verification & KYC */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="w-11 h-11 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
              <FileCheck className="w-6 h-6 text-[#F97316]" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              User Credential Verifications
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Verify government Aadhaar/PAN IDs, approve verified badge status for crew, and suspend bad actors or fraud attempts.
            </p>
          </div>
          <button
            onClick={onOpenAdminPanel}
            className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-[#F97316] hover:text-orange-700 cursor-pointer"
          >
            <span>Manage User Directory</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Platform Governance & Security Rules */}
      <div className="bg-[#0F172A] text-white rounded-3xl p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#7C3AED]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-purple-300 text-xs font-bold uppercase tracking-wider border border-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" /> Platform Admin Protocol
          </div>
          <h3 className="text-2xl font-bold">
            Guaranteed Shift Security & Operational Integrity
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Every shift published on EventCrew requires an upfront 100% escrow lock. Workers check in on-site via QR code scan. 
            Once shifts conclude without dispute, escrow funds are instantly released into worker wallets. Admin oversight ensures fair dispute arbitration within 24 hours.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={onOpenAdminPanel}
              className="px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Open Admin Control Center
            </button>
            <button
              onClick={onOpenMessages}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs transition-all cursor-pointer"
            >
              Monitor Crew Communication
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
