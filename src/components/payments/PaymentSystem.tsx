import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Wallet,
  IndianRupee,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  CreditCard,
  Plus,
  CheckCircle2,
  Building2,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { WithdrawalModal } from './WithdrawalModal';

export const PaymentSystem: React.FC = () => {
  const { currentUser, transactions, addFundsToWallet } = useAuth();

  const [showTopupModal, setShowTopupModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState(2500);
  const [gateway, setGateway] = useState<'stripe' | 'razorpay'>('stripe');
  const [successMsg, setSuccessMsg] = useState(false);

  const myTransactions = transactions.filter(t => t.userId === currentUser.id);
  const walletBalance = currentUser.walletBalance || 0;

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    addFundsToWallet(depositAmount);
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setShowTopupModal(false);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Wallet Card */}
      <div className="p-8 rounded-3xl bg-[#0F172A] text-white shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6 relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#7C3AED]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="md:col-span-2 space-y-2 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#CBD5E1] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#22C55E]" /> Secure Wallet & Escrow Engine
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Min. Withdrawal: ₹1,000
            </span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            ₹{walletBalance.toLocaleString('en-IN')}
          </h2>
          <p className="text-xs text-[#CBD5E1]">
            Available balance for instant worker shift payouts & escrow deposits. Supports direct transfers to Verified Indian Bank Accounts & UPI IDs.
          </p>

          {walletBalance < 1000 && (
            <p className="text-[11px] text-amber-400 font-medium flex items-center gap-1 pt-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Minimum ₹1,000 wallet balance required to request a withdrawal.
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-start md:justify-end gap-3 relative z-10">
          {/* Withdrawal Button */}
          <button
            type="button"
            onClick={() => setShowWithdrawalModal(true)}
            className="px-5 py-3 rounded-2xl bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" /> Withdraw Funds
          </button>

          {/* Top Up Button */}
          <button
            type="button"
            onClick={() => setShowTopupModal(true)}
            className="px-5 py-3 rounded-2xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Top Up Wallet
          </button>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[#E2E8F0] dark:border-slate-700 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
          <h3 className="font-bold text-[#1E293B] dark:text-white text-sm">
            Transaction History ({myTransactions.length})
          </h3>
          <span className="text-xs text-[#64748B]">All payouts & transfers IMPS/UPI verified</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
          {myTransactions.length === 0 ? (
            <p className="p-8 text-center text-xs text-[#64748B]">No transactions recorded yet.</p>
          ) : (
            myTransactions.map(tx => {
              const isCredit = tx.type === 'payout_received' || tx.type === 'deposit';
              const isWithdrawal = tx.type === 'withdrawal';

              return (
                <div key={tx.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${
                      isCredit
                        ? 'bg-[#DCFCE7] text-[#22C55E]'
                        : isWithdrawal
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                        : 'bg-[#EDE9FE] text-[#7C3AED]'
                    }`}>
                      {isCredit ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : isWithdrawal ? (
                        <Building2 className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-[#1E293B] dark:text-white">{tx.description}</p>
                        {isWithdrawal && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                            WITHDRAWAL
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#64748B]">{tx.date}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`font-extrabold text-sm ${
                      isCredit
                        ? 'text-[#22C55E]'
                        : isWithdrawal
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-[#1E293B] dark:text-white'
                    }`}>
                      {isCredit ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                    </span>
                    <span className={`block text-[10px] uppercase font-bold ${
                      tx.status === 'completed'
                        ? 'text-[#22C55E]'
                        : tx.status === 'failed'
                        ? 'text-rose-500'
                        : 'text-amber-500'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Withdrawal Modal */}
      <WithdrawalModal
        isOpen={showWithdrawalModal}
        onClose={() => setShowWithdrawalModal(false)}
      />

      {/* Topup Modal */}
      {showTopupModal && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#E2E8F0] dark:border-slate-800">
            <h3 className="font-bold text-[#1E293B] dark:text-white text-base mb-1">
              Top Up Wallet Balance
            </h3>
            <p className="text-xs text-[#64748B] mb-4">
              Select payment gateway (Stripe or Razorpay) to deposit funds.
            </p>

            {successMsg ? (
              <div className="p-6 text-center text-[#22C55E] font-bold text-sm flex flex-col items-center gap-2">
                <CheckCircle2 className="w-8 h-8 text-[#22C55E]" />
                <span>Wallet Loaded Successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleDeposit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1E293B] dark:text-slate-300">
                    Deposit Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="500"
                    max="100000"
                    value={depositAmount}
                    onChange={e => setDepositAmount(Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 font-extrabold text-lg text-[#1E293B] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGateway('stripe')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      gateway === 'stripe' ? 'bg-[#7C3AED] text-white border-[#7C3AED]' : 'border-[#E2E8F0] dark:border-slate-700 text-[#64748B] dark:text-slate-300'
                    }`}
                  >
                    Stripe Pay
                  </button>
                  <button
                    type="button"
                    onClick={() => setGateway('razorpay')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      gateway === 'razorpay' ? 'bg-[#7C3AED] text-white border-[#7C3AED]' : 'border-[#E2E8F0] dark:border-slate-700 text-[#64748B] dark:text-slate-300'
                    }`}
                  >
                    Razorpay
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-xs shadow-md cursor-pointer transition-all"
                >
                  Confirm ₹{depositAmount.toLocaleString('en-IN')} Deposit
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
