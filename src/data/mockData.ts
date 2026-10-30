import { OrgSettings, PaymentRecord, SessionRecord, Student, StudentEnrollment, Teacher, Therapy, UserProfile } from '../types';

export const INITIAL_ORG_SETTINGS: OrgSettings = {
  orgName: 'The Motivation',
  minAttendanceDurationMinutes: 15,
  defaultSessionDurationMinutes: 45,
  currencySymbol: '₹',
  supportPhone: '+91 98765 43210',
  supportEmail: 'contact@themotivation.org',
  allowOverdueToleranceDays: 7
};

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-admin',
    name: 'Rohit Bansal (Director & Admin)',
    email: 'admin@themotivation.demo',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-teacher-1',
    name: 'Dr. Ananya Roy',
    email: 'teacher@themotivation.demo',
    role: 'teacher',
    teacherId: 'tch-1',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-secretary',
    name: 'Sunita Sharma (Front Desk & Operations)',
    email: 'secretary@themotivation.demo',
    role: 'secretary',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_THERAPIES: Therapy[] = [
  {
    id: 'th-psych',
    name: 'Psychology',
    code: 'PSY',
    description: 'Cognitive behavioral therapy, emotional regulation, and stress management for children and teens.',
    defaultMonthlyFee: 800,
    defaultPackageSessions: 20,
    color: '#6366f1', // Indigo
    active: true
  },
  {
    id: 'th-behav',
    name: 'Behaviour Therapy',
    code: 'BEH',
    description: 'Applied behaviour analysis, social cues development, and positive reinforcement training.',
    defaultMonthlyFee: 900,
    defaultPackageSessions: 20,
    color: '#0d9488', // Teal
    active: true
  },
  {
    id: 'th-sped',
    name: 'Special Education',
    code: 'SPED',
    description: 'Individualized educational plans, learning disorder adaptations, and multisensory teaching.',
    defaultMonthlyFee: 700,
    defaultPackageSessions: 16,
    color: '#8b5cf6', // Purple
    active: true
  },
  {
    id: 'th-remed',
    name: 'Remedial Classes',
    code: 'REM',
    description: 'Curriculum catch-up in math, language literacy, comprehension, and foundational concepts.',
    defaultMonthlyFee: 750,
    defaultPackageSessions: 18,
    color: '#f59e0b', // Amber
    active: true
  }
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'tch-1',
    teacherCode: 'TM-TCH-01',
    name: 'Dr. Ananya Roy',
    phone: '+91 98111 22334',
    email: 'ananya.roy@themotivation.demo',
    specialization: 'Child Psychology & Emotional Regulation',
    assignedTherapies: ['th-psych', 'th-behav'],
    joiningDate: '2023-04-15',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'tch-2',
    teacherCode: 'TM-TCH-02',
    name: 'Vikramaditya Sen',
    phone: '+91 98222 33445',
    email: 'vikram.sen@themotivation.demo',
    specialization: 'Special Education & Dyslexia Support',
    assignedTherapies: ['th-sped'],
    joiningDate: '2023-06-01',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'tch-3',
    teacherCode: 'TM-TCH-03',
    name: 'Priya Nambiar',
    phone: '+91 98333 44556',
    email: 'priya.nambiar@themotivation.demo',
    specialization: 'Behaviour Modification & Autism Spectrum',
    assignedTherapies: ['th-behav'],
    joiningDate: '2023-09-10',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'tch-4',
    teacherCode: 'TM-TCH-04',
    name: 'Rajeshwar Rao',
    phone: '+91 98444 55667',
    email: 'rajeshwar.rao@themotivation.demo',
    specialization: 'Remedial Mathematics & Reading Comprehension',
    assignedTherapies: ['th-remed'],
    joiningDate: '2024-01-12',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'tch-5',
    teacherCode: 'TM-TCH-05',
    name: 'Neha Mathur',
    phone: '+91 98555 66778',
    email: 'neha.mathur@themotivation.demo',
    specialization: 'Developmental Psychology & ADHD Guidance',
    assignedTherapies: ['th-psych'],
    joiningDate: '2024-02-20',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1534751516642-a171edd26cb0?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'tch-6',
    teacherCode: 'TM-TCH-06',
    name: 'Sameer Khurana',
    phone: '+91 98666 77889',
    email: 'sameer.k@themotivation.demo',
    specialization: 'Occupational Integration & Motor Skills',
    assignedTherapies: ['th-sped', 'th-remed'],
    joiningDate: '2024-03-01',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'tch-7',
    teacherCode: 'TM-TCH-07',
    name: 'Dr. Sunita Bhatt',
    phone: '+91 98777 88990',
    email: 'sunita.bhatt@themotivation.demo',
    specialization: 'Adolescent Counselling & Anxiety Management',
    assignedTherapies: ['th-psych'],
    joiningDate: '2024-05-15',
    status: 'on_leave',
    avatar: 'https://images.unsplash.com/photo-1558898479-33c0057a5d12?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'tch-8',
    teacherCode: 'TM-TCH-08',
    name: 'Amit Dave',
    phone: '+91 98888 99001',
    email: 'amit.dave@themotivation.demo',
    specialization: 'Social Skills Coaching & Behaviour Support',
    assignedTherapies: ['th-behav'],
    joiningDate: '2024-07-01',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stu-1',
    studentCode: 'TM-STU-101',
    fullName: 'Aarav Sharma',
    age: 9,
    parentName: 'Vikram Sharma',
    parentPhone: '+91 98765 12340',
    email: 'vikram.sharma@example.in',
    registrationDate: '2024-01-10',
    status: 'active',
    notes: 'Responsive to visual cue cards. Enrolled in 3 therapies: Psychology, Behaviour Therapy, and Special Education.'
  },
  {
    id: 'stu-2',
    studentCode: 'TM-STU-102',
    fullName: 'Riya Patel',
    age: 11,
    parentName: 'Sneha Patel',
    parentPhone: '+91 98223 34455',
    email: 'sneha.patel@example.in',
    registrationDate: '2024-01-15',
    status: 'active',
    notes: 'Enrolled in Psychology & Remedial Classes. Shows notable progress in reading confidence.'
  },
  {
    id: 'stu-3',
    studentCode: 'TM-STU-103',
    fullName: 'Vihaan Deshmukh',
    age: 8,
    parentName: 'Milind Deshmukh',
    parentPhone: '+91 98112 45678',
    email: 'deshmukh.family@example.in',
    registrationDate: '2024-02-01',
    status: 'active',
    notes: 'Undergoing Behaviour Therapy for tactile sensory overload.'
  },
  {
    id: 'stu-4',
    studentCode: 'TM-STU-104',
    fullName: 'Ananya Iyer',
    age: 12,
    parentName: 'Lakshmi Iyer',
    parentPhone: '+91 98334 56789',
    email: 'lakshmi.iyer@example.in',
    registrationDate: '2024-02-14',
    status: 'active',
    notes: 'Attends Special Education sessions online twice a week.'
  },
  {
    id: 'stu-5',
    studentCode: 'TM-STU-105',
    fullName: 'Kabir Verma',
    age: 10,
    parentName: 'Alok Verma',
    parentPhone: '+91 98445 67890',
    email: 'alok.verma@example.in',
    registrationDate: '2024-03-01',
    status: 'active',
    notes: 'Needs calm transitions when starting online sessions.'
  },
  {
    id: 'stu-6',
    studentCode: 'TM-STU-106',
    fullName: 'Meera Reddy',
    age: 7,
    parentName: 'Kavitha Reddy',
    parentPhone: '+91 98556 78901',
    email: 'kavitha.reddy@example.in',
    registrationDate: '2024-03-10',
    status: 'active',
    notes: 'Enrolled in Psychology. High imaginative play engagement.'
  },
  {
    id: 'stu-7',
    studentCode: 'TM-STU-107',
    fullName: 'Ishan Gupta',
    age: 13,
    parentName: 'Ramesh Gupta',
    parentPhone: '+91 98667 89012',
    email: 'ramesh.gupta@example.in',
    registrationDate: '2024-04-05',
    status: 'active',
    notes: 'Remedial Classes for algebraic reasoning.'
  },
  {
    id: 'stu-8',
    studentCode: 'TM-STU-108',
    fullName: 'Saanvi Nair',
    age: 9,
    parentName: 'Unni Nair',
    parentPhone: '+91 98778 90123',
    email: 'unni.nair@example.in',
    registrationDate: '2024-04-20',
    status: 'active',
    notes: 'Enrolled in Behaviour Therapy and Remedial Classes.'
  },
  {
    id: 'stu-9',
    studentCode: 'TM-STU-109',
    fullName: 'Rohan Kulkarni',
    age: 14,
    parentName: 'Prashant Kulkarni',
    parentPhone: '+91 98889 01234',
    email: 'pkulkarni@example.in',
    registrationDate: '2024-05-02',
    status: 'active',
    notes: 'Preparing for board exams; requires focus strengthening exercises.'
  },
  {
    id: 'stu-10',
    studentCode: 'TM-STU-110',
    fullName: 'Tanvi Joshi',
    age: 8,
    parentName: 'Girish Joshi',
    parentPhone: '+91 98990 12345',
    email: 'girish.joshi@example.in',
    registrationDate: '2024-05-18',
    status: 'active',
    notes: 'Special Education offline sessions in morning slots.'
  },
  {
    id: 'stu-11',
    studentCode: 'TM-STU-111',
    fullName: 'Advait Mehta',
    age: 6,
    parentName: 'Dharmesh Mehta',
    parentPhone: '+91 98101 23456',
    email: 'dmehta@example.in',
    registrationDate: '2024-06-01',
    status: 'active',
    notes: 'Sensory integration and playful behaviour therapy.'
  },
  {
    id: 'stu-12',
    studentCode: 'TM-STU-112',
    fullName: 'Diya Sen',
    age: 11,
    parentName: 'Sumita Sen',
    parentPhone: '+91 98212 34567',
    email: 'sumita.sen@example.in',
    registrationDate: '2024-06-15',
    status: 'active',
    notes: 'Psychology sessions focusing on peer communication.'
  },
  {
    id: 'stu-13',
    studentCode: 'TM-STU-113',
    fullName: 'Aryan Malhotra',
    age: 10,
    parentName: 'Rajeev Malhotra',
    parentPhone: '+91 98323 45678',
    email: 'rajeev.m@example.in',
    registrationDate: '2024-07-01',
    status: 'inactive',
    notes: 'Temporarily paused due to out-of-station relocation.'
  },
  {
    id: 'stu-14',
    studentCode: 'TM-STU-114',
    fullName: 'Kavya Pillai',
    age: 7,
    parentName: 'Deepa Pillai',
    parentPhone: '+91 98434 56789',
    email: 'deepa.p@example.in',
    registrationDate: '2024-07-20',
    status: 'active',
    notes: 'Remedial language development.'
  }
];

