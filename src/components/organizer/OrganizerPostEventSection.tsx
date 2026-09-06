import React, { useState } from 'react';
import { JobCategory, JobRoleNeeded } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { 
  PlusCircle, 
  Sparkles, 
  Plus, 
  Trash2, 
  Calendar, 
  MapPin, 
  IndianRupee, 
  Clock, 
  Check, 
  Briefcase, 
  ShieldCheck, 
  Image as ImageIcon,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface OrganizerPostEventSectionProps {
  onEventCreated?: () => void;
}

export const OrganizerPostEventSection: React.FC<OrganizerPostEventSectionProps> = ({ onEventCreated }) => {
  const { createEvent, showToast } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<JobCategory>('Catering');
  const [city, setCity] = useState('Mumbai');
  const [venue, setVenue] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('02:00 PM - 09:00 PM');
  const [description, setDescription] = useState('');
  const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80');

  const [generatingAi, setGeneratingAi] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const [roles, setRoles] = useState<Omit<JobRoleNeeded, 'id' | 'quantityFilled' | 'status'>[]>([
    {
      title: 'Banquet Waiter / Server',
      category: 'Catering',
      quantityNeeded: 4,
      payPerWorker: 2200,
      payType: 'flat',
      shiftHours: 7,
      skillsRequired: ['Tray Service', 'Black Tie Uniform']
    }
  ]);

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

  const cities = ['Mumbai', 'Bengaluru', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'];

  const bannerOptions = [
    { label: 'Corporate Gala', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Wedding Expo', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Music Fest', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Conference', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80' }
  ];

  // Calculate total budget automatically
  const totalBudget = roles.reduce((sum, r) => sum + (r.quantityNeeded * r.payPerWorker), 0);

  const handleAddRole = () => {
    setRoles(prev => [
      ...prev,
      {
        title: 'Guest Host / Usher',
        category: 'Hosting',
        quantityNeeded: 2,
        payPerWorker: 1800,
        payType: 'flat',
        shiftHours: 6,
        skillsRequired: ['Guest Check-in']
      }
    ]);
  };

  const handleRemoveRole = (index: number) => {
    if (roles.length > 1) {
      setRoles(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleGenerateAiDescription = async () => {
    setGeneratingAi(true);
    try {
      const res = await fetch('/api/ai/suggest-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, city, roles })
      });
      const data = await res.json();
      setDescription(data.description || '');
    } catch (e) {
      setDescription(`We are hosting the upcoming ${title || 'Special Event'} in ${city}. We are looking for experienced, punctual staff for ${roles.map(r => r.title).join(', ')}. Clean uniform and professional conduct expected. Food & beverages provided.`);
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Please enter an event title.');
      return;
    }

    const formattedRoles: JobRoleNeeded[] = roles.map((r, i) => ({
      ...r,
      id: `role_post_${Date.now()}_${i}`,
      quantityFilled: 0,
      status: 'open'
    }));

    createEvent({
      title,
      description: description || `Event staffing job post for ${title}.`,
      category,
      city,
      venue: venue || `${city} Exhibition Center`,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: startDate || new Date().toISOString().split('T')[0],
      time,
      status: 'published',
      bannerUrl,
      budgetTotal: totalBudget,
      rolesNeeded: formattedRoles
    });

    setSubmittedSuccess(true);
    showToast('Event published successfully!');

    if (onEventCreated) {
      onEventCreated();
    }
  };

  if (submittedSuccess) {
    return (
      <div className="max-w-4xl mx-auto my-8 p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-5 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Event Job Successfully Posted!
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Your event <strong className="text-slate-800 dark:text-slate-200">{title}</strong> is now live on the marketplace. Verified workers can now apply for your shift roles.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => {
              setSubmittedSuccess(false);
              setTitle('');
              setDescription('');
              setVenue('');
            }}
            className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-white font-bold text-xs transition-colors"
          >
            Post Another Event
          </button>
          
          {onEventCreated && (
            <button
              onClick={onEventCreated}
              className="px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs transition-colors flex items-center gap-2"
            >
              <span>View My Events Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A] text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#7C3AED]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C3AED]/20 text-purple-300 text-xs font-semibold border border-[#7C3AED]/40">
            <PlusCircle className="w-3.5 h-3.5 text-[#F97316]" /> Event Organizer Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Post a New Event Job & Hire Staff
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Fill in required details for your upcoming event. Define staff count, pay rates per shift, and lock escrow budget to start receiving applications from vetted part-time crew.
          </p>
        </div>
      </div>

      {/* Main Post Event Form */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Basic Details */}
          <div className="space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-700/60 pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#7C3AED]" />
                1. Basic Event Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grand Sunburn Music Festival 2026"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Primary Job Category *
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as JobCategory)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  City Location *
                </label>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                >
                  {cities.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Venue Full Address *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jio World Convention Centre, Bandra Kurla Complex"
                    value={venue}
                    onChange={e => setVenue(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 pl-10 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Event Start Date *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 pl-10 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Shift Working Hours *
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 02:00 PM - 10:00 PM"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 pl-10 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Description & AI Auto-Generate */}
          <div className="space-y-4 pt-2">
            <div className="border-b border-slate-100 dark:border-slate-700/60 pb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                2. Event Scope & Staff Guidelines
              </h2>

              <button
                type="button"
                onClick={handleGenerateAiDescription}
                disabled={generatingAi}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 font-semibold text-xs transition-colors flex items-center gap-1.5 border border-indigo-200/60 dark:border-indigo-800/60"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>{generatingAi ? 'Writing with Gemini...' : 'Auto-Generate with Gemini AI'}</span>
              </button>
            </div>

            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe event overview, dress code (e.g. Black suit / White shirt), crew duties, meals provided, and arrival instructions..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Section 3: Job Roles Required */}
          <div className="space-y-4 pt-2">
            <div className="border-b border-slate-100 dark:border-slate-700/60 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-emerald-500" />
                  3. Required Staff Roles & Shift Pay rates
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Add each specific job role needed, quantity of workers, and shift pay rate.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddRole}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Role
              </button>
            </div>

            <div className="space-y-4">
              {roles.map((role, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 space-y-4 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Role #{idx + 1}
                    </span>

                    {roles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRole(idx)}
                        className="text-xs text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove Role
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        Role Title
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lead Bartender"
                        value={role.title}
                        onChange={e => {
                          const updated = [...roles];
                          updated[idx].title = e.target.value;
                          setRoles(updated);
                        }}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        Workers Count
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        required
                        value={role.quantityNeeded}
                        onChange={e => {
                          const updated = [...roles];
                          updated[idx].quantityNeeded = Number(e.target.value);
                          setRoles(updated);
                        }}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        Shift Pay per Worker (₹)
                      </label>
                      <input
                        type="number"
                        min="500"
                        max="50000"
                        required
                        value={role.payPerWorker}
                        onChange={e => {
                          const updated = [...roles];
                          updated[idx].payPerWorker = Number(e.target.value);
                          setRoles(updated);
                        }}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white mt-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Banner Image Selector */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-indigo-500" /> Cover Photo Banner
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {bannerOptions.map((opt, i) => (
                <div
                  key={i}
                  onClick={() => setBannerUrl(opt.url)}
                  className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all relative ${
                    bannerUrl === opt.url ? 'border-indigo-600 ring-2 ring-indigo-500/20' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={opt.url} alt={opt.label} className="w-full h-16 object-cover" />
                  <div className="p-1.5 text-[10px] font-bold text-center bg-slate-900/80 text-white">
                    {opt.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Escrow Lock Budget Summary Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-200/80 dark:border-emerald-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Platform Escrow Lock Protection
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Calculated total for {roles.reduce((a, r) => a + r.quantityNeeded, 0)} workers across {roles.length} roles.
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Total Escrow Required</span>
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                ₹{totalBudget.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-[#F97316] hover:bg-[#EA580C] text-white font-extrabold text-sm shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Check className="w-5 h-5" />
            <span>Confirm & Publish Event Job</span>
          </button>

        </form>
      </div>

    </div>
  );
};
