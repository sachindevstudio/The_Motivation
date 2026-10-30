import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';

// Admin Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentManagement } from './components/admin/StudentManagement';
import { TeacherManagement } from './components/admin/TeacherManagement';
import { TherapyManagement } from './components/admin/TherapyManagement';
import { SessionManagement } from './components/admin/SessionManagement';
import { OnlineSessionMonitoring } from './components/admin/OnlineSessionMonitoring';
import { OfflineSessionVerification } from './components/admin/OfflineSessionVerification';
import { PaymentManagement } from './components/admin/PaymentManagement';
import { WhatsAppReminders } from './components/admin/WhatsAppReminders';
import { ReportsAnalytics } from './components/admin/ReportsAnalytics';
import { SettingsView } from './components/admin/SettingsView';

// Teacher Views
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { TeacherStudents } from './components/teacher/TeacherStudents';
import { CreateSessionWizard } from './components/teacher/CreateSessionWizard';
import { TeacherSessionHistory } from './components/teacher/TeacherSessionHistory';

// Secretary Views
import { SecretaryDashboard } from './components/secretary/SecretaryDashboard';
import { VerifyOfflineView } from './components/secretary/VerifyOfflineView';

import { Sparkles, Key, PlayCircle, Shield, GraduationCap, ClipboardCheck } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentRole, activeTab, switchRole, setActiveTab } = useApp();

  // Route selector
  const renderContent = () => {
    if (currentRole === 'admin') {
      switch (activeTab) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'students':
          return <StudentManagement />;
        case 'teachers':
          return <TeacherManagement />;
        case 'therapies':
          return <TherapyManagement />;
        case 'sessions':
          return <SessionManagement />;
        case 'online-monitor':
          return <OnlineSessionMonitoring />;
        case 'offline-verification':
          return <OfflineSessionVerification />;
        case 'payments':
          return <PaymentManagement />;
        case 'whatsapp':
          return <WhatsAppReminders />;
        case 'reports':
          return <ReportsAnalytics />;
        case 'settings':
          return <SettingsView />;
        default:
          return <AdminDashboard />;
      }
    } else if (currentRole === 'teacher') {
      switch (activeTab) {
        case 'dashboard':
          return <TeacherDashboard />;
        case 'my-students':
          return <TeacherStudents />;
        case 'create-session':
          return <CreateSessionWizard />;
        case 'history':
          return <TeacherSessionHistory />;
        default:
          return <TeacherDashboard />;
      }
    } else if (currentRole === 'secretary') {
      switch (activeTab) {
        case 'dashboard':
          return <SecretaryDashboard />;
        case 'verify-offline':
          return <VerifyOfflineView />;
        default:
          return <SecretaryDashboard />;
      }
    }

    return <AdminDashboard />;
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-800 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Header />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Content View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderContent()}
        </main>
      </div>

      {/* Demo Scenario Guide & Fast Switcher Floating Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-2.5 px-4 z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Key className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[11px] font-semibold text-slate-300">Fast Demo Scenario Switcher:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <button
              onClick={() => {
                switchRole('admin');
                setActiveTab('students');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition-colors"
            >
              1. Add Student & Multi-Therapy
            </button>

            <button
              onClick={() => {
                switchRole('teacher');
                setActiveTab('create-session');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-900/60 font-medium transition-colors"
            >
              2. Online Session Wizard
            </button>

            <button
              onClick={() => {
                switchRole('secretary');
                setActiveTab('verify-offline');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-900/60 font-medium transition-colors"
            >
              3. Offline Register Mismatch
            </button>

            <button
              onClick={() => {
                switchRole('admin');
                setActiveTab('payments');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-900/60 font-medium transition-colors"
            >
              4. Payment Proof & Package Extension
            </button>

            <button
              onClick={() => {
                switchRole('admin');
                setActiveTab('whatsapp');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-900/60 font-medium transition-colors"
            >
              5. WhatsApp Reminders
            </button>

            <button
              onClick={() => {
                switchRole('admin');
                setActiveTab('reports');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-900/60 font-medium transition-colors"
            >
              6. Staff Payroll Hours CSV
            </button>
          </div>
        </div>
      </footer>

      {/* Toast Alert Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
