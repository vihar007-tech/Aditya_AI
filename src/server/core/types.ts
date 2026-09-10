/**
 * Core types and schemas for the Aditya Campus AI backend service.
 */

export type Persona = 'Student' | 'Prospective Student' | 'Parent' | 'Visitor' | 'Faculty/Staff';
export type Language = 'English' | 'Telugu' | 'Hindi';

export type EvidenceLevel = 'STRONG' | 'MODERATE' | 'WEAK' | 'NONE';

export type IntentType =
  | 'campus_overview'
  | 'leadership'
  | 'departments'
  | 'faculty'
  | 'facilities'
  | 'hostel'
  | 'transport'
  | 'healthcare'
  | 'sports'
  | 'career'
  | 'admissions'
  | 'events'
  | 'regulations'
  | 'contact'
  | 'navigation'
  | 'general_conversation'
  | 'unknown';

export interface Source {
  title: string;
  url: string;
  snippet?: string;
  category?: string;
  source_type: 'official' | 'catalog' | 'portal';
}

export interface Action {
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

export interface QueryAnalysis {
  intent: IntentType;
  standalone_query: string;
  requires_retrieval: boolean;
  is_explicit_navigation: boolean;
  user_language: Language;
  persona: Persona;
  entities: string[];
  confidence: number;
}

export interface CampusResponse {
  answer: string;
  intent: IntentType;
  answerable: boolean;
  evidence_level: EvidenceLevel;
  sources: Source[];
  actions: Action[];
  language: Language;
  session_id: string;
  grounded: boolean;
  confidence_status: string;
  smart_action?: SmartAction;
}

export interface KnowledgeChunk {
  id: string;
  title: string;
  url: string;
  category: string;
  source_type: 'official';
  content: string;
  content_hash: string;
  last_updated: string;
  keywords: string[];
}

export interface RetrievedChunk {
  chunk: KnowledgeChunk;
  similarity_score: number;
  keyword_score: number;
  combined_score: number;
}

export interface EvidenceEvaluation {
  level: EvidenceLevel;
  confidence: number;
  top_score: number;
  relevant_chunk_count: number;
  direct_answer_found: boolean;
  reason: string;
}

export interface ConversationTurn {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  intent?: IntentType;
  entities?: string[];
}
