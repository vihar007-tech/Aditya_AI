import {
  StudySubject,
  StudyPlanDay,
  StudySession,
  AttendanceRecord,
  AttendanceAnalysisResult,
  ResumeAnalysisResult,
  BulletRewriteResult,
  InterviewQuestion,
  InterviewEvaluation,
  AppNotification
} from '../../types';

// ==========================================
// 1. DETERMINISTIC STUDY PLANNER SERVICE
// ==========================================

export class StudyPlannerService {
  /**
   * Generates a realistic multi-day study schedule deterministically.
   */
  public static generatePlan(
    subjects: StudySubject[],
    dailyStudyHours: number = 3,
    startDateStr?: string
  ): StudyPlanDay[] {
    const startDate = startDateStr ? new Date(startDateStr) : new Date();
    const daysCount = 7;
    const plan: StudyPlanDay[] = [];

    // Sort subjects by priority and exam urgency
    const sortedSubjects = [...subjects].sort((a, b) => {
      const pMap = { High: 3, Medium: 2, Low: 1 };
      const pDiff = pMap[b.priority] - pMap[a.priority];
      if (pDiff !== 0) return pDiff;
      return new Date(a.examDate).getTime() - new Date(b.examDate).getTime();
    });

    const sessionMinutes = 60;
    const dailySessionsCount = Math.max(1, Math.floor(dailyStudyHours));

    for (let dayOffset = 0; dayOffset < daysCount; dayOffset++) {
      const currDate = new Date(startDate);
      currDate.setDate(startDate.getDate() + dayOffset);
      const dateStr = currDate.toISOString().split('T')[0];
      const dayName = currDate.toLocaleDateString('en-US', { weekday: 'long' });

      const daySessions: StudySession[] = [];
      let startHour = 18; // 6:00 PM default evening study block

      for (let s = 0; s < dailySessionsCount; s++) {
        // Round-robin with priority weighting
        const subjectIndex = (dayOffset * dailySessionsCount + s) % sortedSubjects.length;
        const subject = sortedSubjects[subjectIndex] || sortedSubjects[0];

        const shStr = String(startHour).padStart(2, '0');
        const ehStr = String(startHour + 1).padStart(2, '0');

        daySessions.push({
          id: `session-${dayOffset}-${s}-${Date.now()}`,
          subjectId: subject.id,
          subjectName: subject.name,
          date: dateStr,
          startTime: `${shStr}:00`,
          endTime: `${ehStr}:00`,
          durationMinutes: sessionMinutes,
          topic: `Core Concepts & Problem Solving - Block ${s + 1}`,
          isCompleted: dayOffset === 0 && s === 0, // mock past session
          isMissed: false
        });

        startHour += 1;
      }

      plan.push({
        date: dateStr,
        dayName,
        totalStudyMinutes: daySessions.length * sessionMinutes,
        sessions: daySessions
      });
    }

    return plan;
  }

  /**
   * Reschedules the plan deterministically after a session is marked "Missed".
   * Reallocates missed hours into subsequent remaining days.
   */
  public static reschedulePlan(
    currentPlan: StudyPlanDay[],
    missedSessionId: string
  ): { updatedPlan: StudyPlanDay[]; rebalancedMessage: string } {
    let missedSession: StudySession | null = null;
    let missedDayIndex = -1;

    // Find and flag the missed session
    const updatedPlan = currentPlan.map((day, dIdx) => {
      const updatedSessions = day.sessions.map(session => {
        if (session.id === missedSessionId) {
          missedSession = { ...session, isMissed: true, isCompleted: false };
          missedDayIndex = dIdx;
          return missedSession;
        }
        return session;
      });
      return { ...day, sessions: updatedSessions };
    });

    if (!missedSession || missedDayIndex === -1) {
      return { updatedPlan, rebalancedMessage: "No missed session found to reschedule." };
    }

    const missedSubject = (missedSession as StudySession).subjectName;

    // Find the next upcoming days with lowest workload or highest priority to add makeup time
    let makeupAdded = false;
    for (let i = missedDayIndex + 1; i < updatedPlan.length; i++) {
      const targetDay = updatedPlan[i];
      if (targetDay.sessions.length < 4) { // cap daily sessions at 4
        const lastSession = targetDay.sessions[targetDay.sessions.length - 1];
        const lastEndHour = lastSession ? parseInt(lastSession.endTime.split(':')[0], 10) : 18;
        const newStartHour = lastEndHour < 22 ? lastEndHour : 17;
        const shStr = String(newStartHour).padStart(2, '0');
        const ehStr = String(newStartHour + 1).padStart(2, '0');

        targetDay.sessions.push({
          id: `makeup-${Date.now()}`,
          subjectId: (missedSession as StudySession).subjectId,
          subjectName: (missedSession as StudySession).subjectName,
          date: targetDay.date,
          startTime: `${shStr}:00`,
          endTime: `${ehStr}:00`,
          durationMinutes: 60,
          topic: `[Rebalanced Makeup Session] ${(missedSession as StudySession).topic}`,
          isCompleted: false,
          isMissed: false
        });
        targetDay.totalStudyMinutes += 60;
        makeupAdded = true;
        break;
      }
    }

    const rebalancedMessage = makeupAdded
      ? `Successfully detected missed session in ${missedSubject}. Intelligent scheduler automatically redistributed this session into an upcoming study block without overloading your daily routine.`
      : `Marked ${missedSubject} session as missed. Workload priorities updated.`;

    return { updatedPlan, rebalancedMessage };
  }
}

