// Static sample content for the AI capture mockup screens (from the visual proposal).

export type SamplePartOfSpeech =
  | 'Sustantivo'
  | 'Verbo'
  | 'Adjetivo'
  | 'Adverbio'
  | 'Expresión';

export type SampleProposalStatus = 'accepted' | 'pending' | 'rejected';

export type SampleProposal = {
  id: string;
  source: 'typed' | 'image';
  original: string;
  word: string;
  phonetics: string;
  partOfSpeech: SamplePartOfSpeech;
  meaning: string;
  example: string;
  related: readonly string[];
  status: SampleProposalStatus;
  hasError: boolean;
};

export const SAMPLE_PROPOSALS: readonly SampleProposal[] = [
  {
    id: 'p1',
    source: 'typed',
    original: 'oportunity',
    word: 'opportunity',
    phonetics: '/ˌɒp.əˈtʃuː.nə.ti/',
    partOfSpeech: 'Sustantivo',
    meaning: 'Una buena ocasión para hacer algo.',
    example: 'This job is a great opportunity for me.',
    related: ['chance', 'possibility'],
    status: 'accepted',
    hasError: false
  },
  {
    id: 'p2',
    source: 'typed',
    original: '',
    word: 'take for granted',
    phonetics: '/teɪk fər ˈɡrɑːn.tɪd/',
    partOfSpeech: 'Expresión',
    meaning: 'Dar por sentado; no valorar algo o a alguien.',
    example: 'We often take our health for granted.',
    related: ['assume', 'overlook'],
    status: 'pending',
    hasError: false
  },
  {
    id: 'p3',
    source: 'typed',
    original: 'relaiable',
    word: 'reliable',
    phonetics: '/rɪˈlaɪ.ə.bəl/',
    partOfSpeech: 'Adjetivo',
    meaning: 'Confiable; que siempre responde bien.',
    example: 'I need a reliable laptop for work.',
    related: ['dependable', 'trustworthy'],
    status: 'pending',
    hasError: false
  },
  {
    id: 'p4',
    source: 'image',
    original: '',
    word: 'whiteboard',
    phonetics: '/ˈwaɪt.bɔːd/',
    partOfSpeech: 'Sustantivo',
    meaning: 'Pizarra blanca.',
    example: 'The teacher wrote the new words on the whiteboard.',
    related: ['marker', 'eraser'],
    status: 'accepted',
    hasError: false
  },
  {
    id: 'p5',
    source: 'image',
    original: 'shedule',
    word: 'schedule',
    phonetics: '/ˈʃedʒ.uːl/',
    partOfSpeech: 'Sustantivo',
    meaning: 'Horario; agenda.',
    example: '',
    related: [],
    status: 'pending',
    hasError: true
  }
];

export const SAMPLE_CREATED_CARDS = [
  {
    word: 'opportunity',
    meaning: 'Una buena ocasión para hacer algo.',
    partOfSpeech: 'Sustantivo'
  },
  {
    word: 'reliable',
    meaning: 'Confiable; que siempre responde bien.',
    partOfSpeech: 'Adjetivo'
  },
  {
    word: 'whiteboard',
    meaning: 'Pizarra blanca.',
    partOfSpeech: 'Sustantivo'
  }
] as const satisfies readonly {
  word: string;
  meaning: string;
  partOfSpeech: SamplePartOfSpeech;
}[];

export const SAMPLE_TYPED_TEXT = 'oportunity, take for granted, relaiable';
export const SAMPLE_TYPED_WORDS = [
  'oportunity',
  'take for granted',
  'relaiable'
] as const;

export const SAMPLE_IMAGE = {
  name: 'apuntes-clase.jpg',
  detail: '2,4 MB · lista para leer'
} as const;

export const SAMPLE_GROUPS = [
  { id: 'none', label: 'Sin grupo', tone: 'neutral' },
  { id: 'work', label: 'Laboral', tone: 'indigo' },
  { id: 'tech', label: 'Tecnología', tone: 'teal' },
  { id: 'travel', label: 'Viajes', tone: 'amber' }
] as const;

export const SAMPLE_SELECTED_GROUP_ID = 'work';

export const SAMPLE_PROCESSING_STEPS = [
  { label: 'Leyendo la imagen', detail: 'apuntes-clase.jpg' },
  { label: 'Identificando palabras', detail: '3 escritas + 2 de la imagen' },
  { label: 'Corrigiendo ortografía', detail: '3 correcciones encontradas' },
  {
    label: 'Generando el contenido',
    detail: 'Significado, pronunciación, categoría, ejemplo y 2 relacionadas'
  }
] as const;

export const SAMPLE_QUEUED_WORDS = [
  'oportunity',
  'take for granted',
  'relaiable'
] as const;

export const SAMPLE_UPLOAD_WARNINGS = [
  {
    id: 'format',
    tone: 'error',
    fileName: 'apuntes.heic',
    message: 'Formato no compatible. Usa JPG o PNG.'
  },
  {
    id: 'size',
    tone: 'error',
    fileName: 'pizarra.jpg',
    message: 'Pesa 14 MB. El máximo es 10 MB.'
  },
  {
    id: 'truncated',
    tone: 'warning',
    fileName: 'libro-pag-12.jpg',
    message: 'Encontramos 34 palabras. Usaremos las primeras 20.'
  }
] as const;

export const SAMPLE_SUPPORT_ID = 'VK-a1f9-22c';
export const SAMPLE_ERROR_CODE = '504 · tiempo agotado';
export const SAMPLE_ATTEMPT = 2;
