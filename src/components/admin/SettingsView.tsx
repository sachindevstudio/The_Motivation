import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RotateCcw, Save, Shield, Clock, Phone, Mail, CheckCircle2, AlertTriangle } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { orgSettings, updateOrgSettings, resetDemoData } = useApp();

  const [minThreshold, setMinThreshold] = useState(orgSettings.minAttendanceDurationMinutes);
  const [defaultDuration, setDefaultDuration] = useState(orgSettings.defaultSessionDurationMinutes);
  const [orgName, setOrgName] = useState(orgSettings.orgName);
  const [supportPhone, setSupportPhone] = useState(orgSettings.supportPhone);
  const [supportEmail, setSupportEmail] = useState(orgSettings.supportEmail);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrgSettings({
      minAttendanceDurationMinutes: Number(minThreshold) || 15,
      defaultSessionDurationMinutes: Number(defaultDuration) || 45,
      orgName,
      supportPhone,
      supportEmail
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">System & Organization Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure clinical attendance thresholds, default session parameters, and demo data lifecycle.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Threshold & Session Logic Settings */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Clock className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">Attendance Duration & Deduction Thresholds</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Minimum Attendance Duration Threshold (Minutes) *
              </label>
              <input
                type="number"
                min={5}
                max={45}
                required
                value={minThreshold}
                onChange={e => setMinThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-indigo-700"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Students attending below this duration will NOT be charged from their session package when the session is approved.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Default Scheduled Session Duration (Minutes) *
              </label>
              <input
                type="number"
                min={20}
                max={90}
                required
                value={defaultDuration}
                onChange={e => setDefaultDuration(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-slate-800"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Pre-filled duration for new individual and group therapy meetings.
              </p>
            </div>
          </div>
        </div>

        {/* Organization Identity Settings */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Shield className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">Organization Details</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Organization Name</label>
              <input
                type="text"
                required
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={supportPhone}
                onChange={e => setSupportPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={e => setSupportEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>

      </form>

      {/* Demo Reset Card */}
      <div className="bg-rose-50/60 p-6 rounded-2xl border border-rose-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h3 className="font-bold text-rose-950 text-sm">Demo Data & Cache Management</h3>
          </div>
        </div>

        <p className="text-xs text-rose-900 leading-relaxed">
          Restore the application to the pristine initial state with 14 sample students (including Aarav Sharma with 3 therapies), 8 therapists, active live sessions, mismatch scenarios, and pending fee records.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={resetDemoData}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data to Initial State</span>
          </button>
        </div>
      </div>

    </div>
  );
};
