import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, CheckCircle2, Clock, AlertTriangle, ArrowRight, Wallet, Lock } from 'lucide-react';

interface EscrowTrackerProps {
  onOpenDispute?: (eventId: string) => void;
  onOpenInvoices?: () => void;
}

export const EscrowTracker: React.FC<EscrowTrackerProps> = ({ onOpenDispute, onOpenInvoices }) => {
  const { currentUser, events, applications, releasePayout } = useAuth();

  // Compute escrow amounts
  // For organizer: total budget of active events not yet paid out
  // For worker: total pay of accepted jobs where event is upcoming or in-progress
  const userEvents = events.filter(e => e.organizerId === currentUser.id);
  const organizerEscrowTotal = userEvents
    .filter(e => e.status === 'upcoming' || e.status === 'in_progress')
    .reduce((sum, e) => sum + (e.budget || 0), 0);

  const workerAcceptedApps = applications.filter(a => a.workerId === currentUser.id && (a.status === 'accepted' || a.status === 'attended'));
  const workerEscrowTotal = workerAcceptedApps.reduce((sum, a) => sum + (a.payAmount || 0), 0);

  const totalEscrow = currentUser.role === 'organizer' ? organizerEscrowTotal : workerEscrowTotal;

  // Active shifts in escrow
  const activeAppsInEscrow = currentUser.role === 'organizer'
    ? applications.filter(a => {
        const ev = events.find(e => e.id === a.eventId);
        return ev?.organizerId === currentUser.id && (a.status === 'accepted' || a.status === 'attended');
      })
    : applications.filter(a => a.workerId === currentUser.id && (a.status === 'accepted' || a.status === 'attended'));

  return (
    <div className="p-6 rounded-3xl bg-[#0F172A] text-white shadow-xl border border-slate-800 space-y-6 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#7C3AED]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-[#7C3AED] border border-[#7C3AED]/40 text-white shadow-lg shadow-purple-600/30">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold tracking-tight text-white">Smart Escrow Vault</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30">
                100% Protected
              </span>
            </div>
            <p className="text-xs text-[#CBD5E1]">
              Funds are safely held until shift completion is confirmed by organizer and crew
            </p>
          </div>
        </div>

        {/* Total in Escrow Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/15 px-5 py-3 rounded-2xl flex items-center gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#CBD5E1]">
              {currentUser.role === 'organizer' ? 'Organized Funds in Escrow' : 'Guaranteed Worker Escrow'}
            </span>
            <div className="text-2xl font-black text-white">
              ₹{totalEscrow.toLocaleString('en-IN')}
            </div>
          </div>
          {onOpenInvoices && (
            <button
              onClick={onOpenInvoices}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Invoices
            </button>
          )}
        </div>
      </div>

      {/* 3-Stage Escrow Timeline */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs relative z-10">
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#22C55E] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow">
            1
          </div>
          <div>
            <p className="font-bold text-white">Funds Deposited</p>
            <p className="text-[11px] text-[#CBD5E1]">Organizer deposits budget into escrow upon event publishing.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow">
            2
          </div>
          <div>
            <p className="font-bold text-white">Shift Checked-In</p>
            <p className="text-[11px] text-[#CBD5E1]">Worker reports to venue, performs duties, and logs hours.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#F97316] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow">
            3
          </div>
          <div>
            <p className="font-bold text-white">Instant Release</p>
            <p className="text-[11px] text-[#CBD5E1]">Upon approval, funds transfer instantly to worker wallet.</p>
          </div>
        </div>

      </div>

      {/* Shift List currently in escrow */}
      {activeAppsInEscrow.length > 0 && (
        <div className="space-y-3 relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#CBD5E1] block">
            Active Shifts Protected Under Escrow ({activeAppsInEscrow.length})
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeAppsInEscrow.slice(0, 4).map(app => (
              <div 
                key={app.id} 
                className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 transition-all border border-white/10 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <p className="font-bold text-white">{app.jobRoleTitle}</p>
                  <p className="text-[11px] text-[#CBD5E1]">
                    {currentUser.role === 'organizer' ? `Worker: ${app.workerName}` : `Event: ${events.find(e => e.id === app.eventId)?.title || 'Event Shift'}`}
                  </p>
                  <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    app.payoutStatus === 'released' 
                      ? 'bg-[#22C55E]/20 text-[#22C55E]' 
                      : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                  }`}>
                    {app.payoutStatus === 'released' ? 'Payout Released' : 'Held in Escrow'}
                  </span>
                </div>

                <div className="text-right space-y-2 shrink-0">
                  <span className="text-sm font-extrabold text-[#22C55E]">
                    ₹{app.payAmount.toLocaleString('en-IN')}
                  </span>
                  
                  {currentUser.role === 'organizer' && app.payoutStatus !== 'released' && (
                    <button
                      onClick={() => releasePayout(app.id)}
                      className="block w-full px-2.5 py-1 rounded-lg bg-[#22C55E] hover:bg-[#16A34A] text-white font-extrabold text-[10px] transition-all shadow cursor-pointer"
                    >
                      Release Escrow
                    </button>
                  )}

                  {onOpenDispute && (
                    <button
                      onClick={() => onOpenDispute(app.eventId)}
                      className="block text-[10px] text-purple-300 hover:text-white underline underline-offset-2 mt-1 cursor-pointer"
                    >
                      Issue Dispute
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
