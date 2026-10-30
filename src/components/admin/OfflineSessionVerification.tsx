import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SessionRecord } from '../../types';
import { SessionDetailModal } from '../modals/SessionDetailModal';
import { formatDateIndian } from '../../utils/rules';
import {
  FileCheck2,
  Building,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  ShieldCheck,
  UserCheck,
  XCircle,
  AlertCircle
} from 'lucide-react';

export const OfflineSessionVerification: React.FC = () => {
  const { sessions, approveSession, rejectSession } = useApp();
  const [inspectSession, setInspectSession] = useState<SessionRecord | null>(null);

  // All offline sessions
  const offlineSessions = sessions.filter(s => s.mode === 'offline');
  const pendingSecretary = offlineSessions.filter(s => s.verificationStatus === 'awaiting_secretary');
  const mismatchedSessions = offlineSessions.filter(s => s.verificationStatus === 'mismatch');
  const matchedPendingAdmin = offlineSessions.filter(
    s => s.verificationStatus === 'matched' && s.status !== 'approved'
  );
  const approvedSessions = offlineSessions.filter(s => s.status === 'approved');

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Offline Session Dual-Verification</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              Cross-Check Audit
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare teacher session submissions independently against secretary attendance register logs before approving session package deductions.
          </p>
        </div>

        {/* Quick status summary */}
        <div className="flex items-center gap-2">
          {mismatchedSessions.length > 0 && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              <span>{mismatchedSessions.length} Attendance Mismatch</span>
            </span>
          )}
        </div>
      </div>

      {/* Mismatch Alert Notice */}
      {mismatchedSessions.length > 0 && (
        <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-start gap-3.5">
          <AlertCircle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h3 className="font-bold text-amber-950 text-sm">
              Discrepancy Detected Between Teacher Submission & Front-Desk Register
            </h3>
            <p className="text-amber-900 leading-relaxed">
              For one or more offline sessions, the students or duration submitted by the therapist do not match the physical register confirmed by the Secretary. Review the differences below before granting approval.
            </p>
          </div>
        </div>
      )}

      {/* Verification Cards */}
      <div className="space-y-5">
        <h2 className="text-sm font-bold text-slate-900">Offline Sessions Pending Admin Review</h2>

        {mismatchedSessions.concat(matchedPendingAdmin).length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">All offline session confirmations have been reviewed!</p>
            <p className="text-slate-400 mt-1">New teacher submissions will show up here after secretary confirmation.</p>
          </div>
        ) : (
          mismatchedSessions.concat(matchedPendingAdmin).map(session => {
            const isMismatch = session.verificationStatus === 'mismatch';
            const teacherStudents = session.participants.map(p => p.studentName);
            const confirmedIds = session.secretaryConfirmation?.confirmedStudentIds || [];
            const confirmedCount = confirmedIds.length;

            return (
              <div
                key={session.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs transition-all space-y-4 ${
                  isMismatch
                    ? 'border-amber-300 ring-2 ring-amber-100'
                    : 'border-slate-200'
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                      <Building className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-sm">{session.sessionCode}</span>
                        <span className="text-slate-500 text-xs">• {formatDateIndian(session.date)}</span>
                        {isMismatch ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-700" />
                            ATTENDANCE MISMATCH
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            RECORDS MATCH
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Therapy: <strong>{session.therapyName}</strong> • Type: {session.type} ({session.scheduledStartTime})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setInspectSession(session)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Details</span>
                    </button>
                    <button
                      onClick={() => approveSession(session.id)}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Session</span>
                    </button>
                  </div>
                </div>

                {/* Dual Comparison Blocks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  
                  {/* Therapist Submission */}
                  <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-900 uppercase text-[10px] tracking-wider">
                        1. Teacher Submission
                      </span>
                      <span className="font-semibold text-blue-800">{session.totalDurationMinutes} mins</span>
                    </div>
                    <p><strong className="text-slate-900">Therapist:</strong> {session.teacherName}</p>
                    <p><strong className="text-slate-900">Submitted Students ({session.participants.length}):</strong></p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {session.participants.map(p => (
                        <span key={p.studentId} className="px-2 py-0.5 rounded-md bg-white border border-blue-200 text-blue-900 font-medium">
                          {p.studentName}
                        </span>
                      ))}
                    </div>
                    {session.teacherNotes && (
                      <p className="text-slate-600 italic text-[11px] pt-1">"{session.teacherNotes}"</p>
                    )}
                  </div>

                  {/* Secretary Confirmation */}
                  <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                    isMismatch ? 'border-amber-300 bg-amber-50/50' : 'border-emerald-200 bg-emerald-50/40'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold uppercase text-[10px] tracking-wider text-slate-900">
                        2. Secretary Physical Register
                      </span>
                      <span className="font-semibold text-slate-800">
                        {session.secretaryConfirmation?.confirmedDurationMinutes || session.totalDurationMinutes} mins
                      </span>
                    </div>
                    <p>
                      <strong className="text-slate-900">Confirmed Teacher:</strong>{' '}
                      {session.secretaryConfirmation?.confirmedTeacherName || session.teacherName}
                    </p>
                    <p>
                      <strong className="text-slate-900">Confirmed Present Students ({confirmedCount}):</strong>
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {session.participants.map(p => {
                        const isConfirmed = confirmedIds.includes(p.studentId);
                        return (
                          <span
                            key={p.studentId}
                            className={`px-2 py-0.5 rounded-md font-medium border ${
                              isConfirmed
                                ? 'bg-white border-emerald-300 text-emerald-900 font-semibold'
                                : 'bg-rose-50 border-rose-300 text-rose-800 line-through'
                            }`}
                          >
                            {p.studentName} {isConfirmed ? '✓' : '(Not Present)'}
                          </span>
                        );
                      })}
                    </div>
                    {session.secretaryConfirmation?.remarks && (
                      <p className="text-slate-600 italic text-[11px] pt-1">
                        "{session.secretaryConfirmation.remarks}"
                      </p>
                    )}
                  </div>

                </div>

                {/* Explicit Mismatch Explanation Box */}
                {isMismatch && session.secretaryConfirmation?.mismatchDetails && (
                  <div className="p-3 bg-amber-100/70 border border-amber-300 rounded-xl text-xs text-amber-950 font-medium flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>{session.secretaryConfirmation.mismatchDetails}</span>
                    </div>
                    <span className="text-[11px] text-amber-800">
                      Admin decision: Approve will deduct package only for students confirmed present.
                    </span>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      <SessionDetailModal
        session={inspectSession}
        isOpen={!!inspectSession}
        onClose={() => setInspectSession(null)}
      />

    </div>
  );
};
