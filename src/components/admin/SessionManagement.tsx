import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SessionRecord } from '../../types';
import { SessionDetailModal } from '../modals/SessionDetailModal';
import { formatDateIndian } from '../../utils/rules';
import {
  CalendarCheck,
  Search,
  Filter,
  Video,
  Building,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Eye,
  Radio,
  FileCheck2,
  XCircle
} from 'lucide-react';

export const SessionManagement: React.FC = () => {
  const { sessions, therapies, teachers, approveSession } = useApp();

  const [activeTab, setActiveTab] = useState<
    'all' | 'online' | 'offline' | 'live' | 'pending' | 'completed' | 'rejected'
  >('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [therapyFilter, setTherapyFilter] = useState('all');
  const [inspectSession, setInspectSession] = useState<SessionRecord | null>(null);

  // Filter logic
  const filteredSessions = sessions.filter(session => {
    // Tab filter
    if (activeTab === 'online' && session.mode !== 'online') return false;
    if (activeTab === 'offline' && session.mode !== 'offline') return false;
    if (activeTab === 'live' && session.status !== 'live') return false;
    if (
      activeTab === 'pending' &&
      session.status !== 'awaiting_verification' &&
      session.verificationStatus !== 'pending_admin' &&
      session.verificationStatus !== 'mismatch'
    )
      return false;
    if (
      activeTab === 'completed' &&
      session.status !== 'completed' &&
      session.status !== 'approved'
    )
      return false;
    if (activeTab === 'rejected' && session.status !== 'rejected') return false;

    // Search filter
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      session.sessionCode.toLowerCase().includes(searchLower) ||
      session.teacherName.toLowerCase().includes(searchLower) ||
      session.participants.some(p => p.studentName.toLowerCase().includes(searchLower));

    // Therapy filter
    const matchesTherapy = therapyFilter === 'all' || session.therapyId === therapyFilter;

    return matchesSearch && matchesTherapy;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Central Session Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {sessions.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Comprehensive audit log of all online and centre sessions, attendance durations, and dual-record approvals.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 text-xs font-semibold">
        {[
          { id: 'all', label: 'All Sessions', count: sessions.length },
          { id: 'live', label: 'Live Now', count: sessions.filter(s => s.status === 'live').length, pulse: true },
          { id: 'online', label: 'Online Sessions', count: sessions.filter(s => s.mode === 'online').length },
          { id: 'offline', label: 'Offline / Centre', count: sessions.filter(s => s.mode === 'offline').length },
          {
            id: 'pending',
            label: 'Pending Approvals',
            count: sessions.filter(
              s =>
                s.status === 'awaiting_verification' ||
                s.verificationStatus === 'pending_admin' ||
                s.verificationStatus === 'mismatch'
            ).length,
            color: 'text-amber-700 bg-amber-50'
          },
          {
            id: 'completed',
            label: 'Approved / Completed',
            count: sessions.filter(s => s.status === 'approved' || s.status === 'completed').length
          },
          { id: 'rejected', label: 'Rejected', count: sessions.filter(s => s.status === 'rejected').length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.pulse && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            )}
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === tab.id
                  ? 'bg-indigo-700 text-white'
                  : tab.color || 'bg-slate-100 text-slate-700'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter Row */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by session code, therapist, or student name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <select
            value={therapyFilter}
            onChange={e => setTherapyFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="all">All Therapies</option>
            {therapies.map(t => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-3.5 pl-5">Session Code & Date</th>
                <th className="p-3.5">Mode / Discipline</th>
                <th className="p-3.5">Therapist</th>
                <th className="p-3.5">Students Present</th>
                <th className="p-3.5">Duration</th>
                <th className="p-3.5">Verification & Approval</th>
                <th className="p-3.5 text-right pr-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 italic">
                    No session records found matching the active filter.
                  </td>
                </tr>
              ) : (
                filteredSessions.map(session => {
                  const presentCount = session.participants.filter(p => p.joined).length;

                  return (
                    <tr key={session.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Code & Date */}
                      <td className="p-3.5 pl-5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">{session.sessionCode}</span>
                          {session.status === 'live' && (
                            <span className="flex h-2 w-2 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          {formatDateIndian(session.date)} • {session.scheduledStartTime}
                        </span>
                      </td>

                      {/* Mode / Discipline */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          {session.mode === 'online' ? (
                            <span className="p-1 rounded-md bg-indigo-50 text-indigo-700">
                              <Video className="w-3.5 h-3.5" />
                            </span>
                          ) : (
                            <span className="p-1 rounded-md bg-amber-50 text-amber-700">
                              <Building className="w-3.5 h-3.5" />
                            </span>
                          )}
                          <span className="font-bold text-slate-900">{session.therapyName}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold">
                          {session.type} ({session.mode})
                        </span>
                      </td>

                      {/* Therapist */}
                      <td className="p-3.5 font-medium text-slate-800">
                        {session.teacherName}
                      </td>

                      {/* Students Present */}
                      <td className="p-3.5">
                        <span className="font-semibold text-slate-900">
                          {presentCount} of {session.participants.length} present
                        </span>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5">
                          {session.participants.map(p => p.studentName).join(', ')}
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="p-3.5">
                        <span className="font-bold text-slate-900">{session.totalDurationMinutes} mins</span>
                        {session.status === 'live' && (
                          <span className="text-[10px] font-semibold text-rose-600 block animate-pulse">
                            ● In Progress
                          </span>
                        )}
                      </td>

                      {/* Verification Status */}
                      <td className="p-3.5">
                        <div className="flex flex-col items-start gap-1">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              session.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : session.verificationStatus === 'mismatch'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : session.status === 'live'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {session.verificationStatus.replace('_', ' ')}
                          </span>

                          <span className="text-[10px] text-slate-500">
                            {session.deductionApplied ? '✓ Package Deducted' : 'Pending Deduction'}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right pr-5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setInspectSession(session)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </button>

                          {session.status !== 'approved' && session.status !== 'rejected' && (
                            <button
                              onClick={() => approveSession(session.id)}
                              className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                              Approve
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
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