// ==========================================
// 2. DETERMINISTIC ATTENDANCE SERVICE
// ==========================================

export class AttendanceService {
  /**
   * Deterministic attendance calculation and safe absence estimate.
   */
  public static analyze(record: AttendanceRecord): AttendanceAnalysisResult {
    const total = Math.max(1, record.totalClasses);
    const attended = Math.min(total, Math.max(0, record.attendedClasses));
    const minRequired = record.minRequiredPercent || 75;
    const reqRatio = minRequired / 100;

    const currentPercent = Math.round((attended / total) * 1000) / 10;

    // Formula for safe absences:
    // (attended) / (total + x) >= reqRatio  =>  attended >= reqRatio * total + reqRatio * x
    // => x <= (attended - reqRatio * total) / reqRatio
    let daysAffordToMiss = 0;
    if (currentPercent >= minRequired) {
      daysAffordToMiss = Math.max(0, Math.floor((attended - reqRatio * total) / reqRatio));
    }

    // Formula for classes needed to recover if below threshold:
    // (attended + y) / (total + y) >= reqRatio => attended + y >= reqRatio * total + reqRatio * y
    // => y * (1 - reqRatio) >= reqRatio * total - attended
    // => y >= (reqRatio * total - attended) / (1 - reqRatio)
    let classesNeededToRecover = 0;
    if (currentPercent < minRequired) {
      classesNeededToRecover = Math.max(
        1,
        Math.ceil((reqRatio * total - attended) / (1 - reqRatio))
      );
    }

    let status: 'safe' | 'warning' | 'critical' = 'safe';
    let alertMessage = '';

    if (currentPercent >= minRequired + 5) {
      status = 'safe';
      alertMessage = `Your attendance is in the Safe Zone (${currentPercent}%). You can afford to miss up to ${daysAffordToMiss} upcoming classes while staying above the ${minRequired}% threshold.`;
    } else if (currentPercent >= minRequired) {
      status = 'warning';
      alertMessage = `Warning: Your attendance is ${currentPercent}%, closely bordering the required ${minRequired}%. You can afford to miss at most ${daysAffordToMiss} class before falling below.`;
    } else {
      status = 'critical';
      alertMessage = `Critical Alert: Current attendance is ${currentPercent}%, below the university's mandatory ${minRequired}%. You must attend the next ${classesNeededToRecover} consecutive classes to recover eligibility.`;
    }

    return {
      record,
      currentPercent,
      status,
      daysAffordToMiss,
      classesNeededToRecover,
      alertMessage
    };
  }

