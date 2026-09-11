import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Calculator,
  Users,
  GraduationCap,
  TrendingUp,
  ShieldAlert,
  Info,
  Sliders,
  Sparkles
} from 'lucide-react';
import { AttendanceRecord } from '../types';
import { AttendanceService } from '../server/services/studentToolkitService';

export const AttendanceAnalyzerView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');
  const [records, setRecords] = useState<AttendanceRecord[]>(() =>
    AttendanceService.getDemoRecords()
  );

  // Interactive "What-If" Calculator State
  const [calcTotal, setCalcTotal] = useState<number>(50);
  const [calcAttended, setCalcAttended] = useState<number>(42);
  const [calcMinRequired, setCalcMinRequired] = useState<number>(75);

  // Dynamic analysis for interactive calculator
  const calcResult = AttendanceService.analyze({
    id: 'calc-custom',
    subjectCode: 'SIM',
    subjectName: 'Custom Course Simulation',
    totalClasses: calcTotal,
    attendedClasses: calcAttended,
    minRequiredPercent: calcMinRequired,
    facultyName: 'Department Faculty'
  });

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
              <Calculator className="w-3.5 h-3.5 text-emerald-600" />
              <span>Deterministic Arithmetic • Transparent Formula</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Smart Attendance Analyzer
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Real-time eligibility tracking, shortage forecasting, and safe-absence limits for Aditya University students.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('student')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'student'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Personal View</span>
            </button>
            <button
              onClick={() => setActiveTab('teacher')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'teacher'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Teacher / Admin Overview</span>
            </button>
          </div>
        </div>

        {activeTab === 'student' ? (
          <>
            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(() => {
                const totalClassesAll = records.reduce((acc, r) => acc + r.totalClasses, 0);
                const attendedAll = records.reduce((acc, r) => acc + r.attendedClasses, 0);
                const overallPercent = Math.round((attendedAll / totalClassesAll) * 1000) / 10;
                const safeCount = records.filter(r => (r.attendedClasses / r.totalClasses) >= 0.75).length;
                const atRiskCount = records.length - safeCount;

                return (
                  <>
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Semester Aggregate
                      </div>
                      <div className="text-3xl font-extrabold text-slate-900 mt-2">
                        {overallPercent}%
                      </div>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Aditya Min Requirement: 75.0%</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Total Classes
                      </div>
                      <div className="text-3xl font-extrabold text-slate-900 mt-2">
                        {attendedAll} <span className="text-base font-medium text-slate-400">/ {totalClassesAll}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Across {records.length} registered subjects
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Safe Courses
                      </div>
                      <div className="text-3xl font-extrabold text-emerald-600 mt-2">
                        {safeCount} <span className="text-base font-normal text-slate-400">Courses</span>
                      </div>
                      <div className="text-xs text-emerald-700 font-medium mt-1">
                        Above 75% exam eligibility mark
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Attention Required
                      </div>
                      <div className={`text-3xl font-extrabold mt-2 ${atRiskCount > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                        {atRiskCount} <span className="text-base font-normal text-slate-400">Courses</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {atRiskCount > 0 ? 'Shortage alert triggered' : 'All courses in safe zone'}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Subject Breakdown List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">
                  Subject-Wise Attendance & "Days You Can Afford to Miss"
                </h2>
                <span className="text-xs text-slate-500">
                  Aditya University Regulations (NAAC A++ Academic Guidelines)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {records.map(record => {
                  const analysis = AttendanceService.analyze(record);
                  return (
                    <div
                      key={record.id}
                      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs font-mono font-bold text-slate-400">
                            {record.subjectCode}
                          </div>
                          <div className="font-bold text-sm text-slate-900 mt-0.5">
                            {record.subjectName}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Faculty: {record.facultyName}
                          </div>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${
                            analysis.status === 'safe'
                              ? 'bg-emerald-100 text-emerald-800'
                              : analysis.status === 'warning'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {analysis.currentPercent}%
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>Attended: {record.attendedClasses} / {record.totalClasses} classes</span>
                          <span className="font-medium">Req: {record.minRequiredPercent}%</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden relative">
                          <div
                            className={`h-full rounded-full transition-all ${
                              analysis.status === 'safe'
                                ? 'bg-emerald-500'
                                : analysis.status === 'warning'
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${Math.min(100, analysis.currentPercent)}%` }}
                          />
                          <div
                            className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10"
                            style={{ left: `${record.minRequiredPercent}%` }}
                            title="75% Minimum Threshold"
                          />
                        </div>
                      </div>

                      {/* Safe Absences or Recovery Metric */}
                      <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                        analysis.status === 'safe'
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                          : analysis.status === 'warning'
                          ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                          : 'bg-rose-50/70 border-rose-200 text-rose-900'
                      }`}>
                        {analysis.status === 'safe' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : analysis.status === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        )}

                        <div>
                          <div className="font-bold">
                            {analysis.status === 'safe'
                              ? `You can afford to miss: ${analysis.daysAffordToMiss} upcoming class${analysis.daysAffordToMiss === 1 ? '' : 'es'}`
                              : analysis.status === 'warning'
                              ? `Approaching shortage: Can afford to miss only ${analysis.daysAffordToMiss} class`
                              : `Eligibility Shortage: Attend next ${analysis.classesNeededToRecover} consecutive classes to recover`}
                          </div>
                          <div className="text-[11px] opacity-90 mt-0.5">
                            {analysis.alertMessage}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive "What-If" Absence Simulation Calculator */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Interactive "What-If" Absence Simulator
                </h3>
              </div>
              <p className="text-xs text-slate-600">
                Simulate your attendance percentage before deciding to miss or attend upcoming lectures. All arithmetic is computed deterministically in code.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Total Classes Held</label>
                  <input
                    type="number"
                    min="10"
                    max="120"
                    value={calcTotal}
                    onChange={(e) => {
                      const val = Math.max(1, parseInt(e.target.value, 10) || 1);
                      setCalcTotal(val);
                      if (calcAttended > val) setCalcAttended(val);
                    }}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Classes Attended</label>
                  <input
                    type="number"
                    min="0"
                    max={calcTotal}
                    value={calcAttended}
                    onChange={(e) => {
                      const val = Math.min(calcTotal, Math.max(0, parseInt(e.target.value, 10) || 0));
                      setCalcAttended(val);
                    }}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Required Threshold (%)</label>
                  <input
                    type="number"
                    min="50"
                    max="90"
                    value={calcMinRequired}
                    onChange={(e) => setCalcMinRequired(parseInt(e.target.value, 10) || 75)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              {/* Formula & Result Display */}
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-xs text-slate-400 font-mono">
                    Calculated: ({calcAttended} / {calcTotal}) = <span className="text-amber-400 font-bold">{calcResult.currentPercent}%</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Formula: <span className="font-mono text-slate-300">Safe = ⌊(Attended - Req × Total) / Req⌋</span>
                  </div>
                </div>

                <div className="text-sm font-semibold text-slate-200">
                  {calcResult.alertMessage}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Teacher / Admin Attendance Analytics View (Section 19) */
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2 font-medium">
              <Info className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Institutional Demo Dataset:</strong> Displaying aggregated section analytics for B.Tech Computer Science Semester VI (Sections A, B, and C).
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600" />
                <span>Class-Wide Attendance Monitoring (Teacher Console)</span>
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                      <th className="pb-3 pl-2">Subject / Course</th>
                      <th className="pb-3">Faculty Instructor</th>
                      <th className="pb-3">Enrolled</th>
                      <th className="pb-3">Class Average</th>
                      <th className="pb-3">Students &lt;75%</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-3.5 pl-2 font-semibold text-slate-900">CS401: Cloud Computing</td>
                      <td className="py-3.5">Dr. K. Ramakrishna</td>
                      <td className="py-3.5">64 Students</td>
                      <td className="py-3.5 text-emerald-600 font-bold">86.5%</td>
                      <td className="py-3.5 text-emerald-700">3 students</td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                          Optimal
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-3.5 pl-2 font-semibold text-slate-900">CS402: Machine Learning</td>
                      <td className="py-3.5">Prof. S. Sunitha</td>
                      <td className="py-3.5">64 Students</td>
                      <td className="py-3.5 text-amber-600 font-bold">77.1%</td>
                      <td className="py-3.5 text-amber-700">12 students</td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-semibold">
                          Borderline
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-3.5 pl-2 font-semibold text-slate-900">CS403: Database Management</td>
                      <td className="py-3.5">Dr. V. Srinivas</td>
                      <td className="py-3.5">64 Students</td>
                      <td className="py-3.5 text-rose-600 font-bold">72.4%</td>
                      <td className="py-3.5 text-rose-700 font-bold">19 students</td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-semibold">
                          Shortage Drop
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
