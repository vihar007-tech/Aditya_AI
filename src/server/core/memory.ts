/**
 * Short-term session memory and conversational reference resolver.
 * Keeps recent conversation context to rewrite follow-up queries into standalone search queries.
 */

import { ConversationTurn, IntentType } from './types';

interface SessionRecord {
  sessionId: string;
  turns: ConversationTurn[];
  lastActive: number;
}

class SessionMemoryManager {
  private sessions: Map<string, SessionRecord> = new Map();
  private readonly MAX_TURNS_PER_SESSION = 8;
  private readonly TTL_MS = 1000 * 60 * 60; // 1 hour

  public getSession(sessionId: string): SessionRecord {
    this.cleanExpiredSessions();
    let session = this.sessions.get(sessionId);
    if (!session) {
      session = {
        sessionId,
        turns: [],
        lastActive: Date.now()
      };
      this.sessions.set(sessionId, session);
    }
    session.lastActive = Date.now();
    return session;
  }

  public addTurn(sessionId: string, turn: ConversationTurn) {
    const session = this.getSession(sessionId);
    session.turns.push(turn);
    if (session.turns.length > this.MAX_TURNS_PER_SESSION) {
      session.turns = session.turns.slice(-this.MAX_TURNS_PER_SESSION);
    }
    session.lastActive = Date.now();
  }

  public clearSession(sessionId: string) {
    this.sessions.delete(sessionId);
  }

  /**
   * Resolves follow-up queries by replacing pronouns or resolving contextual follow-ups.
   * Example:
   *  Turn 1: "Who is the Vice Chancellor?" -> Dr. M.B. Srinivas
   *  Turn 2: "Tell me more about him" -> "Tell me more about Vice Chancellor Dr. M.B. Srinivas"
   *  Turn 1: "What facilities are available?"
   *  Turn 2: "Which of those are related to sports?" -> "Which campus facilities at Aditya University are related to sports?"
   */
  public resolveQuery(sessionId: string, currentMessage: string): {
    standaloneQuery: string;
    isFollowUp: boolean;
    referencedEntities: string[];
  } {
    const session = this.getSession(sessionId);
    const text = currentMessage.trim();
    const lower = text.toLowerCase();

    // Check if there is preceding history
    if (session.turns.length === 0) {
      return {
        standaloneQuery: text,
        isFollowUp: false,
        referencedEntities: []
      };
    }

    const lastUserTurn = [...session.turns].reverse().find(t => t.role === 'user');
    const lastAssistantTurn = [...session.turns].reverse().find(t => t.role === 'assistant');

    const referencedEntities: string[] = [];
    let isFollowUp = false;
    let standalone = text;

    // Pronoun and relative reference detection
    const hasPronoun = /\b(he|him|his|she|her|they|them|their|it|its|those|these|that)\b/i.test(lower);
    const isFragment = text.split(/\s+/).length <= 4 && !/\b(what|who|where|when|why|how)\b/i.test(lower);
    const hasFollowUpConnector = /^(and\b|also\b|what about\b|tell me more\b|which of\b|how about\b|is there\b|are there\b)/i.test(lower);

    if (hasPronoun || isFragment || hasFollowUpConnector) {
      isFollowUp = true;

      // Check context from last turns
      const prevContextText = `${lastUserTurn?.content || ''} ${lastAssistantTurn?.content || ''}`.toLowerCase();

      // Leadership context (e.g. Vice Chancellor Dr. M.B. Srinivas, Chancellor Dr. N. Sesha Reddy)
      if (/\b(vice chancellor|vc|chancellor|director|srinivas|sesha reddy)\b/i.test(prevContextText)) {
        if (/\b(vice chancellor|vc|srinivas)\b/i.test(prevContextText)) {
          referencedEntities.push('Vice Chancellor Dr. M.B. Srinivas');
          standalone = text.replace(/\b(he|him|his)\b/gi, 'Vice Chancellor Dr. M.B. Srinivas');
          if (!standalone.toLowerCase().includes('vice chancellor') && !standalone.toLowerCase().includes('srinivas')) {
            standalone = `${standalone} regarding Vice Chancellor Dr. M.B. Srinivas of Aditya University`;
          }
        } else if (/\b(chancellor|sesha reddy)\b/i.test(prevContextText)) {
          referencedEntities.push('Chancellor Dr. N. Sesha Reddy');
          standalone = text.replace(/\b(he|him|his)\b/gi, 'Chancellor Dr. N. Sesha Reddy');
          if (!standalone.toLowerCase().includes('sesha reddy')) {
            standalone = `${standalone} regarding Chancellor Dr. N. Sesha Reddy`;
          }
        }
      }

      // Facilities context (e.g. "What facilities are available?" -> "Which of those are related to sports?")
      else if (/\b(facilities|facility|amenities|campus)\b/i.test(prevContextText)) {
        referencedEntities.push('Campus Facilities');
        if (/\b(those|these|them)\b/i.test(lower)) {
          standalone = text.replace(/\b(those|these|them)\b/gi, 'campus facilities');
        } else {
          standalone = `${standalone} among campus facilities`;
        }
      }

      // Hostels context (e.g. "What hostels are available?" -> "Are they available for first year students?")
      else if (/\b(hostel|hostels|accommodation|rooms|room)\b/i.test(prevContextText)) {
        referencedEntities.push('Hostels & Accommodation');
        if (/\b(they|them|it)\b/i.test(lower)) {
          standalone = text.replace(/\b(they|them|it)\b/gi, 'hostel rooms at Aditya University');
        } else {
          standalone = `${standalone} for Aditya University student hostels`;
        }
      }

      // Transport context
      else if (/\b(bus|buses|transport|transportation|route|routes)\b/i.test(prevContextText)) {
        referencedEntities.push('Campus Transportation Fleet');
        standalone = `${standalone} regarding Aditya University 400+ bus transportation fleet`;
      }

      // Healthcare context
      else if (/\b(health|hospital|doctor|clinic|medical|ambulance)\b/i.test(prevContextText)) {
        referencedEntities.push('Campus Healthcare');
        standalone = `${standalone} regarding Aditya University 24/7 healthcare centre`;
      }

      // Admissions context
      else if (/\b(admission|admissions|apply|application|fee|scholarship|eligibility)\b/i.test(prevContextText)) {
        referencedEntities.push('Admissions');
        standalone = `${standalone} regarding Aditya University admissions`;
      }
    }

    return {
      standaloneQuery: standalone.trim(),
      isFollowUp,
      referencedEntities
    };
  }

  private cleanExpiredSessions() {
    const now = Date.now();
    for (const [key, session] of this.sessions.entries()) {
      if (now - session.lastActive > this.TTL_MS) {
        this.sessions.delete(key);
      }
    }
  }
}

export const sessionMemory = new SessionMemoryManager();