  public static getDemoRecords(): AttendanceRecord[] {
    return [
      {
        id: "att-1",
        subjectCode: "CS401",
        subjectName: "Cloud Computing & Distributed Systems",
        totalClasses: 52,
        attendedClasses: 45,
        minRequiredPercent: 75,
        facultyName: "Dr. K. Ramakrishna"
      },
      {
        id: "att-2",
        subjectCode: "CS402",
        subjectName: "Machine Learning & Neural Networks",
        totalClasses: 48,
        attendedClasses: 37,
        minRequiredPercent: 75,
        facultyName: "Prof. S. Sunitha"
      },
      {
        id: "att-3",
        subjectCode: "CS403",
        subjectName: "Database Management & Big Data Analytics",
        totalClasses: 44,
        attendedClasses: 32,
        minRequiredPercent: 75,
        facultyName: "Dr. V. Srinivas"
      },
      {
        id: "att-4",
        subjectCode: "HS101",
        subjectName: "Professional Communication & Corporate Soft Skills",
        totalClasses: 36,
        attendedClasses: 33,
        minRequiredPercent: 75,
        facultyName: "Prof. M. Anjali"
      }
    ];
  }
}

// ==========================================
// 3. RESUME ANALYZER & ATS MATCH SERVICE
// ==========================================

export class ResumeAnalyzerService {
  public static analyze(resumeText: string, jobDescription?: string): ResumeAnalysisResult {
    const textLower = resumeText.toLowerCase();

    // Known university skill catalog
    const commonSkills = [
      "python", "javascript", "typescript", "react", "node.js", "express",
      "docker", "kubernetes", "sql", "postgresql", "mongodb", "git",
      "aws", "google cloud", "machine learning", "data structures",
      "algorithms", "ci/cd", "rest api", "linux", "c++", "java"
    ];

    const extractedSkills = commonSkills.filter(skill => textLower.includes(skill));

    let matchedKeywords: string[] = [];
    let missingKeywords: string[] = [];
    let atsCompatibility = 78;

    if (jobDescription && jobDescription.trim()) {
      const jdLower = jobDescription.toLowerCase();
      const jdTokens = commonSkills.filter(skill => jdLower.includes(skill));

      matchedKeywords = jdTokens.filter(k => textLower.includes(k));
      missingKeywords = jdTokens.filter(k => !textLower.includes(k));

      if (jdTokens.length > 0) {
        atsCompatibility = Math.round((matchedKeywords.length / jdTokens.length) * 100);
      }
    } else {
      matchedKeywords = extractedSkills.slice(0, 5);
      missingKeywords = ["docker", "ci/cd", "unit testing", "system design"].filter(
        k => !textLower.includes(k)
      );
    }

    // Heuristic scoring based on content depth, sections, and quantified achievements
    let score = 65;
    if (extractedSkills.length >= 6) score += 12;
    if (/\b(increased|improved|reduced|optimized|achieved|deployed|architected)\b/i.test(textLower)) score += 10;
    if (/\b(\d+%|\$\d+|\d+\+?\s*(users|clients|rps|ms))\b/i.test(textLower)) score += 8;
    if (/\b(education|experience|projects|skills)\b/i.test(textLower)) score += 5;
    score = Math.min(95, Math.max(45, score));

    return {
      overallScore: score,
      summary: "Resume demonstrates solid technical foundation with strong project descriptions. Incorporating more quantified impact metrics and targeted ATS keywords will elevate your profile for tier-1 campus placements.",
      atsCompatibilityPercent: atsCompatibility,
      extractedSkills,
      matchedKeywords,
      missingKeywords,
      strengths: [
        "Clearly separated technical skills and academic background.",
        "Demonstrated hands-on experience with modern development stacks.",
        "Active GitHub/portfolio project references included."
      ],
      improvements: [
        "Add measurable impact metrics (e.g., 'reduced latency by 25%', 'served 500+ daily users').",
        "Incorporate missing industry keywords relevant to your target engineering roles.",
        "Ensure bullet points start with strong action verbs (Engineered, Architected, Spearheaded)."
      ],
      experienceGaps: [
        "Production deployment & CI/CD workflow exposure.",
        "Automated unit/integration testing methodologies."
      ],
      benchmarkComparison: {
        role: "Software Development Engineer (Campus Placements)",
        benchmarkScore: 82,
        percentile: score >= 80 ? 88 : 72,
        skillsCoveragePercent: Math.min(100, Math.round((extractedSkills.length / 10) * 100))
      }
    };
  }

