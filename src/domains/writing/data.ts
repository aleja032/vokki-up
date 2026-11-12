import type {
  WritingCategory,
  WritingFeedback,
  WritingHistoryItem,
  WritingPrompt
} from './types';

export const WRITING_CATEGORIES: WritingCategory[] = [
  'Conversación',
  'Viajes',
  'Trabajo',
  'Opinión',
  'Descripción',
  'Examen',
  'Personalizado'
];
export const WRITING_DEFAULT_CATEGORY: WritingCategory = 'Conversación';
export const WRITING_WORD_LIMIT = 150;

const SAMPLE_PROMPT: Omit<WritingPrompt, 'category'> = {
  title: 'Do you prefer living in a city or a small town?',
  prompt: 'Explain why.'
};

export const WRITING_PROMPTS: Record<WritingCategory, WritingPrompt> = {
  Conversación: { category: 'Conversación', ...SAMPLE_PROMPT },
  Viajes: { category: 'Viajes', ...SAMPLE_PROMPT },
  Trabajo: { category: 'Trabajo', ...SAMPLE_PROMPT },
  Opinión: { category: 'Opinión', ...SAMPLE_PROMPT },
  Descripción: { category: 'Descripción', ...SAMPLE_PROMPT },
  Examen: { category: 'Examen', ...SAMPLE_PROMPT },
  Personalizado: { category: 'Personalizado', ...SAMPLE_PROMPT }
};

export const WRITING_HISTORY: WritingHistoryItem[] = [
  {
    id: 'dream-job',
    title: 'My dream job',
    category: 'Trabajo',
    dateLabel: '19 oct',
    score: 74,
    updatedAt: 3,
    draft: ''
  },
  {
    id: 'trip-memory',
    title: 'A trip I remember',
    category: 'Viajes',
    dateLabel: '15 oct',
    score: 71,
    updatedAt: 2,
    draft: ''
  },
  {
    id: 'city-description',
    title: 'Describe your city',
    category: 'Descripción',
    dateLabel: '10 oct',
    score: 68,
    updatedAt: 1,
    draft: ''
  }
];

export const SAMPLE_FEEDBACK: WritingFeedback = {
  overall: 78,
  summary:
    'Clara y bien organizada. +6 frente a tu promedio. Revisa 3 detalles de gramática.',
  metrics: { clarity: 84, vocabulary: 80, grammar: 70 },
  corrections: [
    {
      original: 'I am agree',
      suggested: 'I agree',
      explanation: '“Agree” ya es verbo; no lleva “am”.',
      tone: 'grammar'
    },
    {
      original: 'is more quiet',
      suggested: "it's quieter",
      explanation: 'Falta el sujeto “it” y el comparativo corto es -er.',
      tone: 'grammar'
    }
  ]
};
