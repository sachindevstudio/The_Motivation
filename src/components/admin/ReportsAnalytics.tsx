import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDateIndian } from '../../utils/rules';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Users,
  GraduationCap,
  Sparkles,
  CreditCard,
  CheckCircle2,
  Filter
} from 'lucide-react';

export const ReportsAnalytics: React.FC = () => {
  const { teachers, students, sessions, enrollments, payments, therapies } = useApp();

  const [reportType, setReportType] = useState<
    'teacher_hours' | 'student_balance' | 'therapy_summary' | 'payments_summary'
  >('teacher_hours');

  // Teacher hours & session counts calculation
  const teacherReports = teachers.map(teacher => {
    const teacherSessions = sessions.filter(s => s.teacherId === teacher.id);
    const approved = teacherSessions.filter(s => s.status === 'approved' || s.status === 'completed');
    const online = approved.filter(s => s.mode === 'online').length;
    const offline = approved.filter(s => s.mode === 'offline').length;
    const individual = approved.filter(s => s.type === 'individual').length;
    const group = approved.filter(s => s.type === 'group').length;
    const totalMinutes = approved.reduce((acc, curr) => acc + curr.totalDurationMinutes, 0);
    const totalHours = (totalMinutes / 60).toFixed(1);

    return {
      teacherCode: teacher.teacherCode,
      name: teacher.name,
      specialization: teacher.specialization,
      totalSessions: approved.length,
      individual,
      group,
      online,
      offline,
      totalHours
    };
  });

  // Export CSV generator
  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = `The_Motivation_Report_${Date.now()}.csv`;

    if (reportType === 'teacher_hours') {
      filename = 'The_Motivation_Teacher_Hours_Payroll_Report.csv';
      headers = ['Teacher Code', 'Teacher Name', 'Specialization', 'Total Sessions', 'Individual', 'Group', 'Online', 'Offline', 'Total Teaching Hours'];
      rows = teacherReports.map(t => [
        t.teacherCode,
        t.name,
        t.specialization,
        String(t.totalSessions),
        String(t.individual),
        String(t.group),
        String(t.online),
        String(t.offline),
        String(t.totalHours)
      ]);
    } else if (reportType === 'student_balance') {
      filename = 'The_Motivation_Student_Package_Balances.csv';
      headers = ['Student Code', 'Student Name', 'Parent Name', 'Parent Phone', 'Therapy', 'Total Sessions Allowed', 'Sessions Consumed', 'Remaining Sessions', 'Payment Status'];
      rows = [];
      students.forEach(st => {
        const studentEnrollments = enrollments.filter(e => e.studentId === st.id);
        studentEnrollments.forEach(enr => {
          const th = therapies.find(t => t.id === enr.therapyId);
          rows.push([
            st.studentCode,
            st.fullName,
            st.parentName,
            st.parentPhone,
            th?.name || 'Therapy',
            String(enr.totalAllowedSessions),
            String(enr.sessionsConsumed),
            String(enr.remainingSessions),
            enr.paymentStatus
          ]);
        });
      });
    } else {
      filename = 'The_Motivation_Payments_Ledger.csv';
      headers = ['Receipt Number', 'Student Name', 'Therapy', 'Payment Month', 'Monthly Fee', 'Amount Paid', 'Status', 'Date', 'Transaction Ref'];
      rows = payments.map(p => [
        p.receiptNumber,
        p.studentName,
        p.therapyName,
        p.paymentMonth,
        String(p.monthlyFee),
        String(p.amountPaid),
        p.verificationStatus,
        p.paymentDate || 'Pending',
        p.transactionReference || 'N/A'
      ]);
    }

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(r => r.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Executive Reports & Staff Billing Logs</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Audit & Payroll Ready
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified session counts, teaching hours for therapist payroll, and remaining student package balances.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Category Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 text-xs font-semibold">
        {[
          { id: 'teacher_hours', label: '1. Teacher Session Hours (For Payroll)', icon: <GraduationCap className="w-4 h-4" /> },
          { id: 'student_balance', label: '2. Student Package Balances', icon: <Users className="w-4 h-4" /> },
          { id: 'payments_summary', label: '3. Payments & Fees Reconciliation', icon: <CreditCard className="w-4 h-4" /> }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setReportType(cat.id as any)}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              reportType === cat.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Category 1: Teacher Teaching Hours & Counts */}
      {reportType === 'teacher_hours' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Teacher-Wise Completed Sessions & Teaching Hours
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Accurate verifiable session volume and cumulative hours for separate payroll processing.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-700 px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-200">
              Month: October 2026
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-3 pl-4">Therapist</th>
                  <th className="p-3">Specialization</th>
                  <th className="p-3 text-center">Individual</th>
                  <th className="p-3 text-center">Group</th>
                  <th className="p-3 text-center">Online</th>
                  <th className="p-3 text-center">Offline</th>
                  <th className="p-3 text-center">Total Completed</th>
                  <th className="p-3 text-right pr-4">Total Teaching Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {teacherReports.map(t => (
                  <tr key={t.teacherCode} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 pl-4">
                      <span className="font-bold text-slate-900 block">{t.name}</span>
                      <span className="font-mono text-[10px] text-slate-500">{t.teacherCode}</span>
                    </td>
                    <td className="p-3 text-slate-600">{t.specialization}</td>
                    <td className="p-3 text-center font-medium">{t.individual}</td>
                    <td className="p-3 text-center font-medium">{t.group}</td>
                    <td className="p-3 text-center font-medium text-indigo-600">{t.online}</td>
                    <td className="p-3 text-center font-medium text-amber-600">{t.offline}</td>
                    <td className="p-3 text-center font-black text-slate-900 text-sm">{t.totalSessions}</td>
                    <td className="p-3 text-right pr-4 font-mono font-bold text-indigo-700 text-sm">
                      {t.totalHours} hrs
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Category 2: Student Package Balances */}
      {reportType === 'student_balance' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Student Therapy Package Balances & Consumption
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tracks remaining sessions per enrolled therapy discipline.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-3 pl-4">Student</th>
                  <th className="p-3">Parent Contact</th>
                  <th className="p-3">Therapy Service</th>
                  <th className="p-3 text-center">Package Total</th>
                  <th className="p-3 text-center">Consumed</th>
                  <th className="p-3 text-center">Remaining Balance</th>
                  <th className="p-3 text-right pr-4">Fee Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {students.flatMap(st => {
                  const studentEnrollments = enrollments.filter(e => e.studentId === st.id);
                  return studentEnrollments.map(enr => {
                    const th = therapies.find(t => t.id === enr.therapyId);
                    const isLow = enr.remainingSessions <= 3;
                    return (
                      <tr key={enr.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 pl-4 font-bold text-slate-900">
                          {st.fullName} ({st.studentCode})
                        </td>
                        <td className="p-3 text-slate-600">
                          {st.parentName} ({st.parentPhone})
                        </td>
                        <td className="p-3 font-semibold text-indigo-700">
                          {th?.name || 'Therapy'}
                        </td>
                        <td className="p-3 text-center text-slate-600 font-medium">
                          {enr.totalAllowedSessions}
                        </td>
                        <td className="p-3 text-center text-slate-900 font-semibold">
                          {enr.sessionsConsumed}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-xs ${
                            isLow ? 'bg-amber-100 text-amber-900' : 'bg-indigo-50 text-indigo-900'
                          }`}>
                            {enr.remainingSessions} sessions
                          </span>
                        </td>
                        <td className="p-3 text-right pr-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            enr.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {enr.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  });
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Category 3: Payments Reconciliation */}
      {reportType === 'payments_summary' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Fees & Payment Invoices Reconciliation Ledger
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete transaction trail for verified receipts and pending balances.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-3 pl-4">Receipt #</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Therapy</th>
                  <th className="p-3">Monthly Tariff</th>
                  <th className="p-3">Amount Deposited</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right pr-4">Transaction Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {payments.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 pl-4 font-mono font-semibold text-slate-900">{p.receiptNumber}</td>
                    <td className="p-3 font-bold text-slate-900">{p.studentName}</td>
                    <td className="p-3">{p.therapyName}</td>
                    <td className="p-3 font-semibold">{formatCurrency(p.monthlyFee)}</td>
                    <td className="p-3 font-black text-emerald-700">{formatCurrency(p.amountPaid)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        p.verificationStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.verificationStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right pr-4 font-mono text-[11px] text-slate-500">
                      {p.paymentMethod || 'UPI'} • {p.transactionReference || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
