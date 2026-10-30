import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SessionRecord } from '../../types';
import { formatDateIndian } from '../../utils/rules';
import {
  FileCheck2,
  Building,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  UserX,
  Send,
  Info
} from 'lucide-react';

export const VerifyOfflineView: React.FC = () => {
  const { sessions, secretaryConfirmOfflineSession } = useApp();

  // Find all offline sessions
  const offlineSessions = sessions.filter(s => s.mode === 'offline');
  const pendingSessions = offlineSessions.filter(
    s => s.verificationStatus === 'awaiting_secretary'
  );

  // Active session being verified
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    pendingSessions[0]?.id || offlineSessions[0]?.id || ''
  );

  const activeSession = offlineSessions.find(s => s.id === selectedSessionId) || offlineSessions[0];

  // Secretary form fields
  const [confirmedStudentIds, setConfirmedStudentIds] = useState<string[]>(
    activeSession?.participants.map(p => p.studentId) || []
  );
  const [confirmedDuration, setConfirmedDuration] = useState<number>(
    activeSession?.totalDurationMinutes || 45
  );
  const [remarks, setRemarks] = useState<string>('Checked physical register. Signatures verified.');

  // When active session changes, re-sync state
  const handleSelectSession = (session: SessionRecord) => {
    setSelectedSessionId(session.id);
    setConfirmedStudentIds(session.participants.map(p => p.studentId));
    setConfirmedDuration(session.totalDurationMinutes);
    setRemarks(session.secretaryConfirmation?.remarks || 'Checked physical register. Signatures verified.');
  };

  const handleToggleStudent = (studentId: string) => {
    setConfirmedStudentIds(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmitConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSession) return;

    secretaryConfirmOfflineSession(
      activeSession.id,
      confirmedStudentIds,
      Number(confirmedDuration) || 45,
      remarks
    );
  };

  if (offlineSessions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 text-xs">
        No offline sessions found.
      </div>
    );
  }

  const teacherStudentIds = activeSession?.participants.map(p => p.studentId) || [];
  const missingStudents = teacherStudentIds.filter(id => !confirmedStudentIds.includes(id));
  const willTriggerMismatch = missingStudents.length > 0 || Math.abs(confirmedDuration - (activeSession?.totalDurationMinutes || 0)) > 10;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Verify Physical Centre Sessions</h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            Independent Sign-in Audit
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          As the Secretary, verify that submitted teachers and students were physically logged in the centre's entry register.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: List of offline sessions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Offline Sessions Queue
            </span>
            <span className="text-xs text-slate-400">{offlineSessions.length} total</span>
          </div>

          <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
            {offlineSessions.map(session => {
              const isSelected = session.id === activeSession?.id;
              const isPending = session.verificationStatus === 'awaiting_secretary';

              return (
                <button
                  key={session.id}
                  onClick={() => handleSelectSession(session)}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-100'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900">{session.sessionCode}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        isPending
                          ? 'bg-amber-100 text-amber-900'
                          : session.verificationStatus === 'mismatch'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {session.verificationStatus.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-slate-700 font-semibold mt-1">{session.therapyName} ({session.type})</p>
                  <p className="text-[11px] text-slate-500">
                    {session.teacherName} • {session.participants.length} students • {formatDateIndian(session.date)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Independent Verification Form */}
        {activeSession && (
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Verify Session: {activeSession.sessionCode}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                    {activeSession.therapyName}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Conducted on {formatDateIndian(activeSession.date)} at {activeSession.scheduledStartTime}
                </p>
              </div>

              <div className="text-xs">
                <span className="text-slate-500">Therapist: </span>
                <strong className="text-slate-900">{activeSession.teacherName}</strong>
              </div>
            </div>

            {/* Teacher's original submitted data (Read-only) */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 text-xs space-y-2">
              <span className="font-bold text-blue-900 uppercase tracking-wider text-[10px] block">
                Teacher's Submission (Original Record)
              </span>
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <p><strong>Submitted Duration:</strong> {activeSession.totalDurationMinutes} mins</p>
                <p><strong>Students Reported:</strong> {activeSession.participants.map(p => p.studentName).join(', ')}</p>
              </div>
              {activeSession.teacherNotes && (
                <p className="text-slate-600 italic text-[11px]">"{activeSession.teacherNotes}"</p>
              )}
            </div>

            {/* Secretary Independent Input Form */}
            <form onSubmit={handleSubmitConfirmation} className="space-y-5 text-xs">
              
              {/* Student Presence Checklist */}
              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                  Confirm Actual Student Attendance (Physical Sign-In Sheet) *
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  Uncheck any student who was NOT present in the centre register:
                </p>

                <div className="space-y-2">
                  {activeSession.participants.map(p => {
                    const isChecked = confirmedStudentIds.includes(p.studentId);

                    return (
                      <label
                        key={p.studentId}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                          isChecked
                            ? 'border-emerald-300 bg-emerald-50/50 text-emerald-950 font-semibold'
                            : 'border-slate-200 bg-slate-50/60 text-slate-400 line-through'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleStudent(p.studentId)}
                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
                          />
                          <span>{p.studentName}</span>
                        </div>

                        <span className="text-[11px]">
                          {isChecked ? 'Confirmed Present in Register' : 'Marked Absent by Secretary'}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Confirmed Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Confirmed Session Duration (Minutes) *
                  </label>
                  <input
                    type="number"
                    min={15}
                    max={120}
                    step={5}
                    required
                    value={confirmedDuration}
                    onChange={e => setConfirmedDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Teacher submitted: {activeSession.totalDurationMinutes} mins
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Secretary Front Desk Remarks
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Signatures verified from Page 14 of Oct Register"
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Mismatch Warning preview */}
              {willTriggerMismatch && (
                <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-2.5 text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Note:</strong> You have unchecked {missingStudents.length} student(s) or adjusted duration. Submitting will flag this session with an <strong>"Attendance Mismatch"</strong> alert for Admin review and prevent automatic deduction for absent students.
                  </p>
                </div>
              )}

              {/* Submit Confirmation button */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Secretary Confirmation</span>
                </button>
              </div>

            </form>

          </div>
        )}

      </div>

    </div>
  );
};
