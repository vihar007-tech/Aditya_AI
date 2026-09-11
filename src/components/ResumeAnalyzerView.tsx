import React, { useState } from 'react';
import {
  FileText,
  UploadCloud,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Copy,
  Check,
  BarChart,
  ShieldCheck,
  RefreshCw,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ResumeAnalyzerService } from '../server/services/studentToolkitService';
import { ResumeAnalysisResult, BulletRewriteResult } from '../types';

export const ResumeAnalyzerView: React.FC = () => {
  const defaultResumeText = `K. VENKATA SAI
B.Tech in Computer Science & Engineering, Aditya University (CGPA: 8.7)
Surampalem, Andhra Pradesh | sai.k@adityauniversity.in | github.com/sai-aditya

TECHNICAL SKILLS:
Languages: Python, TypeScript, JavaScript, SQL, C++
Frameworks: React, Node.js, Express, Tailwind CSS
Databases & Tools: PostgreSQL, MongoDB, Git, Docker, Linux, Google Cloud

ACADEMIC & CAPSTONE PROJECTS:
• Campus Smart Transport Route Tracker:
  Built a web portal using React, Node.js, and Google Maps API for tracking university bus fleets.
  Implemented GPS location polling and interactive boarding bay search for 400+ campus buses.

• Autonomous Library RFID Kiosk:
  Designed a book inventory retrieval service with Python and SQLite.
  Integrated barcode scanning and automated student due date email reminders.

CAMPUS ACHIEVEMENTS & CERTIFICATIONS:
• Google Cloud Career Readiness Associate Cloud Engineer Badge (Aditya CoE).
• Finalist, AP State Smart India Hackathon 2025.
• Vice President, Aditya Coding Club (Organized 3 competitive programming contests).`;

  const defaultJobDesc = `We are seeking an Associate Software Engineer for our Cloud Platforms team.
Requirements:
• Strong foundation in Python, TypeScript, and modern web frameworks (React, Node.js).
• Familiarity with REST APIs, SQL databases (PostgreSQL), and Docker containerization.
• Knowledge of CI/CD workflows, automated testing, and agile development methodologies.
• Excellent communication skills and passion for scalable distributed systems.`;

  const [resumeText, setResumeText] = useState(defaultResumeText);
  const [jobDescription, setJobDescription] = useState(defaultJobDesc);
  const [analysis, setAnalysis] = useState<ResumeAnalysisResult | null>(() =>
    ResumeAnalyzerService.analyze(defaultResumeText, defaultJobDesc)
  );

  // Bullet rewriter states
  const [sampleBullet, setSampleBullet] = useState(
    'Built a web portal using React, Node.js, and Google Maps API for tracking university bus fleets.'
  );
  const [rewriteMode, setRewriteMode] = useState<'concise' | 'impact' | 'technical' | 'atsFriendly'>('impact');
  const [rewriteResult, setRewriteResult] = useState<BulletRewriteResult>(() =>
    ResumeAnalyzerService.rewriteBullet(sampleBullet)
  );
  const [copied, setCopied] = useState(false);

  const handleAnalyze = () => {
    if (!resumeText.trim()) return;
    const res = ResumeAnalyzerService.analyze(resumeText, jobDescription);
    setAnalysis(res);
  };

  const handleRewrite = () => {
    if (!sampleBullet.trim()) return;
    const res = ResumeAnalyzerService.rewriteBullet(sampleBullet);
    setRewriteResult(res);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          setResumeText(content);
          setAnalysis(ResumeAnalyzerService.analyze(content, jobDescription));
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>ATS Compatibility & Placement Benchmark Engine</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              AI Resume Analyzer
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Extract skills, optimize bullet points for campus placements, and test ATS keywords against target tech roles.
            </p>
          </div>

          <button
            onClick={handleAnalyze}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition-colors shadow-sm self-start md:self-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Run ATS Analysis</span>
          </button>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resume Text / File Upload */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>Student Resume Content</span>
              </label>

              <label className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors">
                <UploadCloud className="w-3.5 h-3.5 text-slate-600" />
                <span>Upload TXT/DOCX</span>
                <input
                  type="file"
                  accept=".txt,.docx,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <textarea
              rows={11}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste student resume text here..."
              className="w-full p-3.5 text-xs font-mono rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-amber-500 transition-all leading-relaxed"
            />
          </div>

          {/* Target Job Description */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Target Job Description (Optional for ATS Match)</span>
              </label>
              <span className="text-[11px] text-slate-400 font-medium">Campus Placement Role</span>
            </div>

            <textarea
              rows={11}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job description or campus recruiter criteria here..."
              className="w-full p-3.5 text-xs font-mono rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-amber-500 transition-all leading-relaxed"
            />
          </div>
        </div>

        {/* Analysis Results Display */}
        {analysis && (
          <div className="space-y-6">
            {/* Top Score Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Resume Quality Score
                </div>
                <div className="text-4xl font-black text-slate-900 mt-2 flex items-baseline gap-1">
                  <span>{analysis.overallScore}</span>
                  <span className="text-base text-slate-400 font-medium">/ 100</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Evaluated across structure, skills, and quantified impact
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  ATS Match Rate
                </div>
                <div className="text-4xl font-black text-blue-600 mt-2 flex items-baseline gap-1">
                  <span>{analysis.atsCompatibilityPercent}%</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Keyword alignment with provided job requirements
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Extracted Tech Skills
                </div>
                <div className="text-4xl font-black text-emerald-600 mt-2 flex items-baseline gap-1">
                  <span>{analysis.extractedSkills.length}</span>
                  <span className="text-base text-slate-400 font-medium">Verified</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Recognized in official curriculum taxonomy
                </div>
              </div>
            </div>

            {/* Keyword Match Breakdown */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BarChart className="w-4 h-4 text-amber-600" />
                <span>ATS Keyword Coverage Analysis</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                  <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Matched Keywords ({analysis.matchedKeywords.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.matchedKeywords.map(k => (
                      <span key={k} className="px-2.5 py-1 rounded-md bg-white border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-2xs">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2">
                  <div className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Missing Keywords ({analysis.missingKeywords.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.missingKeywords.map(k => (
                      <span key={k} className="px-2.5 py-1 rounded-md bg-white border border-rose-200 text-rose-800 text-xs font-semibold shadow-2xs">
                        +{k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Anonymous Benchmark Comparison (Section 23) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Anonymous Benchmark Mode (Privacy-Safe)</span>
                </h3>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                  Demo Benchmark Dataset
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your resume profile is compared strictly against synthetic role rubrics and anonymized candidate cohorts. No identifiable student data is ever accessed or exposed.
              </p>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    Role Benchmark: {analysis.benchmarkComparison.role}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Benchmark Target Score: {analysis.benchmarkComparison.benchmarkScore} | Skills Coverage: {analysis.benchmarkComparison.skillsCoveragePercent}%
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500">Estimated Cohort Percentile</div>
                  <div className="text-xl font-extrabold text-amber-600">
                    Top {100 - analysis.benchmarkComparison.percentile}% Tier
                  </div>
                </div>
              </div>
            </div>

            {/* Auto Bullet Rewriting (Section 22) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Auto Bullet Point Rewriter</span>
                </h3>
                <span className="text-xs text-slate-500">Transform weak descriptions into impactful bullets</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Original Bullet Point</label>
                  <input
                    type="text"
                    value={sampleBullet}
                    onChange={(e) => setSampleBullet(e.target.value)}
                    placeholder="Enter an existing resume bullet point..."
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700">Rewrite Style:</span>
                  {(['impact', 'concise', 'technical', 'atsFriendly'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => {
                        setRewriteMode(mode);
                        handleRewrite();
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        rewriteMode === mode
                          ? 'bg-amber-500 text-white shadow-2xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {mode === 'impact' && 'Impact-Focused'}
                      {mode === 'concise' && 'Concise'}
                      {mode === 'technical' && 'Technical Depth'}
                      {mode === 'atsFriendly' && 'ATS-Optimized'}
                    </button>
                  ))}
                </div>

                {/* Rewritten Result Display */}
                <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 relative group">
                  <div className="text-[11px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span>Improved Version ({rewriteMode.toUpperCase()})</span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    • {rewriteResult.rewritten[rewriteMode]}
                  </p>

                  <button
                    onClick={() => handleCopyText(`• ${rewriteResult.rewritten[rewriteMode]}`)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-xs"
                    title="Copy bullet"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
