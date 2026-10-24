import type { CardGroup, VocabularyCard } from './types';

export const INITIAL_GROUPS: CardGroup[] = [
  {
    id: 'work',
    name: 'Trabajo',
    description: 'Reuniones, proyectos y oficina',
    tone: 'indigo'
  },
  {
    id: 'travel',
    name: 'Viajes',
    description: 'Moverte con confianza',
    tone: 'amber'
  },
  {
    id: 'daily',
    name: 'Día a día',
    description: 'Palabras para cada momento',
    tone: 'green'
  },
  {
    id: 'phrases',
    name: 'Frases útiles',
    description: 'Expresiones que suenan naturales',
    tone: 'blue'
  }
];

export const INITIAL_CARDS: VocabularyCard[] = [
  {
    id: '1',
    term: 'reliable',
    meaning: 'confiable; que siempre responde bien',
    phonetics: '/rɪˈlaɪəbəl/',
    example: 'She is a reliable colleague who always meets her deadlines.',
    partOfSpeech: 'Adjetivo',
    groupId: 'work',
    tags: ['work', 'personality']
  },
  {
    id: '2',
    term: 'deadline',
    meaning: 'fecha límite para terminar algo',
    phonetics: '/ˈdedlaɪn/',
    example: 'We need to finish the report before the deadline.',
    partOfSpeech: 'Sustantivo',
    groupId: 'work',
    tags: ['work']
  },
  {
    id: '3',
    term: 'to schedule',
    meaning: 'programar o agendar algo',
    phonetics: '/ˈskedʒuːl/',
    example: 'Could we schedule a meeting for Thursday morning?',
    partOfSpeech: 'Verbo',
    groupId: 'work',
    tags: ['work', 'meetings']
  },
  {
    id: '4',
    term: 'to catch up',
    meaning: 'ponerse al día con alguien',
    phonetics: '/kætʃ ʌp/',
    example: 'Let’s catch up over coffee next week.',
    partOfSpeech: 'Verbo frasal',
    groupId: 'work',
    tags: ['phrases']
  },
  {
    id: '5',
    term: 'boarding pass',
    meaning: 'tarjeta de embarque',
    phonetics: '/ˈbɔːrdɪŋ pæs/',
    example: 'Please have your boarding pass ready at the gate.',
    partOfSpeech: 'Sustantivo',
    groupId: 'travel',
    tags: ['travel', 'airport']
  },
  {
    id: '6',
    term: 'a layover',
    meaning: 'escala entre dos vuelos',
    phonetics: '/ˈleɪoʊvər/',
    example: 'We have a three-hour layover in Madrid.',
    partOfSpeech: 'Sustantivo',
    groupId: 'travel',
    tags: ['travel']
  },
  {
    id: '7',
    term: 'to get around',
    meaning: 'desplazarse por un lugar',
    phonetics: '/ɡet əˈraʊnd/',
    example: 'It is easy to get around the city by metro.',
    partOfSpeech: 'Verbo frasal',
    groupId: 'travel',
    tags: ['travel']
  },
  {
    id: '8',
    term: 'to run errands',
    meaning: 'hacer diligencias o mandados',
    phonetics: '/rʌn ˈerəndz/',
    example: 'I need to run a few errands after work.',
    partOfSpeech: 'Expresión',
    groupId: 'daily',
    tags: ['daily']
  },
  {
    id: '9',
    term: 'thoughtful',
    meaning: 'considerado; atento con los demás',
    phonetics: '/ˈθɔːtfəl/',
    example: 'That was a thoughtful thing to say.',
    partOfSpeech: 'Adjetivo',
    groupId: 'daily',
    tags: ['personality']
  },
  {
    id: '10',
    term: 'to make up your mind',
    meaning: 'decidirse',
    phonetics: '/meɪk ʌp jʊr maɪnd/',
    example: 'Take your time before you make up your mind.',
    partOfSpeech: 'Expresión',
    groupId: 'phrases',
    tags: ['phrases']
  },
  {
    id: '11',
    term: 'I’m looking forward to it',
    meaning: 'tengo muchas ganas',
    phonetics: '/aɪm ˈlʊkɪŋ ˈfɔːrwərd tuː ɪt/',
    example: 'Thanks for inviting me. I’m looking forward to it.',
    partOfSpeech: 'Expresión',
    groupId: 'phrases',
    tags: ['phrases']
  },
  {
    id: '12',
    term: 'to figure out',
    meaning: 'averiguar o encontrar la solución',
    phonetics: '/ˈfɪɡjər aʊt/',
    example: 'We will figure out a better way to organize the files.',
    partOfSpeech: 'Verbo frasal',
    groupId: 'work',
    tags: ['work', 'phrases']
  }
];
