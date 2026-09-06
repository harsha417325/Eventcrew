import React from 'react';
import { EventItem } from '../../types';
import { MapPin, Calendar, Clock, Star, ArrowRight } from 'lucide-react';

interface EventCardProps {
  event: EventItem;
  onViewDetails: (event: EventItem) => void;
  onQuickApply?: (event: EventItem) => void;
  layout?: 'grid' | 'row';
}

export const EventCard: React.FC<EventCardProps> = ({ event, onViewDetails, onQuickApply, layout = 'grid' }) => {
  const totalOpenSlots = event.rolesNeeded.reduce(
    (acc, r) => acc + Math.max(0, r.quantityNeeded - r.quantityFilled),
    0
  );

  const maxPayRole = event.rolesNeeded.reduce(
    (max, r) => r.payPerWorker > max ? r.payPerWorker : max,
    0
  );

  // Approximate distance calculation for visual match with reference mockup
  const distanceMap: Record<string, string> = {
    'Mumbai': '2.4 km away',
    'Bengaluru': '1.8 km away',
    'Delhi': '3.2 km away',
    'Hyderabad': '2.1 km away',
    'Chennai': '4.0 km away',
    'Pune': '1.5 km away'
  };
  const distance = distanceMap[event.city] || '2.5 km away';

  if (layout === 'row') {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
        <div className="flex items-center gap-4">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0 border border-slate-100 dark:border-slate-700"
          />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#7C3AED] transition-colors line-clamp-1">
              {event.title}
            </h3>
            <p className="text-xs text-[#64748B] dark:text-slate-400 flex items-center gap-1.5">
              <span>{event.location}, {event.city}</span>
              <span>•</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{distance}</span>
            </p>
            <p className="text-xs text-[#64748B] dark:text-slate-400">
              {event.startDate}, {event.time}
            </p>
            <div className="pt-1 flex items-center gap-2">
              <span className="text-base font-extrabold text-[#22C55E]">
                ₹{maxPayRole.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-[#64748B]">/day</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:self-center shrink-0">
          <button
            onClick={() => onQuickApply ? onQuickApply(event) : onViewDetails(event)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition-all shadow-md shadow-purple-900/10 hover:shadow-purple-900/25 active:scale-95 cursor-pointer"
          >
            Apply Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
      
      {/* Banner Header Image */}
      <div className="relative h-44 overflow-hidden bg-[#0F172A]">
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/30 to-transparent" />

        {/* Category Badge Top Left */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white/95 dark:bg-[#0F172A]/90 text-[#7C3AED] backdrop-blur-md shadow-sm">
          {event.category}
        </span>

        {/* City & Distance Badge Top Right */}
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-[#0F172A]/85 text-white backdrop-blur-md flex items-center gap-1 border border-slate-700/50">
          <MapPin className="w-3 h-3 text-[#F97316]" />
          {event.city} • {distance}
        </span>

        {/* Pay Rate Bottom Left */}
        <div className="absolute bottom-3 left-3 flex items-baseline gap-1 text-white">
          <span className="text-xl font-extrabold text-[#22C55E]">₹{maxPayRole.toLocaleString('en-IN')}</span>
          <span className="text-[10px] text-slate-300 font-medium">/ day</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Organizer Info */}
          <div className="flex items-center gap-2 mb-2 text-xs text-[#64748B] dark:text-slate-400">
            <img
              src={event.organizerAvatar}
              alt={event.organizerName}
              className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200"
            />
            <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
              {event.organizerName}
            </span>
            <span className="flex items-center gap-0.5 text-amber-500 font-bold text-[10px]">
              <Star className="w-3 h-3 fill-amber-400" /> {event.organizerRating}
            </span>
          </div>

          <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-[#7C3AED] transition-colors line-clamp-1 leading-snug">
            {event.title}
          </h3>

          <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          {/* Date & Time */}
          <div className="mt-4 space-y-1.5 text-xs text-[#64748B] dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>{event.startDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#F97316]" />
              <span>{event.time}</span>
            </div>
          </div>

          {/* Roles Breakdown Pills */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60">
            <div className="flex flex-wrap gap-1.5">
              {event.rolesNeeded.map(role => (
                <span
                  key={role.id}
                  className="px-2 py-1 rounded-md text-[11px] bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1"
                >
                  <span>{role.title}</span>
                  <span className="text-[#22C55E] font-bold">₹{role.payPerWorker.toLocaleString('en-IN')}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
          <div className="text-xs">
            <span className="font-bold text-[#7C3AED]">{totalOpenSlots}</span>
            <span className="text-[#64748B] dark:text-slate-400 ml-1">spots open</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewDetails(event)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all cursor-pointer"
            >
              Details
            </button>
            <button
              onClick={() => onQuickApply ? onQuickApply(event) : onViewDetails(event)}
              className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition-all shadow-md shadow-purple-900/10 active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
