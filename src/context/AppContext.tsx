import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  OrgSettings,
  PaymentRecord,
  SessionRecord,
  Student,
  StudentEnrollment,
  Teacher,
  Therapy,
  UserProfile,
  UserRole
} from '../types';
import {
  INITIAL_ENROLLMENTS,
  INITIAL_ORG_SETTINGS,
  INITIAL_PAYMENTS,
  INITIAL_SESSIONS,
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_THERAPIES,
  INITIAL_USERS
} from '../data/mockData';
import {
  applySessionApprovalDeductions,
  calculateParticipantEligibility,
  checkOfflineMismatch
} from '../utils/rules';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface AppContextType {
  // Current user & role
  currentUser: UserProfile;
  currentRole: UserRole;
  allUsers: UserProfile[];
  switchRole: (role: UserRole) => void;
  switchUser: (userId: string) => void;

  // Active navigation tab
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;

  // Domain data
  orgSettings: OrgSettings;
  updateOrgSettings: (newSettings: Partial<OrgSettings>) => void;

  therapies: Therapy[];
  addTherapy: (therapy: Omit<Therapy, 'id'>) => void;
  updateTherapy: (therapy: Therapy) => void;

  teachers: Teacher[];
  addTeacher: (teacher: Omit<Teacher, 'id' | 'teacherCode'>) => void;
  updateTeacher: (teacher: Teacher) => void;

  students: Student[];
  enrollments: StudentEnrollment[];
  addStudent: (
    studentData: Omit<Student, 'id' | 'studentCode'>,
    enrollmentItems: { therapyId: string; monthlyFee: number; packageSessions: number }[]
  ) => void;
  updateStudent: (student: Student) => void;
  updateEnrollment: (enrollment: StudentEnrollment) => void;
  addEnrollment: (enrollment: Omit<StudentEnrollment, 'id'>) => void;

  sessions: SessionRecord[];
  createSession: (sessionData: Partial<SessionRecord>) => SessionRecord;
  updateSession: (session: SessionRecord) => void;
  approveSession: (sessionId: string) => void;
  rejectSession: (sessionId: string, reason?: string) => void;
  secretaryConfirmOfflineSession: (
    sessionId: string,
    confirmedStudentIds: string[],
    confirmedDurationMinutes: number,
    remarks: string
  ) => void;

  // Simulation controls for live & online sessions
  simulateStudentJoin: (sessionId: string, studentId: string) => void;
  simulateStudentLeave: (sessionId: string, studentId: string) => void;
  endOnlineSession: (sessionId: string) => void;

  // Payments
  payments: PaymentRecord[];
  verifyPayment: (paymentId: string, extendSessionsCount?: number) => void;
  rejectPayment: (paymentId: string, reason?: string) => void;
  addManualPayment: (payment: Omit<PaymentRecord, 'id' | 'receiptNumber'>) => void;

  // System
  resetDemoData: () => void;
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const STORAGE_KEY = 'the_motivation_app_state_v2';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from local storage or fallback to initial mocks
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]); // Default admin
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(prev => !prev);
  }, []);

  const [orgSettings, setOrgSettings] = useState<OrgSettings>(INITIAL_ORG_SETTINGS);
  const [therapies, setTherapies] = useState<Therapy[]>(INITIAL_THERAPIES);
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [enrollments, setEnrollments] = useState<StudentEnrollment[]>(INITIAL_ENROLLMENTS);
  const [sessions, setSessions] = useState<SessionRecord[]>(INITIAL_SESSIONS);
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage['type'], title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.orgSettings) setOrgSettings(parsed.orgSettings);
        if (parsed.therapies) setTherapies(parsed.therapies);
        if (parsed.teachers) setTeachers(parsed.teachers);
        if (parsed.students) setStudents(parsed.students);
        if (parsed.enrollments) setEnrollments(parsed.enrollments);
        if (parsed.sessions) setSessions(parsed.sessions);
        if (parsed.payments) setPayments(parsed.payments);
        if (parsed.currentUserId) {
          const u = INITIAL_USERS.find(user => user.id === parsed.currentUserId);
          if (u) setCurrentUser(u);
        }
      }
    } catch (e) {
      console.error('Failed to parse state from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to LocalStorage on updates
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const payload = {
        orgSettings,
        therapies,
        teachers,
        students,
        enrollments,
        sessions,
        payments,
        currentUserId: currentUser.id
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('Failed to persist state to localStorage', e);
    }
  }, [isLoaded, orgSettings, therapies, teachers, students, enrollments, sessions, payments, currentUser]);

  // Switch role helper
  const switchRole = useCallback((role: UserRole) => {
    const matching = INITIAL_USERS.find(u => u.role === role);
    if (matching) {
      setCurrentUser(matching);
      setActiveTab('dashboard');
      addToast('info', `Switched to ${role.toUpperCase()} View`, `Operating as ${matching.name}`);
    }
  }, [addToast]);

  const switchUser = useCallback((userId: string) => {
    const user = INITIAL_USERS.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setActiveTab('dashboard');
      addToast('info', `Active user changed`, `Logged in as ${user.name}`);
    }
  }, [addToast]);

  const updateOrgSettings = useCallback((newSettings: Partial<OrgSettings>) => {
    setOrgSettings(prev => ({ ...prev, ...newSettings }));
    addToast('success', 'Settings updated successfully');
  }, [addToast]);

  const addTherapy = useCallback((therapyData: Omit<Therapy, 'id'>) => {
    const newId = `th-${Date.now()}`;
    const newTherapy: Therapy = { ...therapyData, id: newId };
    setTherapies(prev => [...prev, newTherapy]);
    addToast('success', 'Therapy created', `${newTherapy.name} is now available for student enrollments.`);
  }, [addToast]);

  const updateTherapy = useCallback((therapy: Therapy) => {
    setTherapies(prev => prev.map(t => (t.id === therapy.id ? therapy : t)));
    addToast('success', 'Therapy updated');
  }, [addToast]);

  const addTeacher = useCallback((teacherData: Omit<Teacher, 'id' | 'teacherCode'>) => {
    const id = `tch-${Date.now()}`;
    const code = `TM-TCH-${Math.floor(10 + Math.random() * 90)}`;
    const newTeacher: Teacher = { ...teacherData, id, teacherCode: code };
    setTeachers(prev => [...prev, newTeacher]);
    addToast('success', 'Teacher added', `${newTeacher.name} has been added to staff.`);
  }, [addToast]);

  const updateTeacher = useCallback((teacher: Teacher) => {
    setTeachers(prev => prev.map(t => (t.id === teacher.id ? teacher : t)));
    addToast('success', 'Teacher profile updated');
  }, [addToast]);

  const addStudent = useCallback((
    studentData: Omit<Student, 'id' | 'studentCode'>,
    enrollmentItems: { therapyId: string; monthlyFee: number; packageSessions: number }[]
  ) => {
    const newStudentId = `stu-${Date.now()}`;
    const studentCode = `TM-STU-${Math.floor(100 + Math.random() * 899)}`;
    const newStudent: Student = {
      ...studentData,
      id: newStudentId,
      studentCode,
      registrationDate: new Date().toISOString().split('T')[0]
    };

    const newEnrollmentRecords: StudentEnrollment[] = enrollmentItems.map((item, idx) => ({
      id: `enr-${Date.now()}-${idx}`,
      studentId: newStudentId,
      therapyId: item.therapyId,
      monthlyFee: item.monthlyFee,
      totalAllowedSessions: item.packageSessions,
      sessionsConsumed: 0,
      remainingSessions: item.packageSessions,
      membershipStartDate: new Date().toISOString().split('T')[0],
      membershipExpiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      paymentStatus: 'pending'
    }));

    setStudents(prev => [newStudent, ...prev]);
    setEnrollments(prev => [...newEnrollmentRecords, ...prev]);
    addToast('success', 'Student enrolled', `${newStudent.fullName} registered with ${enrollmentItems.length} therapy package(s).`);
  }, [addToast]);

  const updateStudent = useCallback((student: Student) => {
    setStudents(prev => prev.map(s => (s.id === student.id ? student : s)));
    addToast('success', 'Student details updated');
  }, [addToast]);

  const updateEnrollment = useCallback((enrollment: StudentEnrollment) => {
    setEnrollments(prev => prev.map(e => (e.id === enrollment.id ? enrollment : e)));
    addToast('success', 'Enrollment updated');
  }, [addToast]);

  const addEnrollment = useCallback((enrollmentData: Omit<StudentEnrollment, 'id'>) => {
    const newEnrollment: StudentEnrollment = {
      ...enrollmentData,
      id: `enr-${Date.now()}`
    };
    setEnrollments(prev => [...prev, newEnrollment]);
    addToast('success', 'Therapy enrollment added');
  }, [addToast]);

  // Session lifecycle & creation
  const createSession = useCallback((sessionData: Partial<SessionRecord>): SessionRecord => {
    const id = `ses-${Date.now()}`;
    const sessionCode = `SES-2026-${Math.floor(100 + Math.random() * 899)}`;
    const newSession: SessionRecord = {
      id,
      sessionCode,
      date: sessionData.date || new Date().toISOString().split('T')[0],
      teacherId: sessionData.teacherId || currentUser.teacherId || 'tch-1',
      teacherName: sessionData.teacherName || currentUser.name,
      therapyId: sessionData.therapyId || 'th-psych',
      therapyName: sessionData.therapyName || 'Psychology',
      mode: sessionData.mode || 'online',
      type: sessionData.type || 'individual',
      scheduledStartTime: sessionData.scheduledStartTime || '11:00 AM',
      scheduledEndTime: sessionData.scheduledEndTime,
      actualStartTime: sessionData.actualStartTime,
      actualEndTime: sessionData.actualEndTime,
      totalDurationMinutes: sessionData.totalDurationMinutes || 45,
      status: sessionData.status || (sessionData.mode === 'online' ? 'waiting' : 'awaiting_verification'),
      verificationStatus: sessionData.verificationStatus || (sessionData.mode === 'online' ? 'pending_admin' : 'awaiting_secretary'),
      meetingRoomUrl: sessionData.meetingRoomUrl,
      meetingId: sessionData.meetingId,
      participants: sessionData.participants || [],
      teacherNotes: sessionData.teacherNotes,
      deductionApplied: false
    };

    setSessions(prev => [newSession, ...prev]);
    addToast(
      'success',
      `${newSession.mode === 'online' ? 'Online' : 'Offline'} Session Created`,
      `Session code: ${newSession.sessionCode} (${newSession.participants.length} students)`
    );
    return newSession;
  }, [currentUser, addToast]);

  const updateSession = useCallback((updated: SessionRecord) => {
    setSessions(prev => prev.map(s => (s.id === updated.id ? updated : s)));
  }, []);

  // Admin approves session -> triggers safe deduction
  const approveSession = useCallback((sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    if (session.deductionApplied) {
      addToast('warning', 'Already Approved', 'Package sessions were previously deducted for this session.');
      return;
    }

    const result = applySessionApprovalDeductions(session, enrollments, currentUser.name);
    setEnrollments(result.updatedEnrollments);
    setSessions(prev => prev.map(s => (s.id === sessionId ? result.updatedSession : s)));

    addToast(
      'success',
      'Session Approved & Verified',
      `Session ${session.sessionCode} approved. ${result.deductedStudentIds.length} eligible student package(s) deducted.`
    );
  }, [sessions, enrollments, currentUser.name, addToast]);

  const rejectSession = useCallback((sessionId: string, reason?: string) => {
    setSessions(prev =>
      prev.map(s =>
        s.id === sessionId
          ? {
              ...s,
              status: 'rejected',
              verificationStatus: 'rejected',
              secretaryNotes: reason || s.secretaryNotes
            }
          : s
      )
    );
    addToast('warning', 'Session Rejected', reason || 'The session was marked rejected by administration.');
  }, [addToast]);

  // Secretary independent confirmation
  const secretaryConfirmOfflineSession = useCallback((
    sessionId: string,
    confirmedStudentIds: string[],
    confirmedDurationMinutes: number,
    remarks: string
  ) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    const teacherStudentIds = session.participants.map(p => p.studentId);
    const mismatchCheck = checkOfflineMismatch(
      teacherStudentIds,
      confirmedStudentIds,
      session.totalDurationMinutes,
      confirmedDurationMinutes
    );

    const secretaryConf = {
      confirmedTeacherId: session.teacherId,
      confirmedTeacherName: session.teacherName,
      confirmedStudentIds,
      confirmedDurationMinutes,
      confirmedAt: new Date().toISOString(),
      remarks,
      hasMismatch: mismatchCheck.hasMismatch,
      mismatchDetails: mismatchCheck.details
    };

    // Update participants joined & eligibility based on secretary confirmation
    const updatedParticipants = session.participants.map(p => {
      const isConfirmedPresent = confirmedStudentIds.includes(p.studentId);
      const eligibility = calculateParticipantEligibility(
        isConfirmedPresent,
        confirmedDurationMinutes,
        orgSettings.minAttendanceDurationMinutes
      );
      return {
        ...p,
        joined: isConfirmedPresent,
        attendanceDurationMinutes: isConfirmedPresent ? confirmedDurationMinutes : 0,
        eligibleForDeduction: eligibility.eligible,
        deductionStatus: eligibility.deductionStatus
      };
    });

    const updatedSession: SessionRecord = {
      ...session,
      verificationStatus: mismatchCheck.hasMismatch ? 'mismatch' : 'matched',
      status: 'awaiting_verification',
      secretaryConfirmation: secretaryConf,
      secretaryNotes: remarks,
      participants: updatedParticipants
    };

    setSessions(prev => prev.map(s => (s.id === sessionId ? updatedSession : s)));

    if (mismatchCheck.hasMismatch) {
      addToast(
        'warning',
        'Attendance Mismatch Flagged!',
        `Secretary confirmed ${confirmedStudentIds.length} of ${teacherStudentIds.length} students. Sent for Admin review.`
      );
    } else {
      addToast('success', 'Secretary Confirmation Saved', 'Session attendance verified and matched. Ready for Admin approval.');
    }
  }, [sessions, orgSettings.minAttendanceDurationMinutes, addToast]);

  // Online meeting simulation helpers
  const simulateStudentJoin = useCallback((sessionId: string, studentId: string) => {
    setSessions(prev =>
      prev.map(s => {
        if (s.id !== sessionId) return s;
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const updatedParticipants = s.participants.map(p => {
          if (p.studentId !== studentId) return p;
          const currentDuration = p.attendanceDurationMinutes || 1;
          const eligibility = calculateParticipantEligibility(
            true,
            currentDuration,
            orgSettings.minAttendanceDurationMinutes
          );
          return {
            ...p,
            joined: true,
            joinTime: p.joinTime || timeStr,
            attendanceDurationMinutes: currentDuration,
            eligibleForDeduction: eligibility.eligible,
            deductionStatus: eligibility.deductionStatus
          };
        });

        return {
          ...s,
          status: 'live',
          participants: updatedParticipants
        };
      })
    );
    addToast('info', 'Student Joined (Simulated)', `Student participant connected to live room.`);
  }, [orgSettings.minAttendanceDurationMinutes, addToast]);

  const simulateStudentLeave = useCallback((sessionId: string, studentId: string) => {
    setSessions(prev =>
      prev.map(s => {
        if (s.id !== sessionId) return s;
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const updatedParticipants = s.participants.map(p => {
          if (p.studentId !== studentId) return p;
          // Calculate realistic duration if was joined
          const duration = Math.max(p.attendanceDurationMinutes, 22);
          const eligibility = calculateParticipantEligibility(
            true,
            duration,
            orgSettings.minAttendanceDurationMinutes
          );

          return {
            ...p,
            leaveTime: timeStr,
            attendanceDurationMinutes: duration,
            eligibleForDeduction: eligibility.eligible,
            deductionStatus: eligibility.deductionStatus
          };
        });

        return {
          ...s,
          participants: updatedParticipants
        };
      })
    );
    addToast('info', 'Student Left (Simulated)', `Participant leave event logged with timestamp.`);
  }, [orgSettings.minAttendanceDurationMinutes, addToast]);

  const endOnlineSession = useCallback((sessionId: string) => {
    setSessions(prev =>
      prev.map(s => {
        if (s.id !== sessionId) return s;
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Update participants eligibility based on final attendance duration
        const updatedParticipants = s.participants.map(p => {
          const duration = p.joined ? (p.attendanceDurationMinutes || s.totalDurationMinutes) : 0;
          const eligibility = calculateParticipantEligibility(
            p.joined,
            duration,
            orgSettings.minAttendanceDurationMinutes
          );
          return {
            ...p,
            attendanceDurationMinutes: duration,
            eligibleForDeduction: eligibility.eligible,
            deductionStatus: eligibility.deductionStatus
          };
        });

        return {
          ...s,
          status: 'awaiting_verification',
          verificationStatus: 'pending_admin',
          actualEndTime: timeStr,
          participants: updatedParticipants
        };
      })
    );
    addToast('success', 'Meeting Ended', 'Session completed and moved to Admin Verification queue.');
  }, [orgSettings.minAttendanceDurationMinutes, addToast]);

  // Payment operations
  const verifyPayment = useCallback((paymentId: string, extendSessionsCount?: number) => {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return;

    // Find enrollment for student & therapy
    const enrollment = enrollments.find(
      e => e.studentId === payment.studentId && e.therapyId === payment.therapyId
    );

    const sessionsToAdd = extendSessionsCount || enrollment?.totalAllowedSessions || 20;

    // Extend enrollment
    if (enrollment) {
      setEnrollments(prev =>
        prev.map(e =>
          e.id === enrollment.id
            ? {
                ...e,
                remainingSessions: e.remainingSessions + sessionsToAdd,
                paymentStatus: 'paid',
                membershipExpiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
              }
            : e
        )
      );
    }

    // Update payment record
    setPayments(prev =>
      prev.map(p =>
        p.id === paymentId
          ? {
              ...p,
              verificationStatus: 'paid',
              amountPaid: p.monthlyFee,
              pendingAmount: 0,
              paymentDate: new Date().toISOString().split('T')[0],
              extensionApplied: true,
              extensionSessionsAdded: sessionsToAdd,
              verifiedBy: currentUser.name,
              verifiedAt: new Date().toISOString()
            }
          : p
      )
    );

    addToast(
      'success',
      'Payment Verified & Package Extended',
      `Payment of ₹${payment.monthlyFee} approved. ${sessionsToAdd} sessions added to student package balance.`
    );
  }, [payments, enrollments, currentUser.name, addToast]);

  const rejectPayment = useCallback((paymentId: string, reason?: string) => {
    setPayments(prev =>
      prev.map(p =>
        p.id === paymentId
          ? {
              ...p,
              verificationStatus: 'pending',
              notes: `Rejected: ${reason || 'Invalid screenshot or unconfirmed bank transaction'}`
            }
          : p
      )
    );
    addToast('warning', 'Payment Rejected', reason || 'Payment receipt rejected. Parent will be notified.');
  }, [addToast]);

  const addManualPayment = useCallback((paymentData: Omit<PaymentRecord, 'id' | 'receiptNumber'>) => {
    const id = `pay-${Date.now()}`;
    const receiptNumber = `RCP-2026-${Math.floor(100 + Math.random() * 899)}`;
    const newPayment: PaymentRecord = {
      ...paymentData,
      id,
      receiptNumber
    };
    setPayments(prev => [newPayment, ...prev]);
    addToast('success', 'Payment Recorded', `Receipt #${receiptNumber} added.`);
  }, [addToast]);

  const resetDemoData = useCallback(() => {
    setOrgSettings(INITIAL_ORG_SETTINGS);
    setTherapies(INITIAL_THERAPIES);
    setTeachers(INITIAL_TEACHERS);
    setStudents(INITIAL_STUDENTS);
    setEnrollments(INITIAL_ENROLLMENTS);
    setSessions(INITIAL_SESSIONS);
    setPayments(INITIAL_PAYMENTS);
    localStorage.removeItem(STORAGE_KEY);
    addToast('info', 'Demo Data Reset', 'Application restored to default realistic organization data.');
  }, [addToast]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole: currentUser.role,
        allUsers: INITIAL_USERS,
        switchRole,
        switchUser,
        activeTab,
        setActiveTab,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        toggleMobileSidebar,
        orgSettings,
        updateOrgSettings,
        therapies,
        addTherapy,
        updateTherapy,
        teachers,
        addTeacher,
        updateTeacher,
        students,
        enrollments,
        addStudent,
        updateStudent,
        updateEnrollment,
        addEnrollment,
        sessions,
        createSession,
        updateSession,
        approveSession,
        rejectSession,
        secretaryConfirmOfflineSession,
        simulateStudentJoin,
        simulateStudentLeave,
        endOnlineSession,
        payments,
        verifyPayment,
        rejectPayment,
        addManualPayment,
        resetDemoData,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
