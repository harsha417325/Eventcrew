import React from 'react';
import { EventItem } from '../../types';
import { MapPin, Navigation, Car, Train, Calendar, ExternalLink, X, Clock, Compass } from 'lucide-react';

interface VenueMapModalProps {
  event: EventItem;
  onClose: () => void;
}

export const VenueMapModal: React.FC<VenueMapModalProps> = ({ event, onClose }) => {
  const coords = event.coordinates || { lat: 19.0760, lng: 72.8777 }; // Default Mumbai

  // Simulated commute estimate from city center
  const commuteEstimates = [
    { mode: 'Cab / Ride-Hail', icon: Car, time: '28 mins', cost: '₹220 - ₹280', tip: 'Fastest via Eastern Freeway' },
    { mode: 'Metro / Local Train', icon: Train, time: '35 mins', cost: '₹20 - ₹40', tip: 'Nearest station: 400m walk' },
    { mode: 'Auto Rickshaw', icon: Navigation, time: '40 mins', cost: '₹140 - ₹180', tip: 'Metered pricing available' }
  ];

  const [calendarSyncMsg, setCalendarSyncMsg] = React.useState<string | null>(null);
  const [userLocation, setUserLocation] = React.useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = React.useState(false);
  const [distanceKm, setDistanceKm] = React.useState<number | null>(null);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  const handleRequestLiveDirections = () => {
    if (!navigator.geolocation) {
      handleOpenGoogleMaps();
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLoading(false);
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        const dist = calculateDistance(latitude, longitude, coords.lat, coords.lng);
        setDistanceKm(dist);

        const destQuery = encodeURIComponent(`${event.venue}, ${event.city}`);
        window.open(
          `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${destQuery}&travelmode=driving`,
          '_blank',
          'noopener,noreferrer'
        );
      },
      (error) => {
        setGpsLoading(false);
        console.warn('Geolocation access declined or unavailable:', error.message);
        // Graceful fallback to destination directions
        const destQuery = encodeURIComponent(`${event.venue}, ${event.city}`);
        window.open(
          `https://www.google.com/maps/dir/?api=1&destination=${destQuery}`,
          '_blank',
          'noopener,noreferrer'
        );
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleOpenGoogleMaps = () => {
    const query = encodeURIComponent(`${event.venue}, ${event.city}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank', 'noopener,noreferrer');
  };

  const getCleanDate = () => {
    // Safely get date string YYYYMMDD
    const raw = event.startDate || (event as any).date || '2026-08-15';
    return raw.replace(/[-/]/g, '').slice(0, 8);
  };

  const handleAddToCalendar = () => {
    try {
      const rawDate = event.startDate || (event as any).date || '2026-08-15';
      const params = new URLSearchParams({
        title: event.title || 'Event Shift',
        venue: event.venue || 'Venue',
        city: event.city || '',
        startDate: rawDate,
        time: event.time || 'Full day shift',
        organizerName: event.organizerName || 'Organizer'
      });

      // Priority 1: Server-backed direct .ics download (reliable on all deployed production environments & iOS Safari)
      const serverUrl = `/api/calendar/export-ics?${params.toString()}`;
      const link = document.createElement('a');
      link.href = serverUrl;
      const sanitized = (event.title || 'event').replace(/[^a-zA-Z0-9]/g, '_');
      link.setAttribute('download', `${sanitized}_shift.ics`);
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
      }, 300);

      setCalendarSyncMsg('Shift schedule downloaded (.ics)!');
      setTimeout(() => setCalendarSyncMsg(null), 3500);
    } catch (err) {
      console.warn('Direct server download fallback to client blob:', err);
      // Priority 2: Client-side Blob generation
      try {
        const dateStr = getCleanDate();
        const startDate = `${dateStr}T090000Z`;
        const endDate = `${dateStr}T170000Z`;
        const nowStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

        const icsData = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//EventCrew//Event Shift Calendar//EN',
          'CALSCALE:GREGORIAN',
          'METHOD:PUBLISH',
          'BEGIN:VEVENT',
          `UID:shift-${event.id || 'evt'}-${Date.now()}@eventcrew.com`,
          `DTSTAMP:${nowStamp}`,
          `SUMMARY:${(event.title || 'Event Shift').replace(/,/g, '\\,')} - EventCrew Shift`,
          `DESCRIPTION:EventCrew Shift at ${event.venue}. Organizer: ${event.organizerName}. Timing: ${event.time || 'Full day'}`,
          `LOCATION:${(event.venue || '').replace(/,/g, '\\,')}\\, ${(event.city || '').replace(/,/g, '\\,')}`,
          `DTSTART:${startDate}`,
          `DTEND:${endDate}`,
          'STATUS:CONFIRMED',
          'END:VEVENT',
          'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const fallbackLink = document.createElement('a');
        fallbackLink.href = url;
        fallbackLink.setAttribute('download', `shift_${event.id || 'event'}.ics`);
        document.body.appendChild(fallbackLink);
        fallbackLink.click();
        setTimeout(() => {
          document.body.removeChild(fallbackLink);
          window.URL.revokeObjectURL(url);
        }, 300);

        setCalendarSyncMsg('Shift schedule downloaded (.ics)!');
        setTimeout(() => setCalendarSyncMsg(null), 3500);
      } catch (clientErr) {
        console.error('All calendar download attempts failed:', clientErr);
        setCalendarSyncMsg('Could not export calendar file.');
      }
    }
  };

  const handleGoogleCalendarWeb = () => {
    try {
      const dateStr = getCleanDate();
      const startIso = `${dateStr}T100000`;
      const endIso = `${dateStr}T180000`;
      const title = encodeURIComponent(`${event.title || 'Event Shift'} - EventCrew`);
      const details = encodeURIComponent(
        `Event: ${event.title}\nRole Shift at ${event.venue}\nOrganizer: ${event.organizerName}\nCity: ${event.city}\nShift Timing: ${event.time || 'Scheduled shift'}\n\nPlease arrive 15 minutes before shift start.`
      );
      const location = encodeURIComponent(`${event.venue}, ${event.city}`);
      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
      
      window.open(url, '_blank', 'noopener,noreferrer');
      setCalendarSyncMsg('Opening Google Calendar in a new tab...');
      setTimeout(() => setCalendarSyncMsg(null), 3500);
    } catch (err) {
      console.error('Failed to open Google Calendar:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Venue Directions & Transit</h3>
              <p className="text-xs text-slate-400">{event.venue}, {event.city}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          
          {/* Simulated Interactive Map Display */}
          <div className="h-48 rounded-2xl bg-slate-100 dark:bg-slate-800 relative overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-4 text-center">
            {/* Background grid texture representing map lines */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]" />
            
            <div className="relative z-10 space-y-2">
              <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-500/30 animate-bounce">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{event.venue}</h4>
              <p className="text-xs text-slate-500">{event.city} • Lat: {coords.lat.toFixed(4)}, Lng: {coords.lng.toFixed(4)}</p>
            </div>

            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <button
                onClick={handleRequestLiveDirections}
                disabled={gpsLoading}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-500 active:scale-95 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                title="Get GPS Navigation from Current Location"
              >
                <Compass className={`w-3.5 h-3.5 ${gpsLoading ? 'animate-spin' : ''}`} />
                <span>{gpsLoading ? 'Locating...' : distanceKm ? `${distanceKm} km • Directions` : 'Live GPS Route'}</span>
              </button>
              <button
                onClick={handleOpenGoogleMaps}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 text-xs font-bold shadow-md hover:bg-slate-50 flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                Maps <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Commute Estimates */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Transit & Commute Estimates
            </span>
            <div className="grid grid-cols-1 gap-2">
              {commuteEstimates.map((est, idx) => {
                const IconComponent = est.icon;
                return (
                  <div 
                    key={idx} 
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{est.mode}</p>
                        <p className="text-[11px] text-slate-500">{est.tip}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-indigo-600 dark:text-indigo-400">{est.time}</p>
                      <p className="text-[11px] text-slate-500">{est.cost}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Calendar Sync Section */}
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h5 className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                Sync Shift with Your Personal Calendar
              </h5>
            </div>
            <p className="text-[11px] text-indigo-800 dark:text-indigo-300 leading-relaxed">
              Export event timings and venue directions to your mobile calendar app so you get shift alarms and departure reminders.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleGoogleCalendarWeb}
                className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Google Calendar</span>
              </button>
              <button
                onClick={handleAddToCalendar}
                className="flex-1 py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-98 text-slate-800 dark:text-white font-bold text-xs border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Download .ICS File</span>
              </button>
            </div>

            {calendarSyncMsg && (
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-1.5 animate-fadeIn">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>{calendarSyncMsg}</span>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
