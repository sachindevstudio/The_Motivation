import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentRecord } from '../../types';
import { formatCurrency, formatDateIndian } from '../../utils/rules';
import { X, CheckCircle, XCircle, AlertTriangle, ExternalLink, ShieldCheck } from 'lucide-react';

interface PaymentReceiptModalProps {
  payment: PaymentRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  payment,
  isOpen,
  onClose
}) => {
  const { verifyPayment, rejectPayment, enrollments } = useApp();
  const [sessionsToAdd, setSessionsToAdd] = useState<number>(20);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [showRejectInput, setShowRejectInput] = useState<boolean>(false);

  if (!isOpen || !payment) return null;

  const enrollment = enrollments.find(
    e => e.studentId === payment.studentId && e.therapyId === payment.therapyId
  );

  const handleVerify = () => {
    verifyPayment(payment.id, sessionsToAdd);
    onClose();
  };

  const handleReject = () => {
    if (!showRejectInput) {
      setShowRejectInput(true);
      return;
    }
    rejectPayment(payment.id, rejectReason || 'Receipt details could not be reconciled with bank statements.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-6">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold">Payment Receipt Inspection</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {payment.receiptNumber}
              </span>
            </div>
            <p className="text-xs text-slate-400">Manual review required before extending therapy package</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Status Alert Banner */}
          {payment.verificationStatus === 'awaiting_verification' && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-amber-900">Verification Pending: </span>
                <span className="text-amber-800">
                  Parent submitted this transaction proof. Review details against bank register. Upon verification, student package will be credited with {sessionsToAdd} sessions.
                </span>
              </div>
            </div>
          )}

          {payment.verificationStatus === 'paid' && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-emerald-900">Verified & Reconciled: </span>
                <span className="text-emerald-800">
                  Approved by {payment.verifiedBy || 'Admin'}. Package extended by {payment.extensionSessionsAdded || 20} sessions.
                </span>
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 font-medium">Student:</span>
              <p className="font-bold text-slate-900 text-sm">{payment.studentName}</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Parent Contact:</span>
              <p className="font-semibold text-slate-800">{payment.parentName} ({payment.parentPhone})</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Therapy Service:</span>
              <p className="font-bold text-indigo-700">{payment.therapyName}</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Billing Month:</span>
              <p className="font-semibold text-slate-800">{payment.paymentMonth}</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Monthly Fee:</span>
              <p className="font-bold text-slate-900 text-base">{formatCurrency(payment.monthlyFee)}</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Payment Mode & Ref:</span>
              <p className="font-semibold text-slate-800 font-mono text-[11px]">
                {payment.paymentMethod || 'UPI'} - {payment.transactionReference || 'N/A'}
              </p>
            </div>
          </div>

          {/* Screenshot Preview */}
          <div>
            <span className="text-xs font-semibold text-slate-700 mb-2 block">
              Uploaded Payment Screenshot / Bank Proof:
            </span>
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-100 flex flex-col items-center justify-center p-3">
              <img
                src={payment.receiptScreenshotUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80'}
                alt="Payment proof screenshot"
                className="max-h-56 rounded-lg object-contain shadow-xs border border-slate-200"
              />
              <span className="text-[11px] text-slate-500 mt-2">
                Simulated UPI Payment Screenshot (Proof submitted by Parent)
              </span>
            </div>
          </div>

          {/* Package Extension Settings (For Admin Verification) */}
          {payment.verificationStatus !== 'paid' && (
            <div className="p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-2">
              <label className="block text-xs font-semibold text-indigo-950">
                Package Extension on Verification:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={sessionsToAdd}
                  onChange={e => setSessionsToAdd(Number(e.target.value))}
                  className="w-24 px-3 py-1.5 text-xs border border-indigo-200 rounded-lg bg-white font-bold text-indigo-900 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-xs text-indigo-800">
                  Sessions will be added to {payment.studentName}'s {payment.therapyName} balance.
                </span>
              </div>
            </div>
          )}

          {/* Rejection input toggle */}
          {showRejectInput && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
              <label className="block text-xs font-semibold text-rose-900">Reason for Rejection *</label>
              <input
                type="text"
                placeholder="e.g. UTR number not found in current bank statement"
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-rose-300 rounded-lg outline-none focus:ring-1 focus:ring-rose-500 bg-white"
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Close
            </button>

            {payment.verificationStatus !== 'paid' && (
              <>
                <button
                  type="button"
                  onClick={handleReject}
                  className="px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold rounded-xl hover:bg-rose-100 transition-colors flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>{showRejectInput ? 'Confirm Rejection' : 'Reject Proof'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleVerify}
                  className="px-5 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Verify Payment & Credit Sessions</span>
                </button>
              </>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
