import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateParticipantEligibility,
  checkOfflineMismatch,
  applySessionApprovalDeductions,
  generateWhatsAppUrl,
  generatePrefilledWhatsAppMessage,
  formatCurrency
} from './rules';
import { SessionRecord, StudentEnrollment } from '../types';

test('calculateParticipantEligibility verifies threshold logic', () => {
  // Absent student
  const absentResult = calculateParticipantEligibility(false, 30, 15);
  assert.equal(absentResult.eligible, false);
  assert.equal(absentResult.deductionStatus, 'absent');

  // Attended below threshold (e.g. 10m < 15m)
  const lowResult = calculateParticipantEligibility(true, 10, 15);
  assert.equal(lowResult.eligible, false);
  assert.equal(lowResult.deductionStatus, 'below_threshold');

  // Attended exactly or above threshold (e.g. 20m >= 15m)
  const okResult = calculateParticipantEligibility(true, 20, 15);
  assert.equal(okResult.eligible, true);
  assert.equal(okResult.deductionStatus, 'pending');
});

test('checkOfflineMismatch flags mismatched student counts and duration differences', () => {
  // Matching scenario
  const matchResult = checkOfflineMismatch(['s1', 's2'], ['s1', 's2'], 45, 45);
  assert.equal(matchResult.hasMismatch, false);
  assert.equal(matchResult.missingFromSecretary.length, 0);

  // Mismatch: Teacher submitted 3 students, secretary confirmed only 2
  const mismatchStudents = checkOfflineMismatch(['s1', 's2', 's3'], ['s1', 's2'], 45, 45);
  assert.equal(mismatchStudents.hasMismatch, true);
  assert.deepEqual(mismatchStudents.missingFromSecretary, ['s3']);

  // Duration discrepancy (> 10m)
  const mismatchDuration = checkOfflineMismatch(['s1'], ['s1'], 60, 40);
  assert.equal(mismatchDuration.hasMismatch, true);
  assert.equal(mismatchDuration.durationDiffMinutes, 20);
});

test('applySessionApprovalDeductions decrements remaining sessions only for eligible attendees and prevents duplicate deduction', () => {
  const mockEnrollments: StudentEnrollment[] = [
    {
      id: 'enr-1',
      studentId: 'stu-1',
      therapyId: 'th-psych',
      monthlyFee: 800,
      totalAllowedSessions: 20,
      sessionsConsumed: 5,
      remainingSessions: 15,
      membershipStartDate: '2026-10-01',
      membershipExpiryDate: '2026-10-31',
      paymentStatus: 'paid'
    },
    {
      id: 'enr-2',
      studentId: 'stu-2',
      therapyId: 'th-psych',
      monthlyFee: 800,
      totalAllowedSessions: 20,
      sessionsConsumed: 2,
      remainingSessions: 18,
      membershipStartDate: '2026-10-01',
      membershipExpiryDate: '2026-10-31',
      paymentStatus: 'paid'
    }
  ];

  const mockSession: SessionRecord = {
    id: 'ses-1',
    sessionCode: 'SES-001',
    date: '2026-10-29',
    teacherId: 't-1',
    teacherName: 'Dr. Ananya Roy',
    therapyId: 'th-psych',
    therapyName: 'Psychology',
    mode: 'online',
    type: 'group',
    scheduledStartTime: '10:00 AM',
    totalDurationMinutes: 45,
    status: 'awaiting_verification',
    verificationStatus: 'pending_admin',
    deductionApplied: false,
    participants: [
      {
        studentId: 'stu-1',
        studentName: 'Aarav Sharma',
        joined: true,
        attendanceDurationMinutes: 42,
        eligibleForDeduction: true,
        deductionStatus: 'pending'
      },
      {
        studentId: 'stu-2',
        studentName: 'Riya Patel',
        joined: false, // did not join!
        attendanceDurationMinutes: 0,
        eligibleForDeduction: false,
        deductionStatus: 'absent'
      }
    ]
  };

  const outcome = applySessionApprovalDeductions(mockSession, mockEnrollments, 'Admin Rohit');
  assert.equal(outcome.deductedStudentIds.length, 1);
  assert.equal(outcome.deductedStudentIds[0], 'stu-1');
  assert.equal(outcome.skippedStudentIds.includes('stu-2'), true);

  // Stu-1 remaining sessions should have decremented from 15 to 14
  const updatedStu1 = outcome.updatedEnrollments.find(e => e.studentId === 'stu-1')!;
  assert.equal(updatedStu1.remainingSessions, 14);
  assert.equal(updatedStu1.sessionsConsumed, 6);

  // Stu-2 was absent, remaining sessions should be intact (18)
  const updatedStu2 = outcome.updatedEnrollments.find(e => e.studentId === 'stu-2')!;
  assert.equal(updatedStu2.remainingSessions, 18);
  assert.equal(updatedStu2.sessionsConsumed, 2);

  // Session status updated
  assert.equal(outcome.updatedSession.status, 'approved');
  assert.equal(outcome.updatedSession.deductionApplied, true);

  // Try calling again with already approved session -> should not deduct again
  const secondAttempt = applySessionApprovalDeductions(outcome.updatedSession, outcome.updatedEnrollments, 'Admin Rohit');
  assert.equal(secondAttempt.deductedStudentIds.length, 0);
  const reCheckedStu1 = secondAttempt.updatedEnrollments.find(e => e.studentId === 'stu-1')!;
  assert.equal(reCheckedStu1.remainingSessions, 14);
});

test('generateWhatsAppUrl creates properly formatted wa.me link', () => {
  const url1 = generateWhatsAppUrl('9876543210', 'Hello from The Motivation');
  assert.ok(url1.startsWith('https://wa.me/919876543210?text='));
  assert.ok(url1.includes('Hello%20from%20The%20Motivation'));

  const urlWithCountryCode = generateWhatsAppUrl('+91 98765-43210', 'Test message');
  assert.ok(urlWithCountryCode.startsWith('https://wa.me/919876543210?text='));
});

test('generatePrefilledWhatsAppMessage formats message text properly', () => {
  const msg = generatePrefilledWhatsAppMessage('payment_reminder', {
    studentName: 'Aarav Sharma',
    parentName: 'Vikram Sharma',
    therapyName: 'Psychology',
    amount: 800,
    dueDate: '31 Oct 2026'
  });
  assert.ok(msg.includes('Dear Vikram Sharma,'));
  assert.ok(msg.includes('Aarav Sharma'));
  assert.ok(msg.includes('₹800'));
});

test('formatCurrency handles Indian rupee formatting', () => {
  assert.equal(formatCurrency(2400), '₹2,400');
  assert.equal(formatCurrency(15000), '₹15,000');
});
