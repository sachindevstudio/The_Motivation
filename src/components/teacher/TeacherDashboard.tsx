import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatDateIndian } from '../../utils/rules';
import {
  CalendarCheck,
  Clock,
  Video,
  Building,
  Users,
  CheckCircle2,
  PlusCircle,
  AlertTriangle,
  ArrowRight,
  Radio,
  FileCheck2
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { currentUser, sessions, enrollments, students, therapies, setActiveTab } = useApp();

  const teacherId = currentUser.teacherId || 'tch-1';

  // Filter only sessions conducted by this teacher
  const mySessions = sessions.filter(s => s.teacherId === teacherId);
  const myLiveSessions = mySessions.filter(s => s.status === 'live');
  const myCompleted = mySessions.filter(s => s.status === 'completed' || s.status === 'approved');
  const myPendingVerification = mySessions.filter(
    s => s.status === 'awaiting_verification' || s.verificationStatus === 'pending_admin' || s.verificationStatus === 'mismatch'
  );

  const totalMinutes = myCompleted.reduce((acc, curr) => acc + curr.totalDurationMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  // Relevant therapies for this teacher
  const assignedTherapyIds = currentUser.role === 'teacher' ? ['th-psych', 'th-behav'] : ['th-psych'];

  // Students enrolled in these therapies
  const myAssignedStudents = students.filter(st => {
    const studentEnrs = enrollments.filter(e => e.studentId === st.id);
    return studentEnrs.some(e => assignedTherapyIds.includes(e.therapyId));
  });

  return (
    <div className="space-y-6">
      
      {/* Teacher Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl text-white shadow-xl shadow-indigo-950/20">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">Therapist Portal — {currentUser.name}</h1>
            <span className="px-2 py-0.5 text-[11px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 rounded-full">
              Clinical Workspace
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Specialization: Child Psychology & Emotional Regulation. Conduct live online sessions, submit offline physical clinic records, and view assigned student therapy packages.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('create-session')}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Session</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Assigned Students</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{myAssignedStudents.length}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">In your disciplines</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Completed Sessions</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{myCompleted.length}</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Approved & verified</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Teaching Hours</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-purple-700 mt-2">{totalHours}h</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Monthly accumulated</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Verification</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-700 mt-2">{myPendingVerification.length}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Awaiting secretary/admin</span>
        </div>

      </div>

      {/* Active Live Session Alert (If running) */}
      {myLiveSessions.length > 0 && (
        <div className="p-5 bg-gradient-to-r from-rose-50 to-indigo-50 border-2 border-rose-300 rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
              <h3 className="font-bold text-rose-950 text-sm">
                You have {myLiveSessions.length} active live video meeting in progress!
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('history')}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Manage Meeting
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {myLiveSessions.map(s => (
              <div key={s.id} className="p-3 bg-white rounded-xl border border-rose-200 shadow-2xs space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{s.therapyName} ({s.type})</span>
                  <span className="text-rose-600 font-mono">{s.totalDurationMinutes}m running</span>
                </div>
                <p className="text-slate-600">Students: {s.participants.map(p => p.studentName).join(', ')}</p>
                <a
                  href={s.meetingRoomUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 font-semibold inline-block pt-1 hover:underline"
                >
                  Join Meeting URL →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Access: My Assigned Students Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">My Assigned Students</h3>
            <p className="text-xs text-slate-500">Students currently receiving therapy under your care</p>
          </div>
          <button
            onClick={() => setActiveTab('my-students')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All ({myAssignedStudents.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {myAssignedStudents.slice(0, 6).map(st => {
            const studentEnrs = enrollments.filter(e => e.studentId === st.id);
            return (
              <div
                key={st.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center shrink-0 text-sm">
                  {st.fullName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0 text-xs">
                  <h4 className="font-bold text-slate-900 truncate">{st.fullName}</h4>
                  <p className="text-slate-500 text-[11px] truncate">Parent: {st.parentName}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {studentEnrs.map(enr => {
                      const th = therapies.find(t => t.id === enr.therapyId);
                      return (
                        <span key={enr.id} className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-indigo-900">
                          {th?.code}: {enr.remainingSessions} left
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Conducted Sessions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Recent Session Log</h3>
          <button
            onClick={() => setActiveTab('history')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Full History
          </button>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {mySessions.slice(0, 5).map(s => (
            <div key={s.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{s.sessionCode}</span>
                  <span className="text-slate-500">• {formatDateIndian(s.date)}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                    {s.mode}
                  </span>
                </div>
                <p className="text-slate-600 mt-0.5">
                  {s.therapyName} ({s.type}) • Duration: {s.totalDurationMinutes}m • {s.participants.length} students
                </p>
              </div>

              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  s.status === 'approved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : s.verificationStatus === 'mismatch'
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {s.verificationStatus.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
