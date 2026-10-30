import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Teacher } from '../../types';
import { AddTeacherModal } from '../modals/AddTeacherModal';
import { formatDateIndian } from '../../utils/rules';
import {
  GraduationCap,
  Plus,
  Search,
  Phone,
  Mail,
  Clock,
  CalendarCheck,
  Video,
  Building,
  CheckCircle2,
  Users
} from 'lucide-react';

export const TeacherManagement: React.FC = () => {
  const { teachers, sessions, therapies } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const filteredTeachers = teachers.filter(
    t =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Therapist & Teacher Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
              {teachers.length} Staff Members
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor teacher session logs, teaching hours for external payroll calculation, delivery modes, and assigned disciplines.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Therapist</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by therapist name, specialization, or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeachers.map(teacher => {
          const teacherSessions = sessions.filter(s => s.teacherId === teacher.id);
          const completed = teacherSessions.filter(s => s.status === 'completed' || s.status === 'approved');
          const onlineCount = completed.filter(s => s.mode === 'online').length;
          const offlineCount = completed.filter(s => s.mode === 'offline').length;
          const totalMinutes = completed.reduce((acc, curr) => acc + curr.totalDurationMinutes, 0);
          const totalHours = (totalMinutes / 60).toFixed(1);
          const pendingApprovalCount = teacherSessions.filter(
            s => s.status === 'awaiting_verification' || s.verificationStatus === 'pending_admin' || s.verificationStatus === 'mismatch'
          ).length;

          return (
            <div
              key={teacher.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top Avatar & Name */}
                <div className="flex items-start gap-3.5">
                  <img
                    src={teacher.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
                    alt={teacher.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-50 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-slate-400 font-semibold">{teacher.teacherCode}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        teacher.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {teacher.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm truncate mt-0.5">{teacher.name}</h3>
                    <p className="text-xs text-indigo-700 font-medium truncate">{teacher.specialization}</p>
                  </div>
                </div>

                {/* Assigned Therapies */}
                <div className="mt-3.5 flex flex-wrap gap-1">
                  {teacher.assignedTherapies.map(thId => {
                    const th = therapies.find(t => t.id === thId);
                    return (
                      <span
                        key={thId}
                        className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {th?.name || thId}
                      </span>
                    );
                  })}
                </div>

                {/* Contact info */}
                <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                  <p className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{teacher.email}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{teacher.phone}</span>
                  </p>
                </div>

                {/* Session Counts & Teaching Hours Statistics */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-3 text-center text-xs">
                  <div>
                    <span className="font-black text-slate-900 text-sm">{completed.length}</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Sessions</p>
                  </div>
                  <div className="border-x border-slate-200">
                    <span className="font-black text-indigo-700 text-sm">{totalHours}h</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Teaching Hrs</p>
                  </div>
                  <div>
                    <span className="font-black text-slate-900 text-sm">
                      {onlineCount}o / {offlineCount}c
                    </span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Online/Centre</p>
                  </div>
                </div>

                {pendingApprovalCount > 0 && (
                  <div className="mt-2.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium flex items-center justify-between">
                    <span>Pending Admin Approval:</span>
                    <span className="font-bold">{pendingApprovalCount} sessions</span>
                  </div>
                )}
              </div>

              {/* Footer info */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Joined {formatDateIndian(teacher.joiningDate)}</span>
                <span className="text-indigo-600 font-semibold">Active Staff</span>
              </div>
            </div>
          );
        })}
      </div>

      <AddTeacherModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

    </div>
  );
};
