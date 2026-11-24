import type { DueWord } from '@/lib/home/home-hand.types';

// Shown instead of the real hand until a due word has been reviewed, so the
// memory colours (fragile to mastered) read before there is any data. The
// words and levels are the ones drawn in the design. Weakest first, like the
// real hand.
export const SAMPLE_HAND: DueWord[] = [
  {
    id: 'sample-receipt',
    term: 'receipt',
    meaning: 'recibo',
    phonetics: '/rɪˈsiːt/',
    partOfSpeech: 'Sustantivo',
    memoryLevel: 1,
    isNew: false,
    tone: 'coral'
  },
  {
    id: 'sample-afford',
    term: 'afford',
    meaning: 'permitirse',
    phonetics: '/əˈfɔːrd/',
    partOfSpeech: 'Verbo',
    memoryLevel: 2,
    isNew: false,
    tone: 'amber'
  },
  {
    id: 'sample-although',
    term: 'although',
    meaning: 'aunque',
    phonetics: '/ɔːlˈðoʊ/',
    partOfSpeech: 'Conector',
    memoryLevel: 2,
    isNew: false,
    tone: 'amber'
  },
  {
    id: 'sample-schedule',
    term: 'schedule',
    meaning: 'horario',
    phonetics: '/ˈskedʒ.uːl/',
    partOfSpeech: 'Sustantivo',
    memoryLevel: 3,
    isNew: false,
    tone: 'brand'
  },
  {
    id: 'sample-mention',
    term: 'mention',
    meaning: 'mencionar',
    phonetics: '/ˈmen.ʃən/',
    partOfSpeech: 'Verbo',
    memoryLevel: 3,
    isNew: false,
    tone: 'brand'
  },
  {
    id: 'sample-borrow',
    term: 'borrow',
    meaning: 'pedir prestado',
    phonetics: '/ˈbɒr.oʊ/',
    partOfSpeech: 'Verbo',
    memoryLevel: 4,
    isNew: false,
    tone: 'mint'
  }
];
