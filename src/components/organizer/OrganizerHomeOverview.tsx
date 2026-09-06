import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  ShieldCheck, 
  Plus, 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  MessageSquare,
  Briefcase,
  AlertCircle,
  FileText,
  BadgeCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { JobCategory } from '../../types';
import { CreateEventModal } from './CreateEventModal';

interface OrganizerHomeOverviewProps {
  onOpenDashboard: () => void;
  onOpenPayments: () => void;
  onOpenChat: () => void;
}

export const OrganizerHomeOverview: React.FC<OrganizerHomeOverviewProps> = ({
  onOpenDashboard,
  onOpenPayments,
  onOpenChat
}) => {
  const { currentUser, events, applications, users } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Events posted by this organizer
  const myEvents = events.filter(e => e.organizerId === currentUser.id);
  const activeEvents = myEvents.filter(e => e.status !== 'completed' && e.status !== 'cancelled');
  const myApplications = applications.filter(a => a.organizerId === currentUser.id);
  const pendingApplicants = myApplications.filter(a => a.status === 'applied');
  const hiredCrew = myApplications.filter(a => a.status === 'accepted' || a.status === 'completed');
  const totalEscrowLocked = activeEvents.reduce((sum, e) => sum + e.budgetTotal, 0);

  const talentCategories: { name: JobCategory; icon: string; count: number; desc: string }[] = [
    { name: 'Catering', icon: '🍽️', count: 1420, desc: 'Banquet servers, chefs, dishwashers' },
    { name: 'Hosting', icon: '🎤', count: 860, desc: 'Bilingual ushers, emcees, front desk' },
    { name: 'Security', icon: '🛡️', count: 940, desc: 'Licensed bouncers, crowd controllers' },
    { name: 'Audio & DJ', icon: '🎧', count: 620, desc: 'Sound engineers, console technicians, DJs' },
    { name: 'Photography', icon: '📸', count: 540, desc: 'Event candid shooters, videographers' },
    { name: 'Decoration', icon: '🌸', count: 480, desc: 'Stage florists, balloon & fabric designers' }
  ];

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Top Banner: Organizer Quick Stats & Post Action */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-[#7C3AED] text-xs font-bold uppercase tracking-wider mb-2">
              <BadgeCheck className="w-3.5 h-3.5" />
              <span>Organizer Shift Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Event Management & Crew Hiring
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage your live event shifts, review incoming applicants, and secure verified crew.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post a New Job</span>
            </button>
            <button
              onClick={onOpenDashboard}
              className="px-4 py-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
            >
              <span>Full Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Active Events */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Posted Shifts</span>
              <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#7C3AED]" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {activeEvents.length}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {myEvents.length} total events organized
              </p>
            </div>
          </div>

          {/* Pending Applicants */}
          <div 
            onClick={onOpenDashboard}
            className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-sm hover:border-[#7C3AED]/60 cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Applicants to Review</span>
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{pendingApplicants.length}</span>
                {pendingApplicants.length > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white animate-pulse">
                    Action Required
                  </span>
                )}
              </p>
              <p className="text-[11px] text-[#7C3AED] font-medium mt-1">
                Click to open applicant review →
              </p>
            </div>
          </div>

          {/* Hired Verified Crew */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Hired Crew Staff</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {hiredCrew.length}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                KYC verified workers assigned
              </p>
            </div>
          </div>

          {/* Escrow Locked */}
          <div 
            onClick={onOpenPayments}
            className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-sm hover:border-[#7C3AED]/60 cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Escrow Protected</span>
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                ₹{totalEscrowLocked.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-[#7C3AED] font-medium mt-1">
                View wallet & escrow tracker →
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Shift Management Section */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Your Posted Shifts & Events
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Track hiring progress, filled vacancies, and applicant status.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-xs sm:text-sm font-bold text-[#7C3AED] hover:text-[#6D28D9] flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Post Another Shift</span>
          </button>
        </div>

        {myEvents.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 space-y-4">
            <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/30 text-[#7C3AED] flex items-center justify-center mx-auto">
              <Briefcase className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">No active shifts posted yet</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                Post your first event shift in seconds. Specify roles needed, hourly rates, and hire verified crew.
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs shadow-md cursor-pointer transition-all"
            >
              Post a Job Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {myEvents.slice(0, 4).map(evt => {
              const eventApps = applications.filter(a => a.eventId === evt.id);
              const pendingCount = eventApps.filter(a => a.status === 'applied').length;
              const acceptedCount = eventApps.filter(a => a.status === 'accepted' || a.status === 'completed').length;
              const totalNeeded = evt.rolesNeeded.reduce((s, r) => s + r.quantityNeeded, 0);

              return (
                <div 
                  key={evt.id}
                  className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-[#7C3AED]/50 bg-slate-50/50 dark:bg-slate-900/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {evt.title}
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        evt.status === 'published' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' :
                        evt.status === 'in_progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' :
                        'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {evt.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#7C3AED]" />
                        <span>{evt.startDate}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
                        <span>{evt.city} • {evt.venue}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Budget: ₹{evt.budgetTotal.toLocaleString('en-IN')}</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {evt.rolesNeeded.map(r => (
                        <span key={r.id} className="text-[10px] font-medium px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                          {r.title} ({r.quantityFilled}/{r.quantityNeeded})
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {acceptedCount} / {totalNeeded} Crew Hired
                      </p>
                      {pendingCount > 0 && (
                        <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                          {pendingCount} new applicants
                        </p>
                      )}
                    </div>
                    <button
                      onClick={onOpenDashboard}
                      className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      Manage & Review
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Talent Categories to Hire */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#7C3AED]">
              Verified Event Talent Directory
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              Hire Specialized Crew by Role
            </h3>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold transition-all"
          >
            Post Role Request
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {talentCategories.map(cat => (
            <div 
              key={cat.name}
              onClick={() => setShowCreateModal(true)}
              className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-sm hover:border-[#7C3AED] hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                  {cat.count}+ Available
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#7C3AED] transition-colors">
                {cat.name} Staff
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {cat.desc}
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-xs font-bold text-[#7C3AED]">
                <span>Post shift for {cat.name}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Organizer Escrow & Quality Guarantees */}
      <div className="bg-[#0F172A] text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7C3AED]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C3AED]/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#7C3AED]" />
            <span>EventCrew Organizer Protection</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
            100% Escrow Protection & Verified Attendance Guarantee
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Your event budget is held in bank-grade escrow. Workers are verified via Government ID (Aadhaar/PAN) and checked in via geofenced QR codes. Funds are only disbursed once you confirm flawless shift completion.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-4">
              <CheckCircle2 className="w-5 h-5 text-[#22C55E] mb-2" />
              <h5 className="text-xs font-bold">Replacement Crew</h5>
              <p className="text-[11px] text-slate-400 mt-0.5">Automated backup worker dispatch if anyone cancels.</p>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-4">
              <ShieldCheck className="w-5 h-5 text-[#0284C7] mb-2" />
              <h5 className="text-xs font-bold">Escrow Vault</h5>
              <p className="text-[11px] text-slate-400 mt-0.5">Funds locked safely until you approve shift timesheets.</p>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-4">
              <FileText className="w-5 h-5 text-[#F97316] mb-2" />
              <h5 className="text-xs font-bold">Instant GST Invoices</h5>
              <p className="text-[11px] text-slate-400 mt-0.5">Automated tax invoices generated for company filings.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => setShowCreateModal(false)}
        />
      )}

    </div>
  );
};
