import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  Briefcase, 
  UserCheck, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Search, 
  Filter, 
  Building2, 
  MapPin, 
  IndianRupee, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  UserX, 
  UserPlus, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  BarChart3,
  FileText,
  BadgeAlert
} from 'lucide-react';
import { EventItem, User, UserRole, JobCategory } from '../../types';

export const AdminPanel: React.FC = () => {
  const { 
    users, 
    events, 
    applications, 
    complaints, 
    updateEventStatus, 
    resolveComplaint 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'upcoming-events' | 'completed-events' | 'users' | 'complaints'>('overview');
  
  // User Filters
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'organizer' | 'worker' | 'admin'>('all');
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Event Filters
  const [eventSearchQuery, setEventSearchQuery] = useState('');
  const [eventCityFilter, setEventCityFilter] = useState('All');

  // Complaint Resolution Modal/State
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  // Local user verification simulation state
  const [verifiedUserIds, setVerifiedUserIds] = useState<string[]>(() => 
    users.filter(u => u.isVerified).map(u => u.id)
  );
  const [suspendedUserIds, setSuspendedUserIds] = useState<string[]>(() => 
    users.filter(u => u.status === 'suspended').map(u => u.id)
  );

  // -------------------------------------------------------------
  // Calculations
  // -------------------------------------------------------------
  const totalUsersCount = users.length;
  const organizersCount = users.filter(u => u.role === 'organizer').length;
  const workersCount = users.filter(u => u.role === 'worker').length;
  const adminCount = users.filter(u => u.role === 'admin').length;

  const todayStr = new Date().toISOString().split('T')[0];

  // Upcoming Events: Status is published, ongoing, pending_approval, or draft (not completed and not cancelled)
  const upcomingEvents = events.filter(e => e.status !== 'completed' && e.status !== 'cancelled');
  
  // Events Already Done (Completed): Status is completed OR endDate < today
  const completedEvents = events.filter(e => e.status === 'completed' || (e.endDate < todayStr && e.status !== 'cancelled'));

  const totalEventBudget = events.reduce((sum, e) => sum + e.budgetTotal, 0);
  const totalCompletedBudget = completedEvents.reduce((sum, e) => sum + e.budgetTotal, 0);

  // Filtered Users List
  const filteredUsers = users.filter(u => {
    if (userRoleFilter !== 'all' && u.role !== userRoleFilter) return false;
    if (userSearchQuery) {
      const q = userSearchQuery.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.city.toLowerCase().includes(q);
    }
    return true;
  });

  // Filtered Upcoming Events List
  const filteredUpcomingEvents = upcomingEvents.filter(e => {
    if (eventCityFilter !== 'All' && e.city.toLowerCase() !== eventCityFilter.toLowerCase()) return false;
    if (eventSearchQuery) {
      const q = eventSearchQuery.toLowerCase();
      return e.title.toLowerCase().includes(q) || e.organizerName.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q);
    }
    return true;
  });

  // Filtered Completed Events List
  const filteredCompletedEvents = completedEvents.filter(e => {
    if (eventCityFilter !== 'All' && e.city.toLowerCase() !== eventCityFilter.toLowerCase()) return false;
    if (eventSearchQuery) {
      const q = eventSearchQuery.toLowerCase();
      return e.title.toLowerCase().includes(q) || e.organizerName.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q);
    }
    return true;
  });

  // Unique cities from events
  const allCities = ['All', ...Array.from(new Set(events.map(e => e.city)))];

  // Toggle user verification
  const handleToggleVerification = (userId: string) => {
    if (verifiedUserIds.includes(userId)) {
      setVerifiedUserIds(prev => prev.filter(id => id !== userId));
    } else {
      setVerifiedUserIds(prev => [...prev, userId]);
    }
  };

  // Toggle user account status (active/suspended)
  const handleToggleSuspension = (userId: string) => {
    if (suspendedUserIds.includes(userId)) {
      setSuspendedUserIds(prev => prev.filter(id => id !== userId));
    } else {
      setSuspendedUserIds(prev => [...prev, userId]);
    }
  };

  const handleResolveComplaintSubmit = (complaintId: string) => {
    if (!resolutionText.trim()) return;
    resolveComplaint(complaintId, resolutionText);
    setSelectedComplaint(null);
    setResolutionText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-xl border border-purple-500/20">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              EventCrew Command Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              System Administration Dashboard
            </h1>
            <p className="text-sm text-purple-200/80 max-w-2xl">
              Real-time platform telemetry, user registration metrics, organizer & crew analytics, upcoming events control, and completed event audit logs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('upcoming-events')}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-900/40 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Upcoming ({upcomingEvents.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('completed-events')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/40 transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Completed ({completedEvents.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Telemetry Grid (Requirements 1, 2, 3, 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Registered Users Count */}
        <div 
          onClick={() => setActiveTab('users')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-purple-400 dark:hover:border-purple-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2.5 py-1 rounded-full border border-purple-200 dark:border-purple-800">
              Total Accounts
            </span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalUsersCount}</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <span>Registered Platform Users</span>
            </p>
          </div>
        </div>

        {/* Metric 2: Organizers vs Part-Time Workers (Separate Breakdown) */}
        <div 
          onClick={() => setActiveTab('users')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
              Role Division
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 dark:border-slate-700/60 pt-2">
            <div>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">{organizersCount}</p>
              <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">Organizers</p>
            </div>
            <div className="border-l border-slate-200 dark:border-slate-700 pl-2">
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">{workersCount}</p>
              <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Part-Time Crew</p>
            </div>
          </div>
        </div>

        {/* Metric 3: Upcoming Events Count */}
        <div 
          onClick={() => setActiveTab('upcoming-events')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
              Upcoming
            </span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{upcomingEvents.length}</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              Active / Scheduled Events
            </p>
          </div>
        </div>

        {/* Metric 4: Events Already Done Count */}
        <div 
          onClick={() => setActiveTab('completed-events')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-400 dark:hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              Completed
            </span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{completedEvents.length}</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              Events Done & Settled
            </p>
          </div>
        </div>

      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('upcoming-events')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'upcoming-events'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Upcoming Events</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/30 text-purple-100 font-extrabold">
            {upcomingEvents.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('completed-events')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'completed-events'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Events Done</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/30 text-emerald-100 font-extrabold">
            {completedEvents.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'users'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Registered Users</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-700 text-slate-200 font-extrabold">
            {totalUsersCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('complaints')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'complaints'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BadgeAlert className="w-4 h-4" />
          <span>Complaints & Disputes</span>
          {complaints.filter(c => c.status !== 'resolved').length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-extrabold animate-pulse">
              {complaints.filter(c => c.status !== 'resolved').length}
            </span>
          )}
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: OVERVIEW & TELEMETRY */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Quick Analytics Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* User Demographics Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  User Role Distribution
                </h3>
                <span className="text-xs font-bold text-slate-400">{totalUsersCount} Total</span>
              </div>

              <div className="space-y-3">
                {/* Organizers Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                      Event Organizers
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400">
                      {organizersCount} ({Math.round((organizersCount / (totalUsersCount || 1)) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 rounded-full transition-all"
                      style={{ width: `${(organizersCount / (totalUsersCount || 1)) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Workers Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Part-Time Crew Workers
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {workersCount} ({Math.round((workersCount / (totalUsersCount || 1)) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${(workersCount / (totalUsersCount || 1)) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Admins Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
                      System Administrators
                    </span>
                    <span className="text-purple-600 dark:text-purple-400">
                      {adminCount} ({Math.round((adminCount / (totalUsersCount || 1)) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-600 rounded-full transition-all"
                      style={{ width: `${(adminCount / (totalUsersCount || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex justify-between items-center text-xs text-slate-500">
                <span>Verified Accounts: {users.filter(u => u.isVerified).length}</span>
                <span>Active Status: {users.filter(u => u.status !== 'suspended').length}</span>
              </div>
            </div>

            {/* Event Lifecycle Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Event Lifecycle Breakdown
                </h3>
                <span className="text-xs font-bold text-slate-400">{events.length} Total</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 text-center">
                  <p className="text-2xl font-extrabold text-blue-700 dark:text-blue-300">{upcomingEvents.length}</p>
                  <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mt-0.5">Upcoming Events</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/40 text-center">
                  <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">{completedEvents.length}</p>
                  <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mt-0.5">Events Done</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between font-semibold text-slate-600 dark:text-slate-300">
                  <span>Published & Active:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{events.filter(e => e.status === 'published').length}</span>
                </div>
                <div className="flex justify-between font-semibold text-slate-600 dark:text-slate-300">
                  <span>Ongoing Today:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{events.filter(e => e.status === 'ongoing').length}</span>
                </div>
                <div className="flex justify-between font-semibold text-slate-600 dark:text-slate-300">
                  <span>Pending Approval:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{events.filter(e => e.status === 'pending_approval').length}</span>
                </div>
              </div>
            </div>

            {/* Platform Financials Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Platform Volume
                </h3>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Escrow Verified
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                <p className="text-xs font-medium text-slate-400">Total Event Budget Volume</p>
                <p className="text-2xl font-extrabold text-emerald-400">₹{totalEventBudget.toLocaleString('en-IN')}</p>
                <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
                  <span>Completed Event Payouts:</span>
                  <span className="font-bold text-white">₹{totalCompletedBudget.toLocaleString('en-IN')}</span>
                </p>
              </div>

              <div className="text-xs text-slate-500 space-y-1">
                <p className="flex justify-between">
                  <span>Job Applications Total:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{applications.length}</span>
                </p>
                <p className="flex justify-between">
                  <span>Accepted Hires in Escrow:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {applications.filter(a => a.payoutStatus === 'escrow').length}
                  </span>
                </p>
              </div>
            </div>

          </div>

          {/* Quick Preview Grid of Upcoming vs Completed */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Upcoming Events Preview List */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Upcoming Events ({upcomingEvents.length})
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('upcoming-events')}
                  className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {upcomingEvents.slice(0, 3).map(evt => (
                  <div 
                    key={evt.id} 
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{evt.title}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                          {evt.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-3">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{evt.city}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{evt.startDate}</span>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">₹{evt.budgetTotal.toLocaleString('en-IN')}</p>
                      <span className="text-[10px] font-bold text-slate-500 capitalize">{evt.organizerName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Completed Events Preview List */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Events Already Done ({completedEvents.length})
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('completed-events')}
                  className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {completedEvents.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4 text-center">No completed events logged yet.</p>
                ) : (
                  completedEvents.slice(0, 3).map(evt => (
                    <div 
                      key={evt.id} 
                      className="p-3.5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{evt.title}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200">
                            Done
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-3">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{evt.city}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{evt.endDate}</span>
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-extrabold text-slate-900 dark:text-white">₹{evt.budgetTotal.toLocaleString('en-IN')}</p>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Settled & Closed</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: UPCOMING EVENTS LIST & COUNT (Requirement 3) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'upcoming-events' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Upcoming Events Catalog
                </h2>
                <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-extrabold">
                  Count: {upcomingEvents.length}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Active and scheduled upcoming event listings requiring shift fulfillment or management.
              </p>
            </div>

            {/* Filter inputs */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search upcoming events..."
                  value={eventSearchQuery}
                  onChange={(e) => setEventSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 w-48 sm:w-60"
                />
              </div>

              <select
                value={eventCityFilter}
                onChange={(e) => setEventCityFilter(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold focus:outline-none"
              >
                {allCities.map(city => (
                  <option key={city} value={city}>{city === 'All' ? 'All Cities' : city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Upcoming Events Grid */}
          {filteredUpcomingEvents.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <p className="text-base font-bold text-slate-900 dark:text-white">No upcoming events found</p>
              <p className="text-xs text-slate-500">Try adjusting your search query or city filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredUpcomingEvents.map(evt => (
                <div 
                  key={evt.id} 
                  className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 hover:shadow-md transition-all relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[11px] font-extrabold uppercase tracking-wider">
                          {evt.category}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[11px] font-bold capitalize border border-blue-200 dark:border-blue-800">
                          Status: {evt.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white pt-1">
                        {evt.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                        {evt.description}
                      </p>
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      <span className="truncate">{evt.venue}, {evt.city}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      <span>{evt.startDate} to {evt.endDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="truncate">Organizer: {evt.organizerName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <IndianRupee className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                        ₹{evt.budgetTotal.toLocaleString('en-IN')} Budget
                      </span>
                    </div>
                  </div>

                  {/* Roles Needed Summary */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>Shift Staffing Requirements</span>
                      <span className="text-purple-600 dark:text-purple-400">
                        {evt.rolesNeeded.reduce((s, r) => s + r.quantityFilled, 0)} / {evt.rolesNeeded.reduce((s, r) => s + r.quantityNeeded, 0)} Filled
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {evt.rolesNeeded.map(role => (
                        <span 
                          key={role.id}
                          className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700/70 text-[11px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-600/60 flex items-center gap-1"
                        >
                          <span>{role.title}</span>
                          <span className="text-purple-600 dark:text-purple-400 font-extrabold">({role.quantityFilled}/{role.quantityNeeded})</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Admin Quick Status Override Controls */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400 font-medium">Admin Actions:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateEventStatus(evt.id, 'completed')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                        title="Mark event as completed & settled"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Done</span>
                      </button>

                      {evt.status === 'pending_approval' && (
                        <button
                          onClick={() => updateEventStatus(evt.id, 'published')}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      )}

                      <button
                        onClick={() => updateEventStatus(evt.id, 'cancelled')}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: EVENTS ALREADY DONE LIST & COUNT (Requirement 4) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'completed-events' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Events Already Done (Audit Log)
                </h2>
                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold">
                  Count: {completedEvents.length}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Completed and archived event history with verified shift execution and released escrow payouts.
              </p>
            </div>

            {/* Filter inputs */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search done events..."
                  value={eventSearchQuery}
                  onChange={(e) => setEventSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-48 sm:w-60"
                />
              </div>

              <select
                value={eventCityFilter}
                onChange={(e) => setEventCityFilter(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold focus:outline-none"
              >
                {allCities.map(city => (
                  <option key={city} value={city}>{city === 'All' ? 'All Cities' : city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Completed Events Table / Cards */}
          {filteredCompletedEvents.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <p className="text-base font-bold text-slate-900 dark:text-white">No completed events found</p>
              <p className="text-xs text-slate-500">Events marked as completed will automatically appear here.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Event Details</th>
                      <th className="p-4">Category & Location</th>
                      <th className="p-4">Organizer</th>
                      <th className="p-4">Date Completed</th>
                      <th className="p-4">Payout Spent</th>
                      <th className="p-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-medium">
                    {filteredCompletedEvents.map(evt => (
                      <tr key={evt.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="p-4">
                          <div className="space-y-0.5">
                            <p className="font-extrabold text-slate-900 dark:text-white text-sm">{evt.title}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">{evt.venue}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px]">
                              {evt.category}
                            </span>
                            <p className="text-[11px] text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-purple-500" /> {evt.city}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-slate-900 dark:text-white">{evt.organizerName}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-slate-600 dark:text-slate-300 font-mono">{evt.endDate}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                            ₹{evt.budgetTotal.toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-[11px] border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Completed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: REGISTERED USERS DIRECTORY (Requirements 1 & 2) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Registered Users Directory
                </h2>
                <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-extrabold">
                  Total: {totalUsersCount}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Full database of registered organizers ({organizersCount}), part-time crew ({workersCount}), and administrators ({adminCount}).
              </p>
            </div>

            {/* Filter Buttons & Search */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search user name or email..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 w-48 sm:w-60"
                />
              </div>

              {/* Role Filter Tabs */}
              <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex gap-1 text-[11px] font-bold">
                <button
                  onClick={() => setUserRoleFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    userRoleFilter === 'all'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All ({totalUsersCount})
                </button>
                <button
                  onClick={() => setUserRoleFilter('organizer')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    userRoleFilter === 'organizer'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Organizers ({organizersCount})
                </button>
                <button
                  onClick={() => setUserRoleFilter('worker')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    userRoleFilter === 'worker'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Part-Time Crew ({workersCount})
                </button>
              </div>
            </div>
          </div>

          {/* User Directory Table */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">User Profile</th>
                    <th className="p-4">Role & City</th>
                    <th className="p-4">Contact Info</th>
                    <th className="p-4">Wallet Balance</th>
                    <th className="p-4">Verification</th>
                    <th className="p-4 text-center">Account Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-medium">
                  {filteredUsers.map(user => {
                    const isVerified = verifiedUserIds.includes(user.id);
                    const isSuspended = suspendedUserIds.includes(user.id);

                    return (
                      <tr key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={user.avatar} 
                              alt={user.name} 
                              className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700" 
                            />
                            <div>
                              <p className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                                {user.name}
                                {isVerified && (
                                  <ShieldCheck className="w-4 h-4 text-blue-500" title="Verified Badge" />
                                )}
                              </p>
                              <p className="text-[11px] text-slate-400">Rating: ⭐ {user.rating} ({user.reviewCount} reviews)</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="space-y-1">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              user.role === 'organizer' 
                                ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                                : user.role === 'worker'
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                            }`}>
                              {user.role === 'worker' ? 'Part-Time Crew' : user.role}
                            </span>
                            <p className="text-[11px] text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-purple-500" /> {user.city}
                            </p>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="space-y-0.5 text-[11px]">
                            <p className="font-mono text-slate-800 dark:text-slate-200">{user.email}</p>
                            <p className="text-slate-400">{user.phone || 'No phone set'}</p>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                            ₹{user.walletBalance.toLocaleString('en-IN')}
                          </span>
                        </td>

                        <td className="p-4">
                          <button
                            onClick={() => handleToggleVerification(user.id)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                              isVerified 
                                ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {isVerified ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Verified</span>
                              </>
                            ) : (
                              <span>Mark Verified</span>
                            )}
                          </button>
                        </td>

                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleToggleSuspension(user.id)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 mx-auto ${
                              isSuspended
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-rose-100 dark:hover:bg-rose-950 hover:text-rose-600 dark:hover:text-rose-400'
                            }`}
                          >
                            {isSuspended ? (
                              <>
                                <UserX className="w-3.5 h-3.5" />
                                <span>Suspended</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Active</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: COMPLAINTS & DISPUTES */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'complaints' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2">
              <BadgeAlert className="w-5 h-5 text-rose-500" />
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Dispute Resolution & System Complaints
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Investigate and resolve shift complaints filed between organizers and part-time crew members.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complaints.map(complaint => (
              <div 
                key={complaint.id} 
                className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      complaint.status === 'open'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                        : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    }`}>
                      Status: {complaint.status}
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {complaint.eventTitle}
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{complaint.createdAt}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60 space-y-1.5 text-xs">
                  <p className="text-slate-500">
                    Complainant: <span className="font-bold text-slate-900 dark:text-white">{complaint.complainantName} ({complaint.complainantRole})</span>
                  </p>
                  <p className="text-slate-500">
                    Reason: <span className="font-bold text-rose-600 dark:text-rose-400">{complaint.reason}</span>
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 italic pt-1 border-t border-slate-200 dark:border-slate-700">
                    "{complaint.details}"
                  </p>
                </div>

                {complaint.resolution ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 text-xs space-y-1">
                    <p className="font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Resolution Executed
                    </p>
                    <p className="text-slate-600 dark:text-slate-300">{complaint.resolution}</p>
                  </div>
                ) : (
                  <div className="space-y-3 pt-2">
                    {selectedComplaint === complaint.id ? (
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          placeholder="Type official admin resolution decision..."
                          value={resolutionText}
                          onChange={(e) => setResolutionText(e.target.value)}
                          className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-purple-300 dark:border-purple-700 text-xs outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleResolveComplaintSubmit(complaint.id)}
                            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all cursor-pointer"
                          >
                            Save Resolution
                          </button>
                          <button
                            onClick={() => setSelectedComplaint(null)}
                            className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedComplaint(complaint.id)}
                        className="w-full py-2.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900 font-bold text-xs transition-colors cursor-pointer"
                      >
                        Resolve Dispute
                      </button>
                    )}
                  </div>
                )}

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
