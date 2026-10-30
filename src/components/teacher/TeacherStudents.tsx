import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { ViewStudentModal } from '../modals/ViewStudentModal';
import { Users, Search, Phone, Sparkles, Eye, CheckCircle2 } from 'lucide-react';

export const TeacherStudents: React.FC = () => {
  const { students, enrollments, therapies, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  const assignedTherapyIds = ['th-psych', 'th-behav'];

  // Students enrolled in this therapist's disciplines
  const myStudents = students.filter(st => {
    const studentEnrs = enrollments.filter(e => e.studentId === st.id);
    const hasDiscipline = studentEnrs.some(e => assignedTherapyIds.includes(e.therapyId));
    const matchesSearch =
      st.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.parentName.toLowerCase().includes(searchTerm.toLowerCase());

    return hasDiscipline && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">My Assigned Therapy Students</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {myStudents.length} Students
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Children and students receiving Psychology & Behaviour Therapy under your clinical supervision.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by student name, code, or parent..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {myStudents.map(student => {
          const studentEnrs = enrollments.filter(
            e => e.studentId === student.id && assignedTherapyIds.includes(e.therapyId)
          );

          return (
            <div
              key={student.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center text-sm shadow-xs">
                      {student.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{student.fullName}</h3>
                      <span className="font-mono text-[10px] text-slate-500">
                        {student.studentCode} • {student.age} yrs
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>

                {/* Parent Contact */}
                <div className="mt-3 text-xs text-slate-600 space-y-1">
                  <p>
                    <span className="text-slate-400 font-medium">Guardian:</span>{' '}
                    <strong>{student.parentName}</strong>
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{student.parentPhone}</span>
                  </p>
                </div>

                {/* Therapy Packages for this Teacher */}
                <div className="mt-4 space-y-2 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Remaining Session Allowance
                  </span>

                  {studentEnrs.map(enr => {
                    const th = therapies.find(t => t.id === enr.therapyId);
                    const isLow = enr.remainingSessions <= 3;

                    return (
                      <div
                        key={enr.id}
                        className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900">{th?.name}</span>
                          <span className={`font-bold ${isLow ? 'text-amber-700' : 'text-indigo-700'}`}>
                            {enr.remainingSessions} / {enr.totalAllowedSessions} left
                          </span>
                        </div>

                        {/* Progress */}
                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isLow ? 'bg-amber-500' : 'bg-indigo-600'}`}
                            style={{
                              width: `${Math.min(100, (enr.remainingSessions / enr.totalAllowedSessions) * 100)}%`
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Clinical Notes snippet */}
                {student.notes && (
                  <p className="mt-3 text-[11px] text-slate-500 italic line-clamp-2">
                    "{student.notes}"
                  </p>
                )}
              </div>

              {/* Action button */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={() => setViewingStudent(student)}
                  className="w-full py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-xl border border-indigo-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Clinical Record & Therapy History</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      <ViewStudentModal
        student={viewingStudent}
        isOpen={!!viewingStudent}
        onClose={() => setViewingStudent(null)}
      />

    </div>
  );
};
