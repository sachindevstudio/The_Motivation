import { SessionParticipant, SessionRecord, StudentEnrollment } from '../types';

/**
 * Checks whether an online/offline participant qualifies for package session deduction.
 * Only participants who actually attended AND met the minimum duration threshold are eligible.
 */
export function calculateParticipantEligibility(
  joined: boolean,
  attendanceDurationMinutes: number,
  minThresholdMinutes: number = 15
): { eligible: boolean; reason: string; deductionStatus: SessionParticipant['deductionStatus'] } {
  if (!joined) {
    return {
      eligible: false,
      reason: 'Student did not join the session.',
      deductionStatus: 'absent'
    };
  }

  if (attendanceDurationMinutes < minThresholdMinutes) {
    return {
      eligible: false,
      reason: `Attended ${attendanceDurationMinutes}m, which is below the minimum required threshold of ${minThresholdMinutes}m.`,
      deductionStatus: 'below_threshold'
    };
  }

  return {
    eligible: true,
    reason: `Attended ${attendanceDurationMinutes}m (met >= ${minThresholdMinutes}m threshold).`,
    deductionStatus: 'pending'
  };
}

/**
 * Compares teacher-submitted session details against secretary-confirmed offline details.
 * Flags mismatches in attendance or duration.
 */
export function checkOfflineMismatch(
  teacherStudentIds: string[],
  secretaryStudentIds: string[],
  teacherDurationMinutes: number,
  secretaryDurationMinutes: number
): {
  hasMismatch: boolean;
  details: string;
  missingFromSecretary: string[];
  extraInSecretary: string[];
  durationDiffMinutes: number;
} {
  const teacherSet = new Set(teacherStudentIds);
  const secretarySet = new Set(secretaryStudentIds);

  const missingFromSecretary = teacherStudentIds.filter(id => !secretarySet.has(id));
  const extraInSecretary = secretaryStudentIds.filter(id => !teacherSet.has(id));
  const durationDiffMinutes = Math.abs(teacherDurationMinutes - secretaryDurationMinutes);

  const reasons: string[] = [];
  if (missingFromSecretary.length > 0) {
    reasons.push(`${missingFromSecretary.length} student(s) submitted by teacher were not confirmed by secretary`);
  }
  if (extraInSecretary.length > 0) {
    reasons.push(`${extraInSecretary.length} student(s) confirmed by secretary were not in teacher submission`);
  }
  if (durationDiffMinutes > 10) {
    reasons.push(`Duration discrepancy: Teacher submitted ${teacherDurationMinutes}m, Secretary recorded ${secretaryDurationMinutes}m`);
  }

  const hasMismatch = reasons.length > 0;
  return {
    hasMismatch,
    details: hasMismatch ? reasons.join('; ') : 'Both teacher submission and secretary records match perfectly.',
    missingFromSecretary,
    extraInSecretary,
    durationDiffMinutes
  };
}

/**
 * Safe session package deduction on Admin Approval.
 * Prevents double deductions and ensures only eligible students have their balance decremented.
 */
export function applySessionApprovalDeductions(
  session: SessionRecord,
  enrollments: StudentEnrollment[],
  adminName: string = 'Admin Staff'
): {
  updatedEnrollments: StudentEnrollment[];
  updatedSession: SessionRecord;
  deductedStudentIds: string[];
  skippedStudentIds: string[];
} {
  // Guard against duplicate deduction
  if (session.deductionApplied) {
    return {
      updatedEnrollments: enrollments,
      updatedSession: session,
      deductedStudentIds: [],
      skippedStudentIds: session.participants.map(p => p.studentId)
    };
  }

  const updatedEnrollments = [...enrollments];
  const deductedStudentIds: string[] = [];
  const skippedStudentIds: string[] = [];

  const updatedParticipants = session.participants.map(participant => {
    if (participant.eligibleForDeduction && participant.joined) {
      // Find the student's enrollment for this specific therapy
      const enrollmentIndex = updatedEnrollments.findIndex(
        e => e.studentId === participant.studentId && e.therapyId === session.therapyId
      );

      if (enrollmentIndex !== -1) {
        const currentEnrollment = updatedEnrollments[enrollmentIndex];
        const newRemaining = Math.max(0, currentEnrollment.remainingSessions - 1);
        const newConsumed = currentEnrollment.sessionsConsumed + 1;

        updatedEnrollments[enrollmentIndex] = {
          ...currentEnrollment,
          remainingSessions: newRemaining,
          sessionsConsumed: newConsumed
        };

        deductedStudentIds.push(participant.studentId);
        return {
          ...participant,
          deductionStatus: 'deducted' as const
        };
      }
    }

    skippedStudentIds.push(participant.studentId);
    return {
      ...participant,
      deductionStatus: participant.joined ? ('below_threshold' as const) : ('absent' as const)
    };
  });

  const updatedSession: SessionRecord = {
    ...session,
    status: 'approved',
    verificationStatus: 'approved',
    deductionApplied: true,
    approvedBy: adminName,
    approvedAt: new Date().toISOString(),
    participants: updatedParticipants
  };

  return {
    updatedEnrollments,
    updatedSession,
    deductedStudentIds,
    skippedStudentIds
  };
}

/**
 * Cleans phone numbers and generates valid WhatsApp click-to-chat links.
 */
export function generateWhatsAppUrl(phone: string, text: string): string {
  // Strip non-digits
  const digits = phone.replace(/\D/g, '');
  // If 10 digits (standard Indian mobile), prepend 91
  const fullNumber = digits.length === 10 ? `91${digits}` : digits;
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${fullNumber}?text=${encodedText}`;
}

/**
 * Generates pre-filled professional reminder messages.
 */
export function generatePrefilledWhatsAppMessage(
  type: 'payment_reminder' | 'expiry_reminder' | 'session_invite' | 'custom',
  data: {
    studentName: string;
    parentName?: string;
    therapyName?: string;
    amount?: number;
    dueDate?: string;
    expiryDate?: string;
    sessionTime?: string;
    meetingUrl?: string;
    customMsg?: string;
  }
): string {
  const greeting = data.parentName ? `Dear ${data.parentName},` : `Hello,`;
  const orgSignature = `\n\nWarm regards,\nThe Motivation — Therapy & Educational Centre\n📞 +91 98765 43210`;

  switch (type) {
    case 'payment_reminder':
      return `${greeting} This is a friendly reminder from The Motivation regarding monthly fees for ${data.studentName} for ${data.therapyName || 'therapy sessions'}. Amount due is ₹${data.amount?.toLocaleString('en-IN') || 0} by ${data.dueDate || 'this week'}. Kindly complete the payment and share the screenshot. Thank you!${orgSignature}`;

    case 'expiry_reminder':
      return `${greeting} Greetings from The Motivation. The therapy package for ${data.studentName} (${data.therapyName || 'Therapy'}) is expiring on ${data.expiryDate || 'soon'}. To ensure uninterrupted sessions, please renew the monthly package.${orgSignature}`;

    case 'session_invite':
      return `${greeting} Your upcoming online ${data.therapyName || 'therapy'} session for ${data.studentName} is scheduled for ${data.sessionTime || 'today'}. Join via this secure link: ${data.meetingUrl || 'Link will be shared shortly'}.${orgSignature}`;

    case 'custom':
    default:
      return `${greeting} ${data.customMsg || ''}${orgSignature}`;
  }
}

/**
 * Indian Rupee currency formatter
 */
export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Indian readable date formatter: DD MMM YYYY
 */
export function formatDateIndian(dateInput: string | Date | undefined): string {
  if (!dateInput) return '-';
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return String(dateInput);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return String(dateInput);
  }
}
