import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { WhatsAppModal } from '../modals/WhatsAppModal';
import { generateWhatsAppUrl, generatePrefilledWhatsAppMessage, formatCurrency } from '../../utils/rules';
import {
  MessageSquare,
  Search,
  ExternalLink,
  Send,
  AlertTriangle,
  Clock,
  Sparkles,
  Phone,
  CheckCircle2
} from 'lucide-react';

export const WhatsAppReminders: React.FC = () => {
  const { students, enrollments, payments, therapies } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeModalStudent, setActiveModalStudent] = useState<Student | null>(null);
  const [defaultReminderType, setDefaultReminderType] = useState<
    'payment_reminder' | 'expiry_reminder' | 'custom'
  >('payment_reminder');
  const [defaultTherapy, setDefaultTherapy] = useState('Psychology');
  const [defaultAmount, setDefaultAmount] = useState(800);

  // Identify students needing reminders:
  // 1. Pending or overdue payments
  // 2. Low package balance (remaining <= 3)
  const studentsWithIssues = students.map(student => {
    const studentEnrollments = enrollments.filter(e => e.studentId === student.id);
    const studentPayments = payments.filter(p => p.studentId === student.id);

    const pendingPayment = studentPayments.find(
      p => p.verificationStatus === 'pending' || p.verificationStatus === 'overdue'
    );
    const lowEnrollment = studentEnrollments.find(e => e.remainingSessions <= 3);

    return {
      student,
      pendingPayment,
      lowEnrollment,
      hasIssue: !!pendingPayment || !!lowEnrollment
    };
  });

  const filtered = studentsWithIssues.filter(item => {
    const s = searchTerm.toLowerCase();
    return (
      item.student.fullName.toLowerCase().includes(s) ||
      item.student.parentName.toLowerCase().includes(s) ||
      item.student.parentPhone.includes(s)
    );
  });

  const handleDirectLaunch = (
    student: Student,
    type: 'payment_reminder' | 'expiry_reminder',
    therapyName: string,
    amount: number
  ) => {
    const text = generatePrefilledWhatsAppMessage(type, {
      studentName: student.fullName,
      parentName: student.parentName,
      therapyName,
      amount,
      dueDate: 'this week'
    });
    const url = generateWhatsAppUrl(student.parentPhone, text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOpenCustomModal = (
    student: Student,
    type: 'payment_reminder' | 'expiry_reminder' | 'custom',
    therapyName: string = 'Psychology',
    amount: number = 800
  ) => {
    setActiveModalStudent(student);
    setDefaultReminderType(type);
    setDefaultTherapy(therapyName);
    setDefaultAmount(amount);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Parent WhatsApp Communications</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              wa.me Click-to-Chat
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Send instant payment reminders, membership package expiry notifications, and custom messages directly via WhatsApp.
          </p>
        </div>
      </div>

      {/* Info notice */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs text-emerald-950">
        <MessageSquare className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Compliant WhatsApp Click-to-Chat Architecture:</p>
          <p className="text-emerald-900 leading-relaxed">
            Per organizational policy, messages open via secure WhatsApp Web / app links with pre-filled professional templates. No expensive third-party messaging server or risky API credentials required. Staff reviews and taps Send in WhatsApp.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search parent name, student, or phone number..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Student List for WhatsApp Reminders */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-3.5 pl-5">Student & Parent</th>
                <th className="p-3.5">WhatsApp Contact</th>
                <th className="p-3.5">Active Reminder Status</th>
                <th className="p-3.5 text-right pr-5">Quick Launch & Custom</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map(({ student, pendingPayment, lowEnrollment }) => {
                const th = therapies.find(t => t.id === lowEnrollment?.therapyId);

                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Student & Parent */}
                    <td className="p-3.5 pl-5">
                      <span className="font-bold text-slate-900 text-sm block">{student.fullName}</span>
                      <span className="text-[11px] text-slate-500">
                        Parent: <strong className="text-slate-700">{student.parentName}</strong> ({student.studentCode})
                      </span>
                    </td>

                    {/* WhatsApp Contact */}
                    <td className="p-3.5">
                      <span className="font-mono font-semibold text-emerald-700 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        {student.parentPhone}
                      </span>
                    </td>

                    {/* Reminder Status */}
                    <td className="p-3.5">
                      <div className="space-y-1">
                        {pendingPayment && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            Pending Fee: {formatCurrency(pendingPayment.monthlyFee)} ({pendingPayment.therapyName})
                          </span>
                        )}

                        {lowEnrollment && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 ml-1">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Low Sessions: {lowEnrollment.remainingSessions} left ({th?.name})
                          </span>
                        )}

                        {!pendingPayment && !lowEnrollment && (
                          <span className="text-[11px] text-slate-400 italic">
                            Account up to date
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Quick WhatsApp Actions */}
                    <td className="p-3.5 text-right pr-5">
                      <div className="flex items-center justify-end gap-2">
                        {pendingPayment && (
                          <button
                            onClick={() =>
                              handleDirectLaunch(
                                student,
                                'payment_reminder',
                                pendingPayment.therapyName,
                                pendingPayment.monthlyFee
                              )
                            }
                            className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition-colors flex items-center gap-1"
                            title="Directly launch WhatsApp with payment reminder"
                          >
                            <Send className="w-3 h-3" />
                            <span>Remind Fee (₹{pendingPayment.monthlyFee})</span>
                          </button>
                        )}

                        {lowEnrollment && !pendingPayment && (
                          <button
                            onClick={() =>
                              handleDirectLaunch(
                                student,
                                'expiry_reminder',
                                th?.name || 'Therapy',
                                lowEnrollment.monthlyFee
                              )
                            }
                            className="px-2.5 py-1 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-xs transition-colors flex items-center gap-1"
                            title="Remind package expiry"
                          >
                            <Send className="w-3 h-3" />
                            <span>Remind Expiry</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenCustomModal(student, 'custom')}
                          className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3 text-slate-500" />
                          <span>Customize</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <WhatsAppModal
        student={activeModalStudent}
        isOpen={!!activeModalStudent}
        onClose={() => setActiveModalStudent(null)}
        defaultType={defaultReminderType}
        defaultTherapyName={defaultTherapy}
        defaultAmount={defaultAmount}
      />

    </div>
  );
};
