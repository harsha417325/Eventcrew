import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Invoice } from '../../types';
import { FileText, Printer, Download, CheckCircle, Building2, Calendar, ShieldCheck, X, Copy, Check } from 'lucide-react';

interface InvoiceModalProps {
  onClose: () => void;
  preselectedInvoiceId?: string;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ onClose, preselectedInvoiceId }) => {
  const { invoices, currentUser, events } = useAuth();

  // Filter invoices for current user (organizer or worker) or all for admin
  const userInvoices = currentUser.role === 'admin'
    ? invoices
    : invoices.filter(inv => inv.organizerId === currentUser.id || inv.workerId === currentUser.id);

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice>(
    userInvoices.find(inv => inv.id === preselectedInvoiceId) || userInvoices[0] || invoices[0]
  );
  const [copiedId, setCopiedId] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh]">
        
        {/* Left Sidebar: Invoice Selector */}
        <div className="w-full md:w-80 bg-slate-50 dark:bg-slate-800/60 border-r border-slate-200 dark:border-slate-700 p-5 flex flex-col shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Tax Invoices</h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold">
              {userInvoices.length}
            </span>
          </div>

          <div className="space-y-2 overflow-y-auto flex-1 pr-1">
            {userInvoices.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No invoices issued yet.</p>
            ) : (
              userInvoices.map(inv => (
                <button
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className={`w-full text-left p-3 rounded-2xl transition-all border ${
                    selectedInvoice?.id === inv.id
                      ? 'bg-white dark:bg-slate-900 border-indigo-500 shadow-md ring-1 ring-indigo-500'
                      : 'bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                      {inv.invoiceNumber}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      inv.status === 'paid' 
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' 
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    }`}>
                      {inv.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-1">
                    {inv.eventTitle}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                    <span className="text-slate-400">{inv.date}</span>
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                      ₹{inv.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Content: Printable Invoice Viewer */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900">
          
          {/* Top Actions Bar */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> Print / PDF
              </button>
              {selectedInvoice && (
                <button
                  onClick={() => handleCopy(selectedInvoice.invoiceNumber)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy ID
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Invoice Paper Document */}
          {selectedInvoice ? (
            <div className="p-8 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200" id="printable-invoice">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">
                      EventCrew
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      TAX INVOICE
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    EventCrew Marketplace Technologies Pvt Ltd<br />
                    GSTIN: 27AABCE9876Q1Z2 • CIN: U72200MH2024PTC123456<br />
                    BKC One, Bandra Kurla Complex, Mumbai, Maharashtra 400051
                  </p>
                </div>

                <div className="sm:text-right space-y-1">
                  <div className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                    {selectedInvoice.invoiceNumber}
                  </div>
                  <p className="text-xs text-slate-500">Date: {selectedInvoice.date}</p>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    selectedInvoice.status === 'paid'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  }`}>
                    {selectedInvoice.status === 'paid' ? 'PAID & SETTLED' : 'ESCROW SECURED'}
                  </span>
                </div>
              </div>

              {/* Bill To & Event Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {selectedInvoice.type === 'organizer_bill' ? 'Billed To (Organizer)' : 'Worker Voucher'}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {selectedInvoice.organizerName}
                  </h4>
                  {selectedInvoice.organizerGstin && (
                    <p className="text-[11px] text-slate-500 mt-0.5">GSTIN: {selectedInvoice.organizerGstin}</p>
                  )}
                  {selectedInvoice.workerName && (
                    <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
                      Recipient: {selectedInvoice.workerName}
                    </p>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Event Reference
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {selectedInvoice.eventTitle}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Platform Event ID: {selectedInvoice.eventId}
                  </p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Protected under Escrow Framework
                  </p>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3.5">Description</th>
                      <th className="p-3.5 text-center">Hours / Units</th>
                      <th className="p-3.5 text-right">Rate (₹)</th>
                      <th className="p-3.5 text-right">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="p-3.5 text-slate-900 dark:text-white font-semibold">
                          {item.description}
                        </td>
                        <td className="p-3.5 text-center text-slate-600 dark:text-slate-300">
                          {item.hours} hrs
                        </td>
                        <td className="p-3.5 text-right text-slate-600 dark:text-slate-300">
                          ₹{item.rate}
                        </td>
                        <td className="p-3.5 text-right font-bold text-slate-900 dark:text-white">
                          ₹{item.amount.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Summary Breakdown */}
              <div className="flex justify-end">
                <div className="w-72 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900 dark:text-white">₹{selectedInvoice.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {selectedInvoice.platformFee > 0 && (
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                      <span>Platform Convenience (5%)</span>
                      <span className="font-semibold text-slate-900 dark:text-white">₹{selectedInvoice.platformFee.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {selectedInvoice.gstTax > 0 && (
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                      <span>GST (18% on Staffing Services)</span>
                      <span className="font-semibold text-slate-900 dark:text-white">₹{selectedInvoice.gstTax.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 text-sm font-extrabold text-indigo-600 dark:text-indigo-400 border-t-2 border-slate-200 dark:border-slate-700">
                    <span>Total Net Amount</span>
                    <span>₹{selectedInvoice.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Footer Terms */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 space-y-1">
                <p>This is an electronically generated tax invoice that does not require physical signature.</p>
                <p>Payment processed via EventCrew Smart Escrow. For dispute resolution or audit queries, contact support@eventcrew.com.</p>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">
              Select an invoice from the left panel to inspect details.
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
