import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentRecord } from '../../types';
import { PaymentReceiptModal } from '../modals/PaymentReceiptModal';
import { WhatsAppModal } from '../modals/WhatsAppModal';
import { formatCurrency, formatDateIndian } from '../../utils/rules';
import {
  CreditCard,
  Search,
  Filter,
  Plus,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  MessageSquare,
  FileText
} from 'lucide-react';

export const PaymentManagement: React.FC = () => {
  const { payments, students, therapies, addManualPayment } = useApp();

  const [activeTab, setActiveTab] = useState<
    'all' | 'awaiting_verification' | 'pending' | 'overdue' | 'paid'
  >('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [inspectPayment, setInspectPayment] = useState<PaymentRecord | null>(null);
  const [whatsappStudent, setWhatsappStudent] = useState<any | null>(null);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);

  // New manual payment state
  const [manualStudentId, setManualStudentId] = useState(students[0]?.id || '');
  const [manualTherapyId, setManualTherapyId] = useState(therapies[0]?.id || '');
  const [manualAmount, setManualAmount] = useState(800);
  const [manualMethod, setManualMethod] = useState<'UPI' | 'Bank Transfer' | 'Cash' | 'Cheque'>('UPI');
  const [manualRef, setManualRef] = useState('');

  // Summary Metrics
  const totalRevenue = payments
    .filter(p => p.verificationStatus === 'paid')
    .reduce((acc, curr) => acc + curr.amountPaid, 0);

  const totalPendingAmount = payments
    .filter(p => p.verificationStatus === 'pending' || p.verificationStatus === 'awaiting_verification')
    .reduce((acc, curr) => acc + (curr.pendingAmount || curr.monthlyFee), 0);

  const totalOverdueAmount = payments
    .filter(p => p.verificationStatus === 'overdue')
    .reduce((acc, curr) => acc + (curr.pendingAmount || curr.monthlyFee), 0);

  const awaitingCount = payments.filter(p => p.verificationStatus === 'awaiting_verification').length;

  // Filter payments
  const filteredPayments = payments.filter(p => {
    if (activeTab !== 'all' && p.verificationStatus !== activeTab) return false;
    const s = searchTerm.toLowerCase();
    return (
      p.studentName.toLowerCase().includes(s) ||
      p.receiptNumber.toLowerCase().includes(s) ||
      p.therapyName.toLowerCase().includes(s) ||
      p.parentPhone.includes(s)
    );
  });

  const handleCreateManualPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === manualStudentId);
    const th = therapies.find(t => t.id === manualTherapyId);
    if (!st || !th) return;

    addManualPayment({
      studentId: st.id,
      studentName: st.fullName,
      parentName: st.parentName,
      parentPhone: st.parentPhone,
      therapyId: th.id,
      therapyName: th.name,
      paymentMonth: 'October 2026',
      dueDate: new Date().toISOString().split('T')[0],
      monthlyFee: manualAmount,
      amountPaid: manualAmount,
      pendingAmount: 0,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: manualMethod,
      transactionReference: manualRef || `MANUAL-${Date.now().toString().slice(-4)}`,
      verificationStatus: 'paid',
      extensionApplied: true,
      extensionSessionsAdded: th.defaultPackageSessions || 20
    });

    setShowAddPaymentModal(false);
  };

  const handleOpenWhatsApp = (p: PaymentRecord) => {
    const st = students.find(s => s.id === p.studentId);
    if (st) setWhatsappStudent(st);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Fees & Payment Reconciliation</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Billing Ledger
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Verify uploaded parent screenshots, approve bank transactions, and auto-credit therapy packages.
          </p>
        </div>

        <button
          onClick={() => setShowAddPaymentModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Record Offline / Cash Payment</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Collected Revenue</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(totalRevenue)}</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Verified & deposited</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Pending Parent Payments</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(totalPendingAmount)}</p>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Invoices generated</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Overdue Fees</span>
          <p className="text-2xl font-black text-rose-600 mt-1">{formatCurrency(totalOverdueAmount)}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">WhatsApp reminders due</span>
        </div>

        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 shadow-xs">
          <span className="text-xs font-semibold text-amber-900">Verification Pending</span>
          <p className="text-2xl font-black text-amber-950 mt-1">{awaitingCount} Proofs</p>
          <span className="text-[11px] text-amber-800 font-medium mt-1 block">Requires admin review</span>
        </div>
      </div>

      {/* Tab Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 text-xs font-semibold">
        {[
          { id: 'all', label: 'All Invoices', count: payments.length },
          {
            id: 'awaiting_verification',
            label: 'Awaiting Proof Verification',
            count: awaitingCount,
            color: 'bg-amber-100 text-amber-900 border border-amber-300'
          },
          { id: 'pending', label: 'Pending Payment', count: payments.filter(p => p.verificationStatus === 'pending').length },
          { id: 'overdue', label: 'Overdue', count: payments.filter(p => p.verificationStatus === 'overdue').length, color: 'bg-rose-100 text-rose-800' },
          { id: 'paid', label: 'Paid & Verified', count: payments.filter(p => p.verificationStatus === 'paid').length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === tab.id
                  ? 'bg-indigo-700 text-white'
                  : tab.color || 'bg-slate-100 text-slate-700'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by student name, receipt #, or phone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-3.5 pl-5">Receipt & Student</th>
                <th className="p-3.5">Therapy & Month</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Payment Method / Ref</th>
                <th className="p-3.5">Proof Screenshot</th>
                <th className="p-3.5">Verification Status</th>
                <th className="p-3.5 text-right pr-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 italic">
                    No payment records match this filter.
                  </td>
                </tr>
              ) : (
                filteredPayments.map(payment => (
                  <tr key={payment.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Receipt & Student */}
                    <td className="p-3.5 pl-5">
                      <span className="font-bold text-slate-900 text-sm block">{payment.studentName}</span>
                      <span className="font-mono text-[10px] text-slate-500">
                        {payment.receiptNumber} • Parent: {payment.parentName}
                      </span>
                    </td>

                    {/* Therapy & Month */}
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-900 block">{payment.therapyName}</span>
                      <span className="text-[11px] text-slate-500">{payment.paymentMonth}</span>
                    </td>

                    {/* Amount */}
                    <td className="p-3.5">
                      <span className="font-black text-slate-900 text-sm">
                        {formatCurrency(payment.monthlyFee)}
                      </span>
                      {payment.pendingAmount > 0 && (
                        <span className="text-[10px] text-rose-600 block">
                          Pending: {formatCurrency(payment.pendingAmount)}
                        </span>
                      )}
                    </td>

                    {/* Method / Ref */}
                    <td className="p-3.5">
                      <span className="font-medium text-slate-800 block">
                        {payment.paymentMethod || 'UPI Transfer'}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 truncate max-w-xs block">
                        {payment.transactionReference || 'Awaiting submission'}
                      </span>
                    </td>

                    {/* Screenshot Preview */}
                    <td className="p-3.5">
                      {payment.receiptScreenshotUrl ? (
                        <button
                          onClick={() => setInspectPayment(payment)}
                          className="flex items-center gap-1.5 p-1 rounded-lg border border-slate-200 hover:border-indigo-300 bg-slate-50 text-[11px] text-indigo-700 font-semibold"
                        >
                          <img
                            src={payment.receiptScreenshotUrl}
                            alt="Receipt thumb"
                            className="w-6 h-6 rounded object-cover"
                          />
                          <span>View Proof</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">No receipt file</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          payment.verificationStatus === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : payment.verificationStatus === 'awaiting_verification'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : payment.verificationStatus === 'overdue'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {payment.verificationStatus.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right pr-5">
                      <div className="flex items-center justify-end gap-2">
                        {/* WhatsApp Reminder Button */}
                        <button
                          onClick={() => handleOpenWhatsApp(payment)}
                          title="Send WhatsApp Payment Reminder"
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 border border-emerald-200 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setInspectPayment(payment)}
                          className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                            payment.verificationStatus === 'awaiting_verification'
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                          }`}
                        >
                          {payment.verificationStatus === 'awaiting_verification' ? 'Verify Proof' : 'Receipt'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Manual Payment Modal */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Record Manual / Cash Payment</h3>
            <p className="text-xs text-slate-500">Record direct payments collected at the centre</p>

            <form onSubmit={handleCreateManualPayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Student</label>
                <select
                  value={manualStudentId}
                  onChange={e => setManualStudentId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.studentCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Therapy</label>
                <select
                  value={manualTherapyId}
                  onChange={e => setManualTherapyId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {therapies.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} (Default: ₹{t.defaultMonthlyFee})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount Collected (₹)</label>
                  <input
                    type="number"
                    min={100}
                    step={50}
                    value={manualAmount}
                    onChange={e => setManualAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={manualMethod}
                    onChange={e => setManualMethod(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Cash">Cash at Centre</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reference / Note</label>
                <input
                  type="text"
                  placeholder="e.g. Cash collected by front desk staff"
                  value={manualRef}
                  onChange={e => setManualRef(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddPaymentModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold"
                >
                  Save & Credit Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modals */}
      <PaymentReceiptModal
        payment={inspectPayment}
        isOpen={!!inspectPayment}
        onClose={() => setInspectPayment(null)}
      />

      <WhatsAppModal
        student={whatsappStudent}
        isOpen={!!whatsappStudent}
        onClose={() => setWhatsappStudent(null)}
      />

    </div>
  );
};
