export type Persona = 'Student' | 'Prospective Student' | 'Parent' | 'Visitor' | 'Faculty/Staff';

export type Language = 'English' | 'Telugu' | 'Hindi';

export interface SourceReference {
  title: string;
  url: string;
  snippet?: string;
  category?: string;
}

export interface ActionItem {
  label: string;
  url?: string;
  action_type: 'source' | 'navigation' | 'page';
  action_page?: string;
}

export interface SmartAction {
  intent: string;
  action_label: string;
  action_page?: string;
  action_url?: string;
  suggested_query?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: SourceReference[];
  actions?: ActionItem[];
  grounded?: boolean;
  confidence_status?: string;
  evidence_level?: 'STRONG' | 'MODERATE' | 'WEAK' | 'NONE';
  answerable?: boolean;
  smart_action?: SmartAction;
  persona?: Persona;
  language?: Language;
  feedback?: 'helpful' | 'unhelpful';
}

export interface ProgramDepartment {
  degree: string;
  name: string;
  collaborations: string[];
  duration: string;
  description: string;
  highlights?: string[];
  intake?: string;
}

export interface AcademicSchool {
  name: string;
  description: string;
  departments: ProgramDepartment[];
}

export interface CampusFacility {
  id: string;
  icon: string;
  title: string;
  category: string;
  desc: string;
  stats: string;
  features: string[];
  url: string;
}

export interface LeaderProfile {
  id: string;
  name: string;
  role: string;
  desc: string;
  vision: string;
  url: string;
}

export interface QueryLog {
  id: number;
  query: string;
  category: string;
  persona: string;
  language: string;
  created_at: string;
}

export interface AnalyticsMetrics {
  total_queries: number;
  grounding_rate: string;
  satisfaction_rate: number;
  top_categories: { category: string; count: number }[];
  top_personas: { persona: string; count: number }[];
  campus_insights: string[];
}

export interface FeedbackSummary {
  total: number;
  helpful: number;
  unhelpful: number;
  satisfaction_rate: number;
}

export type UserRole = 'user' | 'admin';

export interface CampusLocation {
  id: string;
  name: string;
  category: string;
  landmark: string;
  coordinates: { lat: number; lng: number };
  directionsUrl: string;
  hours: string;
  description: string;
}

export interface StudySubject {
  id: string;
  name: string;
  priority: 'High' | 'Medium' | 'Low';
  examDate: string;
  difficulty: 'Hard' | 'Moderate' | 'Easy';
  targetHours: number;
  completedHours: number;
}

export interface StudySession {
  id: string;
  subjectId: string;
  subjectName: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  topic: string;
  isCompleted: boolean;
  isMissed: boolean;
}

export interface StudyPlanDay {
  date: string;
  dayName: string;
  totalStudyMinutes: number;
  sessions: StudySession[];
}

export interface AttendanceRecord {
  id: string;
  subjectCode: string;
  subjectName: string;
  totalClasses: number;
  attendedClasses: number;
  minRequiredPercent: number;
  facultyName: string;
}

export interface AttendanceAnalysisResult {
  record: AttendanceRecord;
  currentPercent: number;
  status: 'safe' | 'warning' | 'critical';
  daysAffordToMiss: number;
  classesNeededToRecover: number;
  alertMessage: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'deadline' | 'event' | 'fee' | 'study' | 'attendance' | 'system';
  priority: 'high' | 'medium' | 'low';
  scheduledAt: string;
  isRead: boolean;
  actionUrl?: string;
  actionTab?: string;
}

export interface ResumeAnalysisResult {
  overallScore: number;
  summary: string;
  atsCompatibilityPercent: number;
  extractedSkills: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  improvements: string[];
  experienceGaps: string[];
  benchmarkComparison: {
    role: string;
    benchmarkScore: number;
    percentile: number;
    skillsCoveragePercent: number;
  };
}

export interface BulletRewriteResult {
  original: string;
  rewritten: {
    concise: string;
    impact: string;
    technical: string;
    atsFriendly: string;
  };
}

export interface InterviewQuestion {
  id: number;
  category: 'Technical' | 'Behavioral' | 'HR' | 'Case-based';
  question: string;
  tips: string;
  suggestedStructure: string;
}

export interface InterviewEvaluation {
  relevanceScore: number;
  clarityScore: number;
  starStructureScore: number;
  fillerWordsCount: number;
  speakingPaceWordCount: number;
  strengths: string[];
  constructiveCritique: string[];
  improvedSampleAnswer: string;
}
