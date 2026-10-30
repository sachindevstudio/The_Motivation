# The Motivation — Therapy & Educational Session Management System
### *Interactive Client-Facing MVP Demo & Operations Platform*

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Daily.co](https://img.shields.io/badge/Daily.co-Video_Telemetry-4A3AFF?logo=google-meet&logoColor=white)](https://www.daily.co/)
[![Tests](https://img.shields.io/badge/Tests-Passing_(node:test)-success)](#unit-tests--logic-verification)

---

## 📌 Executive Summary

**The Motivation** is an educational and therapeutic institution providing specialized sessions to children and students across disciplines such as **Psychology, Behaviour Therapy, Special Education, and Remedial Classes**.

Historically, session tracking, student package balances, physical attendance registers, teacher hours, and fee collections were manually handled across disparate Excel spreadsheets, paper registers, and WhatsApp chats. 

This application is an **interactive SaaS management prototype** designed to demonstrate how all clinical and operational workflows can be centralized into a cohesive, role-based platform with robust business rules, dual-verification workflows, and real-time telemetry.

> **Note on Architecture:** This is a zero-backend, client-facing functional MVP. All data mutations persist client-side via `localStorage`, accompanied by deterministic seed datasets and zero external API dependencies.

---

## 🏢 Organization Profile & Scale

| Metric | Current Scope |
| :--- | :--- |
| **Organization Name** | The Motivation — Therapy & Educational Centre |
| **Active Students** | ~65 students (14 detailed sample profiles in seed dataset) |
| **Therapists & Teachers** | ~16 staff members (8 detailed specialist profiles in seed dataset) |
| **Core Therapies** | Psychology, Behaviour Therapy, Special Education, Remedial Classes |
| **Session Delivery Modes** | Online (Daily.co Video Rooms) & Offline (Physical Clinic) |
| **Session Formats** | Individual (1-on-1) & Small Group (2–5 students) |
| **Daily Session Volume** | 6–7 maximum concurrent sessions |
| **Monthly Sessions** | ~250 total online & offline sessions |

---

## 🌟 Key Functional Highlights

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │                     THE MOTIVATION UNIFIED SYSTEM                      │
 └────────────────────────────────────────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    ▼                               ▼                               ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│   ADMIN PANEL    │      │  TEACHER PANEL   │      │ SECRETARY PANEL  │
│                  │      │                  │      │                  │
│ • Live Telemetry │      │ • Session Wizard │      │ • Centre Sign-in │
│ • Dual-Audit Log │      │ • Assigned Kids  │      │ • Independent    │
│ • Fee & Receipts │      │ • Live Rooms     │      │   Verification   │
│ • Staff Payroll  │      │ • Monthly Hours  │      │ • Mismatch Alert │
└──────────────────┘      └──────────────────┘      └──────────────────┘
```

### 1. Multi-Therapy Package Accounting
- A single student can be concurrently enrolled in multiple therapies (e.g., **Aarav Sharma**: *Psychology* @ ₹800/mo, *Behaviour Therapy* @ ₹900/mo, and *Special Education* @ ₹700/mo).
- Each therapy maintains its own monthly tariff, total allowed sessions, sessions consumed, and remaining balance.
- Remaining balances decrement **only upon approved, verified session attendance**.

### 2. Live Online Video Telemetry (Daily.co Simulation Architecture)
- Clean service abstraction in `src/services/dailyService.ts` ready for production Daily.co webhook integration (`meeting.started`, `participant.joined`, `participant.left`, `meeting.ended`).
- **Telemetry Threshold Rule:** Only participants who connect **and** remain in session for at least the configurable threshold (**&ge; 15 minutes**) qualify for package deduction.
- Interactive controls allow simulating students joining, leaving early, or failing to report.

### 3. Dual-Record Offline Verification (Clinic Anti-Fraud)
- **Teacher Record:** Therapist submits date, duration, and students present.
- **Secretary Record:** Front desk staff independently cross-checks the physical clinic entrance sign-in sheet.
- **Mismatch Engine:** Highlights any discrepancies (e.g., teacher reports 3 attendees, but secretary register shows only 2 were present at the clinic).
- Admin retains final discretion to inspect discrepancies and approve only eligible attendees.

### 4. Fee Reconciliation & Proof Verification
- Parents upload UPI / bank transaction receipts.
- **Manual Verification Discipline:** Uploaded screenshots do not automatically extend session balances.
- Admin inspects the receipt screenshot; clicking **Verify Payment** immediately reconciles the ledger and credits the student package by the enrolled session count.

### 5. Parent WhatsApp Click-to-Chat Reminders
- Compliant with WhatsApp standards using universal `https://wa.me/<number>?text=<encoded>` URLs.
- Pre-filled professional templates for:
  - Pending Fee Reminders
  - Package Expiry & Renewal Alerts
  - Live Online Meeting Invites
  - Custom Therapist Notes
- No third-party WhatsApp Business API fees or credentials required.

### 6. Therapist Hours & Payroll Analytics
- Automatic computation of therapist teaching hours, individual vs. group split, and online vs. clinic ratio.
- 1-click **Export CSV** and **Print Report** formats for external payroll and accounting software.

---

## 👥 Role-Based Workspaces & Demo Credentials

Use the top navigation bar to switch personas on the fly:

| Role | Demo Identity | Access Email | Scope & Responsibilities |
| :--- | :--- | :--- | :--- |
| **Admin** | Rohit Bansal (Director & Admin) | `admin@themotivation.demo` | Full organization access, pricing, telemetry monitoring, dual-record verification, payment approvals, and payroll reporting. |
| **Teacher / Therapist** | Dr. Ananya Roy (Lead Psychologist) | `teacher@themotivation.demo` | Simple clinical interface: assigned student profiles, 6-step session creation wizard, meeting links, and teaching hours. |
| **Secretary** | Sunita Sharma (Front Desk & Ops) | `secretary@themotivation.demo` | Physical sign-in register cross-check, attendance confirmation, and discrepancy reporting. |

---

## 🧪 Interactive Demo Scenarios

Use the floating **Fast Demo Scenario Switcher** in the footer to evaluate core journeys:

### Scenario 1: Add a Student with Multi-Therapy Packages
1. Navigate to **Students & Enrollments** &rarr; click **Add New Student**.
2. Enter student name, age, and parent WhatsApp contact.
3. Check multiple therapies (e.g. *Psychology* + *Remedial Classes*), customize individual monthly fees and session allocations.
4. Submit: Student immediately reflects in the centralized directory with discrete therapy progress cards.

### Scenario 2: Create & Run an Online Video Session
1. Switch to **Teacher Panel** &rarr; open **Create New Session**.
2. Select **Online** &rarr; choose **Psychology** &rarr; select **Group Session** &rarr; pick 2 or more assigned students.
3. Finish wizard: Daily.co meeting URL is generated alongside click-to-chat WhatsApp invites.
4. Switch to **Admin Panel** &rarr; **Online Monitoring**:
   - View live elapsed meeting timer.
   - Click **Simulate Student Leaving** on one student before 15 minutes.
   - Note the status switches to **Below 15m** threshold warning.
   - End meeting and approve: only students with &ge;15m attendance have their package decremented.

### Scenario 3: Offline Clinic Register Mismatch Check
1. Switch to **Secretary Panel** &rarr; **Verify Offline Sessions**.
2. Select session `SES-2026-085` (Priya Nambiar submitted 3 students: Aarav, Vihaan, and Saanvi).
3. The secretary unchecks *Saanvi Nair* (confirming absence from the clinic's physical register) and submits.
4. Switch to **Admin Panel** &rarr; **Offline Verification**:
   - Visual alert flags **Attendance Mismatch**.
   - Admin approves session: Aarav and Vihaan's packages are deducted; Saanvi's balance is preserved untouched.

### Scenario 4: Payment Verification & Package Auto-Credit
1. Navigate to **Fees & Payments** &rarr; filter by **Awaiting Proof Verification**.
2. Select receipt `RCP-2026-101` for *Kabir Verma*.
3. Click **Verify Proof** &rarr; review uploaded UPI payment screenshot.
4. Click **Verify Payment & Credit Sessions**:
   - Payment status updates to **Paid**.
   - Kabir's Psychology package balance is automatically credited with 20 sessions and validity extended by 30 days.

### Scenario 5: Direct WhatsApp Reminders
1. Navigate to **WhatsApp Reminders**.
2. Notice students with overdue fees or low remaining session balances (&le; 3 sessions).
3. Click **Remind Fee** on any row: opens WhatsApp in a new tab with pre-filled message, student name, therapy, and fee amount.

### Scenario 6: Staff Payroll & Teaching Hours Export
1. Navigate to **Reports & Analytics**.
2. Review teacher-wise session breakdown: individual, group, online, clinic, and cumulative teaching hours.
3. Click **Export CSV** to download a clean spreadsheet ready for payroll processing.

---

## 🧮 Pure Business Logic & Rules Engine

Core business rules are decoupled from UI components in `src/utils/rules.ts` and covered by automated unit tests:

```typescript
// 1. Participant Minimum Threshold Evaluation
calculateParticipantEligibility(joined: boolean, durationMinutes: number, minThreshold: number = 15)

// 2. Dual-Record Offline Discrepancy Detection
checkOfflineMismatch(teacherStudentIds, secretaryStudentIds, teacherDuration, secretaryDuration)

// 3. Safe Session Approval & Deduction (Idempotent, Prevents Double-Deduction)
applySessionApprovalDeductions(session, enrollments, adminName)

// 4. Compliant WhatsApp Click-to-Chat URI Formatter
generateWhatsAppUrl(phone: string, text: string)
```

---

## 💻 Tech Stack & Architecture

- **Framework:** React 19 (Functional components, custom hooks, typed context)
- **Language:** TypeScript 5.x (Strict type safety, zero `any` shortcuts)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`, responsive breakpoints, modern color palettes)
- **Icons:** Lucide React
- **Charts & Visualization:** Recharts (Responsive bar charts, donut distribution, custom tooltips)
- **Persistence:** LocalStorage with dynamic schema versioning and instant reset capability
- **Test Runner:** Node.js native test runner (`node:test`, `node:assert/strict`) via `tsx`
- **Build System:** Vite 8.x

---

## 🚀 Local Development Setup

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone <your-repository-url>
cd <repository-folder>

# Install dependencies
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 3. Run Automated Unit Tests
```bash
npx --yes tsx --test src/utils/rules.test.ts
```
Expected output:
```
✔ calculateParticipantEligibility verifies threshold logic
✔ checkOfflineMismatch flags mismatched student counts and duration differences
✔ applySessionApprovalDeductions decrements remaining sessions only for eligible attendees and prevents duplicate deduction
✔ generateWhatsAppUrl creates properly formatted wa.me link
✔ generatePrefilledWhatsAppMessage formats message text properly
✔ formatCurrency handles Indian rupee formatting
ℹ tests 6 | pass 6 | fail 0
```

### 4. Build for Production
```bash
npm run build
```

---

## 🔄 Pushing Changes to GitHub

To link this repository to your GitHub account:

```bash
# 1. Initialize git (if not already initialized) and set default branch
git branch -M main

# 2. Stage all files
git add .

# 3. Commit changes
git commit -m "feat: complete interactive MVP demo for The Motivation session management system"

# 4. Link your remote GitHub repository
# Replace <YOUR_USERNAME> and <YOUR_REPO_NAME> with your GitHub repository URL:
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git

# 5. Push to GitHub
git push -u origin main
```

---

## 📁 Repository File Tree

```
├── .env.example                       # Environment variable templates
├── .gitignore                         # Git exclusion rules
├── index.html                         # Application entrypoint & SEO metadata
├── metadata.json                      # AI Studio application metadata
├── package.json                       # Dependencies and scripts
├── tsconfig.json                      # TypeScript compiler configuration
├── vite.config.ts                     # Vite build configuration
├── src/
│   ├── main.tsx                       # React DOM mount point
│   ├── App.tsx                        # Master layout, persona routes & demo footer
│   ├── index.css                      # Tailwind CSS v4 directives
│   ├── types/
│   │   └── index.ts                   # Domain entities (Students, Therapies, Sessions, Payments)
│   ├── data/
│   │   └── mockData.ts                # Realistic seed dataset (14 students, 8 therapists, 4 therapies)
│   ├── services/
│   │   └── dailyService.ts            # Daily.co video meeting service abstraction
│   ├── utils/
│   │   ├── rules.ts                   # Pure business logic (eligibility, mismatch, deductions, WhatsApp)
│   │   └── rules.test.ts              # Unit test suite for rules engine
│   ├── context/
│   │   └── AppContext.tsx             # Global application state & LocalStorage sync
│   └── components/
│       ├── layout/
│       │   ├── Header.tsx             # Navigation header, live ticker, persona switcher
│       │   └── Sidebar.tsx            # Contextual navigation sidebar & mobile drawer
│       ├── common/
│       │   └── ToastContainer.tsx     # Toast alert notifications system
│       ├── modals/
│       │   ├── AddStudentModal.tsx    # Multi-therapy student registration modal
│       │   ├── AddTeacherModal.tsx    # Staff onboarding & discipline assignment modal
│       │   ├── AddTherapyModal.tsx    # Therapy service & default tariff modal
│       │   ├── ViewStudentModal.tsx   # Comprehensive student profile & package inspection
│       │   ├── SessionDetailModal.tsx # Attendance inspection & admin approval trigger
│       │   ├── PaymentReceiptModal.tsx# Bank proof screenshot review & package extension
│       │   └── WhatsAppModal.tsx      # Pre-filled WhatsApp message launcher
│       ├── admin/
│       │   ├── AdminDashboard.tsx     # KPI summary cards, Recharts, live session grid
│       │   ├── StudentManagement.tsx  # Student directory, package balances & filters
│       │   ├── TeacherManagement.tsx  # Therapist teaching hours & session logs
│       │   ├── TherapyManagement.tsx  # Therapy catalog & default monthly charges
│       │   ├── SessionManagement.tsx  # Central session audit log with tabbed views
│       │   ├── OnlineSessionMonitoring.tsx # Real-time Daily.co telemetry & simulation hub
│       │   ├── OfflineSessionVerification.tsx # Dual-record clinic verification & mismatch audit
│       │   ├── PaymentManagement.tsx  # Ledger reconciliation, revenue KPIs & proof verification
│       │   ├── WhatsAppReminders.tsx  # Priority reminder queue with direct wa.me links
│       │   ├── ReportsAnalytics.tsx   # Teacher hours report, student balance CSV export & print view
│       │   └── SettingsView.tsx       # System thresholds & demo data reset
│       ├── teacher/
│       │   ├── TeacherDashboard.tsx   # Therapist workload, hours, and live meeting alert
│       │   ├── TeacherStudents.tsx    # Assigned student list & package allowances
│       │   ├── CreateSessionWizard.tsx# 6-step online & offline session creation wizard
│       │   └── TeacherSessionHistory.tsx # Clinical session history
│       └── secretary/
│           ├── SecretaryDashboard.tsx # Front desk overview & pending verification metrics
│           └── VerifyOfflineView.tsx  # Independent physical register check & discrepancy logger
```

---

## 📄 License & Organization Details

- **Organization:** The Motivation — Therapy & Educational Centre
- **Contact:** `contact@themotivation.org` | `+91 98765 43210`
- **Application Type:** Interactive Client-Facing MVP Prototype
- **License:** Apache-2.0
