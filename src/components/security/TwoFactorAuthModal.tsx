import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Smartphone, Key, Copy, Check, X, AlertTriangle, Lock } from 'lucide-react';

interface TwoFactorAuthModalProps {
  onClose: () => void;
}

export const TwoFactorAuthModal: React.FC<TwoFactorAuthModalProps> = ({ onClose }) => {
  const { currentUser, toggle2FA } = useAuth();
  
  const [enabled, setEnabled] = useState(currentUser.twoFactorEnabled ?? false);
  const [verificationCode, setVerificationCode] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const secretKey = 'JBSWY3DPEHPK3PXP';
  const backupCodes = ['8492-1920', '3910-5829', '7741-2094', '4928-1184'];

  const handleCopyKey = () => {
    navigator.clipboard.writeText(secretKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleVerifyAndEnable = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Accept any 6 digit code
    if (verificationCode.trim().length === 6) {
      toggle2FA(true);
      setEnabled(true);
      setVerifiedSuccess(true);
    } else {
      setErrorMessage('Please enter a valid 6-digit authenticator code.');
    }
  };

  const handleDisable = () => {
    toggle2FA(false);
    setEnabled(false);
    setVerifiedSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Two-Factor Authentication (2FA)</h3>
              <p className="text-xs text-slate-400">Protect logins and high-value payout transactions</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">

          {/* Current Status Badge */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${enabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  2FA Status: {enabled ? 'Enabled & Active' : 'Disabled'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {enabled ? 'Time-based one-time passwords required for login.' : 'Standard password login only.'}
                </p>
              </div>
            </div>

            {enabled && (
              <button
                onClick={handleDisable}
                className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                Disable 2FA
              </button>
            )}
          </div>

          {!enabled ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Step 1: Link Authenticator App
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Use Google Authenticator, Authy, or 1Password to scan this QR code or enter the secret setup key:
                </p>
              </div>

              {/* Simulated QR Code & Key Box */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row items-center gap-4">
                {/* Visual stylized QR representation */}
                <div className="w-28 h-28 bg-white p-2 rounded-xl shadow border border-slate-200 shrink-0 grid grid-cols-5 gap-1">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`rounded-xs ${[0, 1, 3, 4, 5, 8, 10, 12, 14, 16, 19, 20, 21, 23, 24].includes(i) ? 'bg-slate-900' : 'bg-transparent'}`}
                    />
                  ))}
                </div>

                <div className="space-y-2 flex-1 text-center sm:text-left">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Secret Setup Key</span>
                  <div className="flex items-center gap-2">
                    <code className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-300">
                      {secretKey}
                    </code>
                    <button
                      onClick={handleCopyKey}
                      className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
                      title="Copy Key"
                    >
                      {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400">Account: {currentUser.email}</p>
                </div>
              </div>

              {/* Step 2: Verification code */}
              <form onSubmit={handleVerifyAndEnable} className="space-y-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Step 2: Enter 6-Digit Code from Authenticator App
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={verificationCode}
                    onChange={e => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 px-4 py-2.5 text-center text-lg font-mono font-bold tracking-widest rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={verificationCode.length !== 6}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all"
                  >
                    Verify & Enable
                  </button>
                </div>
                {errorMessage && (
                  <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> {errorMessage}
                  </p>
                )}
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <p className="text-xs text-emerald-900 dark:text-emerald-200 font-medium">
                  2FA is currently protecting your EventCrew profile and instant wallet payouts.
                </p>
              </div>

              {/* Backup Emergency Codes */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Emergency Backup Codes
                  </span>
                  <span className="text-[10px] text-slate-400">Save in a safe place</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {backupCodes.map((code, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center font-mono text-xs text-slate-700 dark:text-slate-300">
                      {code}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
