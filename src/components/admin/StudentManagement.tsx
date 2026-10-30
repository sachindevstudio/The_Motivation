import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { AddStudentModal } from '../modals/AddStudentModal';
import { ViewStudentModal } from '../modals/ViewStudentModal';
import { WhatsAppModal } from '../modals/WhatsAppModal';
import { formatDateIndian } from '../../utils/rules';
import {
  Users,
  Search,
  Plus,
  Filter,
  MessageSquare,
  Eye,
  Sparkles,
  Phone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const StudentManagement: React.FC = () => {
  const { students, enrollments, therapies } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTherapyFilter, setSelectedTherapyFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [whatsappStudent, setWhatsappStudent] = useState<Student | null>(null);

  // Filter students
  const filteredStudents = students.filter(student => {
    const studentEnrollments = enrollments.filter(e => e.studentId === student.id);

    const matchesSearch =
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.parentPhone.includes(searchTerm);

    const matchesTherapy =
      selectedTherapyFilter === 'all' ||
      studentEnrollments.some(e => e.therapyId === selectedTherapyFilter);

    const matchesStatus =
      selectedStatusFilter === 'all' || student.status === selectedStatusFilter;

    return matchesSearch && matchesTherapy && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Student & Enrollment Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {students.length} Students
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage student registrations, multi-therapy package allowances, remaining session balances, and parent WhatsApp communications.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by student name, ID (e.g. TM-STU-101), or parent phone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Therapy Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <select
            value={selectedTherapyFilter}
            onChange={e => setSelectedTherapyFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="all">All Therapies</option>
            {therapies.map(t => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={e => setSelectedStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Students Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-3.5 pl-5">Student Info</th>
                <th className="p-3.5">Parent / Contact</th>
                <th className="p-3.5">Enrolled Therapies & Remaining Balances</th>
                <th className="p-3.5">Total Remaining</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right pr-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 italic">
                    No students match the current search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => {
                  const studentEnrollments = enrollments.filter(e => e.studentId === student.id);
                  const totalRemainingSessions = studentEnrollments.reduce(
                    (acc, curr) => acc + curr.remainingSessions,
                    0
                  );

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & Code */}
                      <td className="p-3.5 pl-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-sm">
                            {student.fullName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 text-sm block">
                              {student.fullName}
                            </span>
                            <span className="font-mono text-[10px] text-slate-500">
                              {student.studentCode} • {student.age} yrs
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Parent Contact */}
                      <td className="p-3.5">
                        <span className="font-medium text-slate-800 block">{student.parentName}</span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          {student.parentPhone}
                        </span>
                      </td>

                      {/* Enrolled Therapies & Remaining Balance Badges */}
                      <td className="p-3.5">
                        <div className="flex flex-wrap gap-1.5 max-w-md">
                          {studentEnrollments.map(enr => {
                            const th = therapies.find(t => t.id === enr.therapyId);
                            const isLow = enr.remainingSessions <= 3;
                            return (
                              <span
                                key={enr.id}
                                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[11px] font-medium ${
                                  isLow
                                    ? 'bg-amber-50 text-amber-900 border-amber-200 font-semibold'
                                    : 'bg-indigo-50/60 text-indigo-900 border-indigo-100'
                                }`}
                                title={`Monthly Fee: ₹${enr.monthlyFee}`}
                              >
                                <span>{th?.name || 'Therapy'}:</span>
                                <span className="font-bold">
                                  {enr.remainingSessions}/{enr.totalAllowedSessions}
                                </span>
                              </span>
                            );
                          })}
                        </div>
                      </td>

                      {/* Total Remaining count */}
                      <td className="p-3.5">
                        <span className="font-black text-slate-900 text-sm">
                          {totalRemainingSessions}
                        </span>
                        <span className="text-[10px] text-slate-500 block">sessions left</span>
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            student.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right pr-5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setWhatsappStudent(student)}
                            title="Send WhatsApp Reminder"
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 border border-emerald-200 transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setViewingStudent(student)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs border border-indigo-200 transition-colors flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>
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

      {/* Modals */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <ViewStudentModal
        student={viewingStudent}
        isOpen={!!viewingStudent}
        onClose={() => setViewingStudent(null)}
      />

      <WhatsAppModal
        student={whatsappStudent}
        isOpen={!!whatsappStudent}
        onClose={() => setWhatsappStudent(null)}
      />

    </div>
  );
};
