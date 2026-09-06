import React, { useState } from 'react';
import { EventItem, JobRoleNeeded } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { X, Calendar, Clock, MapPin, IndianRupee, Star, ShieldCheck, Users, Briefcase, Send, CheckCircle2 } from 'lucide-react';

interface EventDetailModalProps {
  event: EventItem;
  onClose: () => void;
  onOpenApply: (role?: JobRoleNeeded) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose, onOpenApply }) => {
  const { currentUser, applications } = useAuth();

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E2E8F0] dark:border-slate-800 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Sticky Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#0F172A]/70 text-white hover:bg-[#0F172A] transition-colors backdrop-blur-md cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Header Banner */}
        <div className="relative h-64 sm:h-72 w-full bg-[#0F172A] overflow-hidden">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#7C3AED] text-white shadow-md">
                {event.category}
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/20 backdrop-blur-md flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#F97316]" /> {event.city}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {event.title}
            </h2>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Key Facts Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#F8FAFC] dark:bg-slate-800/60 border border-[#E2E8F0] dark:border-slate-700/80 text-xs">
            <div className="space-y-1">
              <span className="text-[#64748B] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#7C3AED]" /> Date
              </span>
              <p className="font-bold text-[#1E293B] dark:text-white">{event.startDate}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[#64748B] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#7C3AED]" /> Shift Hours
              </span>
              <p className="font-bold text-[#1E293B] dark:text-white">{event.time}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[#64748B] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#F97316]" /> Venue
              </span>
              <p className="font-bold text-[#1E293B] dark:text-white truncate">{event.venue}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[#64748B] flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-[#22C55E]" /> Total Budget
              </span>
              <p className="font-extrabold text-[#22C55E]">₹{event.budgetTotal.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Organizer Card */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] dark:bg-slate-800/60 border border-[#E2E8F0] dark:border-slate-700/80">
            <div className="flex items-center gap-3">
              <img
                src={event.organizerAvatar}
                alt={event.organizerName}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#7C3AED]/30"
              />
              <div>
                <h4 className="font-bold text-[#1E293B] dark:text-white text-sm flex items-center gap-1.5">
                  {event.organizerName}
                  <ShieldCheck className="w-4 h-4 text-[#7C3AED]" />
                </h4>
                <p className="text-xs text-[#64748B] dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                  <strong className="text-[#1E293B] dark:text-slate-300">{event.organizerRating} Rating</strong> • Verified Organizer
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#DCFCE7] text-[#22C55E]">
              Escrow Secured
            </span>
          </div>

          {/* Event Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#0F172A] dark:text-white uppercase tracking-wider">
              About This Event
            </h3>
            <p className="text-xs sm:text-sm text-[#1E293B] dark:text-slate-300 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Required Roles Needed Section */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0F172A] dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#7C3AED]" /> Open Job Roles
              </h3>
              <span className="text-xs text-[#64748B]">
                {event.rolesNeeded.length} Roles Listed
              </span>
            </div>

            <div className="space-y-3">
              {event.rolesNeeded.map(role => {
                const isUserApplied = applications.some(
                  a => a.eventId === event.id && a.jobRoleId === role.id && a.workerId === currentUser.id
                );

                return (
                  <div
                    key={role.id}
                    className="p-4 rounded-2xl border border-[#E2E8F0] dark:border-slate-700/80 bg-[#F8FAFC]/60 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1E293B] dark:text-white text-sm">
                          {role.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#EDE9FE] text-[#7C3AED] font-semibold">
                          {role.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[#64748B] dark:text-slate-400">
                        <span>{role.shiftHours} Hours Shift</span>
                        <span>•</span>
                        <span>{role.quantityNeeded - role.quantityFilled} spots left (Needs {role.quantityNeeded})</span>
                      </div>

                      {role.skillsRequired && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {role.skillsRequired.map((sk, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700 text-[#1E293B] dark:text-slate-300"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                      <div className="text-right">
                        <p className="text-lg font-black text-[#22C55E]">
                          ₹{role.payPerWorker.toLocaleString('en-IN')}
                        </p>
                        <p className="text-[10px] text-[#64748B]">per shift</p>
                      </div>

                      {currentUser.role === 'worker' ? (
                        isUserApplied ? (
                          <span className="px-4 py-2 rounded-xl bg-[#DCFCE7] text-[#22C55E] text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Applied
                          </span>
                        ) : (
                          <button
                            onClick={() => onOpenApply(role)}
                            className="px-4 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" /> Apply
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => onOpenApply(role)}
                          className="px-4 py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs transition-all cursor-pointer"
                        >
                          Select Role
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
