import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar as CalendarIcon, CheckCircle2, Clock, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface WorkerAvailabilityCalendarProps {
  targetUserId?: string; // If viewing another worker, else currentUser
  readOnly?: boolean;
}

export const WorkerAvailabilityCalendar: React.FC<WorkerAvailabilityCalendarProps> = ({
  targetUserId,
  readOnly = false
}) => {
  const { currentUser, users, events, applications, toggleAvailability } = useAuth();
  
  const worker = targetUserId ? (users.find(u => u.id === targetUserId) || currentUser) : currentUser;
  const availability = worker.availability || {};

  // Current month view state
  const [viewDate, setViewDate] = useState(new Date(2026, 7, 1)); // August 2026

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  // Compute days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Find accepted shifts for this worker
  const workerAcceptedApps = applications.filter(a => a.workerId === worker.id && (a.status === 'accepted' || a.status === 'attended'));
  const shiftDatesMap = new Map<string, string>(); // 'YYYY-MM-DD' -> eventTitle

  workerAcceptedApps.forEach(app => {
    const ev = events.find(e => e.id === app.eventId);
    if (ev) {
      shiftDatesMap.set(ev.date, ev.title);
    }
  });

  const handleDayClick = (dateStr: string) => {
    if (readOnly) return;
    const current = availability[dateStr] || 'available';
    const next = current === 'available' ? 'busy' : 'available';
    toggleAvailability(dateStr, next);
  };

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {monthNames[month]} {year}
          </h3>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day of Week Headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 uppercase">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {/* Empty cells before month starts */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="h-10 rounded-xl" />
        ))}

        {/* Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
          const isShiftDay = shiftDatesMap.has(dateStr);
          const shiftTitle = shiftDatesMap.get(dateStr);
          const userStatus = availability[dateStr]; // 'available' | 'busy' | undefined

          return (
            <button
              key={dateStr}
              onClick={() => handleDayClick(dateStr)}
              disabled={readOnly}
              title={isShiftDay ? `Shift Confirmed: ${shiftTitle}` : userStatus === 'busy' ? 'Marked as Busy' : 'Available'}
              className={`h-10 rounded-xl flex flex-col items-center justify-center text-xs font-semibold transition-all relative ${
                isShiftDay
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-bold'
                  : userStatus === 'busy'
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 line-through'
                  : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
              }`}
            >
              <span>{dayNum}</span>
              {isShiftDay && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute bottom-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
          <span>Booked Shift</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span>Busy / Off</span>
        </div>
      </div>

      {!readOnly && (
        <p className="text-[10px] text-slate-400 text-center">
          Click any date to toggle between Available and Busy. Organizers prioritize workers marked available.
        </p>
      )}

    </div>
  );
};
