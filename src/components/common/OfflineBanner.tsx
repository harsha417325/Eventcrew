import React from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const OfflineBanner: React.FC = () => {
  const { isOffline, toggleOfflineMode } = useAuth();

  if (!isOffline) return null;

  return (
    <div className="bg-amber-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-md transition-all">
      <div className="flex items-center gap-2 max-w-2xl mx-auto">
        <WifiOff className="w-4 h-4 shrink-0 animate-pulse" />
        <span>
          Offline Mode Active: Viewing cached shifts, saved contracts, and venue directions locally.
        </span>
      </div>
      <button
        onClick={toggleOfflineMode}
        className="px-2.5 py-1 rounded-lg bg-white text-amber-900 font-bold hover:bg-amber-50 text-[11px] flex items-center gap-1 shrink-0 ml-3"
      >
        <Wifi className="w-3.5 h-3.5" /> Reconnect
      </button>
    </div>
  );
};
