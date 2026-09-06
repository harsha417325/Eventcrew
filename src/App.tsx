/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { OfflineBanner } from './components/common/OfflineBanner';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { Hero } from './components/home/Hero';
import { CategoryGrid } from './components/home/CategoryGrid';
import { HowItWorks } from './components/home/HowItWorks';
import { Testimonials } from './components/home/Testimonials';
import { EventCard } from './components/events/EventCard';
import { EventFilter } from './components/events/EventFilter';
import { EventDetailModal } from './components/events/EventDetailModal';
import { ApplyModal } from './components/events/ApplyModal';
import { OrganizerDashboard } from './components/organizer/OrganizerDashboard';
import { OrganizerPostEventSection } from './components/organizer/OrganizerPostEventSection';
import { WorkerDashboard } from './components/worker/WorkerDashboard';
import { ChatSystem } from './components/chat/ChatSystem';
import { PaymentSystem } from './components/payments/PaymentSystem';
import { AdminPanel } from './components/admin/AdminPanel';
import { AdminHomeOverview } from './components/admin/AdminHomeOverview';
import { OrganizerHomeOverview } from './components/organizer/OrganizerHomeOverview';
import { AuthModals } from './components/auth/AuthModals';
import { LoginGate } from './components/auth/LoginGate';
import { EventItem, JobRoleNeeded, JobCategory } from './types';
import { Search, Sparkles, Filter, CheckCircle2 } from 'lucide-react';

