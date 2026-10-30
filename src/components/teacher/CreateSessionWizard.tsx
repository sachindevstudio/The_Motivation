import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SessionMode, SessionType, SessionRecord, Student } from '../../types';
import { DailyVideoService } from '../../services/dailyService';
import { generatePrefilledWhatsAppMessage, generateWhatsAppUrl } from '../../utils/rules';
import {
  Video,
  Building,
  Users,
  User,
  Calendar,
  Clock,
  CheckCircle2,
  Copy,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Share2,
  Info
} from 'lucide-react';

export const CreateSessionWizard: React.FC = () => {
  const {
    currentUser,
    therapies,
    students,
    enrollments,
    createSession,
    setActiveTab,
    addToast
  } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Wizard state
  const [sessionMode, setSessionMode] = useState<SessionMode>('online');
  const [selectedTherapyId, setSelectedTherapyId] = useState<string>('th-psych');
  const [sessionType, setSessionType] = useState<SessionType>('individual');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [sessionDate, setSessionDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState<string>('11:00 AM');
  const [expectedDuration, setExpectedDuration] = useState<number>(45);
  const [teacherNotes, setTeacherNotes] = useState<string>('');

  // Generated session output state (Step 6)
  const [createdSession, setCreatedSession] = useState<SessionRecord | null>(null);

  // Available students enrolled in selected therapy
  const availableStudents = students.filter(st => {
    const studentEnrs = enrollments.filter(e => e.studentId === st.id);
    return studentEnrs.some(e => e.therapyId === selectedTherapyId);
  });

  const selectedTherapy = therapies.find(t => t.id === selectedTherapyId) || therapies[0];

  const handleToggleStudent = (studentId: string) => {
    if (sessionType === 'individual') {
      setSelectedStudentIds([studentId]);
    } else {
      setSelectedStudentIds(prev =>
        prev.includes(studentId)
          ? (prev.length > 1 ? prev.filter(id => id !== studentId) : prev)
          : [...prev, studentId]
      );
    }
  };

  const handleGenerateSession = async () => {
    if (selectedStudentIds.length === 0) {
      addToast('warning', 'Please select at least one student');
      return;
    }

    const participants = selectedStudentIds.map(stId => {
      const st = students.find(s => s.id === stId);
      return {
        studentId: stId,
        studentName: st?.fullName || 'Student',
        joined: sessionMode === 'offline', // For offline teacher marks initial submitted present
        attendanceDurationMinutes: sessionMode === 'offline' ? expectedDuration : 0,
        eligibleForDeduction: sessionMode === 'offline',
        deductionStatus: 'pending' as const
      };
    });

    let roomUrl = undefined;
    let roomId = undefined;

    if (sessionMode === 'online') {
      const dailyRoom = await DailyVideoService.createMeeting(
        selectedTherapy.name,
        sessionType,
        Date.now().toString()
      );
      roomUrl = dailyRoom.url;
      roomId = dailyRoom.id;
    }

    const newRecord = createSession({
      teacherId: currentUser.teacherId || 'tch-1',
      teacherName: currentUser.name,
      therapyId: selectedTherapy.id,
      therapyName: selectedTherapy.name,
      mode: sessionMode,
      type: sessionType,
      date: sessionDate,
      scheduledStartTime: startTime,
      totalDurationMinutes: expectedDuration,
      status: sessionMode === 'online' ? 'waiting' : 'awaiting_verification',
      verificationStatus: sessionMode === 'online' ? 'pending_admin' : 'awaiting_secretary',
      meetingRoomUrl: roomUrl,
      meetingId: roomId,
      participants,
      teacherNotes: teacherNotes || undefined
    });

    setCreatedSession(newRecord);
    setCurrentStep(6);
  };

  const handleCopyLink = () => {
    if (createdSession?.meetingRoomUrl) {
      navigator.clipboard.writeText(createdSession.meetingRoomUrl);
      addToast('success', 'Meeting Link Copied', 'Paste this link to parents or students.');
    }
  };

  const handleShareWhatsApp = (student: Student) => {
    if (!createdSession) return;
    const msg = generatePrefilledWhatsAppMessage('session_invite', {
      studentName: student.fullName,
      parentName: student.parentName,
      therapyName: createdSession.therapyName,
      sessionTime: `${createdSession.scheduledStartTime} on ${createdSession.date}`,
      meetingUrl: createdSession.meetingRoomUrl
    });
    const url = generateWhatsAppUrl(student.parentPhone, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create New Therapy Session</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step wizard for scheduling online Daily.co video meetings or physical centre sessions.
          </p>
        </div>

        {/* Step indicator */}
        <div className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
          Step <span className="font-bold text-indigo-700">{currentStep}</span> of 6
        </div>
      </div>

      {/* Progress Pills */}
      <div className="flex items-center justify-between gap-1">
        {[
          '1. Mode',
          '2. Therapy',
          '3. Type',
          '4. Students',
          '5. Details',
          '6. Generate'
        ].map((title, idx) => {
          const stepNum = idx + 1;
          const isDone = currentStep > stepNum;
          const isCurrent = currentStep === stepNum;

          return (
            <div
              key={title}
              className={`flex-1 py-1.5 text-center text-[10px] font-bold rounded-lg border transition-all ${
                isCurrent
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : isDone
                  ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                  : 'bg-white text-slate-400 border-slate-200'
              }`}
            >
              {title}
            </div>
          );
        })}
      </div>

      {/* Wizard Card Body */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        
        {/* STEP 1: Select Session Mode */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Step 1: Select Session Delivery Mode</h3>
              <p className="text-xs text-slate-500">Choose between real-time video tele-therapy or an in-person centre session</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                onClick={() => setSessionMode('online')}
                className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  sessionMode === 'online'
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-100 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
                  <Video className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Online Video Session (Daily.co)</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Generates an instant Daily.co meeting link with telemetry for participant join/leave timestamps.
                </p>
                <span className="inline-block mt-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                  DEMO MODE Ready
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSessionMode('offline')}
                className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  sessionMode === 'offline'
                    ? 'border-amber-600 bg-amber-50/50 ring-2 ring-amber-100 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                  <Building className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Offline Physical Session (Centre)</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Conducted at The Motivation clinic. Moves to Secretary physical register confirmation workflow.
                </p>
                <span className="inline-block mt-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  Dual-Verification Workflow
                </span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Select Therapy Discipline */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Step 2: Select Therapy Service</h3>
              <p className="text-xs text-slate-500">Pick the therapeutic curriculum for this session</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {therapies.map(therapy => (
                <button
                  key={therapy.id}
                  type="button"
                  onClick={() => setSelectedTherapyId(therapy.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    selectedTherapyId === therapy.id
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{therapy.name}</span>
                    <span className="font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100">
                      {therapy.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{therapy.description}</p>
                  <div className="mt-2 text-[11px] text-slate-400">
                    Standard Tariff: ₹{therapy.defaultMonthlyFee} / {therapy.defaultPackageSessions} sessions
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Select Session Type (Individual vs Group) */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Step 3: Select Session Format</h3>
              <p className="text-xs text-slate-500">Individual 1-on-1 focus or small group peer interaction</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSessionType('individual');
                  if (selectedStudentIds.length > 1) setSelectedStudentIds([selectedStudentIds[0]]);
                }}
                className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  sessionType === 'individual'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-2 ring-indigo-100'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
                  <User className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Individual 1-on-1 Session</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Single student focus. Personalized therapeutic interventions.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSessionType('group')}
                className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  sessionType === 'group'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-2 ring-indigo-100'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Group Therapy Session (2–5 Students)</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Peer interaction & social stories. Counts as 1 session for teacher, deductions apply per attendee upon approval.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Select Student(s) */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Step 4: Select Student{sessionType === 'group' ? 's (Multi-Select Allowed)' : ' (Single Select)'}
                </h3>
                <p className="text-xs text-slate-500">
                  Showing students actively enrolled in {selectedTherapy.name}
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-700">
                {selectedStudentIds.length} Selected
              </span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {availableStudents.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs italic">
                  No active students currently enrolled in this therapy.
                </div>
              ) : (
                availableStudents.map(student => {
                  const isChecked = selectedStudentIds.includes(student.id);
                  const enrollment = enrollments.find(
                    e => e.studentId === student.id && e.therapyId === selectedTherapyId
                  );

                  return (
                    <label
                      key={student.id}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? 'border-indigo-500 bg-indigo-50/50 font-semibold'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type={sessionType === 'individual' ? 'radio' : 'checkbox'}
                          name="selectedStudent"
                          checked={isChecked}
                          onChange={() => handleToggleStudent(student.id)}
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">{student.fullName}</span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {student.studentCode} • Parent: {student.parentName}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-indigo-700">
                          {enrollment ? `${enrollment.remainingSessions}/${enrollment.totalAllowedSessions} sessions left` : ''}
                        </span>
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* STEP 5: Session Details (Date, Duration, Notes) */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Step 5: Session Timing & Clinical Notes</h3>
              <p className="text-xs text-slate-500">Specify scheduled time and expected therapeutic goals</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Session Date *</label>
                <input
                  type="date"
                  required
                  value={sessionDate}
                  onChange={e => setSessionDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Start Time *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 11:30 AM"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Duration (Minutes) *</label>
                <input
                  type="number"
                  min={15}
                  max={90}
                  step={5}
                  required
                  value={expectedDuration}
                  onChange={e => setExpectedDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                />
              </div>
            </div>

            <div className="text-xs pt-1">
              <label className="block font-semibold text-slate-700 mb-1">Session Objectives & Notes</label>
              <textarea
                rows={3}
                placeholder="e.g. Visual routine tracking, emotional thermometer regulation exercises, sensory feedback..."
                value={teacherNotes}
                onChange={e => setTeacherNotes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}

        {/* STEP 6: Generated Session Hub */}
        {currentStep === 6 && createdSession && (
          <div className="space-y-5">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <h4 className="font-bold text-emerald-900 text-sm">Session Successfully Created!</h4>
                <p className="text-emerald-800 mt-0.5">
                  {createdSession.mode === 'online'
                    ? 'Daily.co video meeting room is active and ready for participants.'
                    : 'Offline session submitted and logged in Awaiting Secretary Confirmation status.'}
                </p>
              </div>
            </div>

            {/* Online Meeting Controls */}
            {createdSession.mode === 'online' ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                      Daily.co Video Meeting Room Link
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/30 text-indigo-200 rounded-full border border-indigo-400/30">
                      DEMO MODE
                    </span>
                  </div>

                  <div className="p-3 bg-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs font-mono text-indigo-300 break-all">
                    <span>{createdSession.meetingRoomUrl}</span>
                    <button
                      onClick={handleCopyLink}
                      className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shrink-0"
                      title="Copy Link"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <a
                      href={createdSession.meetingRoomUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-2"
                    >
                      <Video className="w-4 h-4" />
                      <span>Start Online Session (New Tab)</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </a>

                    <button
                      onClick={handleCopyLink}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </button>
                  </div>
                </div>

                {/* WhatsApp Invites to Enrolled Students */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <span className="font-bold text-slate-900 block">
                    Share Meeting Link with Parents via WhatsApp:
                  </span>
                  <div className="space-y-2">
                    {createdSession.participants.map(p => {
                      const studentObj = students.find(s => s.id === p.studentId);
                      if (!studentObj) return null;

                      return (
                        <div
                          key={p.studentId}
                          className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200"
                        >
                          <div>
                            <span className="font-bold text-slate-900">{studentObj.fullName}</span>
                            <span className="text-[11px] text-slate-500 block">
                              Parent: {studentObj.parentName} ({studentObj.parentPhone})
                            </span>
                          </div>

                          <button
                            onClick={() => handleShareWhatsApp(studentObj)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-1 transition-colors text-[11px]"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>Send Invite</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* Offline Submission Confirmation */
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs space-y-2">
                <h4 className="font-bold text-amber-950">Next Step: Physical Register Confirmation</h4>
                <p className="text-amber-900 leading-relaxed">
                  Your offline session submission with {createdSession.participants.length} student(s) has been recorded in the central database. The Secretary will independently verify student presence from the physical centre sign-in register before final Admin approval.
                </p>
              </div>
            )}

            {/* Done button */}
            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Go to My Session History →
              </button>
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        {currentStep < 6 && (
          <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-6">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                currentStep === 1
                  ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 4 && selectedStudentIds.length === 0) {
                    addToast('warning', 'Please select at least one student');
                    return;
                  }
                  setCurrentStep(prev => prev + 1);
                }}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerateSession}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Session</span>
              </button>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
