/**
 * CampusAIService: The Unified AI Service Layer for Aditya Campus AI.
 * Implements the deterministic RAG pipeline, conversational memory,
 * evidence evaluation, and answer-first generation policy.
 */

import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import {
  CampusResponse,
  Persona,
  Language,
  Source,
  Action,
  SmartAction,
  RetrievedChunk,
  EvidenceEvaluation
} from '../core/types';
import { SYSTEM_PROMPT, buildGroundedUserPrompt } from '../core/prompts';
import { sessionMemory } from '../core/memory';
import { hybridRetriever } from '../rag/retriever';
import { knowledgeBase } from '../rag/knowledgeBase';

interface ChatRequestOptions {
  message: string;
  sessionId?: string;
  language?: Language;
  persona?: Persona;
}

export interface StreamCallbacks {
  onStatus?: (status: 'understanding' | 'retrieving' | 'verifying') => void;
  onToken?: (token: string) => void;
  onDone?: (response: CampusResponse) => void;
  onError?: (error: Error) => void;
}

export class CampusAIService {
  private aiClient: GoogleGenAI | null = null;
  private readonly modelName: string;

  constructor() {
    this.modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  }

  private getClient(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) return null;
    if (!this.aiClient) {
      this.aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build-campus-ai'
          }
        }
      });
    }
    return this.aiClient;
  }

  /**
   * Main chat method called by both REST endpoint and internal services.
   */
  public async chat(options: ChatRequestOptions): Promise<CampusResponse> {
    const sessionId = options.sessionId || 'default_session';
    const rawMessage = (options.message || '').trim();
    const language = options.language || 'English';
    const persona = options.persona || 'Student';

    if (!rawMessage) {
      throw new Error('Query message cannot be empty.');
    }

    const startTime = Date.now();

    // 1. Resolve conversational references & multi-turn memory
    const { standaloneQuery, isFollowUp, referencedEntities } = sessionMemory.resolveQuery(
      sessionId,
      rawMessage
    );

    // 2. Query analysis & intent classification
    const analysis = hybridRetriever.analyzeQuery(standaloneQuery, persona, language);

    // 3. Hybrid knowledge retrieval
    const retrieved = hybridRetriever.retrieve(standaloneQuery, analysis.intent, 4);

    // 4. Evidence evaluation
    const evaluation = hybridRetriever.evaluateEvidence(standaloneQuery, analysis, retrieved);

    // 5. Generate grounded answer
    const answer = await this.synthesizeAnswer({
      rawMessage,
      standaloneQuery,
      analysis,
      evaluation,
      retrieved,
      persona,
      language
    });

    // 6. Build citations and smart actions
    const sources = this.buildSources(retrieved, analysis.intent, evaluation);
    const actions = this.buildActions(analysis.intent, evaluation, sources, rawMessage);
    const smartAction = this.buildSmartAction(analysis.intent, sources);

    // 7. Formulate structured response
    const isAnswerable = evaluation.level === 'STRONG' || evaluation.level === 'MODERATE';
    const confidenceStatus =
      evaluation.level === 'STRONG'
        ? 'Verified from official university records'
        : evaluation.level === 'MODERATE'
        ? 'Partially verified from official university records'
        : evaluation.level === 'WEAK'
        ? 'Limited unverified records found'
        : 'Information not verified in official university records';

    const response: CampusResponse = {
      answer,
      intent: analysis.intent,
      answerable: isAnswerable,
      evidence_level: evaluation.level,
      sources,
      actions,
      language,
      session_id: sessionId,
      grounded: retrieved.length > 0 && evaluation.level !== 'NONE',
      confidence_status: confidenceStatus,
      smart_action: smartAction
    };

    // 8. Update session memory
    sessionMemory.addTurn(sessionId, {
      role: 'user',
      content: rawMessage,
      timestamp: Date.now(),
      intent: analysis.intent,
      entities: referencedEntities
    });

    sessionMemory.addTurn(sessionId, {
      role: 'assistant',
      content: answer,
      timestamp: Date.now(),
      intent: analysis.intent
    });

    return response;
  }

  /**
   * Realtime streaming execution yielding status events and token chunks.
   */
  public async streamChat(options: ChatRequestOptions, callbacks: StreamCallbacks): Promise<CampusResponse> {
    callbacks.onStatus?.('understanding');
    await new Promise(r => setTimeout(r, 80));

    const sessionId = options.sessionId || 'default_session';
    const rawMessage = (options.message || '').trim();
    const language = options.language || 'English';
    const persona = options.persona || 'Student';

    const { standaloneQuery, referencedEntities } = sessionMemory.resolveQuery(sessionId, rawMessage);
    const analysis = hybridRetriever.analyzeQuery(standaloneQuery, persona, language);

    callbacks.onStatus?.('retrieving');
    await new Promise(r => setTimeout(r, 100));

    const retrieved = hybridRetriever.retrieve(standaloneQuery, analysis.intent, 4);

    callbacks.onStatus?.('verifying');
    await new Promise(r => setTimeout(r, 80));

    const evaluation = hybridRetriever.evaluateEvidence(standaloneQuery, analysis, retrieved);

    const client = this.getClient();
    let answer = '';

    // If Gemini client exists and not explicit navigation, attempt streaming
    if (client && !analysis.is_explicit_navigation && evaluation.level !== 'NONE') {
      try {
        const contextText = retrieved
          .map(r => `[Source: ${r.chunk.title} | ${r.chunk.url}]\n${r.chunk.content}`)
          .join('\n\n---\n\n');

        const prompt = buildGroundedUserPrompt({
          message: rawMessage,
          contextText,
          persona,
          language,
          evidenceSummary: evaluation.reason,
          hasDirectEvidence: evaluation.direct_answer_found
        });

        const streamResult = await client.models.generateContentStream({
          model: this.modelName,
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.2,
            maxOutputTokens: 1024,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
          }
        });

        for await (const chunk of streamResult) {
          const text = chunk.text;
          if (text) {
            answer += text;
            callbacks.onToken?.(text);
          }
        }
      } catch (streamErr) {
        console.warn('Streaming failed, falling back to deterministic synthesis:', streamErr);
      }
    }

    if (!answer) {
      answer = await this.synthesizeAnswer({
        rawMessage,
        standaloneQuery,
        analysis,
        evaluation,
        retrieved,
        persona,
        language
      });
      callbacks.onToken?.(answer);
    }

    const sources = this.buildSources(retrieved, analysis.intent, evaluation);
    const actions = this.buildActions(analysis.intent, evaluation, sources, rawMessage);
    const smartAction = this.buildSmartAction(analysis.intent, sources);

    const response: CampusResponse = {
      answer,
      intent: analysis.intent,
      answerable: evaluation.level === 'STRONG' || evaluation.level === 'MODERATE',
      evidence_level: evaluation.level,
      sources,
      actions,
      language,
      session_id: sessionId,
      grounded: retrieved.length > 0 && evaluation.level !== 'NONE',
      confidence_status:
        evaluation.level === 'STRONG'
          ? 'Verified from official university records'
          : 'Partially verified from official records',
      smart_action: smartAction
    };

    sessionMemory.addTurn(sessionId, {
      role: 'user',
      content: rawMessage,
      timestamp: Date.now(),
      intent: analysis.intent,
      entities: referencedEntities
    });

    sessionMemory.addTurn(sessionId, {
      role: 'assistant',
      content: answer,
      timestamp: Date.now(),
      intent: analysis.intent
    });

    callbacks.onDone?.(response);
    return response;
  }

  /**
   * Generates answer using either Gemini or the deterministic grounded engine.
   */
  private async synthesizeAnswer(params: {
    rawMessage: string;
    standaloneQuery: string;
    analysis: ReturnType<typeof hybridRetriever.analyzeQuery>;
    evaluation: EvidenceEvaluation;
    retrieved: RetrievedChunk[];
    persona: Persona;
    language: Language;
  }): Promise<string> {
    const { rawMessage, standaloneQuery, analysis, evaluation, retrieved, persona, language } = params;

    // Special Case: Explicit Navigation Request (Section 14 & 35)
    if (analysis.is_explicit_navigation) {
      const topUrl = retrieved[0]?.chunk.url || 'https://www.adityauniversity.in/';
      const topTitle = retrieved[0]?.chunk.title || 'Official Portal';
      if (language === 'Telugu') {
        return `మీరు కోరిన అధికారిక లింక్: [${topTitle}](${topUrl})\n\nఅధికారిక వివరాల కోసం ఈ లింక్‌ను ఓపెన్ చేయండి.`;
      }
      if (language === 'Hindi') {
        return `आपके द्वारा अनुरोधित आधिकारिक पोर्टल: [${topTitle}](${topUrl})\n\nअधिकृत जानकारी के लिए इस लिंक पर जाएं।`;
      }
      return `Here is the official page you requested: [${topTitle}](${topUrl})\n\nYou can click the link above or use the action button below to visit the official university page.`;
    }

    // Special Case: Contact Inquiry (Section 15)
    if (analysis.intent === 'contact') {
      return this.renderContactDetails(persona, language);
    }

    // Special Case: Unverified / Imaginary / Out of Scope (Section 13 & 23)
    if (evaluation.level === 'NONE') {
      if (language === 'Telugu') {
        return `ప్రస్తుత ఆదిత్య క్యాంపస్ AI నాలెడ్జ్ బేస్‌లో ఈ సమాచారం ధృవీకరించబడలేదు. అధికారిక మార్గదర్శకాల కొరకు దయచేసి https://www.adityauniversity.in ని సందర్శించండి లేదా హెల్ప్‌డెస్క్ +91 9989 776661 ను సంప్రదించండి.`;
      }
      if (language === 'Hindi') {
        return `वर्तमान आदित्य कैंपस AI ज्ञानकोष में इस जानकारी की पुष्टि नहीं हो सकी। कृपया आधिकारिक दिशानिर्देशों के लिए https://www.adityauniversity.in पर जाएं या हेल्पलाइन +91 9989 776661 पर संपर्क करें।`;
      }
      return `I couldn't verify that information in the current Aditya Campus AI knowledge base.\n\nAditya University maintains transparent academic, residential, and administrative policies. Please check the official university website at https://www.adityauniversity.in or contact the campus administrative office at +91 9989 776661 for authoritative guidance.`;
    }

    // Special Case: Future / Unsupported Specifics (e.g. 2027 procedures)
    if (evaluation.level === 'WEAK') {
      if (language === 'Telugu') {
        return `నేను సంబంధిత రికార్డులను కనుగొన్నాను, అయితే మీరు అడిగిన నిర్దిష్ట వివరాలు ప్రస్తుత అధికారిక రికార్డులలో అందుబాటులో లేవు.\n\nతాజా అప్‌డేట్‌ల కోసం అధికారిక పోర్టల్ https://www.adityauniversity.in ను సంప్రదించండి.`;
      }
      if (language === 'Hindi') {
        return `मुझे संबंधित जानकारी मिली, लेकिन आपके द्वारा पूछे गए विशिष्ट विवरण वर्तमान आधिकारिक रिकॉर्ड में उपलब्ध नहीं हैं।\n\nनवीनतम अपडेट के लिए आधिकारिक पोर्टल https://www.adityauniversity.in पर जाएं।`;
      }
      return `I found related information about Aditya University policies, but I couldn't verify the exact detail you're asking for from the currently indexed official university records.\n\nPlease confirm latest updates directly via the official university portal at https://www.adityauniversity.in or consult the admissions helpdesk (+91 9989 776661).`;
    }

    // Attempt Gemini Generation with Evidence
    const client = this.getClient();
    if (client) {
      try {
        const contextText = retrieved
          .map(r => `[Source: ${r.chunk.title} | ${r.chunk.url}]\n${r.chunk.content}`)
          .join('\n\n---\n\n');

        const prompt = buildGroundedUserPrompt({
          message: rawMessage,
          contextText,
          persona,
          language,
          evidenceSummary: evaluation.reason,
          hasDirectEvidence: evaluation.direct_answer_found
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini generation timeout')), 25000)
        );

        const response = await Promise.race([
          client.models.generateContent({
            model: this.modelName,
            contents: prompt,
            config: {
              systemInstruction: SYSTEM_PROMPT,
              temperature: 0.2,
              maxOutputTokens: 1024,
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
            }
          }),
          timeoutPromise
        ]);

        const text = response.text?.trim();
        if (text) {
          return text;
        }
      } catch (err) {
        console.warn('Gemini grounded call failed or timed out. Falling back to local synthesis:', err);
      }
    }

    // Deterministic Offline Grounded Generator
    return this.generateDeterministicAnswer(standaloneQuery, retrieved, persona, language);
  }

  /**
   * Deterministic grounded answer engine guaranteeing factual responses even when offline.
   */
  private generateDeterministicAnswer(
    query: string,
    retrieved: RetrievedChunk[],
    persona: Persona,
    language: Language
  ): string {
    if (retrieved.length === 0) {
      return `I couldn't verify that information in the current Aditya Campus AI knowledge base. Please check the official portal at https://www.adityauniversity.in/contact-us.`;
    }

    const main = retrieved[0].chunk;
    let personaSalutation = '';

    if (persona === 'Parent') {
      personaSalutation = 'For parents seeking verified clarity: ';
    } else if (persona === 'Prospective Student') {
      personaSalutation = 'Welcome to Aditya University! ';
    } else if (persona === 'Visitor') {
      personaSalutation = 'For visitors to our Surampalem campus: ';
    }

    const bullets = retrieved.map(r => `• ${r.chunk.content}`).join('\n\n');

    if (language === 'Telugu') {
      return `ఆదిత్య విశ్వవిద్యాలయం అధికారిక రికార్డుల ప్రకారం **${main.title}** వివరాలు:\n\n${bullets}\n\nక్యాంపస్ చిరునామా: ఆదిత్య నగర్, ADB రోడ్, సూరంపాలెం, కాకినాడ జిల్లా, ఆంధ్రప్రదేశ్ (ఫోన్: +91 9989 776661).`;
    }

    if (language === 'Hindi') {
      return `आदित्य विश्वविद्यालय के आधिकारिक रिकॉर्ड के अनुसार **${main.title}** का विवरण:\n\n${bullets}\n\nकैंपस पता: आदित्य नगर, एडीबी रोड, सुरुमपलेम, काकीनाडा जिला, आंध्र प्रदेश (फोन: +91 9989 776661).`;
    }

    return `${personaSalutation}According to verified Aditya University records regarding **${main.title}**:\n\n${bullets}\n\nCampus Coordinates: Aditya Nagar, ADB Road, Surampalem, Kakinada District, AP – 533437 (Phone: +91 9989 776661).`;
  }

  /**
   * Directly provides official university contact info (Section 15).
   */
  private renderContactDetails(persona: Persona, language: Language): string {
    if (language === 'Telugu') {
      return `ఆదిత్య విశ్వవిద్యాలయం అధికారిక సంప్రదింపు వివరాలు:\n\n• **చిరునామా:** ఆదిత్య నగర్, ADB రోడ్, సూరంపాలెం, కాకినాడ జిల్లా, ఆంధ్రప్రదేశ్, భారతదేశం – 533437.\n• **ఫోన్:** +91 9989 776661\n• **ఈమెయిల్:** info@adityauniversity.in\n• **కార్యాలయ వేళలు:** ఉదయం 09:00 నుండి సాయంత్రం 06:00 వరకు (సోమవారం నుండి శనివారం వరకు)\n\nఅధికారిక విచారణల పోర్టల్: https://www.adityauniversity.in/contact-us`;
    }

    if (language === 'Hindi') {
      return `आदित्य विश्वविद्यालय आधिकारिक संपर्क विवरण:\n\n• **पता:** आदित्य नगर, एडीबी रोड, सुरुमपलेम, काकीनाडा जिला, आंध्र प्रदेश, भारत – 533437.\n• **फोन:** +91 9989 776661\n• **ईमेल:** info@adityauniversity.in\n• **कार्यालय समय:** सुबह 09:00 से शाम 06:00 तक (सोमवार से शनिवार)\n\nआधिकारिक पोर्टल: https://www.adityauniversity.in/contact-us`;
    }

    return `Here is the official contact information for Aditya University:\n\n• **Campus Address:** Aditya Nagar, ADB Road, Surampalem, Kakinada District, Andhra Pradesh, India – 533437.\n• **Helpdesk Phone:** +91 9989 776661\n• **Official Email:** info@adityauniversity.in\n• **Office Working Hours:** 09:00 AM to 06:00 PM, Monday through Saturday\n\nOfficial Inquiry Portal: https://www.adityauniversity.in/contact-us`;
  }

  private buildSources(retrieved: RetrievedChunk[], intent: string, evaluation: EvidenceEvaluation): Source[] {
    if (evaluation.level === 'NONE') {
      return [
        {
          title: 'Aditya University Official Portal',
          url: 'https://www.adityauniversity.in/',
          snippet: 'Official homepage of Aditya University with academic and campus resources.',
          source_type: 'official',
          category: 'overview'
        }
      ];
    }

    const uniqueMap = new Map<string, Source>();
    retrieved.forEach(r => {
      if (!uniqueMap.has(r.chunk.url)) {
        uniqueMap.set(r.chunk.url, {
          title: r.chunk.title,
          url: r.chunk.url,
          snippet: r.chunk.content.slice(0, 160) + '...',
          source_type: 'official',
          category: r.chunk.category
        });
      }
    });

    return Array.from(uniqueMap.values());
  }

  private buildActions(intent: string, evaluation: EvidenceEvaluation, sources: Source[], rawMessage: string = ''): Action[] {
    const actions: Action[] = [];
    const msgLower = rawMessage.toLowerCase();

    // Map Navigation actions for physical destinations (Section 8)
    if (/\b(library|central library|books|reading room)\b/i.test(msgLower)) {
      actions.push({
        label: 'Knowledge Resource Centre (Central Library)',
        url: 'https://www.google.com/maps/dir/?api=1&destination=17.0898,82.0674',
        action_type: 'navigation'
      });
      actions.push({
        label: 'Open Map & Directions',
        url: 'https://www.google.com/maps/search/?api=1&query=Aditya+University+Surampalem+Library',
        action_type: 'navigation'
      });
    } else if (/\b(health|hospital|clinic|doctor|medical|ambulance)\b/i.test(msgLower)) {
      actions.push({
        label: '24/7 University Health Care Centre',
        url: 'https://www.google.com/maps/dir/?api=1&destination=17.0905,82.0669',
        action_type: 'navigation'
      });
      actions.push({
        label: 'Call Emergency Medical (+91 9989 776661)',
        url: 'tel:+919989776661',
        action_type: 'source'
      });
    } else if (/\b(hostel|dorm|accommodation|boys hostel|girls hostel)\b/i.test(msgLower)) {
      actions.push({
        label: 'Aditya Residential Hostels (North-East Zone)',
        url: 'https://www.google.com/maps/dir/?api=1&destination=17.0885,82.0660',
        action_type: 'navigation'
      });
      actions.push({
        label: 'Explore Hostels in Campus Explorer',
        action_type: 'page',
        action_page: 'Campus Explorer'
      });
    } else if (/\b(placement|cdc|career development|interview center)\b/i.test(msgLower)) {
      actions.push({
        label: 'Career Development Centre (Ramanujan Block)',
        url: 'https://www.google.com/maps/dir/?api=1&destination=17.0912,82.0681',
        action_type: 'navigation'
      });
    } else if (/\b(sports|cricket|ground|stadium|gym|basketball)\b/i.test(msgLower)) {
      actions.push({
        label: 'Sports Arena & Athletic Complex',
        url: 'https://www.google.com/maps/dir/?api=1&destination=17.0920,82.0690',
        action_type: 'navigation'
      });
    }

    if (intent === 'contact') {
      actions.push({
        label: 'Call Campus Helpdesk (+91 9989 776661)',
        url: 'tel:+919989776661',
        action_type: 'source'
      });
      actions.push({
        label: 'Open Official Contact Page',
        url: 'https://www.adityauniversity.in/contact-us',
        action_type: 'navigation'
      });
    } else if (intent === 'facilities' || intent === 'hostel' || intent === 'transport' || intent === 'sports') {
      actions.push({
        label: 'Explore Campus Facilities & Amenities',
        action_type: 'page',
        action_page: 'Campus Explorer'
      });
      if (sources[0]) {
        actions.push({
          label: `Official Source: ${sources[0].title}`,
          url: sources[0].url,
          action_type: 'source'
        });
      }
    } else if (intent === 'leadership') {
      actions.push({
        label: 'View University Leadership Profiles',
        action_type: 'page',
        action_page: 'Leadership'
      });
    } else if (intent === 'admissions' || intent === 'departments') {
      actions.push({
        label: 'Browse Academic Programs & Collaborations',
        action_type: 'page',
        action_page: 'Academic Programs'
      });
    } else if (sources[0] && actions.length === 0) {
      actions.push({
        label: `View Official Source (${sources[0].title})`,
        url: sources[0].url,
        action_type: 'source'
      });
    }

    return actions;
  }

  private buildSmartAction(intent: string, sources: Source[]): SmartAction {
    if (intent === 'contact') {
      return {
        intent: 'contact',
        action_label: 'Official Contact Directory',
        action_url: 'https://www.adityauniversity.in/contact-us',
        suggested_query: 'What are the working hours and helpline numbers for Aditya University?'
      };
    }
    if (intent === 'leadership') {
      return {
        intent: 'leadership',
        action_label: 'View Leadership & Governance',
        action_page: 'Leadership',
        suggested_query: 'Who is the Chancellor and Vice Chancellor of Aditya University?'
      };
    }
    if (intent === 'facilities' || intent === 'hostel' || intent === 'transport' || intent === 'sports') {
      return {
        intent: 'facilities',
        action_label: 'Explore Campus Infrastructure',
        action_page: 'Campus Explorer',
        suggested_query: 'Tell me about hostel room options and 400+ bus transportation routes.'
      };
    }
    if (intent === 'admissions' || intent === 'departments') {
      return {
        intent: 'academics',
        action_label: 'Academic Programs & Degrees',
        action_page: 'Academic Programs',
        suggested_query: 'What degree programs have Google Cloud or Microsoft tie-ups?'
      };
    }

    return {
      intent: 'general',
      action_label: 'Ask Another Campus Query',
      action_page: 'AI Assistant',
      suggested_query: 'What facilities are available on the Surampalem campus?'
    };
  }
}

export const campusAIService = new CampusAIService();
