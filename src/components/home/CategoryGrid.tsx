import React from 'react';
import { JobCategory } from '../../types';
import { Utensils, Sparkles, UserCheck, Camera, Shield, Layers, Music, Users, ArrowUpRight } from 'lucide-react';

interface CategoryGridProps {
  onSelectCategory: (category: JobCategory) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  const categories: {
    title: JobCategory;
    icon: React.ReactNode;
    desc: string;
    jobsCount: number;
    avgPay: string;
    iconBg: string;
  }[] = [
    {
      title: 'Catering',
      icon: <Utensils className="w-5 h-5 text-[#F97316]" />,
      desc: 'VIP waitstaff, bartenders, banquet servers & kitchen crew.',
      jobsCount: 28,
      avgPay: '₹350 - ₹600/hr',
      iconBg: 'bg-[#FFEDD5] dark:bg-[#F97316]/20'
    },
    {
      title: 'Decoration',
      icon: <Sparkles className="w-5 h-5 text-[#7C3AED]" />,
      desc: 'Stage floral setup, backdrop crew, balloon artists & lighting.',
      jobsCount: 12,
      avgPay: '₹350 - ₹550/hr',
      iconBg: 'bg-[#EDE9FE] dark:bg-[#7C3AED]/20'
    },
    {
      title: 'Photography',
      icon: <Camera className="w-5 h-5 text-[#7C3AED]" />,
      desc: 'Candid event photographers, videographers & drone pilots.',
      jobsCount: 14,
      avgPay: '₹800 - ₹1,500/hr',
      iconBg: 'bg-[#EDE9FE] dark:bg-[#7C3AED]/20'
    },
    {
      title: 'Hosting',
      icon: <UserCheck className="w-5 h-5 text-[#F97316]" />,
      desc: 'Guest check-in, registration, VIP concierge & ushering.',
      jobsCount: 19,
      avgPay: '₹300 - ₹500/hr',
      iconBg: 'bg-[#FFEDD5] dark:bg-[#F97316]/20'
    },
    {
      title: 'Security',
      icon: <Shield className="w-5 h-5 text-[#0284C7]" />,
      desc: 'Licensed security officers, access control & crowd management.',
      jobsCount: 16,
      avgPay: '₹400 - ₹650/hr',
      iconBg: 'bg-[#E0F2FE] dark:bg-[#0284C7]/20'
    },
    {
      title: 'Cleaning',
      icon: <Layers className="w-5 h-5 text-[#22C55E]" />,
      desc: 'Venue preparation, table clearing & rapid post-event cleanup.',
      jobsCount: 22,
      avgPay: '₹250 - ₹400/hr',
      iconBg: 'bg-[#DCFCE7] dark:bg-[#22C55E]/20'
    },
    {
      title: 'Audio & DJ',
      icon: <Music className="w-5 h-5 text-[#7C3AED]" />,
      desc: 'Sound engineers, stage managers & live event DJs.',
      jobsCount: 9,
      avgPay: '₹600 - ₹1,200/hr',
      iconBg: 'bg-[#EDE9FE] dark:bg-[#7C3AED]/20'
    },
    {
      title: 'General Helper',
      icon: <Users className="w-5 h-5 text-[#64748B]" />,
      desc: 'Versatile logistics staff for loading, booth duty & errands.',
      jobsCount: 31,
      avgPay: '₹250 - ₹350/hr',
      iconBg: 'bg-slate-100 dark:bg-slate-800'
    }
  ];

  return (
    <section className="py-14 bg-[#F8FAFC] dark:bg-[#0B1120] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#7C3AED]">
              Popular Categories
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Hire Staff By Specialty
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 max-w-md">
            Find vetted part-time professionals specialized for every aspect of your event lifecycle.
          </p>
        </div>

        {/* Category Quick Pills matching reference mobile & desktop archetype */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
          <button
            onClick={() => onSelectCategory('Catering')}
            className="px-4 py-2 rounded-xl bg-[#7C3AED] text-white font-bold text-xs shrink-0 shadow-sm"
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat.title}
              onClick={() => onSelectCategory(cat.title)}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-xs shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>{cat.title}</span>
              <span className="text-[10px] text-[#64748B] dark:text-slate-400">({cat.jobsCount})</span>
            </button>
          ))}
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map(cat => (
            <div
              key={cat.title}
              onClick={() => onSelectCategory(cat.title)}
              className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 transition-all cursor-pointer group hover:-translate-y-1 hover:shadow-md hover:border-[#7C3AED]/40"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${cat.iconBg}`}>
                  {cat.icon}
                </div>
                <span className="text-[11px] font-semibold text-[#64748B] dark:text-slate-400 group-hover:text-[#7C3AED] transition-colors flex items-center gap-0.5">
                  Explore <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-[#7C3AED] transition-colors">
                {cat.title}
              </h3>
              <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {cat.desc}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-medium">
                <span className="text-[#64748B] dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-white">{cat.jobsCount}</strong> active
                </span>
                <span className="text-[#22C55E] font-bold">
                  {cat.avgPay}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