export const INITIAL_ENROLLMENTS: StudentEnrollment[] = [
  // Aarav Sharma - enrolled in 3 therapies (exact prompt example!)
  {
    id: 'enr-aarav-1',
    studentId: 'stu-1',
    therapyId: 'th-psych',
    monthlyFee: 800,
    totalAllowedSessions: 20,
    sessionsConsumed: 8,
    remainingSessions: 12,
    membershipStartDate: '2026-10-01',
    membershipExpiryDate: '2026-10-31',
    paymentStatus: 'paid'
  },
  {
    id: 'enr-aarav-2',
    studentId: 'stu-1',
    therapyId: 'th-behav',
    monthlyFee: 900,
    totalAllowedSessions: 20,
    sessionsConsumed: 6,
    remainingSessions: 14,
    membershipStartDate: '2026-10-01',
    membershipExpiryDate: '2026-10-31',
    paymentStatus: 'paid'
  },
  {
    id: 'enr-aarav-3',
    studentId: 'stu-1',
    therapyId: 'th-sped',
    monthlyFee: 700,
    totalAllowedSessions: 16,
    sessionsConsumed: 5,
    remainingSessions: 11,
    membershipStartDate: '2026-10-01',
    membershipExpiryDate: '2026-10-31',
    paymentStatus: 'paid'
  },

  // Riya Patel
  {
    id: 'enr-riya-1',
    studentId: 'stu-2',
    therapyId: 'th-psych',
    monthlyFee: 800,
    totalAllowedSessions: 20,
    sessionsConsumed: 12,
    remainingSessions: 8,
    membershipStartDate: '2026-10-01',
    membershipExpiryDate: '2026-10-31',
    paymentStatus: 'paid'
  },
  {
    id: 'enr-riya-2',
    studentId: 'stu-2',
    therapyId: 'th-remed',
    monthlyFee: 750,
    totalAllowedSessions: 18,
    sessionsConsumed: 15,
    remainingSessions: 3,
    membershipStartDate: '2026-10-01',
    membershipExpiryDate: '2026-10-31',
    paymentStatus: 'pending' // Pending payment scenario!
  },

  // Vihaan Deshmukh
  {
    id: 'enr-vihaan-1',
    studentId: 'stu-3',
    therapyId: 'th-behav',
    monthlyFee: 900,
    totalAllowedSessions: 20,
    sessionsConsumed: 18,
    remainingSessions: 2,
    membershipStartDate: '2026-10-01',
    membershipExpiryDate: '2026-10-31',
    paymentStatus: 'overdue' // Overdue payment scenario!
  },

  // Ananya Iyer
  {
    id: 'enr-ananya-1',
    studentId: 'stu-4',
    therapyId: 'th-sped',
    monthlyFee: 700,
    totalAllowedSessions: 16,
    sessionsConsumed: 9,
    remainingSessions: 7,
    membershipStartDate: '2026-10-01',
    membershipExpiryDate: '2026-10-31',
    paymentStatus: 'paid'
  },

  // Kabir Verma
  {
    id: 'enr-kabir-1',
    studentId: 'stu-5',
    therapyId: 'th-psych',
    monthlyFee: 800,
    totalAllowedSessions: 20,
    sessionsConsumed: 7,
    remainingSessions: 13,
    membershipStartDate: '2026-10-01',
    membershipExpiryDate: '2026-10-31',
    paymentStatus: 'awaiting_verification' // Awaiting verification scenario!
  },

  // Meera Reddy
  {
    id: 'enr-meera-1',
    studentId: 'stu-6',
    therapyId: 'th-psych',
    monthlyFee: 800,
    totalAllowedSessions: 20,
    sessionsConsumed: 4,
    remainingSessions: 16,
    membershipStartDate: '2026-10-01',
    membershipExpiryDate: '2026-10-31',
    paymentStatus: 'paid'
  },

  // Ishan Gupta
  {
    id: 'enr-ishan-1',
    studentId: 'stu-7',
    therapyId: 'th-remed',
    monthlyFee: 750,
    totalAllowedSessions: 18,
    sessionsConsumed: 10,
    remainingSessions: 8,
    membershipStartDate: '2026-10-01',
    membershipExpiryDate: '2026-10-31',
    paymentStatus: 'paid'
  },

  // Saanvi Nair
  {
    id: 'enr-saanvi-1',
    studentId: 'stu-8',
    therapyId: 'th-behav',
    monthlyFee: 900,
    totalAllowedSessions: 20,
    sessionsConsumed: 14,
    remainingSessions: 6,
    membershipStartDate: '2026-10-01',
    membershipExpiryDate: '2026-10-31',
    paymentStatus: 'paid'
  },
  {
    id: 'enr-saanvi-2',
    studentId: 'stu-8',
    therapyId: 'th-remed',
    monthlyFee: 750,
    totalAllowedSessions: 18,
    sessionsConsumed: 11,
    remainingSessions: 7,
    membershipStartDate: '2026-10-01',
    membershipExpiryDate: '2026-10-31',
    paymentStatus: 'paid'
  },

  // Rohan Kulkarni
  {
    id: 'enr-rohan-1',
    studentId: 'stu-9',
    therapyId: 'th-remed',
    monthlyFee: 750,
    totalAllowedSessions: 18,
    sessionsConsumed: 8,
    remainingSessions: 10,
    membershipStartDate: '2026-10-01',
    membershipExpiryDate: '2026-10-31',
    paymentStatus: 'paid'
  },

  // Tanvi Joshi
  {
    id: 'enr-tanvi-1',
    studentId: 'stu-10',
    therapyId: 'th-sped',
    monthlyFee: 700,
    totalAllowedSessions: 16,
    sessionsConsumed: 6,
    remainingSessions: 10,
    membershipStartDate: '2026-10-01',
    membershipExpiryDate: '2026-10-31',
    paymentStatus: 'paid'
  },

  // Advait Mehta
  {
    id: 'enr-advait-1',
    studentId: 'stu-11',
    therapyId: 'th-behav',
    monthlyFee: 900,
    totalAllowedSessions: 20,
    sessionsConsumed: 5,
    remainingSessions: 15,
    membershipStartDate: '2026-10-01',
    membershipExpiryDate: '2026-10-31',
    paymentStatus: 'paid'
  },

  // Diya Sen
  {
    id: 'enr-diya-1',
    studentId: 'stu-12',
    therapyId: 'th-psych',
    monthlyFee: 800,
    totalAllowedSessions: 20,
    sessionsConsumed: 11,
    remainingSessions: 9,
    membershipStartDate: '2026-10-01',
    membershipExpiryDate: '2026-10-31',
    paymentStatus: 'paid'
  }
];

