import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff,
  KeyRound,
  Mail,
  ArrowLeft,
  Check,
  RefreshCw
} from 'lucide-react';

interface SecretAdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SecretAdminPinModal: React.FC<SecretAdminPinModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { loginUser } = useAuth();
  
  // 6-digit PIN state
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPinDigits, setShowPinDigits] = useState(false);

  // Forgot PIN recovery states
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotStep, setForgotStep] = useState<'request' | 'verify'>('request');
  const [adminEmail, setAdminEmail] = useState('admin@eventcrew.com');
  const [sentOtp, setSentOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showNewPin, setShowNewPin] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  useEffect(() => {
    if (isOpen) {
      setPin(['', '', '', '', '', '']);
      setErrorMsg('');
      setSuccessMsg('');
      setIsVerifying(false);
      setIsForgotMode(false);
      setForgotStep('request');
      setEnteredOtp('');
      setNewPin('');
      setConfirmPin('');
      setSentOtp('');
      setTimeout(() => {
        inputRefs[0].current?.focus();
      }, 150);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newPinArray = [...pin];
    newPinArray[index] = value.slice(-1);
    setPin(newPinArray);
    setErrorMsg('');

    // Auto-advance focus to next digit
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newPinArray = ['', '', '', '', '', ''];
      for (let i = 0; i < pastedData.length; i++) {
        newPinArray[i] = pastedData[i];
      }
      setPin(newPinArray);
      const focusIndex = Math.min(pastedData.length, 5);
      inputRefs[focusIndex].current?.focus();
    }
  };

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const enteredPin = pin.join('');
    if (enteredPin.length < 6) {
      setErrorMsg('Please enter all 6 digits of the Admin PIN.');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      // Admin 6-digit PINs: 777777 (master default), 123456, 999999, 888888, plus any reset PIN in localStorage
      const savedCustomPin = localStorage.getItem('eventcrew_admin_pin');
      const validPins = ['777777', '123456', '999999', '888888'];
      if (savedCustomPin) {
        validPins.push(savedCustomPin);
      }

      if (validPins.includes(enteredPin)) {
        setSuccessMsg('6-Digit PIN Verified! Unlocking System Admin Access...');
        setTimeout(() => {
          const success = loginUser('admin@eventcrew.com');
          setIsVerifying(false);
          if (success) {
            if (onSuccess) onSuccess();
            onClose();
          } else {
            setErrorMsg('System Admin user account not found.');
          }
        }, 600);
      } else {
        setIsVerifying(false);
        setErrorMsg('Invalid 6-Digit Admin PIN. Access Denied.');
        setPin(['', '', '', '', '', '']);
        inputRefs[0].current?.focus();
      }
    }, 500);
  };

  // Handle Forgot PIN - Step 1: Send Recovery Code
  const handleSendRecoveryOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = adminEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMsg('Please provide your registered administrator email address.');
      return;
    }

    if (cleanEmail !== 'admin@eventcrew.com') {
      setErrorMsg('Unrecognized administrator account. Must match registered system admin (admin@eventcrew.com).');
      return;
    }

    // Generate random 6-digit recovery OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setSentOtp(generatedOtp);
    setForgotStep('verify');
    setSuccessMsg(`Recovery code dispatched to ${cleanEmail}. Verification Code: ${generatedOtp}`);
  };

  // Handle Forgot PIN - Step 2: Verify OTP & Reset 6-Digit PIN
  const handleResetPin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (enteredOtp.trim() !== sentOtp) {
      setErrorMsg('Invalid or expired recovery code. Please check and try again.');
      return;
    }

    if (!/^\d{6}$/.test(newPin)) {
      setErrorMsg('New PIN must be exactly 6 numeric digits.');
      return;
    }

    if (newPin !== confirmPin) {
      setErrorMsg('New PIN and Confirm PIN do not match.');
      return;
    }

    setIsResetting(true);

    setTimeout(() => {
      // Save new PIN to localStorage
      localStorage.setItem('eventcrew_admin_pin', newPin);
      setIsResetting(false);
      setSuccessMsg('6-Digit PIN successfully updated! Signing into Admin Portal...');

      setTimeout(() => {
        const success = loginUser('admin@eventcrew.com');
        if (success) {
          if (onSuccess) onSuccess();
          onClose();
        } else {
          setErrorMsg('Admin account could not be authenticated.');
        }
      }, 700);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#0F172A] border border-[#7C3AED]/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/50 space-y-6 text-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top ambient glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#7C3AED]/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#F97316]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#7C3AED] border border-purple-300/30 flex items-center justify-center shadow-lg shadow-purple-600/30">
            {isForgotMode ? (
              <KeyRound className="w-7 h-7 text-white" />
            ) : (
              <ShieldCheck className="w-8 h-8 text-white" />
            )}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-purple-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              <Lock className="w-3 h-3" />
              {isForgotMode ? 'PIN Recovery Service' : 'Restricted Gateway'}
            </div>
            <h3 className="text-xl font-extrabold text-white">
              {isForgotMode ? 'Reset 6-Digit Admin PIN' : 'Admin Access'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              {isForgotMode 
                ? 'Verify administrator credentials to securely reset your 6-digit Master PIN.'
                : 'Enter your 6-digit Master Security PIN to log into the System Administration Panel.'}
            </p>
          </div>
        </div>

        {/* Alert Messages */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2.5 animate-in shake">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
            <span className="leading-relaxed">{successMsg}</span>
          </div>
        )}

        {/* Standard PIN Entry View */}
        {!isForgotMode ? (
          <>
            <form onSubmit={handleVerifyPin} className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-purple-400" />
                    Master Admin 6-Digit PIN
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPinDigits(!showPinDigits)}
                    className="text-[11px] font-semibold text-slate-400 hover:text-purple-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {showPinDigits ? (
                      <>
                        <EyeOff className="w-3 h-3" /> Hide PIN
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3" /> Show PIN
                      </>
                    )}
                  </button>
                </div>

                {/* 6 Digit Inputs */}
                <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
                  {pin.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={inputRefs[idx]}
                      type={showPinDigits ? 'text' : 'password'}
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      onPaste={handlePaste}
                      className="w-full h-12 sm:h-14 text-center text-lg sm:text-xl font-bold bg-slate-950/80 border border-slate-700 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 rounded-xl sm:rounded-2xl outline-none transition-all text-purple-300"
                    />
                  ))}
                </div>
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                disabled={isVerifying || !!successMsg}
                className="w-full py-3.5 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-xl shadow-purple-900/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isVerifying ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify PIN & Access Admin Panel</span>
                  </>
                )}
              </button>
            </form>

            {/* Forgot PIN Option (replaces previous PIN hint) */}
            <div className="pt-2 text-center border-t border-slate-800 flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  setIsForgotMode(true);
                  setForgotStep('request');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-xs font-semibold text-slate-400 hover:text-purple-300 transition-colors flex items-center gap-1.5 cursor-pointer py-1 px-3 rounded-xl hover:bg-slate-800/50"
              >
                <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                <span>Forgot PIN?</span>
              </button>
            </div>
          </>
        ) : (
          /* Forgot PIN Workflow */
          <div className="space-y-5">
            {forgotStep === 'request' ? (
              <form onSubmit={handleSendRecoveryOtp} className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-purple-400" />
                    Registered Admin Email
                  </label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@eventcrew.com"
                    required
                    className="w-full py-3 px-4 rounded-xl bg-slate-950/80 border border-slate-700 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 text-white text-xs sm:text-sm outline-none transition-all placeholder:text-slate-500"
                  />
                  <p className="text-[11px] text-slate-400">
                    A 6-digit security recovery code will be dispatched to verify your identity.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Recovery Code</span>
                </button>

                <div className="pt-2 text-center border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(false);
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="text-xs font-semibold text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to 6-Digit PIN Login</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Step 2: Enter Recovery Code & Set New 6-Digit PIN */
              <form onSubmit={handleResetPin} className="space-y-4">
                {/* Simulated Recovery Code quick autofill helper */}
                {sentOtp && (
                  <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-700/50 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-purple-200">
                      <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Security OTP: <strong className="font-mono text-white tracking-wider">{sentOtp}</strong></span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEnteredOtp(sentOtp)}
                      className="text-[11px] font-bold text-purple-300 hover:text-white underline cursor-pointer"
                    >
                      Autofill OTP
                    </button>
                  </div>
                )}

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-300">
                    Enter 6-Digit Recovery Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="6-digit recovery code"
                    required
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-950/80 border border-slate-700 focus:border-[#7C3AED] text-white font-mono text-center tracking-widest text-sm outline-none transition-all placeholder:tracking-normal placeholder:font-sans placeholder:text-xs"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-300">
                      New 6-Digit Admin PIN
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowNewPin(!showNewPin)}
                      className="text-[11px] font-semibold text-slate-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                    >
                      {showNewPin ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showNewPin ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <input
                    type={showNewPin ? 'text' : 'password'}
                    maxLength={6}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6 digits (e.g. 777777)"
                    required
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-950/80 border border-slate-700 focus:border-[#7C3AED] text-white font-mono tracking-widest text-center text-sm outline-none transition-all placeholder:tracking-normal placeholder:font-sans placeholder:text-xs"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-300">
                    Confirm New 6-Digit PIN
                  </label>
                  <input
                    type={showNewPin ? 'text' : 'password'}
                    maxLength={6}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Re-enter 6 digits"
                    required
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-950/80 border border-slate-700 focus:border-[#7C3AED] text-white font-mono tracking-widest text-center text-sm outline-none transition-all placeholder:tracking-normal placeholder:font-sans placeholder:text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isResetting || !enteredOtp || newPin.length !== 6 || confirmPin.length !== 6}
                  className="w-full py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isResetting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>Save New PIN & Log In</span>
                </button>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
                      setSentOtp(generatedOtp);
                      setSuccessMsg(`New recovery code dispatched: ${generatedOtp}`);
                    }}
                    className="hover:text-purple-300 cursor-pointer text-[11px]"
                  >
                    Resend Code
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(false);
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer text-[11px]"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Back to PIN Login</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
