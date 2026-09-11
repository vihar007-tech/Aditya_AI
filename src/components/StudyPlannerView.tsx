import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  BookOpen,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Plus,
  Trash2,
  ExternalLink,
  CalendarCheck,
  Zap,
  Info
} from 'lucide-react';
import { StudySubject, StudyPlanDay, StudySession } from '../types';
import { StudyPlannerService } from '../server/services/studentToolkitService';

export const StudyPlannerView: React.FC = () => {
  const [subjects, setSubjects] = useState<StudySubject[]>([
    {
      id: 'sub-1',
      name: 'Cloud Computing & Distributed Systems',
      priority: 'High',
      examDate: '2026-09-28',
      difficulty: 'Hard',
      targetHours: 18,
      completedHours: 4
    },
    {
      id: 'sub-2',
      name: 'Machine Learning & Neural Networks',
      priority: 'High',
      examDate: '2026-10-02',
      difficulty: 'Hard',
      targetHours: 16,
      completedHours: 3
    },
    {
      id: 'sub-3',
      name: 'Database Management & Big Data',
      priority: 'Medium',
      examDate: '2026-10-08',
      difficulty: 'Moderate',
      targetHours: 12,
      completedHours: 2
    },
    {
      id: 'sub-4',
      name: 'Professional Communication & Soft Skills',
      priority: 'Low',
      examDate: '2026-10-15',
      difficulty: 'Easy',
      targetHours: 8,
      completedHours: 1
    }
  ]);

  const [dailyHours, setDailyHours] = useState<number>(3);
  const [plan, setPlan] = useState<StudyPlanDay[]>(() =>
    StudyPlannerService.generatePlan(subjects, 3)
  );
  const [rescheduleNotice, setRescheduleNotice] = useState<string | null>(null);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  // New subject form states
  const [newSubName, setNewSubName] = useState('');
  const [newSubPriority, setNewSubPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newSubExam, setNewSubExam] = useState('2026-10-20');

  const handleGeneratePlan = () => {
    const newPlan = StudyPlannerService.generatePlan(subjects, dailyHours);
    setPlan(newPlan);
    setRescheduleNotice(null);
  };

  const handleMissedSession = (sessionId: string) => {
    const { updatedPlan, rebalancedMessage } = StudyPlannerService.reschedulePlan(plan, sessionId);
    setPlan(updatedPlan);
    setRescheduleNotice(rebalancedMessage);
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;
    const newSubject: StudySubject = {
      id: `sub-${Date.now()}`,
      name: newSubName.trim(),
      priority: newSubPriority,
      examDate: newSubExam,
      difficulty: 'Moderate',
      targetHours: 12,
      completedHours: 0
    };
    const updated = [...subjects, newSubject];
    setSubjects(updated);
    setNewSubName('');
    setPlan(StudyPlannerService.generatePlan(updated, dailyHours));
  };

  const handleDeleteSubject = (id: string) => {
    const updated = subjects.filter(s => s.id !== id);
    setSubjects(updated);
    if (updated.length > 0) {
      setPlan(StudyPlannerService.generatePlan(updated, dailyHours));
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Deterministic Scheduling + Real-Time Rescheduling</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Smart Study Planner
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Autonomous workload balancing tailored for Aditya University semester curricula and upcoming examinations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCalendarModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-colors"
            >
              <CalendarCheck className="w-4 h-4 text-slate-600" />
              <span>Connect Google Calendar</span>
            </button>
            <button
              onClick={handleGeneratePlan}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Recalculate Schedule</span>
            </button>
          </div>
        </div>

        {/* Real-time Reschedule Banner */}
        {rescheduleNotice && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-950 flex items-start gap-3 shadow-xs animate-in fade-in slide-in-from-top-2 duration-200">
            <Zap className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <div className="font-semibold text-amber-900">Dynamic Rebalancing Active</div>
              <p className="text-amber-800 mt-0.5">{rescheduleNotice}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Subjects & Controls */}
          <div className="space-y-6">
            {/* Daily Hours Slider */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-800">
                  Target Daily Study Time
                </label>
                <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 font-bold text-xs">
                  {dailyHours} Hours/Day
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="6"
                step="1"
                value={dailyHours}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setDailyHours(val);
                  setPlan(StudyPlannerService.generatePlan(subjects, val));
                }}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>1 hr (Light)</span>
                <span>3 hrs (Recommended)</span>
                <span>6 hrs (Intensive)</span>
              </div>
            </div>

            {/* Enrolled Subjects List */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span>Curriculum Subjects ({subjects.length})</span>
                </h2>
              </div>

              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {subjects.map(s => (
                  <div
                    key={s.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-semibold text-xs text-slate-900 truncate">
                        {s.name}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                        <span className={`px-1.5 py-0.5 rounded font-semibold text-[10px] ${
                          s.priority === 'High'
                            ? 'bg-rose-100 text-rose-700'
                            : s.priority === 'Medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {s.priority} Priority
                        </span>
                        <span>Exam: {s.examDate}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteSubject(s.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove subject"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Subject Form */}
              <form onSubmit={handleAddSubject} className="pt-3 border-t border-slate-200/80 space-y-2.5">
                <div className="text-xs font-semibold text-slate-700">Add New Subject</div>
                <input
                  type="text"
                  placeholder="Subject name (e.g. Operating Systems)"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-amber-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newSubPriority}
                    onChange={(e) => setNewSubPriority(e.target.value as any)}
                    className="px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                  <input
                    type="date"
                    value={newSubExam}
                    onChange={(e) => setNewSubExam(e.target.value)}
                    className="px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Study Roster</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Multi-Day Interactive Timetable */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>Generated Study Plan (7-Day Horizon)</span>
              </h2>
              <div className="text-xs text-slate-500 font-medium">
                Click "Missed Session" to trigger automatic dynamic redistribution
              </div>
            </div>

            <div className="space-y-4">
              {plan.map((day, dIdx) => (
                <div
                  key={day.date}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="font-bold text-slate-900 text-sm">{day.dayName}</span>
                      <span className="text-xs text-slate-400 font-medium">{day.date}</span>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {day.totalStudyMinutes / 60} hrs scheduled
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    {day.sessions.map((session) => (
                      <div
                        key={session.id}
                        className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          session.isMissed
                            ? 'bg-rose-50/80 border-rose-200 text-rose-900 opacity-75'
                            : session.isCompleted
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                            : 'bg-slate-50/70 border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {session.isMissed ? (
                              <AlertCircle className="w-4 h-4 text-rose-500" />
                            ) : session.isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Clock className="w-4 h-4 text-amber-500" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-slate-900 flex items-center gap-2">
                              <span>{session.subjectName}</span>
                              {session.isMissed && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-200 text-rose-800 font-bold uppercase">
                                  Missed
                                </span>
                              )}
                              {session.isCompleted && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-800 font-bold uppercase">
                                  Completed
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                              <span>{session.startTime} – {session.endTime} ({session.durationMinutes}m)</span>
                              <span>•</span>
                              <span>{session.topic}</span>
                            </div>
                          </div>
                        </div>

                        {!session.isMissed && !session.isCompleted && (
                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <button
                              onClick={() => handleMissedSession(session.id)}
                              className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 font-semibold text-xs transition-colors flex items-center gap-1"
                              title="Trigger intelligent rescheduling of missed session"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Missed Session</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Google Calendar OAuth Modal */}
        {showCalendarModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-slate-900 text-base">
                    Google Calendar Integration
                  </h3>
                </div>
                <button
                  onClick={() => setShowCalendarModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-700" />
                  <span>Free / Hackathon Local Mode Active</span>
                </div>
                <p>
                  Calendar integration is available when Google OAuth credentials (<code>GOOGLE_CLIENT_ID</code>) are configured in <code>.env</code>.
                </p>
                <p>
                  In Local Mode, study blocks are managed deterministically inside your browser and can be exported as an <code>.ics</code> calendar file.
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-700">Configured OAuth Scopes:</div>
                <ul className="text-xs text-slate-600 list-disc list-inside space-y-1">
                  <li><code>https://www.googleapis.com/auth/calendar.events</code></li>
                  <li><code>https://www.googleapis.com/auth/calendar.readonly</code></li>
                </ul>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    alert("Exporting study sessions to standard .ics calendar format for Google Calendar / Apple Calendar import.");
                    setShowCalendarModal(false);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs transition-colors"
                >
                  Export .ics Schedule
                </button>
                <button
                  onClick={() => setShowCalendarModal(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
