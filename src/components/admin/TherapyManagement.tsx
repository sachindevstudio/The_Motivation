import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Therapy } from '../../types';
import { AddTherapyModal } from '../modals/AddTherapyModal';
import { formatCurrency } from '../../utils/rules';
import { Sparkles, Plus, CheckCircle2, XCircle, Info, Edit2 } from 'lucide-react';

export const TherapyManagement: React.FC = () => {
  const { therapies, updateTherapy, enrollments, sessions } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTherapy, setEditingTherapy] = useState<Therapy | null>(null);

  const toggleActive = (therapy: Therapy) => {
    updateTherapy({ ...therapy, active: !therapy.active });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTherapy) return;
    updateTherapy(editingTherapy);
    setEditingTherapy(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Therapy Services & Default Packages</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {therapies.length} Disciplines
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure default monthly tariffs and package session allowances for new student registrations.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Therapy</span>
        </button>
      </div>

      {/* Notice Banner */}
      <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-start gap-3 text-xs text-blue-900">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Individual Student Fee Customization: </span>
          Default tariffs set here serve as the baseline for new enrollments. You can always set individual customized monthly rates (e.g. ₹800 vs ₹900) per student during enrollment or in their profile.
        </div>
      </div>

      {/* Therapies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {therapies.map(therapy => {
          const enrolledCount = enrollments.filter(e => e.therapyId === therapy.id).length;
          const sessionCount = sessions.filter(s => s.therapyId === therapy.id).length;

          return (
            <div
              key={therapy.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Title & Status */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-xs"
                      style={{ backgroundColor: therapy.color }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base">{therapy.name}</h3>
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          {therapy.code}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase ${therapy.active ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {therapy.active ? '● Active Offering' : '○ Inactive'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setEditingTherapy(therapy)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors"
                    title="Edit default tariffs"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {therapy.description}
                </p>

                {/* Default Package Parameters */}
                <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium block">Default Monthly Charge:</span>
                    <span className="font-black text-slate-900 text-base">
                      {formatCurrency(therapy.defaultMonthlyFee)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">per student/month</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Default Session Package:</span>
                    <span className="font-black text-indigo-700 text-base">
                      {therapy.defaultPackageSessions} Sessions
                    </span>
                    <span className="text-[10px] text-slate-400 block">included in monthly fee</span>
                  </div>
                </div>
              </div>

              {/* Stats & Toggle */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                  <span>{enrolledCount} Students Enrolled</span>
                  <span>•</span>
                  <span>{sessionCount} Sessions Conducted</span>
                </div>

                <button
                  onClick={() => toggleActive(therapy)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                    therapy.active
                      ? 'border-slate-300 text-slate-700 hover:bg-slate-100'
                      : 'border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                  }`}
                >
                  {therapy.active ? 'Deactivate' : 'Activate Service'}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      <AddTherapyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Edit Therapy Inline Modal */}
      {editingTherapy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Edit Therapy Defaults: {editingTherapy.name}</h3>
            
            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Therapy Name</label>
                <input
                  type="text"
                  required
                  value={editingTherapy.name}
                  onChange={e => setEditingTherapy({ ...editingTherapy, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Default Fee (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingTherapy.defaultMonthlyFee}
                    onChange={e =>
                      setEditingTherapy({ ...editingTherapy, defaultMonthlyFee: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Default Sessions/Month</label>
                  <input
                    type="number"
                    required
                    value={editingTherapy.defaultPackageSessions}
                    onChange={e =>
                      setEditingTherapy({
                        ...editingTherapy,
                        defaultPackageSessions: Number(e.target.value)
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingTherapy.description}
                  onChange={e => setEditingTherapy({ ...editingTherapy, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingTherapy(null)}
                  className="px-3 py-1.5 border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
