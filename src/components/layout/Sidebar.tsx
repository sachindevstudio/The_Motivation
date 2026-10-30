import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Sparkles,
  CalendarCheck,
  Video,
  FileCheck2,
  CreditCard,
  MessageSquare,
  BarChart3,
  Settings,
  PlusCircle,
  History,
  AlertOctagon,
  Clock
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentRole, activeTab, setActiveTab, sessions, payments, isMobileSidebarOpen, setIsMobileSidebarOpen } = useApp();

  const pendingVerificationCount = sessions.filter(
    s => s.status === 'awaiting_verification' || s.verificationStatus === 'pending_admin' || s.verificationStatus === 'mismatch'
  ).length;

  const pendingPaymentsCount = payments.filter(
    p => p.verificationStatus === 'awaiting_verification' || p.verificationStatus === 'pending'
  ).length;

  const secretaryPendingCount = sessions.filter(
    s => s.mode === 'offline' && s.verificationStatus === 'awaiting_secretary'
  ).length;

  // Navigation items based on role
  let navItems: { id: string; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [];

  if (currentRole === 'admin') {
    navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      { id: 'students', label: 'Students & Enrollments', icon: <Users className="w-4 h-4" /> },
      { id: 'teachers', label: 'Teachers & Therapists', icon: <GraduationCap className="w-4 h-4" /> },
      { id: 'therapies', label: 'Therapy Services', icon: <Sparkles className="w-4 h-4" /> },
      { id: 'sessions', label: 'All Sessions', icon: <CalendarCheck className="w-4 h-4" /> },
      { 
        id: 'online-monitor', 
        label: 'Online Monitoring', 
        icon: <Video className="w-4 h-4" />,
        badge: sessions.filter(s => s.status === 'live').length > 0 ? sessions.filter(s => s.status === 'live').length : undefined,
        badgeColor: 'bg-emerald-500 text-white'
      },
      { 
        id: 'offline-verification', 
        label: 'Offline Verification', 
        icon: <FileCheck2 className="w-4 h-4" />,
        badge: pendingVerificationCount > 0 ? pendingVerificationCount : undefined,
        badgeColor: 'bg-amber-500 text-white'
      },
      { 
        id: 'payments', 
        label: 'Fees & Payments', 
        icon: <CreditCard className="w-4 h-4" />,
        badge: pendingPaymentsCount > 0 ? pendingPaymentsCount : undefined,
        badgeColor: 'bg-indigo-500 text-white'
      },
      { id: 'whatsapp', label: 'WhatsApp Reminders', icon: <MessageSquare className="w-4 h-4" /> },
      { id: 'reports', label: 'Reports & Analytics', icon: <BarChart3 className="w-4 h-4" /> },
      { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
    ];
  } else if (currentRole === 'teacher') {
    navItems = [
      { id: 'dashboard', label: 'Teacher Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      { id: 'create-session', label: 'Create New Session', icon: <PlusCircle className="w-4 h-4" /> },
      { id: 'my-students', label: 'My Assigned Students', icon: <Users className="w-4 h-4" /> },
      { id: 'history', label: 'Session History', icon: <History className="w-4 h-4" /> }
    ];
  } else if (currentRole === 'secretary') {
    navItems = [
      { id: 'dashboard', label: 'Secretary Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      { 
        id: 'verify-offline', 
        label: 'Verify Offline Sessions', 
        icon: <FileCheck2 className="w-4 h-4" />,
        badge: secretaryPendingCount > 0 ? secretaryPendingCount : undefined,
        badgeColor: 'bg-amber-500 text-white'
      }
    ];
  }

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsMobileSidebarOpen(false);
  };

  const sidebarContent = (
    <>
      {/* Role descriptor pill */}
      <div className="p-4 border-b border-slate-800">
        <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Active Workspace</p>
          <div className="flex items-center justify-between mt-1">
            <span className="font-semibold text-white capitalize text-sm">
              {currentRole} Portal
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
              Live State
            </span>
          </div>
        </div>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    item.badgeColor || 'bg-slate-700 text-slate-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom organization info box */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500">
        <p className="font-semibold text-slate-400">The Motivation</p>
        <p className="mt-0.5">Therapy & Educational Centre</p>
        <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
          <span>Min. Threshold: 15m</span>
          <span className="text-emerald-400">● LocalStorage Sync</span>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <aside className="relative w-72 max-w-[80vw] bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
