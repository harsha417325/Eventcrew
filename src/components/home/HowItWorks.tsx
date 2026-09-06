import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const HowItWorks: React.FC = () => {
  const { currentUser } = useAuth();
  const isWorker = currentUser.role === 'worker';

  const steps = isWorker ? [
    {
      number: '1',
      title: 'Find a Shift',
      description: 'Search events by category & city'
    },
    {
      number: '2',
      title: 'Apply in 1-Click',
      description: 'Get confirmed by organizers'
    },
    {
      number: '3',
      title: 'Work & Get Paid',
      description: 'QR check-in & same-day payout'
    }
  ] : [
    {
      number: '1',
      title: 'Post a Job',
      description: 'Share your event details'
    },
    {
      number: '2',
      title: 'Get Applications',
      description: 'Receive from skilled event workers'
    },
    {
      number: '3',
      title: 'Hire & Manage',
      description: 'Communicate and manage easily'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm">
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">
        How It Works
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
        {steps.map((step, idx) => (
          <div key={step.number} className="flex flex-col items-center text-center relative group">
            {/* Step Number Circle matching the user image: Purple circle with number */}
            <div className="w-12 h-12 rounded-full bg-[#EDE9FE] dark:bg-[#7C3AED]/20 text-[#7C3AED] font-bold text-lg flex items-center justify-center mb-3 shadow-sm border border-[#DDD6FE] dark:border-[#7C3AED]/40 group-hover:scale-105 transition-transform">
              {step.number}
            </div>

            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {step.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[180px]">
              {step.description}
            </p>

            {/* Connecting dashed line between step 1-2 and 2-3 */}
            {idx < 2 && (
              <div className="hidden sm:block absolute top-6 left-[60%] w-[80%] border-t-2 border-dashed border-slate-200 dark:border-slate-700 pointer-events-none" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
