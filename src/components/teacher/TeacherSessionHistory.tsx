import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SessionRecord } from '../../types';
import { SessionDetailModal } from '../modals/SessionDetailModal';
import { formatDateIndian } from '../../utils/rules';
import {
  History,
  Search,
  Filter,
  Video,
  Building,
  CheckCircle2,
  Clock,
  Eye,
  AlertTriangle
} from 'lucide-react';

export const TeacherSessionHistory: React.FC = () => {
  const { currentUser, sessions } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [inspectSession, setInspectSession] = useState<SessionRecord | null>(null);

  const teacherId = currentUser.teacherId || 'tch-1';
  const mySessions = sessions.filter(s => s.teacherId === teacherId);

  const filtered = mySessions.filter(s => {
    const term = searchTerm.toLowerCase();
    return (
      s.sessionCode.toLowerCase().includes(term) ||
      s.therapyName.toLowerCase().includes(term) ||
      s.participants.some(p => p.studentName.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">My Session History & Logs</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {mySessions.length} Conducted Sessions
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit history of your individual and group therapy meetings across online and physical delivery channels.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by session code, student name, or therapy..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-3.5 pl-5">Date & Code</th>
                <th className="p-3.5">Mode / Discipline</th>
                <th className="p-3.5">Attending Student(s)</th>
                <th className="p-3.5">Scheduled Duration</th>
                <th className="p-3.5">Verification Status</th>
                <th className="p-3.5 text-right pr-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 italic">
                    No sessions match the current search.
                  </td>
                </tr>
              ) : (
                filtered.map(session => (
                  <tr key={session.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 pl-5">
                      <span className="font-mono font-bold text-slate-900 block">{session.sessionCode}</span>
                      <span className="text-[11px] text-slate-500">{formatDateIndian(session.date)}</span>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        {session.mode === 'online' ? (
                          <Video className="w-3.5 h-3.5 text-indigo-600" />
                        ) : (
                          <Building className="w-3.5 h-3.5 text-amber-600" />
                        )}
                        <span className="font-bold text-slate-900">{session.therapyName}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase">{session.type} ({session.mode})</span>
                    </td>

                    <td className="p-3.5">
                      <span className="font-semibold text-slate-800">
                        {session.participants.map(p => p.studentName).join(', ')}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className="font-bold text-slate-900">{session.totalDurationMinutes} mins</span>
                      <span className="text-[10px] text-slate-500 block">{session.scheduledStartTime}</span>
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          session.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : session.verificationStatus === 'mismatch'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {session.verificationStatus.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="p-3.5 text-right pr-5">
                      <button
                        onClick={() => setInspectSession(session)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