function AppContent() {
  const { events, currentUser, isLoggedIn, conversations, messages } = useAuth();

  const [activeTab, setActiveTab] = useState<string>(() => {
    return currentUser?.role === 'admin' ? 'admin' : 'home';
  });
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'login' | 'signup'; role?: 'organizer' | 'worker' | 'admin' }>({ open: false, mode: 'login', role: 'worker' });

  // Event Explorer filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPay, setMinPay] = useState(0);
  const [sortBy, setSortBy] = useState('newest');

  // Modals state
  const [selectedEventDetails, setSelectedEventDetails] = useState<EventItem | null>(null);
  const [applyModalData, setApplyModalData] = useState<{ event: EventItem; role?: JobRoleNeeded } | null>(null);
  const [selectedChatWorkerId, setSelectedChatWorkerId] = useState<string | undefined>(undefined);
  const [selectedChatEventId, setSelectedChatEventId] = useState<string | undefined>(undefined);
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(undefined);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!isLoggedIn) {
    return <LoginGate />;
  }

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const unreadMessagesCount = messages.filter(m => m.receiverId === currentUser.id && !m.read).length;

  const handleHeroSearch = (city: string, category: string, query: string) => {
    setSelectedCity(city);
    setSelectedCategory(category);
    setSearchQuery(query);
    setActiveTab('events');
  };

  const handleSelectCategory = (cat: JobCategory) => {
    setSelectedCategory(cat);
    setActiveTab('events');
  };

  // Filter & Sort Events
  const filteredEvents = events.filter(evt => {
    if (selectedCity && selectedCity !== 'All Cities' && evt.city.toLowerCase() !== selectedCity.toLowerCase()) {
      return false;
    }
    if (selectedCategory && selectedCategory !== 'All Categories' && evt.category !== selectedCategory) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = evt.title.toLowerCase().includes(q);
      const matchDesc = evt.description.toLowerCase().includes(q);
      const matchRole = evt.rolesNeeded.some(r => r.title.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchRole) return false;
    }
    if (minPay > 0) {
      const maxPay = evt.rolesNeeded.reduce((m, r) => r.payPerWorker > m ? r.payPerWorker : m, 0);
      if (maxPay < minPay) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'highest_pay') {
      const payA = a.rolesNeeded.reduce((m, r) => r.payPerWorker > m ? r.payPerWorker : m, 0);
      const payB = b.rolesNeeded.reduce((m, r) => r.payPerWorker > m ? r.payPerWorker : m, 0);
      return payB - payA;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors flex flex-col font-sans pb-16 md:pb-0">
      
      {/* Offline Mode Banner */}
      <OfflineBanner />

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAuthModal={(mode, role) => setAuthModal({ open: true, mode, role })}
      />

      {/* Toast Notification Banner */}
      {toastMsg && (
        <div className="fixed bottom-20 md:bottom-5 right-5 z-50 px-4 py-3 rounded-2xl bg-slate-900 text-white font-semibold text-xs shadow-2xl border border-indigo-500/40 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* VIEW 1: HOME PAGE */}
        {activeTab === 'home' && (
          <div>
            <Hero
              onSearch={handleHeroSearch}
              onExploreClick={() => setActiveTab('events')}
              onPostJobClick={() => {
                if (currentUser.role === 'organizer') setActiveTab('organizer-dashboard');
                else setActiveTab('events');
              }}
              isAdmin={currentUser.role === 'admin'}
              userRole={currentUser.role}
              onOpenAdminPanel={() => setActiveTab('admin')}
              onOpenEscrow={() => setActiveTab('payments')}
            />

            {/* Role-specific Home Page View */}
            {currentUser.role === 'admin' ? (
              <AdminHomeOverview
                onOpenAdminPanel={() => setActiveTab('admin')}
                onOpenEscrow={() => setActiveTab('payments')}
                onOpenMessages={() => setActiveTab('chat')}
              />
            ) : currentUser.role === 'organizer' ? (
              <OrganizerHomeOverview
                onOpenDashboard={() => setActiveTab('organizer-dashboard')}
                onOpenPayments={() => setActiveTab('payments')}
                onOpenChat={() => setActiveTab('chat')}
              />
            ) : (
              <>
                <CategoryGrid onSelectCategory={handleSelectCategory} />
                
                {/* Featured Jobs Section matching User's Reference Layout */}
                <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left / Main: Featured Jobs List */}
                    <div className="lg:col-span-8 space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                            Featured Jobs
                          </h2>
                        </div>
                        <button
                          onClick={() => setActiveTab('events')}
                          className="text-xs sm:text-sm font-semibold text-[#7C3AED] hover:text-[#6D28D9] transition-colors cursor-pointer"
                        >
                          View All
                        </button>
                      </div>

                      {/* Horizontal List of Featured Jobs */}
                      <div className="space-y-3.5">
                        {events.slice(0, 4).map(evt => (
                          <EventCard
                            key={evt.id}
                            event={evt}
                            layout="row"
                            onViewDetails={event => setSelectedEventDetails(event)}
                            onQuickApply={event => {
                              if (currentUser.role !== 'worker') {
                                showToast('Switch to Worker role to apply for shifts!');
                                return;
                              }
                              setApplyModalData({ event });
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Right / Sidebar: How It Works Card from user mockup */}
                    <div className="lg:col-span-4 space-y-6">
                      <HowItWorks />

                      {/* Quick Nearby Banner */}
                      <div className="bg-[#0F172A] text-white p-6 rounded-2xl border border-slate-800 shadow-md relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C3AED]/20 rounded-full blur-2xl pointer-events-none" />
                        <div className="relative z-10 space-y-3">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#F97316] text-white">
                            Nearby Events
                          </span>
                          <h3 className="text-base font-bold">
                            Bengaluru City Shifts
                          </h3>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            Explore immediate shifts within 10 km radius with verified escrow payments.
                          </p>
                          <button
                            onClick={() => {
                              setSelectedCity('Bengaluru');
                              setActiveTab('events');
                            }}
                            className="w-full py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                          >
                            Explore Nearby Gigs
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </section>

                {/* Grid of All Live Opportunities */}
                <section className="py-12 bg-white dark:bg-slate-900/60 border-t border-slate-200/70 dark:border-slate-800">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#7C3AED]">
                          Explore Shifts
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
                          More Event Opportunities
                        </h2>
                      </div>
                      <button
                        onClick={() => setActiveTab('events')}
                        className="px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold transition-all"
                      >
                        All Events ({events.length})
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {events.slice(0, 6).map(evt => (
                        <EventCard
                          key={evt.id}
                          event={evt}
                          layout="grid"
                          onViewDetails={event => setSelectedEventDetails(event)}
                          onQuickApply={event => {
                            if (currentUser.role !== 'worker') {
                              showToast('Switch to Worker role to apply for shifts!');
                              return;
                            }
                            setApplyModalData({ event });
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </section>

                <Testimonials />
              </>
            )}
          </div>
        )}

        {/* VIEW 2: EXPLORE EVENTS / POST EVENT */}
        {activeTab === 'events' && (
          currentUser.role === 'organizer' ? (
            <OrganizerPostEventSection onEventCreated={() => setActiveTab('organizer-dashboard')} />
          ) : (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
              
              {/* Header Title with Search Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    Explore Part-Time Event Gigs
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Verified shifts with secure escrow deposit guarantees and instant wallet release.
                  </p>
                </div>

                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search roles, titles, festivals..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Horizontal Filters Bar */}
              <EventFilter
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                minPay={minPay}
                setMinPay={setMinPay}
                sortBy={sortBy}
                setSortBy={setSortBy}
                onReset={() => {
                  setSelectedCity('');
                  setSelectedCategory('');
                  setMinPay(0);
                  setSearchQuery('');
                  setSortBy('newest');
                }}
              />

              {/* Events Grid */}
              <div>
                {filteredEvents.length === 0 ? (
                  <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="text-base font-bold text-slate-900 dark:text-white">No events match your search.</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try clearing filters or changing your city/category choice.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map(evt => (
                      <EventCard
                        key={evt.id}
                        event={evt}
                        onViewDetails={event => setSelectedEventDetails(event)}
                        onQuickApply={event => {
                          if (currentUser.role !== 'worker') {
                            showToast('Switch to Worker role to apply for shifts!');
                            return;
                          }
                          setApplyModalData({ event });
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        )}

        {/* VIEW 3: ORGANIZER DASHBOARD */}
        {activeTab === 'organizer-dashboard' && (
          <OrganizerDashboard
            onStartChat={(workerId, eventId) => {
              setSelectedChatWorkerId(workerId);
              setSelectedChatEventId(eventId);
              setSelectedChatId(undefined);
              setActiveTab('chat');
              showToast('Opened shift conversation thread.');
            }}
            onOpenGroupChat={(chatId) => {
              setSelectedChatId(chatId);
              setActiveTab('chat');
              showToast('Joined Crew Team Channel.');
            }}
          />
        )}

        {/* VIEW 4: WORKER DASHBOARD */}
        {activeTab === 'worker-dashboard' && (
          <WorkerDashboard
            onExploreEvents={() => setActiveTab('events')}
            onStartChat={(targetUserId, eventId, isGroup) => {
              if (isGroup || targetUserId.startsWith('group_') || targetUserId.startsWith('crew_group')) {
                setSelectedChatId(targetUserId);
                setSelectedChatWorkerId(undefined);
                setSelectedChatEventId(eventId);
              } else {
                setSelectedChatWorkerId(targetUserId);
                setSelectedChatEventId(eventId);
                setSelectedChatId(undefined);
              }
              setActiveTab('chat');
              showToast('Opened shift conversation channel.');
            }}
          />
        )}

        {/* VIEW 5: CHAT / MESSAGING */}
        {activeTab === 'chat' && (
          <ChatSystem
            initialWorkerId={selectedChatWorkerId}
            initialEventId={selectedChatEventId}
            initialChatId={selectedChatId}
          />
        )}

        {/* VIEW 6: WALLET & PAYMENTS */}
        {activeTab === 'payments' && <PaymentSystem />}

        {/* VIEW 7: ADMIN DASHBOARD */}
        {activeTab === 'admin' && <AdminPanel />}

      </main>

      {/* Global Modals */}
      {selectedEventDetails && (
        <EventDetailModal
          event={selectedEventDetails}
          onClose={() => setSelectedEventDetails(null)}
          onOpenApply={(role) => {
            if (currentUser.role !== 'worker') {
              showToast('Please switch to Part-Time Worker role to submit shift application!');
              return;
            }
            setApplyModalData({ event: selectedEventDetails, role });
          }}
        />
      )}

      {applyModalData && (
        <ApplyModal
          event={applyModalData.event}
          selectedRole={applyModalData.role}
          onClose={() => setApplyModalData(null)}
          onSuccess={() => {
            setApplyModalData(null);
            showToast('Application submitted successfully to Event Organizer!');
            setActiveTab('worker-dashboard');
          }}
        />
      )}

      {authModal.open && (
        <AuthModals
          mode={authModal.mode}
          initialRole={authModal.role || (currentUser.role as any) || 'worker'}
          onClose={() => setAuthModal(prev => ({ ...prev, open: false }))}
          onSwitchMode={(mode) => setAuthModal(prev => ({ ...prev, mode }))}
        />
      )}

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'worker-dash') setActiveTab('worker-dashboard');
          else if (tab === 'organizer-dash') setActiveTab('organizer-dashboard');
          else if (tab === 'admin-panel') setActiveTab('admin');
          else if (tab === 'messages') setActiveTab('chat');
          else setActiveTab(tab);
        }}
        onOpenWallet={() => setActiveTab('payments')}
        unreadMessagesCount={unreadMessagesCount}
      />

      {/* Main Footer */}
      <Footer />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
