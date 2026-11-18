import { getAppLanguage } from '@/lib/i18n/locale';
import { INITIAL_GROUPS } from './data';
import { OTHERS_GROUP } from './delete-group';
import type { CardGroup } from './types';

// The seed groups are stored in Spanish. Only values that still equal the seed
// are translated when displayed; stored data is never changed, and groups the
// user created or renamed show exactly what was typed. A dedicated map is used
// instead of the global translation table because that one falls back to
// substring replacement and would also rewrite longer strings that contain
// "Trabajo" or "Viajes".
const ENGLISH_SEED_TEXT: Record<string, string> = {
  Trabajo: 'Work',
  'Reuniones, proyectos y oficina': 'Meetings, projects, and office',
  Viajes: 'Travel',
  'Moverte con confianza': 'Move around with confidence',
  'Día a día': 'Daily life',
  'Palabras para cada momento': 'Words for every moment',
  'Frases útiles': 'Useful phrases',
  'Expresiones que suenan naturales': 'Expressions that sound natural',
  Otros: 'Others',
  'Tarjetas de grupos eliminados': 'Cards from deleted groups'
};

function localizeSeedText(group: CardGroup, field: 'name' | 'description') {
  const value = group[field];
  if (getAppLanguage() !== 'English') return value;
  const template = [...INITIAL_GROUPS, OTHERS_GROUP].find(
    seed => seed.id === group.id
  );
  if (!template || template[field] !== value) return value;
  return ENGLISH_SEED_TEXT[value] ?? value;
}

export function getGroupDisplayName(group: CardGroup): string {
  return localizeSeedText(group, 'name');
}

export function getGroupDisplayDescription(group: CardGroup): string {
  return localizeSeedText(group, 'description');
}
