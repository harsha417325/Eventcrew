import React from 'react';
import { Home, Briefcase, MessageSquare, User, Wallet } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onOpenWallet: () => void;
  unreadMessagesCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenWallet,
  unreadMessagesCount
}) => {
  const { currentUser } = useAuth();

  const dashboardId = currentUser.role === 'organizer' 
    ? 'organizer-dashboard' 
    : currentUser.role === 'worker' 
    ? 'worker-dashboard' 
    : 'admin';

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { 
      id: 'events', 
      label: currentUser.role === 'worker' ? 'Find Jobs' : 'Events', 
      icon: Briefcase 
    },
    { id: 'chat', label: 'Messages', icon: MessageSquare, badge: unreadMessagesCount },
    { 
      id: 'payments', 
      label: currentUser.role === 'organizer' ? 'Escrow' : currentUser.role === 'worker' ? 'Wallet' : 'Payouts', 
      icon: Wallet 
    },
    { 
      id: dashboardId, 
      label: currentUser.role === 'admin' ? 'Admin' : currentUser.role === 'organizer' ? 'Dashboard' : 'Profile', 
      icon: User 
    }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around shadow-xl">
      {navItems.map(item => {
        const IconComponent = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all relative ${
              isActive 
                ? 'text-[#7C3AED] font-bold' 
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <div className="relative">
              <IconComponent className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              {item.badge && item.badge > 0 ? (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-[#F97316] text-white text-[9px] font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] leading-none">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
