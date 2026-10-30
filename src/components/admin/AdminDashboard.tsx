import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDateIndian } from '../../utils/rules';
import { SessionDetailModal } from '../modals/SessionDetailModal';
import { PaymentReceiptModal } from '../modals/PaymentReceiptModal';
import { SessionRecord, PaymentRecord } from '../../types';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  CheckCircle2,
  Radio,
  Clock,
  CreditCard,
  IndianRupee,
  AlertTriangle,
  ArrowRight,
  Video,
  Building,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const {
    students,
    teachers,
    sessions,
    payments,
    therapies,
    setActiveTab,
    approveSession
  } = useApp();

  const [inspectSession, setInspectSession] = useState<SessionRecord | null>(null);
  const [inspectPayment, setInspectPayment] = useState<PaymentRecord | null>(null);

  // Live timer tick for active sessions
  const [ticker, setTicker] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTicker(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const liveSessions = sessions.filter(s => s.status === 'live');
  const pendingApprovals = sessions.filter(
    s => s.status === 'awaiting_verification' || s.verificationStatus === 'pending_admin' || s.verificationStatus === 'mismatch'
  );
  const pendingPayments = payments.filter(
    p => p.verificationStatus === 'awaiting_verification' || p.verificationStatus === 'pending' || p.verificationStatus === 'overdue'
  );

  const totalRevenue = payments
    .filter(p => p.verificationStatus === 'paid')
    .reduce((acc, curr) => acc + curr.amountPaid, 0);

  const completedSessionsCount = sessions.filter(
    s => s.status === 'completed' || s.status === 'approved'
  ).length;

  // Chart 1: Therapy breakdown
  const therapyDistributionData = therapies.map(t => {
    const count = sessions.filter(s => s.therapyId === t.id).length;
    return {
      name: t.name,
      sessions: count,
      color: t.color
    };
  });

  // Chart 2: Online vs Offline
  const onlineCount = sessions.filter(s => s.mode === 'online').length;
  const offlineCount = sessions.filter(s => s.mode === 'offline').length;
  const modeData = [
    { name: 'Online Sessions', value: onlineCount, color: '#6366f1' },
    { name: 'Offline (Centre)', value: offlineCount, color: '#f59e0b' }
  ];

  // Chart 3: Weekly activity mock distribution
  const weeklyData = [
    { day: 'Mon', sessions: 6 },
    { day: 'Tue', sessions: 7 },
    { day: 'Wed', sessions: 5 },
    { day: 'Thu', sessions: 7 },
    { day: 'Fri', sessions: 6 },
    { day: 'Sat', sessions: 4 },
    { day: 'Sun', sessions: 0 }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl text-white shadow-xl shadow-indigo-950/20">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">The Motivation Command Centre</h1>
            <span className="px-2 py-0.5 text-[11px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 rounded-full">
              Live Operations
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Centralized administration of student therapy packages, dual-record offline session confirmation, live Daily.co meeting telemetry, and fee verification.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('online-monitor')}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Online Monitoring</span>
          </button>
          <button
            onClick={() => setActiveTab('offline-verification')}
            className="px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Building className="w-3.5 h-3.5" />
            <span>Verify Offline</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Students */}
        <div 
          onClick={() => setActiveTab('students')}
          className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Students</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{students.length}</p>
          <div className="mt-1 flex items-center text-[11px] text-slate-500">
            <span className="text-emerald-600 font-semibold">Active & Enrolled</span>
            <ChevronRight className="w-3 h-3 ml-auto text-slate-400" />
          </div>
        </div>

        {/* Total Teachers */}
        <div 
          onClick={() => setActiveTab('teachers')}
          className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Therapists / Staff</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{teachers.length}</p>
          <div className="mt-1 flex items-center text-[11px] text-slate-500">
            <span>Specialized clinical staff</span>
            <ChevronRight className="w-3 h-3 ml-auto text-slate-400" />
          </div>
        </div>

        {/* Completed Sessions */}
        <div 
          onClick={() => setActiveTab('sessions')}
          className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Completed Sessions</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{completedSessionsCount}</p>
          <div className="mt-1 flex items-center text-[11px] text-slate-500">
            <span>Online & Centre records</span>
            <ChevronRight className="w-3 h-3 ml-auto text-slate-400" />
          </div>
        </div>

        {/* Monthly Revenue */}
        <div 
          onClick={() => setActiveTab('payments')}
          className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Verified Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform font-bold text-sm">
              ₹
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{formatCurrency(totalRevenue)}</p>
          <div className="mt-1 flex items-center text-[11px] text-slate-500">
            <span className="text-amber-600 font-semibold">{pendingPayments.length} Pending Invoices</span>
            <ChevronRight className="w-3 h-3 ml-auto text-slate-400" />
          </div>
        </div>

      </div>

      {/* LIVE SESSIONS SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <h3 className="text-sm font-bold text-slate-900">Live Active Sessions</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
              {liveSessions.length} Running Now
            </span>
          </div>

          <button
            onClick={() => setActiveTab('online-monitor')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Open Realtime Telemetry Monitor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {liveSessions.length === 0 ? (
          <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl text-slate-500 text-xs">
            No live meetings currently in progress. You can start a simulated online session in the Teacher Panel.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveSessions.map(session => (
              <div
                key={session.id}
                className="p-4 rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50/50 via-white to-slate-50/50 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase tracking-wide">
                      {session.therapyName} • {session.type}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{session.teacherName}</h4>
                    <p className="text-xs text-slate-500">Started: {session.scheduledStartTime}</p>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
                      <Clock className="w-3 h-3" />
                      <span>{session.totalDurationMinutes}m elapsed</span>
                    </span>
                  </div>
                </div>

                {/* Participating students */}
                <div className="pt-2 border-t border-slate-200/80">
                  <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Enrolled Attendees ({session.participants.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {session.participants.map(p => (
                      <span
                        key={p.studentId}
                        className={`text-[11px] px-2 py-0.5 rounded-lg border font-medium flex items-center gap-1 ${
                          p.joined
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${p.joined ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        {p.studentName} {p.joined ? `(${p.attendanceDurationMinutes}m)` : '(waiting)'}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-500">
                    Room: <span className="font-mono text-slate-700">{session.meetingId || 'Daily.co Room'}</span>
                  </span>
                  <button
                    onClick={() => setActiveTab('online-monitor')}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>Simulate Room</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Therapy Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Therapy-Wise Session Volume</h3>
              <p className="text-xs text-slate-500">Monthly session load across therapeutic disciplines</p>
            </div>
            <span className="text-xs font-semibold text-slate-400">Total: {sessions.length} sessions</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={therapyDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: any) => [`${value} sessions`, 'Conducted']}
                  contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="sessions" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Mode Breakdown (Donut) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Online vs Centre Sessions</h3>
            <p className="text-xs text-slate-500">Distribution by delivery mode</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={modeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {modeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-around text-center text-xs">
            <div>
              <span className="font-bold text-indigo-600 text-sm">{onlineCount}</span>
              <p className="text-slate-500 text-[11px]">Online (Daily.co)</p>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div>
              <span className="font-bold text-amber-600 text-sm">{offlineCount}</span>
              <p className="text-slate-500 text-[11px]">Physical Centre</p>
            </div>
          </div>
        </div>

      </div>

      {/* Two Columns: Pending Verifications & Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pending Session Approvals & Mismatches */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">Pending Verification & Approvals</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                {pendingApprovals.length}
              </span>
            </div>
            <button
              onClick={() => setActiveTab('offline-verification')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View Verification Queue
            </button>
          </div>

          <div className="space-y-2.5">
            {pendingApprovals.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs italic">
                All submitted sessions have been reviewed and approved!
              </div>
            ) : (
              pendingApprovals.slice(0, 4).map(session => (
                <div
                  key={session.id}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    session.verificationStatus === 'mismatch'
                      ? 'border-amber-300 bg-amber-50/50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">{session.sessionCode}</span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        {session.mode}
                      </span>
                      {session.verificationStatus === 'mismatch' && (
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                          Mismatch Alert
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {session.teacherName} • {session.therapyName} ({session.participants.length} students)
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setInspectSession(session)}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      Inspect
                    </button>
                    <button
                      onClick={() => approveSession(session.id)}
                      className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Payments & Screenshot Verification */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Recent Payment Records</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-800">
                {payments.length} Records
              </span>
            </div>
            <button
              onClick={() => setActiveTab('payments')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              All Fees
            </button>
          </div>

          <div className="space-y-2.5">
            {payments.slice(0, 4).map(p => (
              <div
                key={p.id}
                className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-between transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">{p.studentName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({p.receiptNumber})</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      p.verificationStatus === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : p.verificationStatus === 'awaiting_verification'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {p.verificationStatus.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {p.therapyName} • {formatCurrency(p.monthlyFee)} • Due {p.dueDate}
                  </p>
                </div>

                <button
                  onClick={() => setInspectPayment(p)}
                  className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  {p.verificationStatus === 'awaiting_verification' ? 'Verify Proof' : 'View'}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Modals */}
      <SessionDetailModal
        session={inspectSession}
        isOpen={!!inspectSession}
        onClose={() => setInspectSession(null)}
      />

      <PaymentReceiptModal
        payment={inspectPayment}
        isOpen={!!inspectPayment}
        onClose={() => setInspectPayment(null)}
      />

    </div>
  );
};
