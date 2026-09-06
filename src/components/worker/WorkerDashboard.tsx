import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { JobCategory, JobApplication, EventItem, User } from '../../types';
import { 
  User as UserIcon, 
  IndianRupee, 
  Briefcase, 
  Star, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Send, 
  TrendingUp, 
  Wallet,
  Calendar,
  Sparkles,
  Edit2,
  MessageSquare,
  Lock,
  ShieldCheck,
  ShieldAlert,
  FileText,
  Navigation,
  Smartphone,
  Award,
  Scale,
  Users,
  Building2,
  UsersRound,
  Radio,
  Share2,
  ArrowUpRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { WorkerAvailabilityCalendar } from './WorkerAvailabilityCalendar';
import { EscrowTracker } from '../payments/EscrowTracker';
import { IdentityVerificationModal } from '../security/IdentityVerificationModal';
import { TwoFactorAuthModal } from '../security/TwoFactorAuthModal';
import { DisputeModal } from '../security/DisputeModal';
import { InvoiceModal } from '../payments/InvoiceModal';
import { VenueMapModal } from '../events/VenueMapModal';
import { WithdrawalModal } from '../payments/WithdrawalModal';

interface WorkerDashboardProps {
  onExploreEvents: () => void;
  onStartChat: (targetUserId: string, eventId: string, isGroup?: boolean) => void;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({ onExploreEvents, onStartChat }) => {
  const { currentUser, applications, events, users, transactions, updateProfile, sendMessage, startOrGetConversation } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState<'applications' | 'crew-comms' | 'earnings' | 'availability' | 'recommended' | 'profile'>('applications');
  
  // Modals
  const [showVerification, setShowVerification] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [showDispute, setShowDispute] = useState(false);
  const [disputeEventId, setDisputeEventId] = useState<string | undefined>();
  const [showInvoices, setShowInvoices] = useState(false);
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const [selectedMapEvent, setSelectedMapEvent] = useState<EventItem | null>(null);

  // Comms tab event filter
  const [commsEventFilter, setCommsEventFilter] = useState<string>('all');

  // Profile edit state
  const [workerCity, setWorkerCity] = useState(currentUser.city || 'Mumbai');
  const [workerRate, setWorkerRate] = useState(currentUser.hourlyRate || 400);
  const [workerBio, setWorkerBio] = useState(currentUser.bio || 'Experienced event server and host.');

  const myApplications = applications.filter(a => a.workerId === currentUser.id);
  const acceptedApps = myApplications.filter(a => a.status === 'accepted' || a.status === 'completed');
  const pendingApps = myApplications.filter(a => a.status === 'applied');
  const rejectedApps = myApplications.filter(a => a.status === 'rejected');
  
  const totalEarned = myApplications
    .filter(a => a.payoutStatus === 'released')
    .reduce((sum, a) => sum + a.payAmount, 0);

  const earningsChartData = [
    { week: 'Week 1', earnings: 2800 },
    { week: 'Week 2', earnings: 4200 },
    { week: 'Week 3', earnings: 6500 },
    { week: 'Week 4', earnings: 8900 },
    { week: 'Current', earnings: totalEarned || 12400 }
  ];

  const isVerified = currentUser.verificationStatus === 'verified' || currentUser.isVerified;

  // Helper to extract all co-workers and organizers across user's confirmed shifts
  const confirmedShiftEvents = events.filter(e => 
    acceptedApps.some(a => a.eventId === e.id)
  );

  // Filtered shift events for the comms tab
  const activeCommsEvents = commsEventFilter === 'all' 
    ? (confirmedShiftEvents.length > 0 ? confirmedShiftEvents : events.slice(0, 2))
    : events.filter(e => e.id === commsEventFilter);

  // Aggregate all unique coworkers and organizers
  const allConnectedCoworkers = users.filter(u => 
    u.role === 'worker' && u.id !== currentUser.id
  );

  const allConnectedOrganizers = users.filter(u => 
    u.role === 'organizer'
  );

  const handleQuickPing = (targetUserId: string, eventId: string, text: string) => {
    const convId = startOrGetConversation(targetUserId, eventId);
    sendMessage(targetUserId, convId, text, eventId);
    onStartChat(targetUserId, eventId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Worker Header Card */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/50"
            />
            {isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow-sm" title="Verified Pro Worker">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold">{currentUser.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PRO GIG WORKER
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {currentUser.city || 'Mumbai, India'} • 
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {currentUser.rating || 4.9} ({currentUser.totalEventsWorked || 14} events completed)
            </p>
          </div>
        </div>

        {/* Action badges & status */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <button
            onClick={() => setShowWithdrawal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Wallet className="w-4 h-4" />
            <span>Withdraw (₹{(currentUser.walletBalance || 0).toLocaleString('en-IN')})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('crew-comms')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all"
          >
            <Users className="w-4 h-4" />
            <span>Crew & Comms Hub</span>
          </button>

          <button
            onClick={() => setShowInvoices(true)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" /> Invoices
          </button>

          <button
            onClick={() => setShow2FA(true)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400" /> 2FA Setup
          </button>

          {!isVerified ? (
            <button
              onClick={() => setShowVerification(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              <ShieldAlert className="w-3.5 h-3.5" /> Verify Aadhaar / ID
            </button>
          ) : (
            <div className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified ID
            </div>
          )}
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 sm:gap-6 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveSubTab('applications')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeSubTab === 'applications'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          My Applications ({myApplications.length})
        </button>

        {/* Crew & Comms Tab */}
        <button
          onClick={() => setActiveSubTab('crew-comms')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeSubTab === 'crew-comms'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-indigo-500" />
          <span>Crew & Comms</span>
          <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-extrabold">
            Organizer & Co-Workers
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('earnings')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeSubTab === 'earnings'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Earnings & Insights
        </button>

        <button
          onClick={() => setActiveSubTab('availability')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeSubTab === 'availability'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Availability Calendar
        </button>

        <button
          onClick={() => setActiveSubTab('recommended')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeSubTab === 'recommended'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Recommended Events
        </button>

        <button
          onClick={() => setActiveSubTab('profile')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeSubTab === 'profile'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Worker Profile & Skills
        </button>
      </div>

      {/* SUB-TAB: CREW & COMMS (ORGANIZERS & CO-WORKERS) */}
      {activeSubTab === 'crew-comms' && (
        <div className="space-y-6">
          
          {/* Hub Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
              <span className="text-xs text-slate-400 block font-medium">Event Organizers</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 block">
                {allConnectedOrganizers.length} Connected
              </span>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 mt-1">
                <Building2 className="w-3 h-3" /> Direct Host Access
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
              <span className="text-xs text-slate-400 block font-medium">Shift Co-Workers</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 block">
                {allConnectedCoworkers.length} Crew Peers
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                <Users className="w-3 h-3" /> On-Duty Teammates
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
              <span className="text-xs text-slate-400 block font-medium">Crew Channels</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 block">
                {activeCommsEvents.length} Active
              </span>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 mt-1">
                <UsersRound className="w-3 h-3" /> Team Operations
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
              <span className="text-xs text-slate-400 block font-medium">Comms Features</span>
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block flex items-center gap-1.5">
                <Radio className="w-4 h-4 animate-pulse" /> Direct Chat
              </span>
              <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1 mt-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" /> End-to-End Logged
              </span>
            </div>
          </div>

          {/* Comms Event Filter Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-indigo-600" /> Shift Communication Channels
              </h3>
              <p className="text-xs text-slate-500">
                Message your event host and peer shift workers in real time.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">Filter by Shift:</span>
              <select
                value={commsEventFilter}
                onChange={e => setCommsEventFilter(e.target.value)}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="all">All Confirmed Shifts</option>
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>{ev.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 1: Event Organizers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" /> Event Organizers & Hosts
              </h4>
              <span className="text-xs text-slate-400">Briefing, dress code & venue logistics</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allConnectedOrganizers.map(org => {
                const orgEvents = events.filter(e => e.organizerId === org.id);
                const firstEvent = orgEvents[0] || events[0];

                return (
                  <div
                    key={org.id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4 hover:border-indigo-300 transition-all"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={org.avatar}
                            alt={org.name}
                            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/20"
                          />
                          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-800" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h5 className="text-sm font-bold text-slate-900 dark:text-white">{org.name}</h5>
                            <ShieldCheck className="w-4 h-4 text-indigo-500" />
                          </div>
                          <p className="text-xs text-slate-500">
                            Verified Host • <span className="font-semibold text-slate-700 dark:text-slate-300">{firstEvent?.title}</span>
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Venue: {firstEvent?.venue}, {firstEvent?.city}
                          </p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                        ORGANIZER
                      </span>
                    </div>

                    {/* Quick Message Action Row */}
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                      <button
                        onClick={() => onStartChat(org.id, firstEvent?.id || 'evt_1')}
                        className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Message Organizer</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Shift Co-Workers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" /> Shift Co-Workers & Peer Crew
              </h4>
              <span className="text-xs text-slate-400">Team coordination, break rotations & stage handoffs</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allConnectedCoworkers.map(coworker => {
                // Find event where this coworker is confirmed
                const coworkerApp = applications.find(a => a.workerId === coworker.id);
                const assignedEvent = events.find(e => e.id === coworkerApp?.eventId) || events[0];

                return (
                  <div
                    key={coworker.id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4 hover:border-emerald-300 transition-all"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={coworker.avatar}
                            alt={coworker.name}
                            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/20"
                          />
                          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-800" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h5 className="text-sm font-bold text-slate-900 dark:text-white">{coworker.name}</h5>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 uppercase">
                              CO-WORKER
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                            {coworkerApp?.jobRoleTitle || (coworker.skills?.[0] ? `${coworker.skills[0]} Specialist` : 'Event Crew Specialist')}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Assigned to: <span className="text-slate-600 dark:text-slate-300 font-medium">{assignedEvent?.title}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-amber-500 flex items-center gap-1 justify-end">
                          <Star className="w-3.5 h-3.5 fill-amber-400" /> {coworker.rating || 5.0}
                        </span>
                        <span className="text-[10px] text-slate-400">Verified Crew</span>
                      </div>
                    </div>

                    {/* Quick Status Pings */}
                    <div className="flex items-center gap-1.5 overflow-x-auto text-[10px] pt-1">
                      <span className="text-slate-400 font-semibold shrink-0">Quick Ping:</span>
                      <button
                        onClick={() => handleQuickPing(coworker.id, assignedEvent.id, '👋 Hey! Ready for shift handoff?')}
                        className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700/60 hover:bg-emerald-50 text-slate-600 dark:text-slate-300 whitespace-nowrap"
                      >
                        👋 Handoff Sync
                      </button>
                      <button
                        onClick={() => handleQuickPing(coworker.id, assignedEvent.id, '📍 Where are you located on site right now?')}
                        className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700/60 hover:bg-emerald-50 text-slate-600 dark:text-slate-300 whitespace-nowrap"
                      >
                        📍 Site Location
                      </button>
                      <button
                        onClick={() => handleQuickPing(coworker.id, assignedEvent.id, '🥪 Taking 15m break, please cover station.')}
                        className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700/60 hover:bg-emerald-50 text-slate-600 dark:text-slate-300 whitespace-nowrap"
                      >
                        🥪 Break Cover
                      </button>
                    </div>

                    {/* Communication Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                      <button
                        onClick={() => onStartChat(coworker.id, assignedEvent.id)}
                        className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Message Co-Worker</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Shift Team Broadcast Channels */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UsersRound className="w-4 h-4 text-amber-600" /> Shift Team Operations Channels
              </h4>
              <span className="text-xs text-slate-400">All co-workers + organizer group broadcast</span>
            </div>

            <div className="space-y-3">
              {activeCommsEvents.map(event => (
                <div
                  key={event.id}
                  className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 border border-indigo-900/40"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <UsersRound className="w-3 h-3" /> Event Crew Operations
                      </span>
                      <span className="text-xs text-slate-400">{event.date}</span>
                    </div>
                    <h4 className="text-base font-bold text-white">{event.title}</h4>
                    <p className="text-xs text-slate-300">
                      Live crew broadcast channel with your organizer and all accepted shift co-workers.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onStartChat(`crew_group_${event.id}`, event.id, true)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Open Crew Chat</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Sub-Tab 1: My Applications */}
      {activeSubTab === 'applications' && (
        <div className="space-y-4">
          {acceptedApps.length > 0 && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-600 text-white font-bold shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    Shift Crew & Organizer Communication Active!
                  </h4>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                    Your shift application is confirmed! You can now message and call both your event organizer and co-workers.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveSubTab('crew-comms')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs whitespace-nowrap shadow-sm flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Open Crew Comms</span>
              </button>
            </div>
          )}

          {myApplications.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-700 space-y-3">
              <Briefcase className="w-12 h-12 text-slate-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">No Shift Applications Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore open shifts in your city and submit applications to start earning with escrow protection.
              </p>
              <button
                onClick={onExploreEvents}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md"
              >
                Browse Open Gigs
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myApplications.map(app => {
                const event = events.find(e => e.id === app.eventId);
                const isAccepted = app.status === 'accepted' || app.status === 'completed';

                // Find organizer
                const organizer = users.find(u => u.id === event?.organizerId) || {
                  id: event?.organizerId || 'org_1',
                  name: app.organizerName || 'Event Host',
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
                  role: 'organizer' as const,
                  phone: '+91 98200 12345'
                };

                // Find shift coworkers confirmed on this event
                const coworkerApps = applications.filter(
                  a => a.eventId === app.eventId && a.workerId !== currentUser.id && (a.status === 'accepted' || a.status === 'completed')
                );
                const coworkers = coworkerApps.map(cApp => {
                  const u = users.find(user => user.id === cApp.workerId);
                  return {
                    id: cApp.workerId,
                    name: cApp.workerName || u?.name || 'Shift Co-Worker',
                    avatar: cApp.workerAvatar || u?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
                    roleTitle: cApp.jobRoleTitle,
                    skills: cApp.workerSkills || u?.skills || ['Event Specialist'],
                    rating: cApp.workerRating || 4.9,
                    phone: u?.phone || '+91 98111 22334'
                  };
                });

                return (
                  <div
                    key={app.id}
                    className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-5 hover:border-slate-300 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            app.status === 'accepted' 
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                              : app.status === 'applied'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}>
                            {app.status}
                          </span>
                          <span className="text-xs text-slate-500">Applied on {app.appliedAt}</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                          {app.jobRoleTitle} • {event?.title || 'Event Shift'}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {event?.venue}, {event?.city} • 
                          <Calendar className="w-3.5 h-3.5 text-slate-400" /> {event?.date}
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <span className="text-xs text-slate-400 block font-medium">Offered Payout</span>
                        <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                          ₹{app.payAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* If accepted, show the Crew & Communications Section */}
                    {isAccepted && (
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-700/60 space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" /> Shift Crew Contacts & Communications
                          </h5>
                          <span className="text-[10px] text-slate-400">Direct Shift Messaging Active</span>
                        </div>

                        {/* Organizer Contact Row */}
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={organizer.avatar}
                              alt={organizer.name}
                              className="w-9 h-9 rounded-xl object-cover ring-1 ring-indigo-500/30"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-900 dark:text-white">{organizer.name}</span>
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 uppercase">
                                  Organizer
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400">Event Host & Producer</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => onStartChat(organizer.id, app.eventId)}
                              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Message</span>
                            </button>
                          </div>
                        </div>

                        {/* Co-Workers Row */}
                        {coworkers.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold px-1">
                              <span>Co-Workers on this Shift ({coworkers.length})</span>
                              <span>Coordinate duties & break coverage</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {coworkers.map(coworker => (
                                <div
                                  key={coworker.id}
                                  className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-2"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="relative shrink-0">
                                      <img
                                        src={coworker.avatar}
                                        alt={coworker.name}
                                        className="w-8 h-8 rounded-lg object-cover"
                                      />
                                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-1 ring-white" />
                                    </div>
                                    <div className="min-w-0">
                                      <h6 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                        {coworker.name}
                                      </h6>
                                      <p className="text-[10px] text-slate-500 truncate">{coworker.roleTitle}</p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      onClick={() => onStartChat(coworker.id, app.eventId)}
                                      className="px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1"
                                      title="Message Co-Worker"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5" />
                                      <span>Chat</span>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action buttons for shift */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                      <div className="flex items-center gap-2">
                        {event && (
                          <button
                            onClick={() => setSelectedMapEvent(event)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <Navigation className="w-3.5 h-3.5 text-indigo-500" /> Transit & Directions
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setDisputeEventId(app.eventId);
                            setShowDispute(true);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Scale className="w-3.5 h-3.5 text-amber-500" /> Dispute
                        </button>
                      </div>

                      {isAccepted && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onStartChat(`crew_group_${app.eventId}`, app.eventId, true)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold flex items-center gap-1.5 transition-all"
                          >
                            <UsersRound className="w-3.5 h-3.5 text-amber-500" />
                            <span>Team Channel</span>
                          </button>
                          <button
                            onClick={() => onStartChat(organizer.id, app.eventId)}
                            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 transition-all shadow-sm"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Chat Organizer</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 2: Earnings & Insights */}
      {activeSubTab === 'earnings' && (
        <div className="space-y-6">
          {/* Wallet Balance & Direct Payout Card */}
          <div className="p-6 rounded-3xl bg-[#0F172A] text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-1.5 relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Wallet className="w-4 h-4" /> Available Wallet Balance
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Min. ₹1,000 Withdrawal
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-white tracking-tight">
                ₹{(currentUser.walletBalance || 0).toLocaleString('en-IN')}
              </h3>
              <p className="text-xs text-slate-400">
                Direct instant settlement to Verified Bank Accounts (IMPS) & UPI VPAs.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto relative z-10">
              <button
                type="button"
                onClick={() => setShowWithdrawal(true)}
                className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowUpRight className="w-4 h-4" /> Request Withdrawal
              </button>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Earnings Trend Over Time
                </h3>
                <p className="text-xs text-slate-500">Cumulative verified shift payouts</p>
              </div>
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                +38% vs last month
              </span>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={earningsChartData}>
                  <defs>
                    <linearGradient id="workerEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={v => `₹${v}`} />
                  <Tooltip formatter={(value: any) => [`₹${value.toLocaleString('en-IN')}`, 'Earnings']} />
                  <Area type="monotone" dataKey="earnings" stroke="#4f46e5" strokeWidth={3} fill="url(#workerEarnings)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Application Acceptance Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Application Acceptance Breakdown
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-emerald-600">Accepted Shifts</span>
                    <span>{acceptedApps.length} ({myApplications.length ? Math.round((acceptedApps.length / myApplications.length) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${myApplications.length ? (acceptedApps.length / myApplications.length) * 100 : 0}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-amber-500">Under Review</span>
                    <span>{pendingApps.length}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${myApplications.length ? (pendingApps.length / myApplications.length) * 100 : 0}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-400">Not Selected</span>
                    <span>{rejectedApps.length}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full bg-slate-400" style={{ width: `${myApplications.length ? (rejectedApps.length / myApplications.length) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Top In-Demand Skills in {currentUser.city || 'Your Area'}
              </h4>
              <div className="space-y-2.5 text-xs">
                {[
                  { skill: 'VIP Banquet Service', demand: 'High Demand', rate: '₹500 - ₹700/hr' },
                  { skill: 'Event Photography & Edits', demand: 'Very High', rate: '₹800 - ₹1200/hr' },
                  { skill: 'Sound & Light Tech Assistant', demand: 'Moderate', rate: '₹450 - ₹600/hr' },
                  { skill: 'Bilingual Guest Greeter / MC', demand: 'High Demand', rate: '₹600 - ₹900/hr' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{item.skill}</span>
                      <span className="text-[11px] text-slate-400 block">{item.demand}</span>
                    </div>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{item.rate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Availability Calendar */}
      {activeSubTab === 'availability' && (
        <WorkerAvailabilityCalendar />
      )}

      {/* Sub-Tab 4: Recommended Gigs */}
      {activeSubTab === 'recommended' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/40 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
                Custom Recommended Shifts for You
              </h4>
              <p className="text-xs text-indigo-800 dark:text-indigo-300">
                Matches based on your profile skills in {currentUser.city || 'Mumbai'}.
              </p>
            </div>
            <button
              onClick={onExploreEvents}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
            >
              View Full Event Catalog
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.slice(0, 4).map(event => (
              <div key={event.id} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {event.category}
                  </span>
                  <span className="text-xs text-slate-400">{event.date}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{event.title}</h4>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {event.venue}, {event.city}
                </p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                    Up to ₹4,500/day
                  </span>
                  <button
                    onClick={onExploreEvents}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-700 text-xs font-semibold"
                  >
                    View Roles
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 5: Worker Profile */}
      {activeSubTab === 'profile' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Professional Profile Settings</h3>
              <p className="text-xs text-slate-500">Organizers view this information when reviewing applications.</p>
            </div>
            <button
              onClick={() => {
                updateProfile({
                  city: workerCity,
                  hourlyRate: workerRate,
                  bio: workerBio
                });
                alert('Worker profile successfully updated!');
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md"
            >
              Save Profile Changes
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Base Operating City</label>
              <input
                type="text"
                value={workerCity}
                onChange={e => setWorkerCity(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Target Hourly Rate (₹)</label>
              <input
                type="number"
                value={workerRate}
                onChange={e => setWorkerRate(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Professional Bio & Experience</label>
              <textarea
                rows={3}
                value={workerBio}
                onChange={e => setWorkerBio(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      {showVerification && (
        <IdentityVerificationModal onClose={() => setShowVerification(false)} />
      )}

      {show2FA && (
        <TwoFactorAuthModal onClose={() => setShow2FA(false)} />
      )}

      {showDispute && (
        <DisputeModal
          preselectedEventId={disputeEventId}
          onClose={() => {
            setShowDispute(false);
            setDisputeEventId(undefined);
          }}
        />
      )}

      {showInvoices && (
        <InvoiceModal onClose={() => setShowInvoices(false)} />
      )}

      {showWithdrawal && (
        <WithdrawalModal
          isOpen={showWithdrawal}
          onClose={() => setShowWithdrawal(false)}
        />
      )}

      {selectedMapEvent && (
        <VenueMapModal
          event={selectedMapEvent}
          onClose={() => setSelectedMapEvent(null)}
        />
      )}

    </div>
  );
};
