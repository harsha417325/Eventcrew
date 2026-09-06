import React, { useState } from 'react';
import { EventItem, JobCategory, JobRoleNeeded } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { X, Sparkles, Plus, Trash2, Calendar, MapPin, IndianRupee, Clock, Check } from 'lucide-react';

interface CreateEventModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ onClose, onSuccess }) => {
  const { createEvent } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<JobCategory>('Catering');
  const [city, setCity] = useState('Mumbai');
  const [venue, setVenue] = useState('');
  const [startDate, setStartDate] = useState('');
  const [time, setTime] = useState('02:00 PM - 09:00 PM');
  const [description, setDescription] = useState('');
  const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80');

  const [generatingAi, setGeneratingAi] = useState(false);

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

  // Calculate total budget automatically
  const totalBudget = roles.reduce((sum, r) => sum + (r.quantityNeeded * r.payPerWorker), 0);

  const handleAddRole = () => {
    setRoles(prev => [
      ...prev,
      {
        title: 'Guest Host / Registration Assistant',
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
      setDescription(`Join us for the upcoming ${title || 'Event'} in ${city}. We are hiring energetic event staff to deliver high quality service. Shift includes setup, guest hosting, and team coordination.`);
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedRoles: JobRoleNeeded[] = roles.map((r, i) => ({
      ...r,
      id: `role_new_${Date.now()}_${i}`,
      quantityFilled: 0,
      status: 'open'
    }));

    createEvent({
      title,
      description: description || `Event staffing job post for ${title}.`,
      category,
      city,
      venue: venue || `${city} Main Exhibition Center`,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: startDate || new Date().toISOString().split('T')[0],
      time,
      status: 'published',
      bannerUrl,
      budgetTotal: totalBudget,
      rolesNeeded: formattedRoles
    });

    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in fade-in zoom-in-95 duration-200">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1">
          Post New Event Job
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Specify your event details, job roles required, and shift payouts.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Event Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. SF Annual Tech Gala 2026"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Primary Category *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as JobCategory)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* City, Venue & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                City *
              </label>
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              >
                {cities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Venue Address *
              </label>
              <input
                type="text"
                required
                placeholder="Palace of Fine Arts, SF"
                value={venue}
                onChange={e => setVenue(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Event Date *
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Description & AI Generator */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Event & Shift Description
              </label>
              <button
                type="button"
                onClick={handleGenerateAiDescription}
                disabled={generatingAi}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {generatingAi ? 'Generating AI Text...' : 'Generate with Gemini AI'}
              </button>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe event scope, dress code, duties, and guidelines..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Roles Needed Builder */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Job Roles Required ({roles.length})
              </h4>
              <button
                type="button"
                onClick={handleAddRole}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Another Role
              </button>
            </div>

            <div className="space-y-3">
              {roles.map((role, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3 relative"
                >
                  {roles.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRole(idx)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                        Role Title
                      </label>
                      <input
                        type="text"
                        required
                        value={role.title}
                        onChange={e => {
                          const updated = [...roles];
                          updated[idx].title = e.target.value;
                          setRoles(updated);
                        }}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                        Workers Count Needed
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        required
                        value={role.quantityNeeded}
                        onChange={e => {
                          const updated = [...roles];
                          updated[idx].quantityNeeded = Number(e.target.value);
                          setRoles(updated);
                        }}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                        Pay per Worker (₹)
                      </label>
                      <input
                        type="number"
                        min="200"
                        max="50000"
                        required
                        value={role.payPerWorker}
                        onChange={e => {
                          const updated = [...roles];
                          updated[idx].payPerWorker = Number(e.target.value);
                          setRoles(updated);
                        }}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Escrow Lock Banner */}
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">
                Total Escrow Budget Required
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Held safely in platform escrow until event completion.
              </p>
            </div>
            <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
              ₹{totalBudget.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Confirm & Post Event Job</span>
          </button>

        </form>

      </div>
    </div>
  );
};
