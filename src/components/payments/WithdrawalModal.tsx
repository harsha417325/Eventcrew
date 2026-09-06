import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  IndianRupee,
  Building2,
  Zap,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Info,
  Check,
  Loader2,
  Wallet
} from 'lucide-react';
import {
  getMinimumWalletBalance,
  getMaxWithdrawableAmount,
  isWalletBalanceMaintained,
  validateWithdrawal,
  MIN_WITHDRAWAL_AMOUNT,
  WALLET_RULE_EXPLANATIONS
} from '../../utils/walletRules';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (amount: number) => void;
}

const POPULAR_BANKS = [
  'HDFC Bank',
  'State Bank of India (SBI)',
  'ICICI Bank',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Punjab National Bank (PNB)',
  'Bank of Baroda',
  'Canara Bank',
  'IndusInd Bank',
  'Union Bank of India',
  'Other Bank'
];

const UPI_APPS = [
  { name: 'Google Pay', icon: '⚡' },
  { name: 'PhonePe', icon: '📱' },
  { name: 'Paytm', icon: '💳' },
  { name: 'BHIM UPI', icon: '🇮🇳' },
  { name: 'Amazon Pay', icon: '🛒' },
  { name: 'Other UPI App', icon: '🔗' }
];

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { currentUser, withdrawFundsFromWallet } = useAuth();

  const [method, setMethod] = useState<'bank' | 'upi'>('bank');
  const [amount, setAmount] = useState<number>(1000);
  
  // Bank fields
  const [accountHolder, setAccountHolder] = useState(currentUser.name || '');
  const [bankName, setBankName] = useState('HDFC Bank');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [accountType, setAccountType] = useState<'savings' | 'current'>('savings');
  const [certifyBank, setCertifyBank] = useState(true);

  // UPI fields
  const [upiId, setUpiId] = useState('');
  const [upiHolderName, setUpiHolderName] = useState(currentUser.name || '');
  const [upiProvider, setUpiProvider] = useState('Google Pay');
  const [isUpiVerified, setIsUpiVerified] = useState(false);
  const [isVerifyingUpi, setIsVerifyingUpi] = useState(false);
  const [upiVerifyMsg, setUpiVerifyMsg] = useState('');

  // Execution states
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successReceipt, setSuccessReceipt] = useState<{
    utr: string;
    amount: number;
    destination: string;
    timestamp: string;
    method: 'bank' | 'upi';
  } | null>(null);

  const role = currentUser.role;
  const roleLabel = role === 'organizer' ? 'Organizer' : role === 'admin' ? 'Admin' : 'Worker';
  const walletBalance = currentUser.walletBalance || 0;
  const minRequiredBalance = getMinimumWalletBalance(role);
  const maxWithdrawable = getMaxWithdrawableAmount(walletBalance, role);
  const isBalanceLessThanMin = walletBalance < minRequiredBalance;
  const cannotWithdrawDueToReserve = walletBalance >= minRequiredBalance && maxWithdrawable < MIN_WITHDRAWAL_AMOUNT;

  // Auto-set initial amount if wallet balance allows
  useEffect(() => {
    if (isOpen) {
      setErrorMessage('');
      setSuccessReceipt(null);
      setIsProcessing(false);
      setIsUpiVerified(false);
      setUpiVerifyMsg('');
      setAccountHolder(currentUser.name || '');
      setUpiHolderName(currentUser.name || '');

      if (maxWithdrawable >= MIN_WITHDRAWAL_AMOUNT) {
        setAmount(MIN_WITHDRAWAL_AMOUNT);
      } else {
        setAmount(MIN_WITHDRAWAL_AMOUNT);
      }
    }
  }, [isOpen, currentUser.name, walletBalance, maxWithdrawable]);

  if (!isOpen) return null;

  // Real-time verification of UPI VPA
  const handleVerifyUpi = () => {
    const cleanUpi = upiId.trim();
    if (!cleanUpi || !cleanUpi.includes('@')) {
      setUpiVerifyMsg('Please enter a valid UPI ID (e.g. worker@okhdfcbank)');
      setIsUpiVerified(false);
      return;
    }

    setIsVerifyingUpi(true);
    setUpiVerifyMsg('');

    setTimeout(() => {
      setIsVerifyingUpi(false);
      setIsUpiVerified(true);
      setUpiVerifyMsg(`✓ Verified VPA: ${cleanUpi} (Beneficiary: ${upiHolderName || currentUser.name})`);
    }, 600);
  };

  const handleQuickAmount = (val: number) => {
    setAmount(val);
    setErrorMessage('');
  };

  const handleSubmitWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Comprehensive validation enforcing role minimum maintenance rules:
    // (Workers: ₹1,000 INR; Organizers: ₹5,000 INR)
    const validation = validateWithdrawal(walletBalance, amount, role);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Withdrawal validation failed.');
      return;
    }

    // Bank validation
    if (method === 'bank') {
      if (!accountHolder.trim()) {
        setErrorMessage('Please enter the primary account holder name matching bank records.');
        return;
      }
      if (!accountNumber || accountNumber.length < 8) {
        setErrorMessage('Please enter a valid bank account number (at least 8-18 digits).');
        return;
      }
      if (accountNumber !== confirmAccountNumber) {
        setErrorMessage('Account Number and Confirm Account Number do not match.');
        return;
      }
      const ifscClean = ifsc.trim().toUpperCase();
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscClean)) {
        setErrorMessage('Please enter a valid 11-character Indian Financial System Code (IFSC), e.g., HDFC0001234.');
        return;
      }
      if (!certifyBank) {
        setErrorMessage('Please certify that these verified bank account credentials belong to you.');
        return;
      }
    }

    // UPI validation
    if (method === 'upi') {
      const cleanUpi = upiId.trim();
      if (!cleanUpi || !cleanUpi.includes('@')) {
        setErrorMessage('Please provide a valid UPI ID (Virtual Payment Address, e.g. name@okhdfcbank).');
        return;
      }
      if (!upiHolderName.trim()) {
        setErrorMessage('Please enter the registered name associated with this UPI account.');
        return;
      }
    }

    setIsProcessing(true);

    setTimeout(() => {
      const result = withdrawFundsFromWallet(amount, {
        method,
        bankDetails:
          method === 'bank'
            ? {
                accountHolder: accountHolder.trim(),
                bankName,
                accountNumber: accountNumber.trim(),
                ifsc: ifsc.trim().toUpperCase(),
                accountType
              }
            : undefined,
        upiDetails:
          method === 'upi'
            ? {
                upiId: upiId.trim(),
                accountHolder: upiHolderName.trim(),
                provider: upiProvider
              }
            : undefined
      });

      setIsProcessing(false);

      if (!result.success) {
        setErrorMessage(result.error || 'Withdrawal failed. Please try again.');
        return;
      }

      // Generate receipt
      const randomUtr = `UTR${Date.now().toString().slice(-8)}${Math.floor(1000 + Math.random() * 9000)}`;
      const destination =
        method === 'upi'
          ? `UPI VPA: ${upiId.trim()}`
          : `${bankName} (A/C: ••••••${accountNumber.slice(-4)})`;

      setSuccessReceipt({
        utr: randomUtr,
        amount,
        destination,
        timestamp: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        method
      });

      if (onSuccess) {
        onSuccess(amount);
      }
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 relative my-8">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Receipt View */}
        {successReceipt ? (
          <div className="space-y-6 text-center py-3 animate-in zoom-in-95">
            <div className="mx-auto w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-extrabold uppercase tracking-wider">
                IMPS / UPI Payout Dispatched
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
                ₹{successReceipt.amount.toLocaleString('en-IN')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Transferred directly to your {successReceipt.method === 'upi' ? 'UPI VPA' : 'Bank Account'}.
              </p>
            </div>

            {/* Receipt Details Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-left space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500">Transaction Status</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Successful & Settled
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500">Beneficiary Destination</span>
                <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                  {successReceipt.destination}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500">Banking UTR / Reference ID</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {successReceipt.utr}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Remaining Wallet Balance</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  ₹{walletBalance.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Done & View Wallet
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-extrabold uppercase tracking-wider mb-2">
                <Wallet className="w-3.5 h-3.5" /> Worker Wallet Payout
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Withdraw Funds
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Instant payouts via Verified Indian Bank Account or UPI ID.
              </p>
            </div>

            {/* Current Wallet Balance Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shadow-md border border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
                  Available Wallet Balance
                </span>
                <span className="text-2xl font-extrabold text-white mt-0.5 block">
                  ₹{walletBalance.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                  Minimum Requirement
                </span>
                <span className="text-xs font-bold text-slate-200">
                  ₹1,000 INR
                </span>
              </div>
            </div>

            {/* REJECTION BANNER: When Wallet Balance is Less Than 1000 INR */}
            {isBalanceLessThanMin ? (
              <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-400 dark:border-rose-800 text-rose-800 dark:text-rose-200 space-y-3 animate-in shake">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-extrabold text-sm text-rose-900 dark:text-rose-100">
                      Withdrawal Request Rejected
                    </h4>
                    <p className="text-xs text-rose-700 dark:text-rose-300 mt-1 leading-relaxed">
                      Your current wallet balance is <strong className="font-bold underline">₹{walletBalance.toLocaleString('en-IN')}</strong>, which is less than the mandatory minimum threshold of <strong className="font-bold">₹1,000 INR</strong>.
                    </p>
                    <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                      Per platform escrow guidelines, workers must have a minimum balance of ₹1,000 to request a payout transfer.
                    </p>
                  </div>
                </div>

                {/* Progress toward 1000 INR */}
                <div className="pt-2 border-t border-rose-200 dark:border-rose-900/60">
                  <div className="flex justify-between text-[11px] font-bold mb-1">
                    <span>Balance Progress</span>
                    <span>₹{walletBalance.toLocaleString('en-IN')} / ₹1,000 (₹{(1000 - walletBalance).toLocaleString('en-IN')} needed)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-rose-200 dark:bg-rose-900 overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full"
                      style={{ width: `${Math.min(100, Math.max(5, (walletBalance / 1000) * 100))}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Understood & Close
                  </button>
                </div>
              </div>
            ) : (
              /* ACTIVE WITHDRAWAL FORM */
              <form onSubmit={handleSubmitWithdrawal} className="space-y-4">
                {/* Error Banner if any */}
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2 animate-in shake">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Amount Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-slate-800 dark:text-slate-200">
                      Withdrawal Amount (₹)
                    </label>
                    <span className="text-slate-500">Min: ₹1,000 • Max: ₹{walletBalance.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      min={1000}
                      max={walletBalance}
                      step={100}
                      value={amount}
                      onChange={e => setAmount(Number(e.target.value))}
                      required
                      className="w-full pl-8 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-extrabold text-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Quick Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleQuickAmount(1000)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        amount === 1000
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      ₹1,000 (Min)
                    </button>
                    {walletBalance >= 2500 && (
                      <button
                        type="button"
                        onClick={() => handleQuickAmount(2500)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          amount === 2500
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        ₹2,500
                      </button>
                    )}
                    {walletBalance >= 5000 && (
                      <button
                        type="button"
                        onClick={() => handleQuickAmount(5000)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          amount === 5000
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        ₹5,000
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleQuickAmount(walletBalance)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        amount === walletBalance
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      Full Balance (₹{walletBalance.toLocaleString('en-IN')})
                    </button>
                  </div>
                </div>

                {/* Method Selection Tabs */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Payout Destination
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => {
                        setMethod('bank');
                        setErrorMessage('');
                      }}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        method === 'bank'
                          ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Bank Account</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMethod('upi');
                        setErrorMessage('');
                      }}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        method === 'upi'
                          ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Zap className="w-4 h-4" />
                      <span>UPI Payment</span>
                    </button>
                  </div>
                </div>

                {/* METHOD 1: BANK ACCOUNT DETAILS */}
                {method === 'bank' && (
                  <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-emerald-600" /> Verified Bank Information
                      </span>
                      <span className="text-[10px] uppercase text-emerald-600 font-extrabold bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                        IMPS Instant
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                          Account Holder Name
                        </label>
                        <input
                          type="text"
                          value={accountHolder}
                          onChange={e => setAccountHolder(e.target.value)}
                          placeholder="As per bank passbook"
                          required
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                          Select Bank
                        </label>
                        <select
                          value={bankName}
                          onChange={e => setBankName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          {POPULAR_BANKS.map(b => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                          Account Number
                        </label>
                        <input
                          type="password"
                          value={accountNumber}
                          onChange={e => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder="Enter account number"
                          maxLength={18}
                          required
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                          Confirm Account Number
                        </label>
                        <input
                          type="text"
                          value={confirmAccountNumber}
                          onChange={e => setConfirmAccountNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder="Re-enter account number"
                          maxLength={18}
                          required
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                          IFSC Code
                        </label>
                        <input
                          type="text"
                          value={ifsc}
                          onChange={e => setIfsc(e.target.value.toUpperCase())}
                          placeholder="e.g. HDFC0001234"
                          maxLength={11}
                          required
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono uppercase font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                          Account Type
                        </label>
                        <select
                          value={accountType}
                          onChange={e => setAccountType(e.target.value as 'savings' | 'current')}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="savings">Savings Account</option>
                          <option value="current">Current Account</option>
                        </select>
                      </div>
                    </div>

                    <label className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-400 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={certifyBank}
                        onChange={e => setCertifyBank(e.target.checked)}
                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>I certify that this bank account is registered in my legal name and active for IMPS instant settlement.</span>
                    </label>
                  </div>
                )}

                {/* METHOD 2: UPI PAYMENT DETAILS */}
                {method === 'upi' && (
                  <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">
                      <span className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-indigo-500" /> UPI Instant Transfer
                      </span>
                      <span className="text-[10px] uppercase text-indigo-600 font-extrabold bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
                        24x7 Realtime
                      </span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block">
                        Virtual Payment Address (UPI ID)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={upiId}
                          onChange={e => {
                            setUpiId(e.target.value);
                            setIsUpiVerified(false);
                            setUpiVerifyMsg('');
                          }}
                          placeholder="e.g. mobile@upi, name@okhdfcbank"
                          required
                          className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyUpi}
                          disabled={isVerifyingUpi || !upiId.trim()}
                          className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shrink-0"
                        >
                          {isVerifyingUpi ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <ShieldCheck className="w-3.5 h-3.5" />
                          )}
                          <span>Verify VPA</span>
                        </button>
                      </div>

                      {/* UPI verification response */}
                      {upiVerifyMsg && (
                        <p className={`text-[11px] font-semibold flex items-center gap-1 ${
                          isUpiVerified ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                        }`}>
                          {upiVerifyMsg}
                        </p>
                      )}

                      {/* Suffix helpers */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
                        <span className="text-slate-400">Quick handles:</span>
                        {['@okhdfcbank', '@oksbi', '@paytm', '@ybl', '@upi'].map(suffix => (
                          <button
                            key={suffix}
                            type="button"
                            onClick={() => {
                              const base = upiId.split('@')[0] || currentUser.name.toLowerCase().replace(/\s+/g, '');
                              setUpiId(`${base}${suffix}`);
                              setIsUpiVerified(false);
                            }}
                            className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-indigo-400 cursor-pointer"
                          >
                            {suffix}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                          Account Holder on UPI
                        </label>
                        <input
                          type="text"
                          value={upiHolderName}
                          onChange={e => setUpiHolderName(e.target.value)}
                          placeholder="Beneficiary Name"
                          required
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                          UPI Provider App
                        </label>
                        <select
                          value={upiProvider}
                          onChange={e => setUpiProvider(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          {UPI_APPS.map(app => (
                            <option key={app.name} value={app.name}>
                              {app.icon} {app.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Summary Box */}
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Withdrawal Request</span>
                    <span className="font-bold text-slate-900 dark:text-white">₹{amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Escrow Processing Fee (0%)</span>
                    <span className="font-bold text-emerald-600">Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 dark:text-white pt-1.5 border-t border-slate-200 dark:border-slate-700">
                    <span>Net Transfer Amount</span>
                    <span className="text-emerald-600 dark:text-emerald-400 text-sm">
                      ₹{amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  type="submit"
                  disabled={isProcessing || amount < 1000 || amount > walletBalance}
                  className="w-full py-3.5 rounded-2xl bg-[#22C55E] hover:bg-[#16A34A] active:scale-[0.99] disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing Settlement via FastPay...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Confirm & Withdraw ₹{amount.toLocaleString('en-IN')}</span>
                    </>
                  )}
                </button>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
