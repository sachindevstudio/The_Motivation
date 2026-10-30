import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatDateIndian } from '../../utils/rules';
import {
  ClipboardCheck,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  Building,
  ArrowRight,
  Clock,
  ShieldCheck
} from 'lucide-react';

export const SecretaryDashboard: React.FC = () => {
  const { sessions, setActiveTab } = useApp();

  const offlineSessions = sessions.filter(s => s.mode === 'offline');
  const pendingConfirmations = offlineSessions.filter(
    s => s.verificationStatus === 'awaiting_secretary'
  );
  const confirmedSessions = offlineSessions.filter(
    s => s.verificationStatus === 'matched' || s.status === 'approved'
  );
  const mismatchedSessions = offlineSessions.filter(
    s => s.verificationStatus === 'mismatch'
  );

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl text-white shadow-xl shadow-indigo-950/20">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">Front Desk & Secretary Operations</h1>
            <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-500/30 text-amber-200 border border-amber-400/30 rounded-full">
              Physical Register Verification
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Audit teacher offline therapy submissions independently against the centre's physical sign-in sheet.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('verify-offline')}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Verify Offline Sessions ({pendingConfirmations.length})</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Offline Submissions</span>
            <Building className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{offlineSessions.length}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Total centre records</span>
        </div>

        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-900">Awaiting Secretary</span>
            <Clock className="w-4 h-4 text-amber-700" />
          </div>
          <p className="text-2xl font-black text-amber-950 mt-2">{pendingConfirmations.length}</p>
          <span className="text-[11px] text-amber-800 font-medium mt-1 block">Requires register check</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Confirmed Present</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{confirmedSessions.length}</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Matched & reconciled</span>
        </div>

        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-900">Mismatches Flagged</span>
            <AlertTriangle className="w-4 h-4 text-rose-700" />
          </div>
          <p className="text-2xl font-black text-rose-950 mt-2">{mismatchedSessions.length}</p>
          <span className="text-[11px] text-rose-800 font-medium mt-1 block">Reported to Admin</span>
        </div>

      </div>

      {/* Pending Confirmations Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Offline Sessions Awaiting Your Physical Register Check
            </h3>
            <p className="text-xs text-slate-500">
              Compare teacher submissions with student clinic entry sheets
            </p>
          </div>
          <button
            onClick={() => setActiveTab('verify-offline')}
            className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1"
          >
            <span>Open Verification Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {pendingConfirmations.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-xs italic border border-dashed border-slate-200 rounded-xl">
            No pending submissions waiting for secretary verification.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingConfirmations.map(session => (
              <div
                key={session.id}
                className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{session.sessionCode}</span>
                    <span className="text-slate-500">• {formatDateIndian(session.date)} ({session.scheduledStartTime})</span>
                    <span className="px-2 py-0.5 rounded-md font-bold bg-indigo-100 text-indigo-800 text-[10px]">
                      {session.therapyName}
                    </span>
                  </div>
                  <p className="text-slate-700 mt-1">
                    Therapist: <strong>{session.teacherName}</strong> • Submitted Students: {session.participants.map(p => p.studentName).join(', ')} ({session.totalDurationMinutes} mins)
                  </p>
                  {session.teacherNotes && (
                    <p className="text-slate-500 italic mt-0.5 text-[11px]">"{session.teacherNotes}"</p>
                  )}
                </div>

                <button
                  onClick={() => setActiveTab('verify-offline')}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
                >
                  Verify Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
