import { getAppLanguage } from '@/lib/i18n/locale';
import { INITIAL_NOTES } from './data';
import type { Note } from './types';

// The seed notes are stored in Spanish. In English only a note that still
// equals its seed (same id, title and body) is shown translated; stored data is
// never rewritten, and anything the user typed or edited shows as written. The
// English example phrases are kept as they are, only the explanations change.
const ENGLISH_SEED_NOTES: Record<string, Pick<Note, 'title' | 'body'>> = {
  '1': {
    title: 'Giving my opinion',
    body: '## To start\n- I believe that…\n- In my opinion…\n- From my experience…\n\n## To soften\n- I’m not sure, but…\n- It seems to me that…\n- That’s a good point, however…'
  },
  '2': {
    title: 'Present perfect vs. past simple',
    body: '## Present perfect (have + participle)\n- When the result matters now: I have finished my homework.\n- Experiences with no date: Have you ever been to London?\n\n## Past simple\n- With a specific moment: I finished it yesterday.\n- Signals: yesterday, last week, in 2020, ago.'
  },
  '3': {
    title: 'Tipping in the U.S.',
    body: '## What I noticed\n- At restaurants, 15% to 20% is expected.\n- At fast-food places you usually don’t tip.\n- The bill arrives without the tip included.'
  },
  '4': {
    title: 'Ideas for my essays',
    body: '## Connectors\n- However, on the other hand\n- As a result, therefore\n- For example, such as'
  },
  '5': {
    title: 'Make vs. do',
    body: '## Make\n- make a decision, make a mistake\n\n## Do\n- do homework, do business'
  },
  '6': {
    title: 'Verb to be: am, is, are',
    body: '## Forms\n- **I am** a student.\n- **You / we / they are** friends.\n- **He / she / it is** tired.\n\n## Negative and question\n- Negative: I am not, she is not (isn’t), they are not (aren’t).\n- Question: Are you ready? Is she at home?'
  },
  '7': {
    title: 'Simple present',
    body: '## When to use it\n- Routines and habits: I **work** every day.\n- General facts: Water **boils** at 100 °C.\n\n## Key rules\n- With he / she / it add **-s**: she works.\n- Negatives and questions use **do / does**: I don’t like it. Does he play?'
  }
};

export function getNoteDisplay(note: Note): Note {
  if (getAppLanguage() !== 'English') return note;
  const seed = INITIAL_NOTES.find(item => item.id === note.id);
  const english = ENGLISH_SEED_NOTES[note.id];
  if (
    !seed ||
    !english ||
    seed.title !== note.title ||
    seed.body !== note.body
  ) {
    return note;
  }
  return { ...note, ...english };
}
