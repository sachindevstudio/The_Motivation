import React from 'react';
import { useApp } from '../../context/AppContext';
import { SessionRecord } from '../../types';
import { formatDateIndian } from '../../utils/rules';
import {
  X,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Video,
  Building,
  User,
  ShieldCheck,
  Info
} from 'lucide-react';

interface SessionDetailModalProps {
  session: SessionRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({
  session,
  isOpen,
  onClose
}) => {
  const { approveSession, rejectSession, currentRole } = useApp();

  if (!isOpen || !session) return null;

  const handleApprove = () => {
    approveSession(session.id);
    onClose();
  };

  const handleReject = () => {
    rejectSession(session.id, 'Session rejected after review');
    onClose();
  };

  const eligibleCount = session.participants.filter(p => p.eligibleForDeduction && p.joined).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-6">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${session.mode === 'online' ? 'bg-indigo-600' : 'bg-amber-600'}`}>
              {session.mode === 'online' ? <Video className="w-5 h-5" /> : <Building className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">Session Inspection: {session.sessionCode}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  session.status === 'approved'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : session.status === 'live'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {session.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {session.mode.toUpperCase()} • {session.type.toUpperCase()} • {session.therapyName}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          
          {/* Key Facts Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 block">Date:</span>
              <span className="font-bold text-slate-900 text-sm">{formatDateIndian(session.date)}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Teacher / Therapist:</span>
              <span className="font-bold text-slate-900 text-sm">{session.teacherName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Scheduled Time:</span>
              <span className="font-semibold text-slate-800">{session.scheduledStartTime} ({session.totalDurationMinutes}m)</span>
            </div>
            <div>
              <span className="text-slate-500 block">Deduction State:</span>
              <span className={`font-bold ${session.deductionApplied ? 'text-emerald-700' : 'text-amber-700'}`}>
                {session.deductionApplied ? '✓ Deducted' : 'Pending Approval'}
              </span>
            </div>
          </div>

          {/* Secretary vs Teacher Comparison (for Offline Sessions) */}
          {session.mode === 'offline' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <span>Dual-Record Verification Comparison</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Teacher submission */}
                <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 block mb-1">
                    Teacher Submitted Record
                  </span>
                  <div className="space-y-1.5 text-slate-700">
                    <p><strong className="text-slate-900">Therapist:</strong> {session.teacherName}</p>
                    <p><strong className="text-slate-900">Submitted Duration:</strong> {session.totalDurationMinutes} mins</p>
                    <p><strong className="text-slate-900">Submitted Students:</strong> {session.participants.map(p => p.studentName).join(', ')}</p>
                    {session.teacherNotes && (
                      <p className="mt-1 text-slate-600 italic text-[11px]">"{session.teacherNotes}"</p>
                    )}
                  </div>
                </div>

                {/* Secretary confirmation */}
                <div className={`p-3.5 rounded-xl border ${
                  session.secretaryConfirmation
                    ? session.secretaryConfirmation.hasMismatch
                      ? 'border-amber-300 bg-amber-50/50'
                      : 'border-emerald-200 bg-emerald-50/40'
                    : 'border-slate-200 bg-slate-50'
                }`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 block mb-1">
                    Secretary Independent Record
                  </span>
                  {session.secretaryConfirmation ? (
                    <div className="space-y-1.5 text-slate-700">
                      <p><strong className="text-slate-900">Confirmed Teacher:</strong> {session.secretaryConfirmation.confirmedTeacherName}</p>
                      <p><strong className="text-slate-900">Confirmed Duration:</strong> {session.secretaryConfirmation.confirmedDurationMinutes} mins</p>
                      <p><strong className="text-slate-900">Confirmed Students:</strong> {session.secretaryConfirmation.confirmedStudentIds.length} present</p>
                      <p className="text-[11px] text-slate-600 italic">"{session.secretaryConfirmation.remarks}"</p>
                      {session.secretaryConfirmation.hasMismatch && (
                        <div className="mt-2 p-2 bg-amber-100/70 border border-amber-300 rounded-lg text-amber-900 font-medium">
                          ⚠️ {session.secretaryConfirmation.mismatchDetails}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-slate-500 italic py-3 text-center">
                      Awaiting secretary confirmation from physical attendance register.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Participant Attendance Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Student Attendance & Deduction Eligibility
              </h4>
              <span className="text-[11px] text-slate-500">
                Threshold: &ge; 15 min for package deduction
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="p-2.5">Student</th>
                    <th className="p-2.5">Joined?</th>
                    <th className="p-2.5">Duration</th>
                    <th className="p-2.5">Threshold Status</th>
                    <th className="p-2.5">Package Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {session.participants.map(p => (
                    <tr key={p.studentId} className={p.joined ? 'bg-white' : 'bg-slate-50/60'}>
                      <td className="p-2.5 font-bold text-slate-900">{p.studentName}</td>
                      <td className="p-2.5">
                        {p.joined ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Present
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                            Absent
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 font-semibold text-slate-800">
                        {p.attendanceDurationMinutes} mins
                        {p.joinTime && <span className="text-[10px] text-slate-500 block">({p.joinTime} - {p.leaveTime || 'end'})</span>}
                      </td>
                      <td className="p-2.5">
                        {p.eligibleForDeduction ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Met (≥15m)
                          </span>
                        ) : (
                          <span className="text-amber-700 font-semibold flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> {p.joined ? 'Below 15m' : 'Not Joined'}
                          </span>
                        )}
                      </td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          p.deductionStatus === 'deducted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.deductionStatus === 'pending'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {p.deductionStatus.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info callout on business rule */}
          <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-start gap-2.5 text-indigo-900 text-xs">
            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <p>
              <strong>Business Rule:</strong> Group sessions count as 1 session for the teacher, but deduct 1 session individually from each attending student's package only when approved. Absent students and students with &lt;15 mins attendance are preserved without deduction.
            </p>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Close
            </button>

            {currentRole === 'admin' && session.status !== 'approved' && session.status !== 'rejected' && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleReject}
                  className="px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold rounded-xl hover:bg-rose-100 transition-colors flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Session</span>
                </button>

                <button
                  type="button"
                  onClick={handleApprove}
                  className="px-5 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve & Deduct {eligibleCount} Eligible Package(s)</span>
                </button>
              </div>
            )}

            {session.status === 'approved' && (
              <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Approved by {session.approvedBy || 'Admin Staff'}</span>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
