import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  Sparkles, 
  Shield, 
  GraduationCap, 
  ClipboardCheck, 
  Radio, 
  RotateCcw,
  ExternalLink,
  Menu
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    currentRole, 
    switchRole, 
    sessions, 
    setActiveTab,
    resetDemoData,
    toggleMobileSidebar
  } = useApp();

  const liveSessions = sessions.filter(s => s.status === 'live');

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Mobile hamburger & Logo & Org Title */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleMobileSidebar}
              className="p-2 -ml-1 text-slate-600 hover:text-slate-900 md:hidden rounded-lg hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-100 shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-lg tracking-tight">The Motivation</span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-violet-100 text-violet-800 rounded-full border border-violet-200">
                  MVP Demo
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Therapy & Educational Session Management</p>
            </div>
          </div>

          {/* Role Switcher Toolbar */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => switchRole('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'admin'
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>

            <button
              onClick={() => switchRole('teacher')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'teacher'
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Teacher Panel</span>
            </button>

            <button
              onClick={() => switchRole('secretary')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'secretary'
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>Secretary Panel</span>
            </button>
          </div>

          {/* Right action items */}
          <div className="flex items-center gap-3">
            {/* Live Session Counter */}
            {liveSessions.length > 0 && (
              <button
                onClick={() => {
                  if (currentRole === 'admin') setActiveTab('online-monitor');
                }}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium hover:bg-emerald-100 transition-colors cursor-pointer"
                title="Click to view live session monitor"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-semibold">{liveSessions.length} Live Session</span>
                <Radio className="w-3.5 h-3.5 text-emerald-600" />
              </button>
            )}

            {/* Reset Demo Data shortcut */}
            <button
              onClick={resetDemoData}
              title="Reset sample organization data"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Reset demo data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* User Identity chip */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-100"
              />
              <div className="text-left hidden lg:block">
                <p className="text-xs font-semibold text-slate-800 leading-none">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500 capitalize mt-0.5">{currentUser.role} role</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
