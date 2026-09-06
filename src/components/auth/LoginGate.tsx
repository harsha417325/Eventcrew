import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { 
  Calendar, 
  Building2, 
  UserCheck, 
  ShieldCheck, 
  Mail, 
  Lock, 
  Key,
  ArrowRight, 
  Eye, 
  EyeOff, 
  Info,
  MapPin,
  User as UserIcon
} from 'lucide-react';
import { SecretAdminPinModal } from './SecretAdminPinModal';

export const LoginGate: React.FC = () => {
  const { loginUser, signupUser, users } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<UserRole>('organizer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const [notRegisteredNotice, setNotRegisteredNotice] = useState<string | null>(null);
  const [showSecretPinModal, setShowSecretPinModal] = useState(false);

  const handleGmailSignIn = () => {
    setErrorMsg('');
    setNotRegisteredNotice(null);
    if (!email.trim()) {
      setErrorMsg('Please enter your Gmail address above to check if you are registered.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const success = loginUser(email.trim());
      setLoading(false);
      if (!success) {
        setNotRegisteredNotice(email.trim());
      }
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setNotRegisteredNotice(null);

    if (!email.trim()) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!password.trim()) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setLoading(true);

    if (mode === 'login') {
      setTimeout(() => {
        const success = loginUser(email.trim());
        setLoading(false);
        if (!success) {
          setNotRegisteredNotice(email.trim());
        }
      }, 400);
    } else {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        setLoading(false);
        return;
      }

      // Check if user is ALREADY registered
      const existingUser = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
      if (existingUser) {
        setErrorMsg(`The email ${email.trim()} is already registered! Please switch to Login mode to sign in.`);
        setLoading(false);
        return;
      }

      setTimeout(() => {
        signupUser(name.trim(), email.trim(), role, city);
        setLoading(false);
      }, 400);
    }
  };

  const roleInfo = {
    organizer: {
      title: 'Event Organizer Portal',
      desc: 'Post shifts, manage escrow funds, and hire verified event crew.',
      icon: <Building2 className="w-5 h-5 text-[#F97316]" />,
      color: 'orange'
    },
    worker: {
      title: 'Part-Time Crew Worker Portal',
      desc: 'Find flexible shifts, apply for events, and earn instant payouts.',
      icon: <UserCheck className="w-5 h-5 text-[#7C3AED]" />,
      color: 'purple'
    },
    admin: {
      title: 'System Admin Portal',
      desc: 'Oversee events, user verifications, and dispute resolution.',
      icon: <ShieldCheck className="w-5 h-5 text-white" />,
      color: 'navy'
    }
  }[role];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Dynamic Background Glow & Ambient Elements using brand Purple and Orange */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-[#7C3AED]/8 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Branding in Brand Navy #0F172A */}
      <header className="relative z-10 bg-[#0F172A] border-b border-slate-800 py-3.5 px-6 shadow-md w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#7C3AED] shadow-lg shadow-purple-600/30 flex items-center justify-center text-white">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white">EventCrew</span>
                <span className="px-2 py-0.5 rounded-full bg-[#F97316]/20 border border-[#F97316]/40 text-[#F97316] text-[10px] font-bold uppercase tracking-wider">
                  India
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                On-Demand Event Staffing & Shift Marketplace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowSecretPinModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/90 hover:bg-slate-750 px-3.5 py-2 rounded-xl border border-slate-700 transition-colors cursor-pointer shadow-sm hover:border-[#7C3AED]/50"
            >
              <Key className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Login Landing Portal Card */}
      <main className="relative z-10 my-auto px-4 py-8 max-w-md sm:max-w-lg w-full mx-auto">
        
        <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-9 border border-[#E2E8F0] shadow-xl shadow-slate-200/70 space-y-5">
          
          {/* Portal Selection Tabs */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#64748B] block text-center">
              Select User Portal
            </label>
            
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#F1F5F9] rounded-2xl border border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => {
                  setRole('organizer');
                  setErrorMsg('');
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'organizer'
                    ? 'bg-[#F97316] text-white shadow-md shadow-orange-500/25'
                    : 'text-[#64748B] hover:text-[#1E293B] hover:bg-white/60'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Organizer</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole('worker');
                  setErrorMsg('');
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'worker'
                    ? 'bg-[#7C3AED] text-white shadow-md shadow-purple-500/25'
                    : 'text-[#64748B] hover:text-[#1E293B] hover:bg-white/60'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Crew Worker</span>
              </button>
            </div>
          </div>

          {/* Role Header Info */}
          <div className="text-center pt-1">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold border mb-2 ${
              role === 'organizer'
                ? 'bg-[#FFF7ED] text-[#EA580C] border-[#FED7AA]'
                : 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]'
            }`}>
              {roleInfo.icon}
              <span>{roleInfo.title}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#1E293B]">
              {mode === 'login' ? `Sign In to ${role === 'organizer' ? 'Organizer' : 'Crew'} Portal` : `Create ${role === 'organizer' ? 'Organizer' : 'Crew'} Account`}
            </h1>
            <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
              {roleInfo.desc}
            </p>
          </div>

          {/* Quick Demo One-Click Login */}
          {mode === 'login' && (
            <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B] block mb-1.5">
                Quick Demo One-Click Login
              </span>
              <div className="flex flex-wrap gap-2">
                {role === 'organizer' && (
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('organizer@apexevents.com');
                      setPassword('demo123456');
                      setErrorMsg('');
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-xl bg-[#FFF7ED] border border-[#FED7AA] text-[#EA580C] text-[11px] font-semibold hover:bg-[#FFEDD5] transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>🏢 Apex Event Organizer (Demo)</span>
                    <span className="text-[10px] text-[#C2410C] underline font-bold">Auto-fill</span>
                  </button>
                )}
                {role === 'worker' && (
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('ananya.worker@eventcrew.com');
                      setPassword('demo123456');
                      setErrorMsg('');
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-xl bg-[#F5F3FF] border border-[#DDD6FE] text-[#7C3AED] text-[11px] font-semibold hover:bg-[#EDE9FE] transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>👷 Ananya - Senior Crew (Demo)</span>
                    <span className="text-[10px] text-[#6D28D9] underline font-bold">Auto-fill</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGmailSignIn}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z" />
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
            </svg>
            <span>Continue with Gmail</span>
          </button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E2E8F0]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold">
              <span className="bg-[#FFFFFF] px-3 text-[#64748B]">Or Email & Password</span>
            </div>
          </div>

          {/* Unregistered User Warning Alert (Amber #F59E0B status color) */}
          {notRegisteredNotice && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
              <div className="flex items-start gap-2.5">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-amber-800">Account Not Registered!</p>
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    The email <span className="font-mono underline font-semibold text-[#1E293B]">{notRegisteredNotice}</span> is not registered with EventCrew yet. You must register an account first before you can log in.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setNotRegisteredNotice(null);
                  setErrorMsg('');
                }}
                className="w-full mt-2 py-2.5 px-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-500/20"
              >
                <span>Register & Create Account Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Error Message (Red #EF4444 status color) */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1E293B]">Full Legal Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED] focus:bg-white transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1E293B]">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1E293B]">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-[#64748B] hover:text-[#1E293B]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1E293B]">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1E293B]">City Location</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3.5" />
                    <select
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED] focus:bg-white transition-all"
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
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                role === 'organizer'
                  ? 'bg-[#F97316] hover:bg-[#EA580C] shadow-orange-500/25'
                  : 'bg-[#7C3AED] hover:bg-[#6D28D9] shadow-purple-500/25'
              }`}
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{mode === 'login' ? `Sign In to ${roleInfo.title}` : `Register ${roleInfo.title}`}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Mode Switcher Footer */}
          <div className="text-center pt-2 space-y-3">
            {mode === 'login' ? (
              <p className="text-xs text-[#64748B]">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMsg('');
                  }}
                  className="text-[#7C3AED] hover:text-[#6D28D9] font-bold hover:underline"
                >
                  Create an Account
                </button>
              </p>
            ) : (
              <p className="text-xs text-[#64748B]">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg('');
                  }}
                  className="text-[#7C3AED] hover:text-[#6D28D9] font-bold hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>

        </div>
      </main>

      {/* Secret Admin PIN Modal */}
      <SecretAdminPinModal
        isOpen={showSecretPinModal}
        onClose={() => setShowSecretPinModal(false)}
      />

      {/* Footer copyright */}
      <footer className="relative z-10 py-4 text-center text-[11px] text-[#64748B]">
        © 2026 EventCrew. Verified & Secure Event Staffing Platform.
      </footer>

    </div>
  );
};
