export type UserRole = 'admin' | 'teacher' | 'secretary';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  teacherId?: string; // If role is teacher
}

export interface Therapy {
  id: string;
  name: string;
  code: string;
  description: string;
  defaultMonthlyFee: number;
  defaultPackageSessions: number;
  color: string;
  active: boolean;
}

export interface StudentEnrollment {
  id: string;
  studentId: string;
  therapyId: string;
  monthlyFee: number;
  totalAllowedSessions: number;
  sessionsConsumed: number;
  remainingSessions: number;
  membershipStartDate: string;
  membershipExpiryDate: string;
  paymentStatus: 'paid' | 'pending' | 'partially_paid' | 'overdue' | 'awaiting_verification';
}

export interface Student {
  id: string;
  studentCode: string;
  fullName: string;
  age: number;
  parentName: string;
  parentPhone: string;
  email?: string;
  registrationDate: string;
  status: 'active' | 'inactive';
  notes?: string;
  enrollments?: StudentEnrollment[];
}

export interface Teacher {
  id: string;
  teacherCode: string;
  name: string;
  phone: string;
  email: string;
  specialization: string;
  assignedTherapies: string[]; // Therapy IDs
  joiningDate: string;
  status: 'active' | 'on_leave' | 'inactive';
  avatar?: string;
}

export interface AttendanceInterval {
  joinTime: string;
  leaveTime?: string;
  durationMinutes: number;
}

export interface SessionParticipant {
  studentId: string;
  studentName: string;
  joined: boolean;
  joinTime?: string;
  leaveTime?: string;
  attendanceDurationMinutes: number;
  intervals?: AttendanceInterval[];
  eligibleForDeduction: boolean;
  deductionStatus: 'pending' | 'deducted' | 'below_threshold' | 'waived' | 'absent';
}

export type SessionMode = 'online' | 'offline';
export type SessionType = 'individual' | 'group';
export type SessionLifecycle = 
  | 'draft'
  | 'created'
  | 'waiting'
  | 'live'
  | 'completed'
  | 'interrupted'
  | 'awaiting_verification'
  | 'approved'
  | 'rejected'
  | 'cancelled';

export type VerificationStatus =
  | 'awaiting_secretary'
  | 'matched'
  | 'mismatch'
  | 'pending_admin'
  | 'approved'
  | 'rejected';

export interface SecretaryConfirmation {
  confirmedTeacherId: string;
  confirmedTeacherName: string;
  confirmedStudentIds: string[];
  confirmedDurationMinutes: number;
  confirmedAt: string;
  remarks: string;
  hasMismatch: boolean;
  mismatchDetails?: string;
}

export interface SessionRecord {
  id: string;
  sessionCode: string;
  date: string;
  teacherId: string;
  teacherName: string;
  therapyId: string;
  therapyName: string;
  mode: SessionMode;
  type: SessionType;
  scheduledStartTime: string;
  scheduledEndTime?: string;
  actualStartTime?: string;
  actualEndTime?: string;
  totalDurationMinutes: number;
  status: SessionLifecycle;
  verificationStatus: VerificationStatus;
  meetingRoomUrl?: string;
  meetingId?: string;
  participants: SessionParticipant[];
  teacherNotes?: string;
  secretaryNotes?: string;
  secretaryConfirmation?: SecretaryConfirmation;
  approvedBy?: string;
  approvedAt?: string;
  deductionApplied: boolean;
}

export interface PaymentRecord {
  id: string;
  receiptNumber: string;
  studentId: string;
  studentName: string;
  parentName: string;
  parentPhone: string;
  therapyId: string;
  therapyName: string;
  paymentMonth: string;
  dueDate: string;
  monthlyFee: number;
  amountPaid: number;
  pendingAmount: number;
  paymentDate?: string;
  paymentMethod?: 'UPI' | 'Bank Transfer' | 'Cash' | 'Cheque';
  transactionReference?: string;
  receiptScreenshotUrl?: string;
  verificationStatus: 'paid' | 'pending' | 'partially_paid' | 'overdue' | 'awaiting_verification';
  extensionApplied?: boolean;
  extensionSessionsAdded?: number;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
}

export interface OrgSettings {
  orgName: string;
  minAttendanceDurationMinutes: number;
  defaultSessionDurationMinutes: number;
  currencySymbol: string;
  supportPhone: string;
  supportEmail: string;
  allowOverdueToleranceDays: number;
}
