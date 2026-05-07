export type Language = 'english' | 'yoruba' | 'hausa' | 'igbo';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string; // Content in the user's selected language
  originalContent?: string; // Content before translation (English)
  language: Language;
  timestamp: string;
}

export interface AwarenessUpdate {
  title: string;
  content: string;
  source: string;
  date: string;
}

export interface GlossaryEntry {
  term: string;
  definition: string;
  yoruba: string;
  hausa: string;
  igbo: string;
}
