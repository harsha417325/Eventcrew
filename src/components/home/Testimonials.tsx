import React from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Sneha Patel',
      role: 'Lead Event Planner, Bengaluru Tech Summit',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      comment: 'EventCrew saved our 400-person tech summit! We posted for 12 waitstaff and 2 photographers at 48 hours notice. Every crew member was punctual, professional, and well-dressed.',
      rating: 5,
      type: 'Organizer'
    },
    {
      name: 'Rohan Verma',
      role: 'Event Photographer & Audio Tech',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      comment: 'As a freelance photographer, getting paid on time used to be a nightmare. On EventCrew, escrow holds my payment safely, and payouts hit my wallet as soon as the shift ends.',
      rating: 5,
      type: 'Worker'
    },
    {
      name: 'Rajesh Iyer',
      role: 'Operations Director, South India Expo Group',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      comment: 'The rating system and instant worker matching give us total confidence. We have hired over 60 part-time helpers across 8 events with zero hassle.',
      rating: 5,
      type: 'Organizer'
    }
  ];

  return (
    <section className="py-16 bg-[#F8FAFC] dark:bg-[#0B1120] transition-colors border-t border-slate-200/60 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#7C3AED]">
            Trusted Community
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            Loved By Organizers & Crew
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 mt-2">
            Read how EventCrew connects top planners with reliable event professionals.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    rev.type === 'Organizer' 
                      ? 'bg-[#FFEDD5] text-[#F97316] dark:bg-[#F97316]/20' 
                      : 'bg-[#EDE9FE] text-[#7C3AED] dark:bg-[#7C3AED]/20'
                  }`}>
                    {rev.type}
                  </span>
                </div>

                <Quote className="w-6 h-6 text-[#7C3AED]/30 dark:text-[#7C3AED]/40 mb-2" />
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic mb-6">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/60">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#7C3AED]/20"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    {rev.name}
                    <CheckCircle className="w-3 h-3 text-[#22C55E]" />
                  </h4>
                  <p className="text-[10px] text-[#64748B] dark:text-slate-400">
                    {rev.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
