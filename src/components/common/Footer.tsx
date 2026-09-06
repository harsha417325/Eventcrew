import React from 'react';
import { Briefcase, Heart, Mail, Phone, MapPin, Shield, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">EventCrew</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              The modern marketplace connecting top event organizers with verified part-time crew members for catering, hosting, photography, decoration, and security.
            </p>
            <div className="flex items-center gap-3 text-slate-400 pt-1">
              <span className="p-2 rounded-lg bg-slate-800 text-indigo-400"><Shield className="w-4 h-4" /> Verified Crew</span>
              <span className="p-2 rounded-lg bg-slate-800 text-emerald-400"><Zap className="w-4 h-4" /> Instant Payouts</span>
            </div>
          </div>

          {/* Organizer Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">For Event Organizers</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#create-event" className="hover:text-white transition-colors">Post an Event Job</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Staffing Pricing</a></li>
              <li><a href="#escrow" className="hover:text-white transition-colors">Escrow Payment Protection</a></li>
              <li><a href="#organizer-faq" className="hover:text-white transition-colors">Organizer FAQs</a></li>
            </ul>
          </div>

          {/* Worker Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">For Part-Time Workers</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#events" className="hover:text-white transition-colors">Browse Event Jobs</a></li>
              <li><a href="#categories" className="hover:text-white transition-colors">Job Categories</a></li>
              <li><a href="#payouts" className="hover:text-white transition-colors">Same-Day Payouts</a></li>
              <li><a href="#worker-guarantee" className="hover:text-white transition-colors">Worker Protection</a></li>
            </ul>
          </div>

          {/* Contact & Cities */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Top Cities</h4>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {['Mumbai', 'Bengaluru', 'Delhi NCR', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Goa'].map(city => (
                <span key={city} className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[11px]">
                  {city}
                </span>
              ))}
            </div>
            <div className="pt-2 text-xs space-y-1">
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-3.5 h-3.5 text-indigo-400" /> support@eventcrew.com
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="w-3.5 h-3.5 text-indigo-400" /> +91 1800-555-CREW
              </div>
            </div>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} EventCrew Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-400">Terms of Service</a>
            <a href="#security" className="hover:text-slate-400">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
