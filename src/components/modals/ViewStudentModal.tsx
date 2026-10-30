import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { formatCurrency, formatDateIndian } from '../../utils/rules';
import { WhatsAppModal } from './WhatsAppModal';
import {
  X,
  User,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface ViewStudentModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewStudentModal: React.FC<ViewStudentModalProps> = ({
  student,
  isOpen,
  onClose
}) => {
  const { enrollments, therapies, sessions, payments } = useApp();
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [waTherapy, setWaTherapy] = useState('Psychology');
  const [waAmount, setWaAmount] = useState(800);

  if (!isOpen || !student) return null;

  const studentEnrollments = enrollments.filter(e => e.studentId === student.id);
  const studentSessions = sessions.filter(s =>
    s.participants.some(p => p.studentId === student.id)
  );
  const studentPayments = payments.filter(p => p.studentId === student.id);

  const handleOpenWhatsApp = (therapyName: string, amount: number) => {
    setWaTherapy(therapyName);
    setWaAmount(amount);
    setShowWhatsAppModal(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-6">
          
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {student.fullName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">{student.fullName}</h3>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-indigo-900/80 text-indigo-200 border border-indigo-700/50">
                    {student.studentCode}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    student.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-500/20 text-slate-300'
                  }`}>
                    {student.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Age: {student.age} yrs • Parent: {student.parentName} ({student.parentPhone})
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
            
            {/* Multi-therapy Package Balance Overview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Enrolled Therapy Packages ({studentEnrollments.length})</span>
                </h4>
                <span className="text-slate-500 text-[11px]">
                  Remaining sessions decrement upon approved session attendance
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {studentEnrollments.map(enr => {
                  const th = therapies.find(t => t.id === enr.therapyId);
                  const isLow = enr.remainingSessions <= 3;

                  return (
                    <div
                      key={enr.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-sm">{th?.name || 'Therapy'}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            enr.paymentStatus === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {enr.paymentStatus}
                          </span>
                        </div>

                        <div className="mt-3 flex items-baseline justify-between">
                          <span className="text-2xl font-black text-indigo-700">{enr.remainingSessions}</span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            / {enr.totalAllowedSessions} sessions left
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isLow ? 'bg-amber-500' : 'bg-indigo-600'}`}
                            style={{
                              width: `${Math.min(100, (enr.remainingSessions / enr.totalAllowedSessions) * 100)}%`
                            }}
                          />
                        </div>

                        <div className="mt-2 text-[10px] text-slate-500 flex justify-between">
                          <span>Used: {enr.sessionsConsumed}</span>
                          <span>Fee: {formatCurrency(enr.monthlyFee)}/mo</span>
                        </div>
                      </div>

                      {/* WhatsApp Reminder Quick Button */}
                      <button
                        onClick={() => handleOpenWhatsApp(th?.name || 'Therapy', enr.monthlyFee)}
                        className="mt-3 w-full py-1.5 px-2 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Send WhatsApp Reminder</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Clinical Notes */}
            {student.notes && (
              <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <span className="font-bold text-indigo-950 block mb-1">Clinical & Pedagogical Notes:</span>
                <p className="text-indigo-900 leading-relaxed">{student.notes}</p>
              </div>
            )}

            {/* Attendance & Session History for this Student */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Recent Sessions Attended ({studentSessions.length})
              </h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                    <tr>
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5">Therapy</th>
                      <th className="p-2.5">Teacher</th>
                      <th className="p-2.5">Mode</th>
                      <th className="p-2.5">Attendance</th>
                      <th className="p-2.5">Deduction</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {studentSessions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-slate-500 italic">
                          No session records yet.
                        </td>
                      </tr>
                    ) : (
                      studentSessions.slice(0, 5).map(s => {
                        const participant = s.participants.find(p => p.studentId === student.id);
                        return (
                          <tr key={s.id} className="hover:bg-slate-50">
                            <td className="p-2.5 font-medium">{formatDateIndian(s.date)}</td>
                            <td className="p-2.5 font-semibold text-slate-900">{s.therapyName}</td>
                            <td className="p-2.5 text-slate-700">{s.teacherName}</td>
                            <td className="p-2.5 capitalize">{s.mode}</td>
                            <td className="p-2.5">
                              {participant?.joined ? (
                                <span className="text-emerald-700 font-semibold">
                                  {participant.attendanceDurationMinutes} mins
                                </span>
                              ) : (
                                <span className="text-rose-600 font-medium">Absent</span>
                              )}
                            </td>
                            <td className="p-2.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                participant?.deductionStatus === 'deducted'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                {participant?.deductionStatus?.replace('_', ' ') || 'pending'}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment History */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Payment Records ({studentPayments.length})
              </h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                    <tr>
                      <th className="p-2.5">Receipt</th>
                      <th className="p-2.5">Month</th>
                      <th className="p-2.5">Therapy</th>
                      <th className="p-2.5">Amount</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {studentPayments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-slate-500 italic">
                          No payments recorded yet.
                        </td>
                      </tr>
                    ) : (
                      studentPayments.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono font-semibold">{p.receiptNumber}</td>
                          <td className="p-2.5">{p.paymentMonth}</td>
                          <td className="p-2.5">{p.therapyName}</td>
                          <td className="p-2.5 font-bold">{formatCurrency(p.monthlyFee)}</td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              p.verificationStatus === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {p.verificationStatus}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors"
              >
                Close Profile
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Embedded WhatsApp modal */}
      <WhatsAppModal
        student={student}
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        defaultTherapyName={waTherapy}
        defaultAmount={waAmount}
      />
    </>
  );
};
