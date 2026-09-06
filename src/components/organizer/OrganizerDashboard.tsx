import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { EventItem, JobApplication } from '../../types';
import { CreateEventModal } from './CreateEventModal';
import { ApplicantReviewModal } from './ApplicantReviewModal';
import { 
  Plus, 
  Calendar, 
  Users, 
  Clock, 
  IndianRupee, 
  CheckCircle2, 
  AlertCircle, 
  BarChart3, 
  MessageSquare, 
  Star, 
  ArrowUpRight,
  ShieldCheck,
  Search,
  Filter,
  Crown,
  FileText,
  Scale,
  Smartphone,
  Sparkles,
  UsersRound,
  Check
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { SubscriptionModal } from '../payments/SubscriptionModal';
import { InvoiceModal } from '../payments/InvoiceModal';
import { DisputeModal } from '../security/DisputeModal';
import { IdentityVerificationModal } from '../security/IdentityVerificationModal';
import { TwoFactorAuthModal } from '../security/TwoFactorAuthModal';
import { SmartBudgetAdvisor } from '../events/SmartBudgetAdvisor';
import { EscrowTracker } from '../payments/EscrowTracker';

interface OrganizerDashboardProps {
  onStartChat: (workerId: string, eventId: string) => void;
  onOpenGroupChat?: (chatId: string) => void;
}

export const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({ onStartChat, onOpenGroupChat }) => {
  const { currentUser, events, applications, reviews, transactions, releasePayout, createGroupChat } = useAuth();

  const [activeTab, setActiveTab] = useState<'events' | 'applicants' | 'analytics' | 'budgetAdvisor' | 'reviews'>('events');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<JobApplication | null>(null);

  // Modals
  const [showSubscription, setShowSubscription] = useState(false);
  const [showInvoices, setShowInvoices] = useState(false);
  const [showDispute, setShowDispute] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [show2FA, setShow2FA] = useState(false);

  // Filter events organized by current user
  const myEvents = events.filter(e => e.organizerId === currentUser.id);
  const myApplications = applications.filter(a => a.organizerId === currentUser.id);
  const pendingApps = myApplications.filter(a => a.status === 'applied');
  const acceptedApps = myApplications.filter(a => a.status === 'accepted');
  const totalEscrow = myEvents.reduce((sum, e) => sum + e.budgetTotal, 0);

  const currentTier = currentUser.subscriptionTier || 'starter';

  // Recharts financial spend history data
  const chartData = [
    { month: 'Apr', spend: 18000, escrow: 8000 },
    { month: 'May', spend: 28000, escrow: 12000 },
    { month: 'Jun', spend: 39000, escrow: 18000 },
    { month: 'Jul', spend: 52000, escrow: 24000 },
    { month: 'Aug', spend: 75000, escrow: totalEscrow }
  ];

  const handleCreateCrewGroup = (event: EventItem) => {
    // Get all accepted workers for this event
    const eventApps = applications.filter(a => a.eventId === event.id && (a.status === 'accepted' || a.status === 'completed'));
    const workerIds = eventApps.map(a => a.workerId);
    const chatId = createGroupChat(event.id, `${event.title} - Crew Team`, workerIds);
    if (onOpenGroupChat) {
      onOpenGroupChat(chatId);
    } else {
      onStartChat(workerIds[0] || '', event.id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-600/30 via-purple-600/10 to-transparent pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Event Planner Pro
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-amber-400" /> Plan: {currentTier.toUpperCase()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Manage your event crew postings, review applications, launch group team chats, and release automated worker invoices.
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <button
            onClick={() => setShowSubscription(true)}
            className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow"
          >
            <Crown className="w-4 h-4 text-amber-400" /> Subscription Tier
          </button>
          <button
            onClick={() => setShowInvoices(true)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-indigo-400" /> Invoices
          </button>
          <button
            onClick={() => setShowDispute(true)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Scale className="w-4 h-4 text-rose-400" /> Disputes
          </button>
          <button
            onClick={() => setShow2FA(true)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Smartphone className="w-4 h-4 text-emerald-400" /> 2FA
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" /> Post Event Job
          </button>
        </div>
      </div>

      {/* Escrow Tracker for Organizer */}
      <EscrowTracker
        onOpenDispute={() => setShowDispute(true)}
        onOpenInvoices={() => setShowInvoices(true)}
      />

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Events</span>
            <Calendar className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{myEvents.length}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Applications Pending</span>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{pendingApps.length}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Confirmed Crew</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{acceptedApps.length}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Escrow Committed</span>
            <IndianRupee className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">₹{totalEscrow.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('events')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'events'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          My Events ({myEvents.length})
        </button>

        <button
          onClick={() => setActiveTab('applicants')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'applicants'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Applicants ({myApplications.length})
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Staffing Analytics & Budget
        </button>

        <button
          onClick={() => setActiveTab('budgetAdvisor')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'budgetAdvisor'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          AI Pay & Budget Advisor
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'reviews'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Reviews Received ({reviews.length})
        </button>
      </div>

      {/* Tab 1: My Events */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          {myEvents.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-700 space-y-3">
              <Calendar className="w-12 h-12 text-slate-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">No Events Posted Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Post your first event job posting to recruit verified bartenders, servers, photographers, and coordinators.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md"
              >
                Create Event Job
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myEvents.map(evt => {
                const eventApps = applications.filter(a => a.eventId === evt.id);
                const confirmedCount = eventApps.filter(a => a.status === 'accepted' || a.status === 'completed').length;
                const totalSlotsNeeded = evt.rolesNeeded.reduce((acc, r) => acc + (r.quantityNeeded ?? (r as any).slots ?? 1), 0);

                return (
                  <div
                    key={evt.id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                          {evt.category}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                          {evt.title}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Calendar className="w-3.5 h-3.5" /> {evt.date} • {evt.venue}, {evt.city}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs text-slate-400 block font-medium">Budget</span>
                        <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                          ₹{evt.budgetTotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Roles fulfillment progress */}
                    <div className="space-y-1.5 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-600 dark:text-slate-300">Crew Staffed</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                          {confirmedCount} / {totalSlotsNeeded} Filled
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all"
                          style={{ width: `${Math.min(100, (confirmedCount / (totalSlotsNeeded || 1)) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                      <button
                        onClick={() => handleCreateCrewGroup(evt)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-bold flex items-center gap-1.5 transition-colors border border-indigo-200 dark:border-indigo-800/60"
                      >
                        <UsersRound className="w-3.5 h-3.5" /> Crew Group Chat
                      </button>

                      <button
                        onClick={() => setActiveTab('applicants')}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-indigo-600 text-white font-semibold transition-colors"
                      >
                        View {eventApps.length} Applicants
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Applicants Review */}
      {activeTab === 'applicants' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Candidates & Shift Applicants ({myApplications.length})
              </h3>
              <span className="text-xs text-slate-500">
                Sorted by most recent
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {myApplications.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No applicants yet. Share your event postings to invite candidates.
                </div>
              ) : (
                myApplications.map(app => (
                  <div
                    key={app.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={app.workerAvatar}
                        alt={app.workerName}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                          {app.workerName}
                          <span className="flex items-center gap-0.5 text-amber-500 text-xs">
                            <Star className="w-3 h-3 fill-amber-400" /> {app.workerRating}
                          </span>
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Applied for <strong className="text-slate-700 dark:text-slate-200">{app.jobRoleTitle}</strong> on "{app.eventTitle}"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          ₹{app.payAmount.toLocaleString('en-IN')}
                        </span>
                        <span className={`block text-[10px] font-bold uppercase ${
                          app.status === 'accepted' ? 'text-emerald-500' : app.status === 'applied' ? 'text-amber-500' : 'text-slate-400'
                        }`}>
                          {app.status}
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedApplicant(app)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-xs transition-colors"
                      >
                        Review Profile
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Staffing Analytics & Budget */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              Event Staffing Spend & Escrow Volume (₹)
            </h3>
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Area type="monotone" dataKey="spend" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} name="Total Paid" />
                  <Area type="monotone" dataKey="escrow" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="Escrow Locked" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Escrow Protection Guarantee
            </h3>
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <p className="leading-relaxed">
                All event shift budgets are safely held in platform escrow prior to event launch, protecting both planners and workers.
              </p>
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 text-emerald-800 dark:text-emerald-300 font-semibold">
                ✓ 100% Guaranteed Worker Payouts
              </div>
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/50 text-indigo-800 dark:text-indigo-300 font-semibold">
                ✓ Automated GST Invoicing on shift release
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: AI Budget Advisor */}
      {activeTab === 'budgetAdvisor' && (
        <div className="max-w-2xl">
          <SmartBudgetAdvisor />
        </div>
      )}

      {/* Tab 5: Reviews Received */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map(rev => (
              <div key={rev.id} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400">{rev.date}</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 italic">"{rev.comment}"</p>
                <p className="text-[11px] font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-700">
                  — {rev.reviewerName} on "{rev.eventTitle}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => setShowCreateModal(false)}
        />
      )}

      {selectedApplicant && (
        <ApplicantReviewModal
          application={selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
          onStartChat={onStartChat}
        />
      )}

      {showSubscription && (
        <SubscriptionModal onClose={() => setShowSubscription(false)} />
      )}

      {showInvoices && (
        <InvoiceModal onClose={() => setShowInvoices(false)} />
      )}

      {showDispute && (
        <DisputeModal onClose={() => setShowDispute(false)} />
      )}

      {showVerification && (
        <IdentityVerificationModal onClose={() => setShowVerification(false)} />
      )}

      {show2FA && (
        <TwoFactorAuthModal onClose={() => setShow2FA(false)} />
      )}

    </div>
  );
};
