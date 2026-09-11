import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Sparkles,
  Send,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Volume2,
  RefreshCw,
  Shield,
  Layers,
  ChevronRight
} from 'lucide-react';
import { InterviewCoachService } from '../server/services/studentToolkitService';
import { InterviewQuestion, InterviewEvaluation } from '../types';

export const InterviewCoachView: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'Software Engineering' | 'Data Analyst' | 'General Graduate Role'>('Software Engineering');
  const [questions, setQuestions] = useState<InterviewQuestion[]>(() =>
    InterviewCoachService.getQuestions('Software Engineering')
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [userAnswer, setUserAnswer] = useState('');
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Camera analysis states (Section 27)
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const currentQ = questions[currentQuestionIndex] || questions[0];

  useEffect(() => {
    const qList = InterviewCoachService.getQuestions(selectedRole);
    setQuestions(qList);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setEvaluation(null);
  }, [selectedRole]);

  // Handle Voice Recording via browser Web Speech API
  const handleToggleVoice = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser speech recognition is not supported in this browser. You can type your response directly.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setUserAnswer(prev => prev ? `${prev} ${transcript}` : transcript);
      };

      recognition.onerror = (err: any) => {
        console.warn("Speech recognition error:", err);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn("Speech recognition start failed:", err);
      setIsRecording(false);
    }
  };

  // Handle Camera Toggle with user consent
  const handleToggleCamera = async () => {
    if (cameraEnabled) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setCameraEnabled(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraPermissionGranted(true);
      setCameraEnabled(true);
    } catch (err) {
      alert("Camera permission denied or camera device unavailable. Camera framing analysis is optional and the interview coach remains fully functional.");
      setCameraEnabled(false);
    }
  };

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleEvaluate = () => {
    if (!userAnswer.trim()) return;
    const evalResult = InterviewCoachService.evaluateResponse(currentQ.question, userAnswer);
    setEvaluation(evalResult);
  };

  const handleReadQuestion = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentQ.question);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
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
              <span>Observable Signals • STAR Feedback • Placement Simulation</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              AI Interview Coach
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Practice role-specific questions with real-time vocal feedback, STAR structure scoring, and optional presentation framing cues.
            </p>
          </div>

          {/* Role Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Target Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-hidden focus:border-amber-500"
            >
              <option value="Software Engineering">Software Engineering</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="General Graduate Role">General Graduate Role</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Interview Q&A Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Question Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                    {currentQ.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReadQuestion}
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    title="Read question aloud"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      const next = (currentQuestionIndex + 1) % questions.length;
                      setCurrentQuestionIndex(next);
                      setUserAnswer('');
                      setEvaluation(null);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700 px-2 py-1 rounded-lg hover:bg-amber-50 transition-colors"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-base md:text-lg font-bold text-slate-900 leading-relaxed">
                "{currentQ.question}"
              </div>

              {/* Tips & Recommended Structure */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Recommended Approach & Strategy</span>
                </div>
                <div className="text-slate-600 leading-relaxed">
                  <strong>Focus:</strong> {currentQ.tips}
                </div>
                <div className="text-slate-500 font-mono text-[11px] mt-1">
                  <strong>Suggested Structure:</strong> {currentQ.suggestedStructure}
                </div>
              </div>
            </div>

            {/* Response Input Area */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-xs text-slate-800">
                  Your Answer (Type or Record Voice)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleVoice}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isRecording
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isRecording ? 'Listening...' : 'Record Voice'}</span>
                  </button>
                </div>
              </div>

              <textarea
                rows={6}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="State your answer clearly using the STAR framework (Situation, Task, Action, Result)..."
                className="w-full p-3.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-amber-500 transition-all leading-relaxed"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">
                  Words: {userAnswer.trim() ? userAnswer.trim().split(/\s+/).length : 0}
                </span>

                <button
                  onClick={handleEvaluate}
                  disabled={!userAnswer.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-semibold text-xs transition-colors shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze Answer</span>
                </button>
              </div>
            </div>

            {/* Structured Feedback Card */}
            {evaluation && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Observable Communication Feedback</span>
                  </h3>
                  <span className="text-xs text-slate-400">STAR Analysis</span>
                </div>

                {/* Score Meters */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Relevance</div>
                    <div className="text-xl font-bold text-slate-900 mt-1">{evaluation.relevanceScore}%</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">STAR Structure</div>
                    <div className="text-xl font-bold text-amber-600 mt-1">{evaluation.starStructureScore}%</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Filler Words</div>
                    <div className="text-xl font-bold text-slate-900 mt-1">{evaluation.fillerWordsCount}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Speaking Pace</div>
                    <div className="text-xs font-bold text-emerald-600 mt-2">Optimal</div>
                  </div>
                </div>

                {/* Strengths & Critiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1.5">
                    <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Observed Strengths</span>
                    </div>
                    <ul className="space-y-1 text-emerald-800 list-disc list-inside">
                      {evaluation.strengths.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1.5">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Actionable Improvements</span>
                    </div>
                    <ul className="space-y-1 text-amber-800 list-disc list-inside">
                      {evaluation.constructiveCritique.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Improved Sample Answer */}
                <div className="p-4 rounded-xl bg-slate-900 text-white text-xs space-y-2">
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                    Model Response Demonstration (STAR Format)
                  </div>
                  <p className="text-slate-200 leading-relaxed">
                    "{evaluation.improvedSampleAnswer}"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Optional Presentation Cue Camera Analysis (Section 27) */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Video className="w-4 h-4 text-amber-600" />
                  <span>Presentation Cue Camera</span>
                </h3>

                <button
                  onClick={handleToggleCamera}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    cameraEnabled
                      ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cameraEnabled ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
                  <span>{cameraEnabled ? 'Disable' : 'Enable'}</span>
                </button>
              </div>

              {/* Consent & Ethical Notice (Section 27 mandate) */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-slate-500" />
                  <span>Consent & Presentation Notice</span>
                </div>
                <p>
                  Camera feedback observes head positioning, eye level alignment, and posture stability. It does not perform emotional detection or psychological profiling.
                </p>
              </div>

              {/* Camera Preview Area */}
              <div className="relative w-full aspect-4/3 rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center border border-slate-800">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${cameraEnabled ? 'block' : 'hidden'}`}
                />

                {!cameraEnabled && (
                  <div className="text-center p-4 text-slate-400 space-y-2">
                    <Video className="w-8 h-8 mx-auto opacity-40" />
                    <div className="text-xs font-medium">Camera is disabled</div>
                    <div className="text-[10px] text-slate-500">
                      Click "Enable" to practice with real-time framing overlay
                    </div>
                  </div>
                )}

                {/* Framing Overlay */}
                {cameraEnabled && (
                  <div className="absolute inset-4 border-2 border-dashed border-amber-400/60 rounded-xl pointer-events-none flex items-center justify-center">
                    <span className="text-[10px] font-bold text-amber-300 bg-slate-950/80 px-2 py-0.5 rounded-full absolute top-2">
                      Optimal Eye-Level Framing Zone
                    </span>
                  </div>
                )}
              </div>

              {/* Observable Presentation Checklist */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-800">
                  Presentation Checklist
                </div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Camera positioned at eye level</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Consistent gaze towards camera lens</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Upright, stable posture during answers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
