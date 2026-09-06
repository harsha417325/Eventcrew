import React from 'react';
import { Filter, MapPin, Briefcase, IndianRupee, Calendar, RefreshCw } from 'lucide-react';

interface EventFilterProps {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  minPay: number;
  setMinPay: (pay: number) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  onReset: () => void;
}

export const EventFilter: React.FC<EventFilterProps> = ({
  selectedCity,
  setSelectedCity,
  selectedCategory,
  setSelectedCategory,
  minPay,
  setMinPay,
  sortBy,
  setSortBy,
  onReset
}) => {
  const cities = ['All Cities', 'Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune'];
  const categories: string[] = [
    'All Categories',
    'Catering',
    'Decoration',
    'Hosting',
    'Photography',
    'Security',
    'Cleaning',
    'Audio & DJ',
    'General Helper'
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#7C3AED]" />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Event Filters
          </h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-[#7C3AED] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* City Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#F97316]" /> City Location
          </label>
          <select
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          >
            {cities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-[#7C3AED]" /> Job Category
          </label>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Min Pay Rate Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5 text-[#22C55E]" /> Min Shift Pay
            </span>
            <span className="text-[#22C55E] font-bold">₹{minPay.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="range"
            min="0"
            max="5000"
            step="200"
            value={minPay}
            onChange={e => setMinPay(Number(e.target.value))}
            className="w-full accent-[#7C3AED] cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />
        </div>

        {/* Sort By */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#7C3AED]" /> Sort Order
          </label>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          >
            <option value="newest">Newest First</option>
            <option value="highest_pay">Highest Pay Rate</option>
            <option value="date">Upcoming Date</option>
          </select>
        </div>
      </div>
    </div>
  );
};
