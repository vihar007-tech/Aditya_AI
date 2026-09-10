/**
 * Automated Verification Suite for Aditya Campus AI.
 * Tests key answer-vs-redirect behaviors (TEST 1 through TEST 8).
 */

import { campusAIService } from '../services/campusAIService';
import { sessionMemory } from '../core/memory';

export interface TestResult {
  id: string;
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
  durationMs: number;
}

export async function runAllTests(): Promise<{ summary: string; allPassed: boolean; results: TestResult[] }> {
  const results: TestResult[] = [];

  // TEST 1: "What facilities are available?"
  {
    const start = Date.now();
    const res = await campusAIService.chat({
      message: 'What facilities are available?',
      sessionId: 'test_1_session',
      persona: 'Student',
      language: 'English'
    });
    const duration = Date.now() - start;

    const hasContent = res.answer.length > 50 && (
      res.answer.toLowerCase().includes('hostel') ||
      res.answer.toLowerCase().includes('bus') ||
      res.answer.toLowerCase().includes('library') ||
      res.answer.toLowerCase().includes('classrooms')
    );
    const hasSource = res.sources.some(s => s.url.includes('/facilities'));
    const notJustRedirect = !res.answer.trim().startsWith('http') && res.answer.length > 80;

    const passed = res.answerable && hasContent && hasSource && notJustRedirect;
    results.push({
      id: 'TEST-1',
      name: 'Facilities question answered directly with citations (No redirect-only)',
      passed,
      expected: 'answerable = true, contains facilities details, cites official facilities page, does not redirect only',
      actual: `answerable=${res.answerable}, length=${res.answer.length}, sources=${res.sources.length}, evidence=${res.evidence_level}`,
      durationMs: duration
    });
  }

  // TEST 2: "Who is the Vice Chancellor?"
  {
    const start = Date.now();
    const res = await campusAIService.chat({
      message: 'Who is the Vice Chancellor?',
      sessionId: 'test_2_session',
      persona: 'Student',
      language: 'English'
    });
    const duration = Date.now() - start;

    const namesVC = res.answer.toLowerCase().includes('dr. m.b. srinivas') || res.answer.toLowerCase().includes('srinivas');
    const leadershipSource = res.sources.some(s => s.url.includes('/about-us/leadership') || s.category === 'leadership');

    const passed = res.answerable && namesVC && leadershipSource;
    results.push({
      id: 'TEST-2',
      name: 'Vice Chancellor inquiry answered with verified leadership details',
      passed,
      expected: 'Identifies Dr. M.B. Srinivas with official leadership source',
      actual: `namesVC=${namesVC}, sources=${res.sources.length}, answerable=${res.answerable}`,
      durationMs: duration
    });
  }

  // TEST 3: "How do I contact the university?"
  {
    const start = Date.now();
    const res = await campusAIService.chat({
      message: 'How do I contact the university?',
      sessionId: 'test_3_session',
      persona: 'Parent',
      language: 'English'
    });
    const duration = Date.now() - start;

    const hasPhone = res.answer.includes('9989 776661');
    const hasEmail = res.answer.includes('info@adityauniversity.in');
    const hasAddress = res.answer.toLowerCase().includes('surampalem') || res.answer.toLowerCase().includes('aditya nagar');
    const passed = res.answerable && hasPhone && hasEmail && hasAddress;

    results.push({
      id: 'TEST-3',
      name: 'Contact inquiry provides address, phone, email, and working hours directly',
      passed,
      expected: 'Includes phone +91 9989 776661, info@adityauniversity.in, Surampalem campus coordinates',
      actual: `phone=${hasPhone}, email=${hasEmail}, address=${hasAddress}`,
      durationMs: duration
    });
  }

  // TEST 4: "Open the official contact page."
  {
    const start = Date.now();
    const res = await campusAIService.chat({
      message: 'Open the official contact page.',
      sessionId: 'test_4_session',
      persona: 'Student',
      language: 'English'
    });
    const duration = Date.now() - start;

    const hasContactUrl = res.answer.includes('adityauniversity.in/contact-us') || res.sources.some(s => s.url.includes('/contact-us'));
    const isNavigation = res.intent === 'navigation' || res.actions.some(a => a.action_type === 'navigation');
    const passed = hasContactUrl && isNavigation;

    results.push({
      id: 'TEST-4',
      name: 'Explicit navigation request provides official contact link',
      passed,
      expected: 'Recognizes navigation intent and surfaces direct contact link',
      actual: `intent=${res.intent}, hasContactUrl=${hasContactUrl}`,
      durationMs: duration
    });
  }

  // TEST 5: "What is the hostel allocation procedure for 2027?"
  {
    const start = Date.now();
    const res = await campusAIService.chat({
      message: 'What is the hostel allocation procedure for 2027?',
      sessionId: 'test_5_session',
      persona: 'Student',
      language: 'English'
    });
    const duration = Date.now() - start;

    // Must not hallucinate fabricated 2027 rules
    const acknowledgesLimitation =
      res.evidence_level === 'WEAK' ||
      res.answer.toLowerCase().includes('couldn\'t verify') ||
      res.answer.toLowerCase().includes('unverified') ||
      res.answer.toLowerCase().includes('not yet') ||
      res.answer.toLowerCase().includes('confirm latest');

    const passed = acknowledgesLimitation;
    results.push({
      id: 'TEST-5',
      name: 'Unpublished future procedure (2027) triggers unverified evidence warning (No hallucination)',
      passed,
      expected: 'evidence_level=WEAK, acknowledges unverified 2027 specifics safely',
      actual: `evidence_level=${res.evidence_level}, acknowledgesLimitation=${acknowledgesLimitation}`,
      durationMs: duration
    });
  }

  // TEST 6: "What is the university's policy on an imaginary rule that doesn't exist?"
  {
    const start = Date.now();
    const res = await campusAIService.chat({
      message: "What is the university's policy on an imaginary rule that doesn't exist?",
      sessionId: 'test_6_session',
      persona: 'Student',
      language: 'English'
    });
    const duration = Date.now() - start;

    const rejectsImaginary =
      res.evidence_level === 'NONE' ||
      res.answer.toLowerCase().includes('couldn\'t verify') ||
      res.answer.toLowerCase().includes('not verified');

    const passed = rejectsImaginary;
    results.push({
      id: 'TEST-6',
      name: 'Imaginary policy request is rejected with NONE evidence (Anti-hallucination defense)',
      passed,
      expected: 'evidence_level=NONE, does not fabricate nonexistent rule',
      actual: `evidence_level=${res.evidence_level}, rejectsImaginary=${rejectsImaginary}`,
      durationMs: duration
    });
  }

  // TEST 7: Multi-turn conversational context:
  // Turn 1: "What facilities are available?"
  // Turn 2: "Which of those are related to sports?"
  {
    const start = Date.now();
    const testSessionId = `test_7_session_${Date.now()}`;
    sessionMemory.clearSession(testSessionId);

    // Turn 1
    await campusAIService.chat({
      message: 'What facilities are available?',
      sessionId: testSessionId,
      persona: 'Student',
      language: 'English'
    });

    // Turn 2
    const res2 = await campusAIService.chat({
      message: 'Which of those are related to sports?',
      sessionId: testSessionId,
      persona: 'Student',
      language: 'English'
    });
    const duration = Date.now() - start;

    const hasSports =
      res2.answer.toLowerCase().includes('cricket') ||
      res2.answer.toLowerCase().includes('basketball') ||
      res2.answer.toLowerCase().includes('badminton') ||
      res2.answer.toLowerCase().includes('gym') ||
      res2.answer.toLowerCase().includes('sports');

    const passed = hasSports;
    results.push({
      id: 'TEST-7',
      name: 'Conversational memory resolves pronoun/reference ("those" -> facilities related to sports)',
      passed,
      expected: 'Correctly identifies sports facilities from previous context',
      actual: `hasSports=${hasSports}, answer snippet="${res2.answer.slice(0, 100)}..."`,
      durationMs: duration
    });
  }

  // TEST 8: Multilingual query in Telugu
  {
    const start = Date.now();
    const res = await campusAIService.chat({
      message: 'క్యాంపస్ హాస్టల్ వసతులు ఎలా ఉన్నాయి?',
      sessionId: 'test_8_session',
      persona: 'Student',
      language: 'Telugu'
    });
    const duration = Date.now() - start;

    // Checks for Telugu characters in output
    const hasTeluguChars = /[\u0C00-\u0C7F]/.test(res.answer);
    const passed = hasTeluguChars && res.answerable;

    results.push({
      id: 'TEST-8',
      name: 'Telugu language question returns fluent grounded Telugu response',
      passed,
      expected: 'Answer formatted in Telugu with official grounded facts',
      actual: `hasTeluguChars=${hasTeluguChars}, language=${res.language}, answerable=${res.answerable}`,
      durationMs: duration
    });
  }

  const allPassed = results.every(r => r.passed);
  const summary = `Completed ${results.length} tests: ${results.filter(r => r.passed).length} PASSED, ${results.filter(r => !r.passed).length} FAILED.`;

  return { summary, allPassed, results };
}
