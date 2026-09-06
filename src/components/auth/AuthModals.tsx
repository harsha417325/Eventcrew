import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Building2, 
  UserCheck, 
  ArrowRight, 
  ShieldCheck,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  CheckSquare,
  Square,
  FileText,
  Sparkles,
  Info,
  IndianRupee,
  Briefcase,
  Key
} from 'lucide-react';
import { TermsModal } from './TermsModal';
import { SecretAdminPinModal } from './SecretAdminPinModal';

interface AuthModalsProps {
  mode: 'login' | 'signup';
  initialRole?: UserRole;
  onClose: () => void;
  onSwitchMode: (mode: 'login' | 'signup') => void;
}

export const AuthModals: React.FC<AuthModalsProps> = ({ 
  mode, 
  initialRole = 'worker', 
  onClose, 
  onSwitchMode 
}) => {
  const { loginUser, signupUser, users } = useAuth();

  const [role, setRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [phone, setPhone] = useState('+91 ');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showSecretPinModal, setShowSecretPinModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Role-specific extra fields
  const [companyName, setCompanyName] = useState('');
  const [primarySkill, setPrimarySkill] = useState('Catering');
  const [hourlyRate, setHourlyRate] = useState('450');

  const availableSkills = ['Catering', 'Hosting', 'Decoration', 'Security', 'Photography', 'Audio/DJ', 'General Helper'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'login') {
      if (!email.trim() || !password.trim()) {
        setErrorMsg('Please enter both your email address and password.');
        return;
      }

      const existingUser = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!existingUser) {
        setErrorMsg(`The email address ${email.trim()} is not registered with EventCrew. Please register an account first.`);
        return;
      }

      const success = loginUser(email.trim());
      if (success) {
        onClose();
      } else {
        setErrorMsg(`Invalid credentials for ${role} portal. Please check your email and password.`);
      }
    } else {
      // Registration validation
      if (!name.trim() || !email.trim() || !password.trim()) {
        setErrorMsg('Please complete all required fields.');
        return;
      }

      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please re-enter passwords.');
        return;
      }

      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }

      if (!acceptedTerms) {
        setErrorMsg('You must review and accept the Terms & Conditions and Escrow Policy to register.');
        return;
      }

      const existingUser = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
      if (existingUser) {
        setErrorMsg(`The email address ${email.trim()} is already registered! Please switch to Login mode.`);
        return;
      }

      signupUser(name.trim(), email.trim(), role, city, {
        phone: phone.trim(),
        skills: role === 'worker' ? [primarySkill] : undefined,
        hourlyRate: role === 'worker' ? Number(hourlyRate) || 400 : undefined,
        bio: role === 'organizer' 
          ? `Organizer at ${companyName || 'Event Agency'}` 
          : role === 'worker' 
          ? `Skilled ${primarySkill} specialist based in ${city}.`
          : 'Platform Operations Administrator'
      });

      onClose();
    }
  };

  const autofillDemoAccount = (demoEmail: string, demoRole: UserRole) => {
    setRole(demoRole);
    setEmail(demoEmail);
    setPassword('demo123456');
    setErrorMsg('');
  };

  // Helper theme configuration per role portal
  const roleTheme = {
    organizer: {
      badgeBg: 'bg-[#FFF7ED] text-[#EA580C] border-[#FED7AA]',
      btnGradient: 'bg-[#F97316] hover:bg-[#EA580C]',
      title: 'Organizer Portal',
      subtitle: 'Post event shifts, fund escrow budgets, and hire verified staff.',
      icon: <Building2 className="w-5 h-5 text-[#F97316]" />
    },
    worker: {
      badgeBg: 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]',
      btnGradient: 'bg-[#7C3AED] hover:bg-[#6D28D9]',
      title: 'Part-time Crew Portal',
      subtitle: 'Find flexible shifts, check-in to events, and earn instant wallet payouts.',
      icon: <UserCheck className="w-5 h-5 text-[#7C3AED]" />
    },
    admin: {
      badgeBg: 'bg-slate-100 text-[#0F172A] border-slate-300',
      btnGradient: 'bg-[#0F172A] hover:bg-slate-800',
      title: 'Admin Operations Portal',
      subtitle: 'System administrative oversight, user verifications & dispute resolutions.',
      icon: <ShieldCheck className="w-5 h-5 text-[#0F172A]" />
    }
  }[role];

  return (
    <>
      <div className="fixed inset-0 z-50 bg-[#0F172A]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8F0] dark:border-slate-800 relative animate-in fade-in zoom-in-95 duration-200 my-auto">
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-[#64748B] hover:text-[#1E293B] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Portal Switcher Header Tabs */}
          <div className="mb-6">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#64748B] block mb-2 text-center">
              Select User Portal
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#F1F5F9] dark:bg-slate-800/80 rounded-2xl border border-[#E2E8F0] dark:border-slate-700/60">
              <button
                type="button"
                onClick={() => {
                  setRole('organizer');
                  setErrorMsg('');
                }}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  role === 'organizer'
                    ? 'bg-white dark:bg-slate-900 text-[#F97316] shadow-sm border border-[#FED7AA]'
                    : 'text-[#64748B] hover:text-[#1E293B] dark:hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span className="text-[11px]">Organizer</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole('worker');
                  setErrorMsg('');
                }}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  role === 'worker'
                    ? 'bg-white dark:bg-slate-900 text-[#7C3AED] shadow-sm border border-[#DDD6FE]'
                    : 'text-[#64748B] hover:text-[#1E293B] dark:hover:text-white'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span className="text-[11px]">Part-Time Crew</span>
              </button>
            </div>
          </div>

          {/* Title Header */}
          <div className="text-center mb-6">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold border mb-2.5 ${roleTheme.badgeBg}`}>
              {roleTheme.icon}
              <span>{roleTheme.title}</span>
            </div>
            <h2 className="text-xl font-extrabold text-[#1E293B] dark:text-white">
              {mode === 'login' ? `Login to ${roleTheme.title}` : `Register ${roleTheme.title} Account`}
            </h2>
            <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1">
              {roleTheme.subtitle}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Demo Autofill Helpers */}
          {mode === 'login' && (
            <div className="mb-5 p-3 rounded-2xl bg-[#F8FAFC] dark:bg-slate-800/50 border border-[#E2E8F0] dark:border-slate-700/80">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B] dark:text-slate-500 block mb-1.5">
                Quick Demo One-Click Login
              </span>
              <div className="flex flex-wrap gap-1.5">
                {role === 'organizer' && (
                  <button
                    type="button"
                    onClick={() => autofillDemoAccount('organizer@apexevents.com', 'organizer')}
                    className="px-2.5 py-1 rounded-lg bg-[#FFF7ED] border border-[#FED7AA] text-[#EA580C] text-[11px] font-semibold hover:bg-[#FFEDD5] transition-colors"
                  >
                    🏢 Apex Event Organizer
                  </button>
                )}
                {role === 'worker' && (
                  <button
                    type="button"
                    onClick={() => autofillDemoAccount('ananya.worker@eventcrew.com', 'worker')}
                    className="px-2.5 py-1 rounded-lg bg-[#F5F3FF] border border-[#DDD6FE] text-[#7C3AED] text-[11px] font-semibold hover:bg-[#EDE9FE] transition-colors"
                  >
                    👷 Ananya (Senior Banquet Crew)
                  </button>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Registration Specific Fields */}
            {mode === 'signup' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1E293B] dark:text-slate-300 flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-[#64748B]" /> Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-xl p-3 text-xs text-[#1E293B] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#1E293B] dark:text-slate-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#64748B]" /> City Location
                    </label>
                    <select
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-xl p-3 text-xs text-[#1E293B] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED]"
                    >
                      <option value="Mumbai">Mumbai</option>
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Pune">Pune</option>
                      <option value="Kolkata">Kolkata</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#1E293B] dark:text-slate-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#64748B]" /> Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-xl p-3 text-xs text-[#1E293B] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED]"
                    />
                  </div>
                </div>

                {/* Role Specific Inputs */}
                {role === 'organizer' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#1E293B] dark:text-slate-300 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#64748B]" /> Company / Agency Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Event Management Pvt Ltd"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      className="w-full bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-xl p-3 text-xs text-[#1E293B] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED]"
                    />
                  </div>
                )}

                {role === 'worker' && (
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#1E293B] dark:text-slate-300 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-[#64748B]" /> Primary Skill
                      </label>
                      <select
                        value={primarySkill}
                        onChange={e => setPrimarySkill(e.target.value)}
                        className="w-full bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-xl p-3 text-xs text-[#1E293B] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED]"
                      >
                        {availableSkills.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#1E293B] dark:text-slate-300 flex items-center gap-1.5">
                        <IndianRupee className="w-3.5 h-3.5 text-[#64748B]" /> Rate (₹/hr)
                      </label>
                      <input
                        type="number"
                        min="200"
                        max="2000"
                        value={hourlyRate}
                        onChange={e => setHourlyRate(e.target.value)}
                        className="w-full bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-xl p-3 text-xs text-[#1E293B] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED]"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1E293B] dark:text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#64748B]" /> Email Credentials
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-xl p-3 text-xs text-[#1E293B] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED]"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1E293B] dark:text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#64748B]" /> Password
                </span>
                {mode === 'login' && (
                  <button type="button" className="text-[11px] text-[#7C3AED] hover:text-[#6D28D9] font-semibold hover:underline">
                    Forgot?
                  </button>
                )}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-xl p-3 pr-10 text-xs text-[#1E293B] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#64748B] hover:text-[#1E293B] dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password in Signup */}
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1E293B] dark:text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#64748B]" /> Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-xl p-3 text-xs text-[#1E293B] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED]"
                />
              </div>
            )}

            {/* Mandatory Terms & Conditions Checkbox */}
            {mode === 'signup' && (
              <div className="pt-2 border-t border-[#E2E8F0] dark:border-slate-800 space-y-2">
                <div 
                  onClick={() => setAcceptedTerms(!acceptedTerms)}
                  className="flex items-start gap-2.5 cursor-pointer group"
                >
                  <button type="button" className="shrink-0 mt-0.5 text-[#7C3AED]">
                    {acceptedTerms ? (
                      <CheckSquare className="w-4 h-4 text-[#22C55E]" />
                    ) : (
                      <Square className="w-4 h-4 text-[#64748B] group-hover:text-[#7C3AED]" />
                    )}
                  </button>
                  <p className="text-[11px] text-[#64748B] dark:text-slate-300 leading-snug">
                    I have read and agree to the <strong className="text-[#1E293B] dark:text-white">EventCrew Terms of Service</strong>, <strong className="text-[#1E293B] dark:text-white">Escrow Policy</strong>, and <strong className="text-[#1E293B] dark:text-white">Crew Code of Conduct</strong>.
                  </p>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-[11px] font-bold text-[#7C3AED] hover:text-[#6D28D9] hover:underline flex items-center justify-end gap-1 ml-auto cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" /> Read Full Terms & Conditions
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={mode === 'signup' && !acceptedTerms}
              className={`w-full py-3.5 rounded-xl ${roleTheme.btnGradient} text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'signup' && !acceptedTerms ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01]'
              }`}
            >
              <span>{mode === 'login' ? `Log In as ${roleTheme.title}` : `Register ${roleTheme.title}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Switch Mode Footer */}
          <div className="mt-6 pt-4 border-t border-[#E2E8F0] dark:border-slate-800 text-center text-xs text-[#64748B] space-y-3">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    onSwitchMode('signup');
                  }}
                  className="text-[#7C3AED] hover:text-[#6D28D9] font-bold hover:underline cursor-pointer"
                >
                  Create {roleTheme.title} Account
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    onSwitchMode('login');
                  }}
                  className="text-[#7C3AED] hover:text-[#6D28D9] font-bold hover:underline cursor-pointer"
                >
                  Log In to {roleTheme.title}
                </button>
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Secret Admin PIN Modal */}
      <SecretAdminPinModal
        isOpen={showSecretPinModal}
        onClose={() => setShowSecretPinModal(false)}
        onSuccess={onClose}
      />

      {/* Terms & Conditions Full Modal Overlay */}
      {showTermsModal && (
        <TermsModal
          onClose={() => setShowTermsModal(false)}
          onAccept={() => setAcceptedTerms(true)}
        />
      )}
    </>
  );
};
