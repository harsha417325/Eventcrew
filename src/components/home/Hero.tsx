import React, { useState } from 'react';
import { Search, MapPin, Briefcase, Users, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';
import { JobCategory } from '../../types';

interface HeroProps {
  onSearch: (city: string, category: string, query: string) => void;
  onExploreClick: () => void;
  onPostJobClick?: () => void;
  isAdmin?: boolean;
  userRole?: string;
  onOpenAdminPanel?: () => void;
  onOpenEscrow?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onSearch, 
  onExploreClick, 
  onPostJobClick,
  isAdmin = false,
  userRole = 'worker',
  onOpenAdminPanel,
  onOpenEscrow
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Bengaluru');
  const [selectedCategory, setSelectedCategory] = useState('');

  const cities = ['All Cities', 'Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune'];
  const categories: JobCategory[] = [
    'Catering',
    'Decoration',
    'Hosting',
    'Photography',
    'Security',
    'Cleaning',
    'Audio & DJ',
    'General Helper'
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(
      selectedCity === 'All Cities' ? '' : selectedCity,
      selectedCategory === 'All Categories' ? '' : selectedCategory,
      searchQuery
    );
  };

  return (
    <div className="w-full">
      {/* Hero Section with Deep Navy #0F172A and Purple Glow */}
      <section className="relative overflow-hidden bg-[#0F172A] text-white pt-10 pb-16 md:pt-16 md:pb-24">
        {/* Subtle Ambient Purple Stage Light Gradients */}
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#7C3AED]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Heading, Subtitle & Action Buttons */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {isAdmin ? (
                <>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#7C3AED]" /> Platform Admin Control
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
                    EventCrew<br />
                    <span className="text-[#7C3AED]">System Operations</span><br />
                    & Governance
                  </h1>
                  <p className="text-slate-300 text-base sm:text-lg max-w-lg leading-relaxed">
                    Supervise verified shift operations, audit credentials, monitor escrow balances, and arbitrate dispute resolutions.
                  </p>
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button
                      onClick={onOpenAdminPanel}
                      className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Open Admin Panel</span>
                    </button>
                    <button
                      onClick={onOpenEscrow}
                      className="bg-[#0F172A] hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-all hover:-translate-y-0.5 cursor-pointer"
                    >
                      Manage Escrow Vault
                    </button>
                  </div>
                </>
              ) : userRole === 'worker' ? (
                <>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
                    Find Part-Time<br />
                    <span className="text-[#7C3AED]">Event Gigs</span><br />
                    Near You
                  </h1>

                  <p className="text-slate-300 text-base sm:text-lg max-w-lg leading-relaxed">
                    Browse verified shifts for catering, hosting, photography, security, and stage management with guaranteed payouts.
                  </p>

                  {/* Worker Action Button: Find Jobs (Post a Job removed for worker) */}
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button
                      onClick={onExploreClick}
                      className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
                    >
                      <Briefcase className="w-4 h-4" />
                      <span>Find Jobs</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
                    Find Skilled<br />
                    <span className="text-[#7C3AED]">Event Staff</span><br />
                    On Demand
                  </h1>

                  <p className="text-slate-300 text-base sm:text-lg max-w-lg leading-relaxed">
                    Connect with verified part-time workers for your next successful event.
                  </p>

                  {/* Action Buttons for Organizer */}
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button
                      onClick={onPostJobClick || onExploreClick}
                      className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 cursor-pointer"
                    >
                      Post a Job
                    </button>
                    <button
                      onClick={onPostJobClick}
                      className="bg-[#0F172A] hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-all hover:-translate-y-0.5 cursor-pointer"
                    >
                      Manage Active Shifts
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Right Column: Live Concert Crowd Image with Purple Lighting */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 group">
                <img
                  src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80"
                  alt="Live Concert Crowd with Purple Stage Lights"
                  className="w-full h-80 sm:h-96 md:h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Subtle Purple and Navy Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED]/20 to-transparent pointer-events-none" />

                {/* Floating pill badge */}
                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-[#0F172A]/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-700/80 shadow-lg flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-ping" />
                  <div>
                    <p className="text-xs font-bold text-white">4,800+ Verified Crew Active</p>
                    <p className="text-[10px] text-slate-400">Ready for instant shift deployment</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Search Bar Card - Hidden on admin & organizer interfaces */}
          {!isAdmin && userRole !== 'organizer' && (
            <div className="mt-10 max-w-5xl mx-auto">
              <form 
                onSubmit={handleSearchSubmit}
                className="bg-white dark:bg-slate-800/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-xl border border-slate-200/40 dark:border-slate-700 text-slate-900 dark:text-white grid grid-cols-1 sm:grid-cols-12 gap-3"
              >
                {/* Search Query */}
                <div className="sm:col-span-5 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700">
                  <Search className="w-4 h-4 text-[#7C3AED] shrink-0" />
                  <input
                    type="text"
                    placeholder="Search jobs (e.g. Catering, Decorator, Photo)..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm focus:outline-none placeholder-slate-400"
                  />
                </div>

                {/* City Location */}
                <div className="sm:col-span-3 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700">
                  <MapPin className="w-4 h-4 text-[#F97316] shrink-0" />
                  <select
                    value={selectedCity}
                    onChange={e => setSelectedCity(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm focus:outline-none text-slate-800 dark:text-slate-200"
                  >
                    <option value="" className="text-slate-900">Select City</option>
                    {cities.map(c => (
                      <option key={c} value={c} className="text-slate-900">{c}</option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div className="sm:col-span-2 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700">
                  <Briefcase className="w-4 h-4 text-[#7C3AED] shrink-0" />
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm focus:outline-none text-slate-800 dark:text-slate-200 truncate"
                  >
                    <option value="" className="text-slate-900">All Roles</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat} className="text-slate-900">{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Search Submit Button */}
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full h-full min-h-[42px] bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Search Jobs</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </section>

      {/* 4 Value Proposition Cards directly under Hero matching user image */}
      <section className="bg-[#F8FAFC] dark:bg-[#0B1120] py-10 sm:py-12 border-b border-slate-200/60 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Verified Workers (Purple) */}
            <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[#EDE9FE] dark:bg-[#7C3AED]/20 flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-[#7C3AED]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Verified Workers
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Trusted and verified professionals
              </p>
            </div>

            {/* Card 2: Location Based (Orange) */}
            <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[#FFEDD5] dark:bg-[#F97316]/20 flex items-center justify-center mb-4">
                <MapPin className="w-7 h-7 text-[#F97316]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Location Based
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Find nearby workers within your radius
              </p>
            </div>

            {/* Card 3: Real-time Chat (Emerald Green) */}
            <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[#DCFCE7] dark:bg-[#22C55E]/20 flex items-center justify-center mb-4">
                <MessageSquare className="w-7 h-7 text-[#22C55E]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Real-time Chat
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Communicate instantly and easily
              </p>
            </div>

            {/* Card 4: Secure Payments (Blue) */}
            <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[#E0F2FE] dark:bg-[#0284C7]/20 flex items-center justify-center mb-4">
                <ShieldCheck className="w-7 h-7 text-[#0284C7]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Secure Payments
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Safe and secure payment system
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
