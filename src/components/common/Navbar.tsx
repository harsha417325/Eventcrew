import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Briefcase, 
  Search, 
  PlusCircle, 
  Bell, 
  Moon, 
  Sun, 
  User as UserIcon, 
  Wallet, 
  MessageSquare, 
  ShieldCheck, 
  LogOut, 
  LogIn,
  ChevronDown,
  Sparkles,
  Calendar,
  CheckCircle2
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAuthModal: (mode: 'login' | 'signup', role?: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, openAuthModal }) => {
  const { currentUser, darkMode, toggleDarkMode, notifications, markNotificationRead, logoutUser } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-[#0F172A] text-white border-b border-slate-800/80 transition-colors shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo matching user image with orange and purple figures */}
        <div 
          onClick={() => setActiveTab('home')} 
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] via-[#9333EA] to-[#F97316] flex items-center justify-center text-white shadow-md shadow-purple-900/30 group-hover:scale-105 transition-transform p-2">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              {/* Group icon with purple and orange accents */}
              <circle cx="9" cy="7" r="3" className="fill-[#F97316]" />
              <circle cx="15" cy="8" r="2.5" className="fill-white" />
              <path d="M4 19c0-3.3 2.7-6 6-6s6 2.7 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M15 13.5c1.8.8 3 2.5 3 4.5" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-extrabold tracking-tight text-white">
              EventCrew
            </span>
          </div>
        </div>

        {/* Primary Nav Links matching user image */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3.5 py-2 rounded-lg transition-colors ${
              activeTab === 'home'
                ? 'text-white font-bold bg-[#7C3AED]'
                : 'text-[#CBD5E1] hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Home
          </button>
          
          {/* Find Jobs - only for worker interface (removed for organizer and admin) */}
          {currentUser.role === 'worker' && (
            <button
              onClick={() => setActiveTab('events')}
              className={`px-3.5 py-2 rounded-lg transition-colors ${
                activeTab === 'events'
                  ? 'text-white font-bold bg-[#7C3AED]'
                  : 'text-[#CBD5E1] hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Find Jobs
            </button>
          )}

          {/* Find Workers - only for organizer interface (removed for worker and admin) */}
          {currentUser.role === 'organizer' && (
            <button
              onClick={() => {
                setActiveTab('organizer-dashboard');
              }}
              className={`px-3.5 py-2 rounded-lg transition-colors ${
                activeTab === 'workers' || activeTab === 'organizer-dashboard'
                  ? 'text-white font-bold bg-[#7C3AED]'
                  : 'text-[#CBD5E1] hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Find Workers
            </button>
          )}

          {/* Dashboard route based on active role */}
          <button
            onClick={() => {
              if (currentUser.role === 'organizer') setActiveTab('organizer-dashboard');
              else if (currentUser.role === 'worker') setActiveTab('worker-dashboard');
              else setActiveTab('admin');
            }}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              ['organizer-dashboard', 'worker-dashboard', 'admin'].includes(activeTab)
                ? 'text-white font-bold bg-[#7C3AED]'
                : 'text-[#CBD5E1] hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>Dashboard</span>
            <span className="capitalize text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white/20 text-white">
              {currentUser.role}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'text-white font-bold bg-[#7C3AED]'
                : 'text-[#CBD5E1] hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-[#CBD5E1]" />
            <span>Messages</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'payments'
                ? 'text-white font-bold bg-[#7C3AED]'
                : 'text-[#CBD5E1] hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Wallet className="w-4 h-4 text-[#22C55E]" />
            <span className="text-[#22C55E] font-semibold">₹{currentUser.walletBalance.toLocaleString('en-IN')}</span>
          </button>
        </nav>

        {/* Right Actions Header matching user image */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* Post a Job CTA for organizer, Admin Panel for admin */}
          {currentUser.role === 'organizer' ? (
            <button
              onClick={() => {
                setActiveTab('organizer-dashboard');
              }}
              className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 cursor-pointer transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Job</span>
            </button>
          ) : currentUser.role === 'admin' ? (
            <button
              onClick={() => setActiveTab('admin')}
              className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md shadow-purple-500/20 transition-all flex items-center gap-1.5 cursor-pointer transform active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Panel</span>
            </button>
          ) : null}

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-[#CBD5E1] hover:text-white hover:bg-slate-800/80 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#F97316] rounded-full ring-2 ring-[#0F172A] animate-pulse" />
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#7C3AED]" /> Notifications
                  </h4>
                  <span className="text-xs bg-[#EDE9FE] text-[#7C3AED] font-medium px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
                      No notifications yet.
                    </p>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                          notif.read
                            ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 opacity-75'
                            : 'bg-[#EDE9FE]/40 dark:bg-purple-950/40 border-[#DDD6FE] dark:border-purple-900/50'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {notif.title}
                          </span>
                          <span className="text-[10px] text-slate-400">{notif.date}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-snug">
                          {notif.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Auth Action */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800/80 transition-colors"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#7C3AED]/40"
              />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1">
                  {currentUser.name}
                  {currentUser.isVerified && (
                    <CheckCircle2 className="w-3 h-3 text-[#22C55E]" />
                  )}
                </div>
                <div className="text-[10px] text-[#CBD5E1] capitalize font-medium">
                  {currentUser.role} • <span className="text-[#22C55E] font-bold">₹{currentUser.walletBalance.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#CBD5E1] hidden sm:block" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl mb-2">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    {currentUser.name}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {currentUser.email}
                  </p>
                  <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Wallet</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{currentUser.walletBalance.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => {
                      if (currentUser.role === 'organizer') setActiveTab('organizer-dashboard');
                      else setActiveTab('worker-dashboard');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
                  >
                    My Dashboard
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('payments');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
                  >
                    Wallet & Payments
                  </button>

                  <button
                    onClick={() => {
                      toggleDarkMode();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                      <span>Theme: {darkMode ? 'Dark' : 'Light'}</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 font-bold text-slate-600 dark:text-slate-300">
                      Switch to {darkMode ? 'Light' : 'Dark'}
                    </span>
                  </button>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        logoutUser();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold text-[11px] flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out of Account</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
