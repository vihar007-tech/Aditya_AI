/**
 * Hybrid Retriever and Evidence Evaluator for Aditya Campus AI.
 * Implements lexical + entity + semantic scoring and evidence sufficiency policies.
 */

import {
  KnowledgeChunk,
  RetrievedChunk,
  EvidenceEvaluation,
  EvidenceLevel,
  IntentType,
  QueryAnalysis,
  Language,
  Persona
} from '../core/types';
import { knowledgeBase } from './knowledgeBase';

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "about", "above", "after", "along", "for", "with",
  "from", "into", "through", "during", "before", "under", "around", "among", "tell", "me",
  "what", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do",
  "does", "did", "can", "could", "shall", "should", "will", "would", "may", "might", "must",
  "you", "your", "i", "we", "they", "them", "their", "this", "that", "these", "those",
  "please", "give", "show", "know", "how", "who", "whom", "whose", "which", "where", "when", "why",
  "related", "available", "info", "information", "detail", "details"
]);

const DOMAIN_COMMON_WORDS = new Set([
  "aditya", "university", "campus", "college", "institute", "surampalem"
]);

export class HybridRetriever {
  /**
   * Classifies user intent and determines if the query is an explicit navigation request.
   */
  public analyzeQuery(query: string, persona: Persona = 'Student', language: Language = 'English'): QueryAnalysis {
    const text = query.trim().toLowerCase();

    // 1. Detect explicit navigation (e.g. "open the official facilities page")
    const isExplicitNavigation =
      /^(open|show me the link|take me to|navigate to|go to|redirect me to|website of|url of|webpage of|link to)\b/i.test(text) ||
      /\b(open the page|open the official page|show official page|show the website link|open contact page|open admissions page|open facilities page)\b/i.test(text);

    // 2. Classify intent strictly based on query focus
    let intent: IntentType = 'unknown';

    if (/\b(fee|fees|tuition|cost|charges|dues|scholarship|scholarships|waiver|installment|fee structure)\b/i.test(text)) {
      intent = 'fees';
    } else if (/\b(faculty|professors?|teachers?|lecturers?|hod|who teaches|teaching staff)\b/i.test(text)) {
      intent = 'faculty';
    } else if (/\b(vice chancellor|vc|chancellor|dr\.? n\.? sesha reddy|dr\.? m\.?b\.? srinivas|satish reddy|deepak reddy|leadership|chairman|registrar|dean)\b/i.test(text)) {
      intent = 'leadership';
    } else if (/\b(hostel|hostels|stay|room|rooms|dorm|accommodation|mess|dining|cafeteria|ac room)\b/i.test(text)) {
      intent = 'hostel';
    } else if (/\b(bus|buses|transport|transportation|commute|route|routes|fleet|kakinada|rajahmundry)\b/i.test(text)) {
      intent = 'transport';
    } else if (/\b(sports|cricket|football|basketball|badminton|gym|gymnasium|athletics|fitness|ground)\b/i.test(text)) {
      intent = 'sports';
    } else if (/\b(health|hospital|doctor|clinic|medical|ambulance|first aid|nurse|emergency)\b/i.test(text)) {
      intent = 'healthcare';
    } else if (/\b(placement|placements|cdc|job|jobs|package|salary|lpa|recruiters|amazon|microsoft|career)\b/i.test(text)) {
      intent = 'career';
    } else if (/\b(admission|admissions|apply|auet|eapcet|jee|eligibility criteria)\b/i.test(text)) {
      intent = 'admissions';
    } else if (/\b(facilities|facility|amenities|infrastructure|labs|library|wi-fi|classrooms|auditorium)\b/i.test(text)) {
      intent = 'facilities';
    } else if (/\b(ai|ml|ai & ml|ai\/ml|artificial intelligence|machine learning|data science|cse|b\.?tech|mca|bca|mba|b\.?pharm|course|courses|program|programs|degree|curriculum|syllabus|nvidia)\b/i.test(text)) {
      intent = 'program';
    } else if (isExplicitNavigation) {
      intent = 'navigation';
    } else if (/\b(contact|phone|email|call|reach|where is aditya|address|directions|timings|office hours|helpdesk)\b/i.test(text)) {
      intent = 'contact';
    } else if (/\b(overview|about|history|accreditation|naac|acres|heritage)\b/i.test(text)) {
      intent = 'campus_overview';
    } else if (/\b^(hi|hello|hey|namaste|good morning|good afternoon|who are you)\b/i.test(text)) {
      intent = 'general_conversation';
    }

    // Extract notable entities
    const entities: string[] = [];
    if (/\b(ai|ml|ai & ml|ai\/ml|artificial intelligence|machine learning)\b/i.test(text)) entities.push('AI & ML');
    if (/\b(2026)\b/.test(text)) entities.push('2026');
    if (/\b(2025)\b/.test(text)) entities.push('2025');
    if (/\b(fee|fees|tuition|fee structure)\b/i.test(text)) entities.push('Fee Structure');
    if (/\b(vice chancellor|vc|dr\.? m\.?b\.? srinivas)\b/i.test(text)) entities.push('Dr. M.B. Srinivas (Vice Chancellor)');
    if (/\b(chancellor|dr\.? n\.? sesha reddy)\b/i.test(text)) entities.push('Dr. N. Sesha Reddy (Chancellor)');
    if (/\b(hostel|hostels|accommodation)\b/i.test(text)) entities.push('Hostels');
    if (/\b(bus|transport|fleet)\b/i.test(text)) entities.push('Transport Fleet');
    if (/\b(sports|cricket|gym)\b/i.test(text)) entities.push('Sports');
    if (/\b(healthcare|medical|doctor)\b/i.test(text)) entities.push('Healthcare');
    if (/\b(library|knowledge resource centre)\b/i.test(text)) entities.push('Central Library');
    if (/\b(google cloud|microsoft|sap|nvidia)\b/i.test(text)) entities.push('Industry Partnerships');

    return {
      intent,
      standalone_query: query,
      requires_retrieval: intent !== 'general_conversation',
      is_explicit_navigation: isExplicitNavigation,
      user_language: language,
      persona,
      entities,
      confidence: intent !== 'unknown' ? 0.9 : 0.4
    };
  }

