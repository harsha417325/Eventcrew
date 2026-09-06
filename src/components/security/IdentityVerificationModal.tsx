import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Upload, CheckCircle2, AlertCircle, X, FileText, Lock, Clock } from 'lucide-react';

interface IdentityVerificationModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const IdentityVerificationModal: React.FC<IdentityVerificationModalProps> = ({ onClose, onSuccess }) => {
  const { currentUser, submitIdentityVerification } = useAuth();
  
  const [docType, setDocType] = useState<string>(currentUser.role === 'organizer' ? 'GSTIN Certificate & Business PAN' : 'Aadhaar Card');
  const [idNumber, setIdNumber] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isAlreadyVerified = currentUser.verificationStatus === 'verified' || currentUser.isVerified;
  const isPending = currentUser.verificationStatus === 'pending';

  const docOptions = currentUser.role === 'organizer' ? [
    'GSTIN Certificate & Business PAN',
    'Certificate of Incorporation (CIN)',
    'Company PAN Card',
    'Trade License / FSSAI'
  ] : [
    'Aadhaar Card',
    'Permanent Account Number (PAN)',
    'Passport',
    'Driving License',
    'Voter ID Card'
  ];

  const handleFakeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idNumber.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      submitIdentityVerification(docType, idNumber.trim());
      setSubmitting(false);
      setIsSuccess(true);
      if (onSuccess) onSuccess();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Government ID Verification</h3>
              <p className="text-xs text-indigo-100">Unlock the Verified Pro badge & higher trust rank</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {isAlreadyVerified ? (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-emerald-950 dark:text-emerald-200">
                You are Officially Verified!
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-xs mx-auto">
                Your government document has been verified. The Verified Badge is visible on your public profile, event cards, and shift applications.
              </p>
              {currentUser.verificationDoc && (
                <div className="pt-2 text-[11px] text-emerald-800 dark:text-emerald-400 font-medium">
                  {currentUser.verificationDoc.type} • {currentUser.verificationDoc.idNumber}
                </div>
              )}
              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow"
                >
                  Done
                </button>
              </div>
            </div>
          ) : isPending || isSuccess ? (
            <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
                <Clock className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-amber-950 dark:text-amber-200">
                Verification Under Review
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-300 max-w-xs mx-auto">
                Your ID submission has been securely delivered to EventCrew Trust & Safety. Verification usually completes within 2–4 hours.
              </p>
              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition-all"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Trust Callout */}
              <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-3">
                <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed">
                  Documents are stored with 256-bit AES encryption and used solely for identity validation in compliance with digital labor standards.
                </p>
              </div>

              {/* Document Type Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Select Document Type
                </label>
                <select
                  value={docType}
                  onChange={e => setDocType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {docOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Document ID Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Document ID / Registration Number
                </label>
                <input
                  type="text"
                  required
                  placeholder={docType.includes('Aadhaar') ? 'e.g. 1234 5678 9012' : 'e.g. ABCDE1234F'}
                  value={idNumber}
                  onChange={e => setIdNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* File Attachment / Upload Area */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Upload Document Scan or Clear Photo
                </label>
                <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50/50 dark:bg-slate-800/30 transition-colors">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={handleFakeUpload}
                  />
                  <Upload className="w-6 h-6 text-indigo-500" />
                  <div className="text-center">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {selectedFile ? selectedFile : 'Click to browse or drag & drop scan'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Supports PDF, JPG, PNG (Max 10MB)</p>
                  </div>
                </label>
              </div>

              {/* Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !idNumber.trim()}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
                >
                  {submitting ? 'Encrypting & Submitting...' : 'Submit Verification Request'}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