export const INITIAL_SESSIONS: SessionRecord[] = [
  // 1. LIVE SESSION currently happening (Online)
  {
    id: 'ses-live-1',
    sessionCode: 'SES-2026-088',
    date: '2026-10-29',
    teacherId: 'tch-1',
    teacherName: 'Dr. Ananya Roy',
    therapyId: 'th-psych',
    therapyName: 'Psychology',
    mode: 'online',
    type: 'group',
    scheduledStartTime: '11:15 AM',
    scheduledEndTime: '12:00 PM',
    actualStartTime: '11:18 AM',
    totalDurationMinutes: 28, // live running
    status: 'live',
    verificationStatus: 'pending_admin',
    meetingRoomUrl: 'https://themotivation.daily.co/psychology-group-88',
    meetingId: 'room-psych-88',
    deductionApplied: false,
    participants: [
      {
        studentId: 'stu-1',
        studentName: 'Aarav Sharma',
        joined: true,
        joinTime: '11:18 AM',
        attendanceDurationMinutes: 28,
        eligibleForDeduction: true,
        deductionStatus: 'pending'
      },
      {
        studentId: 'stu-2',
        studentName: 'Riya Patel',
        joined: true,
        joinTime: '11:20 AM',
        attendanceDurationMinutes: 26,
        eligibleForDeduction: true,
        deductionStatus: 'pending'
      },
      {
        studentId: 'stu-6',
        studentName: 'Meera Reddy',
        joined: false, // did not join!
        attendanceDurationMinutes: 0,
        eligibleForDeduction: false,
        deductionStatus: 'absent'
      }
    ],
    teacherNotes: 'Live discussion on feelings thermometer and calming breathing routines.'
  },

  // 2. OFFLINE SESSION: With Secretary Mismatch (Scenario 3 in prompt!)
  {
    id: 'ses-mismatch-1',
    sessionCode: 'SES-2026-085',
    date: '2026-10-28',
    teacherId: 'tch-3',
    teacherName: 'Priya Nambiar',
    therapyId: 'th-behav',
    therapyName: 'Behaviour Therapy',
    mode: 'offline',
    type: 'group',
    scheduledStartTime: '03:00 PM',
    scheduledEndTime: '03:45 PM',
    actualStartTime: '03:00 PM',
    actualEndTime: '03:45 PM',
    totalDurationMinutes: 45,
    status: 'awaiting_verification',
    verificationStatus: 'mismatch',
    deductionApplied: false,
    teacherNotes: 'Teacher submitted 3 students: Aarav Sharma, Vihaan Deshmukh, and Saanvi Nair.',
    participants: [
      {
        studentId: 'stu-1',
        studentName: 'Aarav Sharma',
        joined: true,
        attendanceDurationMinutes: 45,
        eligibleForDeduction: true,
        deductionStatus: 'pending'
      },
      {
        studentId: 'stu-3',
        studentName: 'Vihaan Deshmukh',
        joined: true,
        attendanceDurationMinutes: 45,
        eligibleForDeduction: true,
        deductionStatus: 'pending'
      },
      {
        studentId: 'stu-8',
        studentName: 'Saanvi Nair',
        joined: false, // Secretary confirmed Saanvi was absent from centre!
        attendanceDurationMinutes: 0,
        eligibleForDeduction: false,
        deductionStatus: 'absent'
      }
    ],
    secretaryNotes: 'Physical register shows Saanvi Nair did not report to the clinic on 28 Oct.',
    secretaryConfirmation: {
      confirmedTeacherId: 'tch-3',
      confirmedTeacherName: 'Priya Nambiar',
      confirmedStudentIds: ['stu-1', 'stu-3'], // Only 2 confirmed!
      confirmedDurationMinutes: 45,
      confirmedAt: '2026-10-28T16:10:00Z',
      remarks: 'Verified physical sign-in sheet. Saanvi Nair was absent.',
      hasMismatch: true,
      mismatchDetails: '1 student(s) submitted by teacher were not confirmed by secretary (Saanvi Nair).'
    }
  },

  // 3. OFFLINE SESSION: Awaiting Secretary Confirmation
  {
    id: 'ses-pending-sec-1',
    sessionCode: 'SES-2026-089',
    date: '2026-10-29',
    teacherId: 'tch-2',
    teacherName: 'Vikramaditya Sen',
    therapyId: 'th-sped',
    therapyName: 'Special Education',
    mode: 'offline',
    type: 'individual',
    scheduledStartTime: '09:30 AM',
    scheduledEndTime: '10:15 AM',
    actualStartTime: '09:30 AM',
    actualEndTime: '10:15 AM',
    totalDurationMinutes: 45,
    status: 'awaiting_verification',
    verificationStatus: 'awaiting_secretary',
    deductionApplied: false,
    teacherNotes: 'Conducted offline session in Room B for Tanvi Joshi on tactile phonics.',
    participants: [
      {
        studentId: 'stu-10',
        studentName: 'Tanvi Joshi',
        joined: true,
        attendanceDurationMinutes: 45,
        eligibleForDeduction: true,
        deductionStatus: 'pending'
      }
    ]
  },

  // 4. ONLINE SESSION: Completed, Pending Admin Approval (Duration threshold demo)
  {
    id: 'ses-completed-pending-1',
    sessionCode: 'SES-2026-084',
    date: '2026-10-28',
    teacherId: 'tch-1',
    teacherName: 'Dr. Ananya Roy',
    therapyId: 'th-psych',
    therapyName: 'Psychology',
    mode: 'online',
    type: 'group',
    scheduledStartTime: '11:00 AM',
    scheduledEndTime: '11:45 AM',
    actualStartTime: '11:02 AM',
    actualEndTime: '11:47 AM',
    totalDurationMinutes: 45,
    status: 'awaiting_verification',
    verificationStatus: 'pending_admin',
    meetingRoomUrl: 'https://themotivation.daily.co/psychology-group-84',
    meetingId: 'room-psych-84',
    deductionApplied: false,
    teacherNotes: 'Online group session. Kabir joined full session, Diya had network disconnection after 11 mins.',
    participants: [
      {
        studentId: 'stu-5',
        studentName: 'Kabir Verma',
        joined: true,
        joinTime: '11:03 AM',
        leaveTime: '11:46 AM',
        attendanceDurationMinutes: 43,
        eligibleForDeduction: true,
        deductionStatus: 'pending'
      },
      {
        studentId: 'stu-12',
        studentName: 'Diya Sen',
        joined: true,
        joinTime: '11:05 AM',
        leaveTime: '11:16 AM',
        attendanceDurationMinutes: 11, // Below 15 min threshold!
        eligibleForDeduction: false,
        deductionStatus: 'below_threshold'
      }
    ]
  },

  // 5. COMPLETED & APPROVED Online Session
  {
    id: 'ses-approved-1',
    sessionCode: 'SES-2026-080',
    date: '2026-10-27',
    teacherId: 'tch-1',
    teacherName: 'Dr. Ananya Roy',
    therapyId: 'th-psych',
    therapyName: 'Psychology',
    mode: 'online',
    type: 'individual',
    scheduledStartTime: '02:00 PM',
    scheduledEndTime: '02:45 PM',
    actualStartTime: '02:00 PM',
    actualEndTime: '02:44 PM',
    totalDurationMinutes: 44,
    status: 'approved',
    verificationStatus: 'approved',
    meetingRoomUrl: 'https://themotivation.daily.co/psychology-indiv-80',
    deductionApplied: true,
    approvedBy: 'Rohit Bansal (Admin)',
    approvedAt: '2026-10-27T15:30:00Z',
    teacherNotes: 'Individual session with Aarav Sharma on social stories.',
    participants: [
      {
        studentId: 'stu-1',
        studentName: 'Aarav Sharma',
        joined: true,
        attendanceDurationMinutes: 44,
        eligibleForDeduction: true,
        deductionStatus: 'deducted'
      }
    ]
  },

  // 6. COMPLETED & APPROVED Offline Session
  {
    id: 'ses-approved-2',
    sessionCode: 'SES-2026-079',
    date: '2026-10-26',
    teacherId: 'tch-4',
    teacherName: 'Rajeshwar Rao',
    therapyId: 'th-remed',
    therapyName: 'Remedial Classes',
    mode: 'offline',
    type: 'group',
    scheduledStartTime: '04:00 PM',
    scheduledEndTime: '04:50 PM',
    actualStartTime: '04:00 PM',
    actualEndTime: '04:50 PM',
    totalDurationMinutes: 50,
    status: 'approved',
    verificationStatus: 'approved',
    deductionApplied: true,
    approvedBy: 'Rohit Bansal (Admin)',
    approvedAt: '2026-10-26T17:15:00Z',
    teacherNotes: 'Multiplication fluency group session.',
    secretaryConfirmation: {
      confirmedTeacherId: 'tch-4',
      confirmedTeacherName: 'Rajeshwar Rao',
      confirmedStudentIds: ['stu-2', 'stu-7', 'stu-8'],
      confirmedDurationMinutes: 50,
      confirmedAt: '2026-10-26T17:00:00Z',
      remarks: 'All 3 students confirmed present by secretary.',
      hasMismatch: false
    },
    participants: [
      {
        studentId: 'stu-2',
        studentName: 'Riya Patel',
        joined: true,
        attendanceDurationMinutes: 50,
        eligibleForDeduction: true,
        deductionStatus: 'deducted'
      },
      {
        studentId: 'stu-7',
        studentName: 'Ishan Gupta',
        joined: true,
        attendanceDurationMinutes: 50,
        eligibleForDeduction: true,
        deductionStatus: 'deducted'
      },
      {
        studentId: 'stu-8',
        studentName: 'Saanvi Nair',
        joined: true,
        attendanceDurationMinutes: 50,
        eligibleForDeduction: true,
        deductionStatus: 'deducted'
      }
    ]
  },

  // 7. Session with Special Education (Offline Approved)
  {
    id: 'ses-approved-3',
    sessionCode: 'SES-2026-075',
    date: '2026-10-25',
    teacherId: 'tch-2',
    teacherName: 'Vikramaditya Sen',
    therapyId: 'th-sped',
    therapyName: 'Special Education',
    mode: 'offline',
    type: 'individual',
    scheduledStartTime: '10:00 AM',
    actualStartTime: '10:00 AM',
    actualEndTime: '10:45 AM',
    totalDurationMinutes: 45,
    status: 'approved',
    verificationStatus: 'approved',
    deductionApplied: true,
    approvedBy: 'Rohit Bansal (Admin)',
    participants: [
      {
        studentId: 'stu-4',
        studentName: 'Ananya Iyer',
        joined: true,
        attendanceDurationMinutes: 45,
        eligibleForDeduction: true,
        deductionStatus: 'deducted'
      }
    ]
  },

  // 8. Behaviour Therapy Session (Offline Approved)
  {
    id: 'ses-approved-4',
    sessionCode: 'SES-2026-072',
    date: '2026-10-24',
    teacherId: 'tch-3',
    teacherName: 'Priya Nambiar',
    therapyId: 'th-behav',
    therapyName: 'Behaviour Therapy',
    mode: 'offline',
    type: 'group',
    scheduledStartTime: '02:00 PM',
    actualStartTime: '02:00 PM',
    actualEndTime: '02:45 PM',
    totalDurationMinutes: 45,
    status: 'approved',
    verificationStatus: 'approved',
    deductionApplied: true,
    approvedBy: 'Rohit Bansal (Admin)',
    participants: [
      {
        studentId: 'stu-3',
        studentName: 'Vihaan Deshmukh',
        joined: true,
        attendanceDurationMinutes: 45,
        eligibleForDeduction: true,
        deductionStatus: 'deducted'
      },
      {
        studentId: 'stu-11',
        studentName: 'Advait Mehta',
        joined: true,
        attendanceDurationMinutes: 45,
        eligibleForDeduction: true,
        deductionStatus: 'deducted'
      }
    ]
  },

  // 9. Remedial Classes Online
  {
    id: 'ses-approved-5',
    sessionCode: 'SES-2026-068',
    date: '2026-10-23',
    teacherId: 'tch-4',
    teacherName: 'Rajeshwar Rao',
    therapyId: 'th-remed',
    therapyName: 'Remedial Classes',
    mode: 'online',
    type: 'individual',
    scheduledStartTime: '05:00 PM',
    actualStartTime: '05:00 PM',
    actualEndTime: '05:45 PM',
    totalDurationMinutes: 45,
    status: 'approved',
    verificationStatus: 'approved',
    deductionApplied: true,
    approvedBy: 'Rohit Bansal (Admin)',
    participants: [
      {
        studentId: 'stu-9',
        studentName: 'Rohan Kulkarni',
        joined: true,
        attendanceDurationMinutes: 45,
        eligibleForDeduction: true,
        deductionStatus: 'deducted'
      }
    ]
  },

  // 10. Psychology Session with Aarav Sharma
  {
    id: 'ses-approved-6',
    sessionCode: 'SES-2026-065',
    date: '2026-10-22',
    teacherId: 'tch-1',
    teacherName: 'Dr. Ananya Roy',
    therapyId: 'th-psych',
    therapyName: 'Psychology',
    mode: 'online',
    type: 'individual',
    scheduledStartTime: '11:00 AM',
    actualStartTime: '11:00 AM',
    actualEndTime: '11:45 AM',
    totalDurationMinutes: 45,
    status: 'approved',
    verificationStatus: 'approved',
    deductionApplied: true,
    approvedBy: 'Rohit Bansal (Admin)',
    participants: [
      {
        studentId: 'stu-1',
        studentName: 'Aarav Sharma',
        joined: true,
        attendanceDurationMinutes: 45,
        eligibleForDeduction: true,
        deductionStatus: 'deducted'
      }
    ]
  }
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  // 1. Awaiting Verification - Parent uploaded receipt screenshot! (Scenario 4 in prompt)
  {
    id: 'pay-verif-1',
    receiptNumber: 'RCP-2026-101',
    studentId: 'stu-5',
    studentName: 'Kabir Verma',
    parentName: 'Alok Verma',
    parentPhone: '+91 98445 67890',
    therapyId: 'th-psych',
    therapyName: 'Psychology',
    paymentMonth: 'October 2026',
    dueDate: '2026-10-25',
    monthlyFee: 800,
    amountPaid: 800,
    pendingAmount: 0,
    paymentDate: '2026-10-27',
    paymentMethod: 'UPI',
    transactionReference: 'UPI/261027192844/HDFC',
    receiptScreenshotUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    verificationStatus: 'awaiting_verification',
    notes: 'Parent submitted screenshot on WhatsApp; requires admin confirmation before session package extension.'
  },

  // 2. Pending Payment - Needs WhatsApp Reminder (Scenario 5 in prompt)
  {
    id: 'pay-pending-1',
    receiptNumber: 'RCP-2026-102',
    studentId: 'stu-2',
    studentName: 'Riya Patel',
    parentName: 'Sneha Patel',
    parentPhone: '+91 98223 34455',
    therapyId: 'th-remed',
    therapyName: 'Remedial Classes',
    paymentMonth: 'October 2026',
    dueDate: '2026-10-31',
    monthlyFee: 750,
    amountPaid: 0,
    pendingAmount: 750,
    verificationStatus: 'pending',
    notes: 'Invoice generated. Pending payment reminder.'
  },

  // 3. Overdue Payment
  {
    id: 'pay-overdue-1',
    receiptNumber: 'RCP-2026-098',
    studentId: 'stu-3',
    studentName: 'Vihaan Deshmukh',
    parentName: 'Milind Deshmukh',
    parentPhone: '+91 98112 45678',
    therapyId: 'th-behav',
    therapyName: 'Behaviour Therapy',
    paymentMonth: 'October 2026',
    dueDate: '2026-10-15',
    monthlyFee: 900,
    amountPaid: 0,
    pendingAmount: 900,
    verificationStatus: 'overdue',
    notes: 'Payment is overdue by 14 days.'
  },

  // 4. Paid: Aarav Sharma - Psychology
  {
    id: 'pay-aarav-1',
    receiptNumber: 'RCP-2026-081',
    studentId: 'stu-1',
    studentName: 'Aarav Sharma',
    parentName: 'Vikram Sharma',
    parentPhone: '+91 98765 12340',
    therapyId: 'th-psych',
    therapyName: 'Psychology',
    paymentMonth: 'October 2026',
    dueDate: '2026-10-05',
    monthlyFee: 800,
    amountPaid: 800,
    pendingAmount: 0,
    paymentDate: '2026-10-04',
    paymentMethod: 'UPI',
    transactionReference: 'UPI/261004110982/ICICI',
    verificationStatus: 'paid',
    extensionApplied: true,
    extensionSessionsAdded: 20,
    verifiedBy: 'Rohit Bansal (Admin)',
    verifiedAt: '2026-10-04T12:00:00Z'
  },

  // 5. Paid: Aarav Sharma - Behaviour Therapy
  {
    id: 'pay-aarav-2',
    receiptNumber: 'RCP-2026-082',
    studentId: 'stu-1',
    studentName: 'Aarav Sharma',
    parentName: 'Vikram Sharma',
    parentPhone: '+91 98765 12340',
    therapyId: 'th-behav',
    therapyName: 'Behaviour Therapy',
    paymentMonth: 'October 2026',
    dueDate: '2026-10-05',
    monthlyFee: 900,
    amountPaid: 900,
    pendingAmount: 0,
    paymentDate: '2026-10-04',
    paymentMethod: 'UPI',
    transactionReference: 'UPI/261004111245/ICICI',
    verificationStatus: 'paid',
    extensionApplied: true,
    extensionSessionsAdded: 20,
    verifiedBy: 'Rohit Bansal (Admin)',
    verifiedAt: '2026-10-04T12:05:00Z'
  },

  // 6. Paid: Aarav Sharma - Special Education
  {
    id: 'pay-aarav-3',
    receiptNumber: 'RCP-2026-083',
    studentId: 'stu-1',
    studentName: 'Aarav Sharma',
    parentName: 'Vikram Sharma',
    parentPhone: '+91 98765 12340',
    therapyId: 'th-sped',
    therapyName: 'Special Education',
    paymentMonth: 'October 2026',
    dueDate: '2026-10-05',
    monthlyFee: 700,
    amountPaid: 700,
    pendingAmount: 0,
    paymentDate: '2026-10-04',
    paymentMethod: 'UPI',
    transactionReference: 'UPI/261004111589/ICICI',
    verificationStatus: 'paid',
    extensionApplied: true,
    extensionSessionsAdded: 16,
    verifiedBy: 'Rohit Bansal (Admin)',
    verifiedAt: '2026-10-04T12:10:00Z'
  },

  // 7. Paid: Ananya Iyer
  {
    id: 'pay-ananya-1',
    receiptNumber: 'RCP-2026-084',
    studentId: 'stu-4',
    studentName: 'Ananya Iyer',
    parentName: 'Lakshmi Iyer',
    parentPhone: '+91 98334 56789',
    therapyId: 'th-sped',
    therapyName: 'Special Education',
    paymentMonth: 'October 2026',
    dueDate: '2026-10-10',
    monthlyFee: 700,
    amountPaid: 700,
    pendingAmount: 0,
    paymentDate: '2026-10-08',
    paymentMethod: 'Bank Transfer',
    transactionReference: 'NEFT/SBIN004812/998',
    verificationStatus: 'paid',
    extensionApplied: true,
    extensionSessionsAdded: 16,
    verifiedBy: 'Rohit Bansal (Admin)',
    verifiedAt: '2026-10-08T14:20:00Z'
  },

  // 8. Paid: Meera Reddy
  {
    id: 'pay-meera-1',
    receiptNumber: 'RCP-2026-085',
    studentId: 'stu-6',
    studentName: 'Meera Reddy',
    parentName: 'Kavitha Reddy',
    parentPhone: '+91 98556 78901',
    therapyId: 'th-psych',
    therapyName: 'Psychology',
    paymentMonth: 'October 2026',
    dueDate: '2026-10-10',
    monthlyFee: 800,
    amountPaid: 800,
    pendingAmount: 0,
    paymentDate: '2026-10-09',
    paymentMethod: 'UPI',
    transactionReference: 'UPI/261009184511/GPAY',
    verificationStatus: 'paid',
    extensionApplied: true,
    extensionSessionsAdded: 20,
    verifiedBy: 'Rohit Bansal (Admin)',
    verifiedAt: '2026-10-09T19:00:00Z'
  },

  // 9. Paid: Ishan Gupta
  {
    id: 'pay-ishan-1',
    receiptNumber: 'RCP-2026-086',
    studentId: 'stu-7',
    studentName: 'Ishan Gupta',
    parentName: 'Ramesh Gupta',
    parentPhone: '+91 98667 89012',
    therapyId: 'th-remed',
    therapyName: 'Remedial Classes',
    paymentMonth: 'October 2026',
    dueDate: '2026-10-12',
    monthlyFee: 750,
    amountPaid: 750,
    pendingAmount: 0,
    paymentDate: '2026-10-11',
    paymentMethod: 'Cash',
    receiptScreenshotUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    verificationStatus: 'paid',
    extensionApplied: true,
    extensionSessionsAdded: 18,
    verifiedBy: 'Sunita Sharma (Secretary)',
    verifiedAt: '2026-10-11T16:00:00Z'
  },

  // 10. Paid: Saanvi Nair
  {
    id: 'pay-saanvi-1',
    receiptNumber: 'RCP-2026-087',
    studentId: 'stu-8',
    studentName: 'Saanvi Nair',
    parentName: 'Unni Nair',
    parentPhone: '+91 98778 90123',
    therapyId: 'th-behav',
    therapyName: 'Behaviour Therapy',
    paymentMonth: 'October 2026',
    dueDate: '2026-10-15',
    monthlyFee: 900,
    amountPaid: 900,
    pendingAmount: 0,
    paymentDate: '2026-10-14',
    paymentMethod: 'UPI',
    transactionReference: 'UPI/261014102931/PAYTM',
    verificationStatus: 'paid',
    extensionApplied: true,
    extensionSessionsAdded: 20,
    verifiedBy: 'Rohit Bansal (Admin)',
    verifiedAt: '2026-10-14T11:00:00Z'
  }
];