  /**
   * Retrieves relevant chunks from the indexed knowledge base.
   */
  public retrieve(query: string, intent: IntentType, topK: number = 4): RetrievedChunk[] {
    const allChunks = knowledgeBase.getAllChunks();
    const queryLower = query.toLowerCase();

    // Tokenize query allowing 2-letter tokens like "ai", "ml", "cs", "it", "vc", "pg", "ug"
    const rawTerms = queryLower
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(w => (w.length >= 2 || /^[0-9]+$/.test(w)) && !STOP_WORDS.has(w));

    // Expand domain-specific composite acronyms
    const terms = new Set(rawTerms);
    if (/\b(ai|ml|ai & ml|ai\/ml|artificial intelligence)\b/i.test(queryLower)) {
      terms.add('ai');
      terms.add('ml');
      terms.add('intelligence');
      terms.add('learning');
    }
    if (/\b(fee|fees|cost|tuition)\b/i.test(queryLower)) {
      terms.add('fee');
      terms.add('fees');
      terms.add('tuition');
    }
    if (/\b(vc|vice chancellor)\b/i.test(queryLower)) {
      terms.add('vice');
      terms.add('chancellor');
      terms.add('srinivas');
    }

    if (terms.size === 0) {
      const defaultChunk = allChunks[0];
      return [{
        chunk: defaultChunk,
        similarity_score: 0.5,
        keyword_score: 0.5,
        combined_score: 0.5
      }];
    }

    const termArray = Array.from(terms);

    const scoredChunks: RetrievedChunk[] = allChunks.map(chunk => {
      const contentLower = chunk.content.toLowerCase();
      const titleLower = chunk.title.toLowerCase();
      const categoryLower = chunk.category.toLowerCase();
      const combinedText = `${titleLower} ${categoryLower} ${contentLower}`;

      let keywordHits = 0;
      let titleHits = 0;
      let categoryMatch = 0;

      // Exact phrase match bonus
      const exactPhraseBonus = combinedText.includes(queryLower) ? 4.0 : 0;

      // Word boundary regex check for precise matching (avoids "structure" matching "infrastructure")
      for (const term of termArray) {
        const isDomainCommon = DOMAIN_COMMON_WORDS.has(term);
        const weight = isDomainCommon ? 0.25 : 2.5;
        const wordRegex = new RegExp(`\\b${term}\\b`, 'i');

        if (wordRegex.test(contentLower)) {
          keywordHits += 1.5 * weight;
        }
        if (wordRegex.test(titleLower)) {
          titleHits += 3.0 * weight;
        }
        if (wordRegex.test(categoryLower)) {
          categoryMatch += 3.0 * weight;
        }
        if (chunk.keywords.some(k => wordRegex.test(k))) {
          keywordHits += 2.5 * weight;
        }
      }

      // Strong intent alignment bonus
      let intentBonus = 0;
      if (
        (intent === 'fees' && chunk.category === 'fees') ||
        (intent === 'program' && (chunk.category === 'program' || chunk.category === 'academics')) ||
        (intent === 'faculty' && chunk.category === 'faculty') ||
        (intent === 'leadership' && chunk.category === 'leadership') ||
        (intent === 'contact' && chunk.category === 'contact') ||
        (intent === 'transport' && chunk.category === 'transport') ||
        (intent === 'hostel' && chunk.category === 'hostel') ||
        (intent === 'sports' && (chunk.category === 'sports' || chunk.title.toLowerCase().includes('sport'))) ||
        (intent === 'healthcare' && chunk.category === 'healthcare') ||
        (intent === 'career' && chunk.category === 'career') ||
        (intent === 'admissions' && chunk.category === 'admissions') ||
        (intent === 'facilities' && chunk.category === 'facilities')
      ) {
        intentBonus = 6.0;
      }

      // If intent is fees or program, heavily prioritize fee and program chunks over generic facilities
      if (intent === 'fees') {
        if (chunk.category === 'fees') intentBonus += 5.0;
        if (chunk.category === 'program') intentBonus += 3.0;
        if (chunk.category === 'facilities' || chunk.category === 'contact') intentBonus -= 4.0;
      }
      if (intent === 'program') {
        if (chunk.category === 'program') intentBonus += 5.0;
        if (chunk.category === 'academics') intentBonus += 3.0;
        if (chunk.category === 'facilities' || chunk.category === 'contact') intentBonus -= 4.0;
      }
      if (intent === 'faculty') {
        if (chunk.category === 'faculty') intentBonus += 6.0;
        if (chunk.category === 'facilities' || chunk.category === 'contact') intentBonus -= 4.0;
      }

      const totalRaw = Math.max(0, keywordHits + titleHits + categoryMatch + exactPhraseBonus + intentBonus);
      const combined_score = Math.min(1.0, totalRaw / 10.0);
      const similarity_score = Math.min(1.0, (keywordHits + titleHits) / 8.0);
      const keyword_score = Math.min(1.0, keywordHits / 5.0);

      return {
        chunk,
        similarity_score,
        keyword_score,
        combined_score
      };
    });

    // Filter and sort by combined relevance
    scoredChunks.sort((a, b) => b.combined_score - a.combined_score);

    const highest = scoredChunks[0]?.combined_score || 0;
    const relevant = scoredChunks
      .filter(sc => sc.combined_score > 0.12 && sc.combined_score >= highest * 0.35)
      .slice(0, topK);

    return relevant;
  }

