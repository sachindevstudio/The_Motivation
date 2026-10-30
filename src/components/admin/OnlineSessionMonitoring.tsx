import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDateIndian } from '../../utils/rules';
import { SessionDetailModal } from '../modals/SessionDetailModal';
import { SessionRecord } from '../../types';
import {
  Video,
  Radio,
  Users,
  Clock,
  Play,
  Square,
  UserCheck,
  UserX,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Info
} from 'lucide-react';

export const OnlineSessionMonitoring: React.FC = () => {
  const {
    sessions,
    simulateStudentJoin,
    simulateStudentLeave,
    endOnlineSession,
    orgSettings
  } = useApp();

  const [inspectSession, setInspectSession] = useState<SessionRecord | null>(null);

  // Active / Live online meetings
  const onlineLiveSessions = sessions.filter(
    s => s.mode === 'online' && (s.status === 'live' || s.status === 'waiting')
  );

  const completedOnlineSessions = sessions.filter(
    s => s.mode === 'online' && s.status !== 'live' && s.status !== 'waiting'
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Online Session & Telemetry Monitor</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Daily.co Telemetry Hub
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time participant connection intervals, join/leave timestamps, and threshold validation before session approval.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>{onlineLiveSessions.length} Active Video Room(s)</span>
          </span>
        </div>
      </div>

      {/* Demo Mode & Architecture Callout */}
      <div className="p-4 bg-gradient-to-r from-indigo-50 via-slate-50 to-indigo-50 border border-indigo-200 rounded-2xl flex items-start gap-3 text-xs text-indigo-950">
        <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">
            DEMO MODE — Daily.co Webhook & Telemetry Simulation Architecture:
          </p>
          <p className="text-indigo-900 leading-relaxed">
            In production, Daily.co server-side webhooks (<code>participant.joined</code>, <code>participant.left</code>, <code>meeting.ended</code>) securely track exact join/leave seconds without relying on teacher-submitted duration. Use the simulation buttons below to test various attendance scenarios (e.g. absent student, student leaving early &lt;15 mins threshold).
          </p>
        </div>
      </div>

      {/* Active Live Rooms */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Radio className="w-4 h-4 text-rose-600 animate-pulse" />
          <span>Active Video Meeting Rooms ({onlineLiveSessions.length})</span>
        </h2>

        {onlineLiveSessions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 text-xs">
            <Video className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No active online meetings running at this moment.</p>
            <p className="text-slate-500 mt-1">
              Switch to the <strong>Teacher Panel</strong> and click <strong>"Create New Session"</strong> (Online) to start a new live video call.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {onlineLiveSessions.map(session => (
              <div
                key={session.id}
                className="bg-white rounded-2xl border-2 border-indigo-500/80 p-5 shadow-md shadow-indigo-100 space-y-4"
              >
                {/* Room top bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {session.sessionCode}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
                        LIVE MEETING
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-800">
                        {session.therapyName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Teacher: <strong className="text-slate-900">{session.teacherName}</strong> • Type: {session.type} • Started: {session.scheduledStartTime}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-indigo-700 px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-200">
                      Elapsed: {session.totalDurationMinutes} mins
                    </span>

                    <button
                      onClick={() => endOnlineSession(session.id)}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>End Meeting</span>
                    </button>
                  </div>
                </div>

                {/* Telemetry table with simulation controls */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">
                      Live Participant Telemetry & Threshold Tracker:
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Min Duration Threshold: {orgSettings.minAttendanceDurationMinutes} minutes
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                        <tr>
                          <th className="p-3 pl-4">Student</th>
                          <th className="p-3">Connection State</th>
                          <th className="p-3">Join Time</th>
                          <th className="p-3">Leave Time</th>
                          <th className="p-3">Elapsed Duration</th>
                          <th className="p-3">Threshold Status</th>
                          <th className="p-3 text-right pr-4">Interactive Simulation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {session.participants.map(participant => (
                          <tr key={participant.studentId} className={participant.joined ? 'bg-white' : 'bg-slate-50/70'}>
                            <td className="p-3 pl-4 font-bold text-slate-900">
                              {participant.studentName}
                            </td>

                            <td className="p-3">
                              {participant.joined ? (
                                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                  Connected
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-slate-400">
                                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                                  Not in call
                                </span>
                              )}
                            </td>

                            <td className="p-3 font-mono text-slate-700">
                              {participant.joinTime || '—'}
                            </td>

                            <td className="p-3 font-mono text-slate-700">
                              {participant.leaveTime || (participant.joined ? 'Active' : '—')}
                            </td>

                            <td className="p-3 font-bold text-slate-900">
                              {participant.attendanceDurationMinutes} mins
                            </td>

                            <td className="p-3">
                              {participant.eligibleForDeduction ? (
                                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                                  <ShieldCheck className="w-3.5 h-3.5" /> Eligible (≥15m)
                                </span>
                              ) : (
                                <span className="text-amber-700 font-semibold flex items-center gap-1">
                                  <AlertTriangle className="w-3.5 h-3.5" /> {participant.joined ? 'Below 15m' : 'Not Joined'}
                                </span>
                              )}
                            </td>

                            {/* Simulation buttons */}
                            <td className="p-3 text-right pr-4">
                              <div className="flex items-center justify-end gap-2">
                                {!participant.joined ? (
                                  <button
                                    onClick={() => simulateStudentJoin(session.id, participant.studentId)}
                                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg font-semibold text-[11px] transition-colors flex items-center gap-1"
                                    title="Simulate participant joining video call"
                                  >
                                    <UserCheck className="w-3 h-3" />
                                    <span>Simulate Join</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => simulateStudentLeave(session.id, participant.studentId)}
                                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg font-semibold text-[11px] transition-colors flex items-center gap-1"
                                    title="Simulate participant leaving call"
                                  >
                                    <UserX className="w-3 h-3" />
                                    <span>Simulate Leave</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Footer notes */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                  <span>
                    Direct Meeting URL: <a href={session.meetingRoomUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline font-mono">{session.meetingRoomUrl}</a>
                  </span>
                  <button
                    onClick={() => setInspectSession(session)}
                    className="text-xs font-semibold text-slate-700 hover:text-indigo-700"
                  >
                    View Complete Audit Record →
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Online Sessions Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Recent Completed Online Sessions (Verification History)
          </h3>
          <span className="text-xs text-slate-500">
            {completedOnlineSessions.length} Online Records
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {completedOnlineSessions.slice(0, 5).map(session => (
            <div key={session.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">{session.sessionCode}</span>
                  <span className="text-slate-500">• {formatDateIndian(session.date)}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    session.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {session.status}
                  </span>
                </div>
                <p className="text-slate-600 mt-0.5">
                  {session.teacherName} • {session.therapyName} • Duration: {session.totalDurationMinutes} mins
                </p>
              </div>

              <button
                onClick={() => setInspectSession(session)}
                className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                Inspect Telemetry
              </button>
            </div>
          ))}
        </div>
      </div>

      <SessionDetailModal
        session={inspectSession}
        isOpen={!!inspectSession}
        onClose={() => setInspectSession(null)}
      />

    </div>
  );
};
