import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle2 } from 'lucide-react';

interface AddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTeacherModal: React.FC<AddTeacherModalProps> = ({ isOpen, onClose }) => {
  const { therapies, addTeacher } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 98');
  const [email, setEmail] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [assignedTherapies, setAssignedTherapies] = useState<string[]>([therapies[0]?.id || 'th-psych']);
  const [status, setStatus] = useState<'active' | 'on_leave' | 'inactive'>('active');

  if (!isOpen) return null;

  const toggleTherapy = (id: string) => {
    setAssignedTherapies(prev =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter(t => t !== id) : prev) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim()) return;

    addTeacher({
      name,
      phone,
      email,
      specialization: specialization || 'General Therapy & Education',
      assignedTherapies,
      joiningDate: new Date().toISOString().split('T')[0],
      status
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold">Add Teacher / Therapist</h3>
            <p className="text-xs text-slate-400">Assign specialization and available therapies</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name & Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Priya Sen, M.Sc. Psychology"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="+91 98111 22334"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="teacher@themotivation.demo"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Specialization</label>
            <input
              type="text"
              placeholder="e.g. Cognitive Behavioural Therapy, ADHD & Sensory Integration"
              value={specialization}
              onChange={e => setSpecialization(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Assigned Therapies</label>
            <div className="grid grid-cols-2 gap-2">
              {therapies.map(t => (
                <label
                  key={t.id}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                    assignedTherapies.includes(t.id)
                      ? 'border-indigo-500 bg-indigo-50/50 text-indigo-900 font-semibold'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={assignedTherapies.includes(t.id)}
                    onChange={() => toggleTherapy(t.id)}
                    className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  />
                  <span>{t.name}</span>
                </label>
              ))}
            </div>
          </div>

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
              <span>Save Teacher</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
