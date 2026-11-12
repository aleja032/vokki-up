export type WritingCategory =
  | 'Conversación'
  | 'Viajes'
  | 'Trabajo'
  | 'Opinión'
  | 'Descripción'
  | 'Examen'
  | 'Personalizado';
export type WritingPrompt = {
  category: WritingCategory;
  title: string;
  prompt: string;
};
export type WritingCorrection = {
  original: string;
  suggested: string;
  explanation: string;
  tone: 'grammar' | 'vocabulary';
};
export type WritingFeedback = {
  overall: number;
  summary: string;
  metrics: { clarity: number; vocabulary: number; grammar: number };
  corrections: WritingCorrection[];
};
export type WritingHistoryItem = {
  id: string;
  title: string;
  category: WritingCategory;
  dateLabel: string;
  score: number;
  updatedAt: number;
  draft: string;
};
