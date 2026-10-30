import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose }) => {
  const { therapies, addStudent } = useApp();

  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number>(8);
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('+91 98');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  // Selected enrollments with custom fees and package allowances
  const [selectedEnrollments, setSelectedEnrollments] = useState<
    { therapyId: string; monthlyFee: number; packageSessions: number }[]
  >([
    { therapyId: therapies[0]?.id || 'th-psych', monthlyFee: 800, packageSessions: 20 }
  ]);

  if (!isOpen) return null;

  const handleToggleTherapy = (therapyId: string) => {
    const exists = selectedEnrollments.find(e => e.therapyId === therapyId);
    if (exists) {
      if (selectedEnrollments.length === 1) return; // Keep at least one
      setSelectedEnrollments(prev => prev.filter(e => e.therapyId !== therapyId));
    } else {
      const therapy = therapies.find(t => t.id === therapyId);
      setSelectedEnrollments(prev => [
        ...prev,
        {
          therapyId,
          monthlyFee: therapy?.defaultMonthlyFee || 800,
          packageSessions: therapy?.defaultPackageSessions || 20
        }
      ]);
    }
  };

  const handleUpdateFee = (therapyId: string, fee: number) => {
    setSelectedEnrollments(prev =>
      prev.map(e => (e.therapyId === therapyId ? { ...e, monthlyFee: fee } : e))
    );
  };

  const handleUpdateSessions = (therapyId: string, sessions: number) => {
    setSelectedEnrollments(prev =>
      prev.map(e => (e.therapyId === therapyId ? { ...e, packageSessions: sessions } : e))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !parentName.trim() || !parentPhone.trim()) {
      return;
    }

    addStudent(
      {
        fullName,
        age: Number(age) || 8,
        parentName,
        parentPhone,
        email: email || undefined,
        registrationDate: new Date().toISOString().split('T')[0],
        status: 'active',
        notes: notes || undefined
      },
      selectedEnrollments
    );

    onClose();
  };

  const totalMonthlyFee = selectedEnrollments.reduce((acc, curr) => acc + curr.monthlyFee, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-8">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold">Register New Student</h3>
            <p className="text-xs text-slate-400">Enroll student and customize individual therapy packages</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Basic Student Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Student Details</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Age (Years) *</label>
                <input
                  type="number"
                  required
                  min={3}
                  max={21}
                  value={age}
                  onChange={e => setAge(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Parent / Guardian Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Sharma"
                  value={parentName}
                  onChange={e => setParentName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Parent WhatsApp / Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 12340"
                  value={parentPhone}
                  onChange={e => setParentPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Parent Email (Optional)</label>
              <input
                type="email"
                placeholder="parent@example.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Multiple Therapy Enrollments */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Therapy Enrollments & Packages
                </h4>
                <p className="text-xs text-slate-500">Each student can be enrolled in multiple therapies with custom monthly fees</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500">Total Monthly Fee:</span>
                <span className="ml-1 text-sm font-bold text-indigo-700">₹{totalMonthlyFee.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Therapy selection list */}
            <div className="space-y-2.5">
              {therapies.map(therapy => {
                const enrollment = selectedEnrollments.find(e => e.therapyId === therapy.id);
                const isSelected = !!enrollment;

                return (
                  <div
                    key={therapy.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-indigo-300 bg-indigo-50/40 shadow-xs'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleTherapy(therapy.id)}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-900">{therapy.name}</span>
                          <span className="ml-2 text-[10px] text-slate-500 uppercase px-1.5 py-0.5 rounded bg-white border border-slate-200">
                            {therapy.code}
                          </span>
                        </div>
                      </label>

                      {isSelected && (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] text-slate-600 font-medium">Fee (₹):</span>
                            <input
                              type="number"
                              min={0}
                              step={50}
                              value={enrollment.monthlyFee}
                              onChange={e => handleUpdateFee(therapy.id, Number(e.target.value))}
                              className="w-20 px-2 py-1 text-xs border border-slate-300 rounded-lg bg-white font-semibold text-slate-900 focus:ring-1 focus:ring-indigo-500 outline-none"
                            />
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] text-slate-600 font-medium">Sessions:</span>
                            <input
                              type="number"
                              min={1}
                              max={60}
                              value={enrollment.packageSessions}
                              onChange={e => handleUpdateSessions(therapy.id, Number(e.target.value))}
                              className="w-16 px-2 py-1 text-xs border border-slate-300 rounded-lg bg-white font-semibold text-slate-900 focus:ring-1 focus:ring-indigo-500 outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clinical / Educational Notes */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Initial Clinical / Educational Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Focus on verbal prompts and visual charts. Sensory sensitivity to loud background noise."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Enroll Student</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
