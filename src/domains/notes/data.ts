import type { Note, NoteCategory, NoteFilter } from './types';

export const NOTE_CATEGORIES: NoteCategory[] = [
  'Expresiones',
  'Gramática',
  'Cultura',
  'Ideas'
];

export const NOTE_FILTERS: NoteFilter[] = [
  'Todas',
  'Favoritas',
  'Gramática',
  'Expresiones',
  'Cultura'
];

export const INITIAL_NOTES: Note[] = [
  {
    id: '1',
    title: 'Para dar mi opinión',
    category: 'Expresiones',
    body: '## Para empezar\n- I believe that…\n- In my opinion…\n- From my experience…\n\n## Para matizar\n- I’m not sure, but…\n- It seems to me that…\n- That’s a good point, however…',
    updatedAt: '22 oct',
    favorite: true
  },
  {
    id: '2',
    title: 'Present perfect vs. past simple',
    category: 'Gramática',
    body: '## Present perfect (have + participio)\n- Cuando importa el resultado ahora: I have finished my homework.\n- Experiencias sin fecha: Have you ever been to London?\n\n## Past simple\n- Con un momento concreto: I finished it yesterday.\n- Señales: yesterday, last week, in 2020, ago.',
    updatedAt: '20 oct',
    favorite: true
  },
  {
    id: '3',
    title: 'Propinas en EE. UU.',
    category: 'Cultura',
    body: '## Lo que noté\n- En restaurantes se espera entre 15 % y 20 %.\n- En comida rápida normalmente no se deja.\n- La cuenta llega sin propina incluida.',
    updatedAt: '18 oct'
  },
  {
    id: '4',
    title: 'Ideas para mis redacciones',
    category: 'Ideas',
    body: '## Conectores\n- However, on the other hand\n- As a result, therefore\n- For example, such as',
    updatedAt: '15 oct'
  },
  {
    id: '5',
    title: 'Make vs. do',
    category: 'Gramática',
    body: '## Make\n- make a decision, make a mistake\n\n## Do\n- do homework, do business',
    updatedAt: '11 oct'
  }
];
