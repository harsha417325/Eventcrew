import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Crown, Check, Zap, Sparkles, Shield, X, AlertCircle } from 'lucide-react';

interface SubscriptionModalProps {
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ onClose }) => {
  const { currentUser, updateSubscription } = useAuth();
  
  const currentTier = currentUser.subscriptionTier || 'starter';
  const [selectedTier, setSelectedTier] = useState<'starter' | 'pro' | 'enterprise'>(currentTier);
  const [upgrading, setUpgrading] = useState(false);
  const [success, setSuccess] = useState(false);

  const plans = [
    {
      id: 'starter' as const,
      name: 'Starter Organizer',
      price: 0,
      period: 'Forever free',
      desc: 'Great for occasional private parties and small single-day gatherings.',
      badge: 'Current Standard',
      features: [
        'Up to 2 active events simultaneously',
        'Standard 5% platform fee on payouts',
        'Basic candidate applications list',
        'Direct 1-to-1 messaging',
        'Standard escrow protection'
      ]
    },
    {
      id: 'pro' as const,
      name: 'Pro Organizer',
      price: 1999,
      period: 'per month',
      desc: 'Designed for active event planners, wedding agencies, and corporate coordinators.',
      badge: 'Most Popular',
      popular: true,
      features: [
        'Unlimited active event postings',
        '0% Platform Fee on all shift payouts',
        'Priority Listing at top of Worker Feeds',
        'AI Smart Budget & Instant Worker Matching',
        'Crew Group Chat for every event',
        'Fast-track 2-hour ID verification badge'
      ]
    },
    {
      id: 'enterprise' as const,
      name: 'Enterprise Agency',
      price: 4999,
      period: 'per month',
      desc: 'For high-scale event management firms hiring hundreds of crew members monthly.',
      badge: 'Agency Scale',
      features: [
        'Everything in Pro plan',
        'Dedicated 24/7 Account Manager',
        'Automated GST invoicing with corporate billing',
        'Bulk crew hiring & CSV export',
        'Custom shift agreement waivers & NDA',
        'Arbitration dispute priority SLA'
      ]
    }
  ];

  const handleSelectPlan = (tier: 'starter' | 'pro' | 'enterprise') => {
    setSelectedTier(tier);
    if (tier === currentTier) return;

    setUpgrading(true);
    setTimeout(() => {
      updateSubscription(tier);
      setUpgrading(false);
      setSuccess(true);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-500 via-amber-600 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Organizer Subscription Plans</h3>
              <p className="text-xs text-amber-100">Unlock zero platform fees, priority listing, and instant AI matching</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {success && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-medium flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              Your plan was successfully updated to {selectedTier.toUpperCase()}! Benefits are active immediately.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map(plan => {
              const isCurrent = currentTier === plan.id;
              const isSelected = selectedTier === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`rounded-3xl p-5 border flex flex-col justify-between transition-all relative ${
                    plan.popular
                      ? 'border-amber-400 dark:border-amber-500 shadow-xl bg-gradient-to-b from-amber-500/5 to-transparent'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-white font-extrabold text-[10px] uppercase tracking-wider shadow">
                      {plan.badge}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {plan.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 min-h-[34px]">
                        {plan.desc}
                      </p>
                    </div>

                    <div className="pb-3 border-b border-slate-200 dark:border-slate-700">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">
                          ₹{plan.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-500">{plan.period}</span>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Included Features</span>
                      <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="text-[11px] leading-snug">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => handleSelectPlan(plan.id)}
                      disabled={isCurrent || upgrading}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
                        isCurrent
                          ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                          : plan.popular
                          ? 'bg-amber-500 hover:bg-amber-400 text-white shadow-amber-500/20 shadow-md'
                          : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90'
                      }`}
                    >
                      {isCurrent ? 'Current Plan' : upgrading && isSelected ? 'Activating...' : `Select ${plan.name.split(' ')[0]}`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between text-xs text-indigo-900 dark:text-indigo-200">
            <div>
              <span className="font-bold">Need a custom plan for 500+ shifts a month?</span>
              <p className="text-[11px] text-indigo-700 dark:text-indigo-300">Contact our enterprise sales desk at billing@eventcrew.com</p>
            </div>
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 font-bold text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              Done
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