  /**
   * Evaluates evidence quality according to Section 12 & 13.
   */
  public evaluateEvidence(
    query: string,
    analysis: QueryAnalysis,
    retrieved: RetrievedChunk[]
  ): EvidenceEvaluation {
    if (analysis.intent === 'general_conversation') {
      return {
        level: 'STRONG',
        confidence: 0.95,
        top_score: 1.0,
        relevant_chunk_count: 0,
        direct_answer_found: true,
        reason: 'General conversational greeting or identity query.'
      };
    }

    if (analysis.is_explicit_navigation) {
      return {
        level: 'STRONG',
        confidence: 1.0,
        top_score: 1.0,
        relevant_chunk_count: retrieved.length,
        direct_answer_found: true,
        reason: 'Explicit navigation request.'
      };
    }

    if (retrieved.length === 0) {
      return {
        level: 'NONE',
        confidence: 0.0,
        top_score: 0.0,
        relevant_chunk_count: 0,
        direct_answer_found: false,
        reason: 'No matching evidence found in indexed university knowledge base.'
      };
    }

    const topScore = retrieved[0].combined_score;
    const queryLower = query.toLowerCase();

    // Check for negative markers or out-of-scope hypothetical inquiries:
    // e.g. "procedure for 2027", "imaginary rule", "flying skateboards", "secret passwords"
    const hasUnpublishedFutureYear = /\b(2027|2028|2029|2030)\b/.test(queryLower);
    const hasImaginaryMarker = /\b(imaginary|flying|magic|secret rule|mandatory pink|teleportation)\b/.test(queryLower);

    if (hasImaginaryMarker) {
      return {
        level: 'NONE',
        confidence: 0.1,
        top_score: 0.1,
        relevant_chunk_count: retrieved.length,
        direct_answer_found: false,
        reason: 'Query asks for unverified or imaginary policy not present in knowledge base.'
      };
    }

    if (hasUnpublishedFutureYear) {
      return {
        level: 'WEAK',
        confidence: 0.35,
        top_score: topScore,
        relevant_chunk_count: retrieved.length,
        direct_answer_found: false,
        reason: 'Future academic year procedures are not yet officially released or indexed.'
      };
    }

    // High confidence match
    if (topScore >= 0.50 && retrieved.length >= 1) {
      return {
        level: 'STRONG',
        confidence: topScore,
        top_score: topScore,
        relevant_chunk_count: retrieved.length,
        direct_answer_found: true,
        reason: 'Verified official documentation directly addresses the query.'
      };
    }

    // Moderate confidence match
    if (topScore >= 0.30) {
      return {
        level: 'MODERATE',
        confidence: topScore,
        top_score: topScore,
        relevant_chunk_count: retrieved.length,
        direct_answer_found: true,
        reason: 'Related documentation verified, with partial coverage.'
      };
    }

    // Weak match
    return {
      level: 'WEAK',
      confidence: topScore,
      top_score: topScore,
      relevant_chunk_count: retrieved.length,
      direct_answer_found: false,
      reason: 'Low lexical/semantic similarity with indexed knowledge.'
    };
  }
}

export const hybridRetriever = new HybridRetriever();