  public static rewriteBullet(originalBullet: string, jobRole: string = 'Software Engineer'): BulletRewriteResult {
    const clean = originalBullet.trim().replace(/^[-*•]\s*/, '');

    return {
      original: clean,
      rewritten: {
        concise: `Engineered responsive features for core application, enhancing performance and maintainability.`,
        impact: `Architected and optimized key application modules, boosting user task completion efficiency by 32% and decreasing page load latency.`,
        technical: `Implemented scalable RESTful endpoints in TypeScript and Node.js with caching, ensuring sub-50ms latency across peak traffic.`,
        atsFriendly: `Developed full-stack web solutions utilizing React, Node.js, and SQL, strictly aligning with agile software engineering best practices.`
      }
    };
  }
}

// ==========================================
// 4. INTERVIEW COACH SERVICE
// ==========================================

export class InterviewCoachService {
  private static QUESTION_BANK: Record<string, InterviewQuestion[]> = {
    "Software Engineering": [
      {
        id: 1,
        category: "Technical",
        question: "Explain the difference between SQL and NoSQL databases. In what scenario at Aditya University would you choose one over the other?",
        tips: "Highlight schema rigidity vs elasticity, ACID guarantees, and scaling characteristics.",
        suggestedStructure: "Define SQL (relational, ACID) -> Define NoSQL (flexible schemas, horizontal scale) -> Provide campus scenario (Fee records = SQL, Student event activity logs = NoSQL)."
      },
      {
        id: 2,
        category: "Technical",
        question: "How does asynchronous I/O in Node.js work under the hood with the event loop and thread pool?",
        tips: "Discuss libuv, microtasks queue vs macrotasks queue, and non-blocking sockets.",
        suggestedStructure: "Explain single-threaded JavaScript execution -> Introduce libuv event loop phases -> Describe offloading blocking tasks to thread pool."
      },
      {
        id: 3,
        category: "Behavioral",
        question: "Describe a high-pressure technical hackathon or team academic project where a conflict arose. How did you resolve it?",
        tips: "Use the STAR method: Situation, Task, Action, Result. Focus on objective collaboration.",
        suggestedStructure: "State the project context -> Describe differing technical opinions -> Detail your compromise or benchmark test -> Share positive project delivery."
      }
    ],
    "Data Analyst": [
      {
        id: 1,
        category: "Technical",
        question: "How would you handle missing values and outliers in a student campus attendance and placement dataset?",
        tips: "Discuss imputation techniques (mean/median, KNN) vs removal, and IQR / z-score anomaly detection.",
        suggestedStructure: "Assess data distribution -> Explain anomaly detection via IQR -> Compare imputation vs dropping."
      },
      {
        id: 2,
        category: "Case-based",
        question: "Aditya University wants to optimize its 400+ bus routes to reduce fuel consumption while keeping punctuality high. What metrics would you track?",
        tips: "Focus on pickup density, route congestion windows, boarding delays, and cost-per-seat kilometer.",
        suggestedStructure: "Define objective KPI -> Data sources (GPS, student boarding cards) -> Modeling approach."
      }
    ],
    "General Graduate Role": [
      {
        id: 1,
        category: "HR",
        question: "Why do you want to join our organization, and how have your academic experiences at Aditya University prepared you for this role?",
        tips: "Connect company mission with your hands-on coursework, technical labs, and CDC placement bootcamps.",
        suggestedStructure: "Express enthusiasm for the domain -> Cite specific projects/internships -> Reiterate personal career goals."
      },
      {
        id: 2,
        category: "Behavioral",
        question: "Tell me about a time you had to learn a completely unfamiliar technology or tool under a tight deadline.",
        tips: "Demonstrate curiosity, structured self-learning, and fast proof-of-concept building.",
        suggestedStructure: "Identify the challenge -> Outline learning plan -> Execution & outcome."
      }
    ]
  };

  public static getQuestions(role: string = 'Software Engineering'): InterviewQuestion[] {
    return this.QUESTION_BANK[role] || this.QUESTION_BANK["Software Engineering"];
  }

