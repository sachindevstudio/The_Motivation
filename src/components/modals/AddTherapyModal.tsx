import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle2 } from 'lucide-react';

interface AddTherapyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTherapyModal: React.FC<AddTherapyModalProps> = ({ isOpen, onClose }) => {
  const { addTherapy } = useApp();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [defaultMonthlyFee, setDefaultMonthlyFee] = useState(850);
  const [defaultPackageSessions, setDefaultPackageSessions] = useState(20);
  const [color, setColor] = useState('#6366f1');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    addTherapy({
      name,
      code: code.toUpperCase().trim(),
      description,
      defaultMonthlyFee: Number(defaultMonthlyFee) || 800,
      defaultPackageSessions: Number(defaultPackageSessions) || 20,
      color,
      active: true
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold">Add Therapy Service</h3>
            <p className="text-xs text-slate-400">Define default charges and monthly session allowance</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Therapy Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Speech & Language Therapy"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Service Code *</label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="e.g. SLT"
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none uppercase font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Theme Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="w-10 h-9 p-0.5 rounded-lg border border-slate-300 cursor-pointer"
                />
                <span className="text-xs font-mono text-slate-600">{color}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Default Monthly Fee (₹) *</label>
              <input
                type="number"
                required
                min={100}
                step={50}
                value={defaultMonthlyFee}
                onChange={e => setDefaultMonthlyFee(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Default Sessions/Month *</label>
              <input
                type="number"
                required
                min={1}
                max={50}
                value={defaultPackageSessions}
                onChange={e => setDefaultPackageSessions(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Therapy Description</label>
            <textarea
              rows={3}
              placeholder="Brief summary of therapeutic methodology and objectives..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
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
              <span>Create Therapy</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