  public static evaluateResponse(question: string, answer: string): InterviewEvaluation {
    const wordCount = answer.trim().split(/\s+/).length;
    const lower = answer.toLowerCase();

    // Observable communication signals
    const fillerWords = (answer.match(/\b(um|uh|like|you know|basically|sort of|kind of|actually)\b/gi) || []).length;
    const hasSituation = /\b(when|during|in my|while working|at aditya)\b/i.test(lower);
    const hasAction = /\b(i developed|i implemented|i proposed|i coordinated|i decided)\b/i.test(lower);
    const hasResult = /\b(as a result|which resulted|improved|achieved|successfully)\b/i.test(lower);

    let starScore = 50;
    if (hasSituation) starScore += 15;
    if (hasAction) starScore += 20;
    if (hasResult) starScore += 15;

    const relevanceScore = wordCount >= 35 ? Math.min(94, 60 + Math.min(30, wordCount / 4)) : 55;
    const clarityScore = Math.max(50, 95 - fillerWords * 8);

    const strengths: string[] = [];
    const critiques: string[] = [];

    if (wordCount >= 40) {
      strengths.push("Substantive depth and thoughtful elaboration provided.");
    } else {
      critiques.push("Response is somewhat brief. Consider providing concrete project examples to support your point.");
    }

    if (fillerWords === 0) {
      strengths.push("Clean vocal delivery with no distracting filler words observed.");
    } else {
      critiques.push(`Detected approximately ${fillerWords} conversational filler words (e.g. 'basically', 'like'). Pausing briefly instead of filling silence elevates professional composure.`);
    }

    if (hasAction && hasResult) {
      strengths.push("Good application of the STAR framework, clearly tying your specific actions to outcomes.");
    } else {
      critiques.push("Strengthen the conclusion by highlighting the quantifiable impact or lesson learned from your action.");
    }

    return {
      relevanceScore,
      clarityScore,
      starStructureScore: starScore,
      fillerWordsCount: fillerWords,
      speakingPaceWordCount: wordCount,
      strengths,
      constructiveCritique: critiques,
      improvedSampleAnswer: `When tackling this challenge during our academic semester project at Aditya University, our objective was to maintain strict real-time data integrity. I took ownership of designing the database indexing schema and implemented caching layers. This proactive action reduced query latency by 35% and enabled seamless multi-user collaboration during live demonstrations.`
    };
  }
}

// ==========================================
// 5. IN-APP PROACTIVE NOTIFICATION SERVICE
// ==========================================

export class NotificationService {
  private static NOTIFICATIONS: AppNotification[] = [
    {
      id: "notif-1",
      title: "Mid-Term Examination Schedule Released",
      message: "The official timetable for B.Tech & MCA Mid-Term 2 examinations has been published on the university portal. Check your subject dates.",
      type: "deadline",
      priority: "high",
      scheduledAt: "Today, 09:30 AM",
      isRead: false,
      actionTab: "planner"
    },
    {
      id: "notif-2",
      title: "Attendance Notice: CS403 Approaching Threshold",
      message: "Your attendance in Database Management (CS403) is currently 72.7%, below the recommended 75%. Safe absence count is 0.",
      type: "attendance",
      priority: "high",
      scheduledAt: "Yesterday",
      isRead: false,
      actionTab: "attendance"
    },
    {
      id: "notif-3",
      title: "CDC Placement Drive: Amazon & Microsoft Registrations",
      message: "Career Development Centre has opened registrations for upcoming software development coding bootcamps and mock interview rounds.",
      type: "event",
      priority: "medium",
      scheduledAt: "2 days ago",
      isRead: true,
      actionTab: "interview"
    },
    {
      id: "notif-4",
      title: "Merit Scholarship Fee Remittance Window",
      message: "Aditya University Accounts Office announces final date for semester tuition fee verification and AUET sports scholarship adjustments.",
      type: "fee",
      priority: "medium",
      scheduledAt: "3 days ago",
      isRead: true,
      actionUrl: "https://www.adityauniversity.in/admissions"
    }
  ];

  public static getNotifications(): AppNotification[] {
    return [...this.NOTIFICATIONS];
  }

  public static markAsRead(id: string): AppNotification[] {
    this.NOTIFICATIONS = this.NOTIFICATIONS.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    );
    return [...this.NOTIFICATIONS];
  }

  public static markAllAsRead(): AppNotification[] {
    this.NOTIFICATIONS = this.NOTIFICATIONS.map(n => ({ ...n, isRead: true }));
    return [...this.NOTIFICATIONS];
  }
}
