import { createLocalizedMessages } from '@/lib/i18n/locale';
import {
  ALL_WORD_LIBRARY_CATEGORIES,
  WORD_LIBRARY_LEVEL_LABELS
} from './catalog';
import type { WordLibraryLevel } from './catalog';
import type { WorldId } from './worlds';

export const wordLibraryMessages = createLocalizedMessages({
  back: 'Volver a mis tarjetas',
  title: 'Biblioteca de palabras',
  summary:
    'Explora vocabulario en inglés y guarda cada palabra en su colección.',
  searchLabel: 'Buscar en la biblioteca',
  searchPlaceholder: 'Buscar palabra, significado o ejemplo…',
  categoriesLabel: 'Categorías de vocabulario',
  allCategories: ALL_WORD_LIBRARY_CATEGORIES,
  levelsLabel: 'Nivel de inglés',
  allLevels: 'Todos',
  levelNames: WORD_LIBRARY_LEVEL_LABELS,
  clearFilters: 'Quitar filtros',
  emptyFiltered: 'No encontramos palabras con esos filtros.',
  resultCount: (count: number) =>
    `${count} ${count === 1 ? 'palabra disponible' : 'palabras disponibles'}`,
  addMode: 'Agregar palabras',
  addBarLabel: 'Agregar palabras',
  selectedWords: (count: number) =>
    count === 0
      ? 'Toca las palabras que quieras agregar'
      : `${count} ${count === 1 ? 'palabra seleccionada' : 'palabras seleccionadas'}`,
  selectAll: 'Seleccionar todas',
  clearSelection: 'Quitar selección',
  cancelAdd: 'Cancelar',
  addAction: (count: number) => `Agregar ${count}`,
  selectWord: (term: string) => `Seleccionar ${term}`,
  // Each part is translated on its own, then joined (see `buildAddResult`).
  addedPart: (added: number) =>
    `${added} ${added === 1 ? 'palabra agregada' : 'palabras agregadas'} a sus colecciones`,
  duplicatesPart: (duplicates: number) =>
    duplicates === 1
      ? '1 palabra ya existe en tus tarjetas y no se añadió de nuevo'
      : `${duplicates} palabras ya existen en tus tarjetas y no se añadieron de nuevo`,
  empty: 'No encontramos palabras con esa búsqueda.',
  loading: 'Cargando tus grupos…',
  alreadyInLibrary: 'Ya está en tus tarjetas',
  notAdded: 'Sin agregar',
  selectedState: 'Seleccionada',
  previousPage: 'Anterior',
  nextPage: 'Siguiente',
  paginationLabel: 'Paginación de palabras',
  pageStatus: (page: number, pageCount: number) =>
    `Página ${page} de ${pageCount}`,
  // Worlds (proposal D, "Mundos")
  worldsTitle: 'Mundos',
  libraryProgress: 'Tu biblioteca',
  libraryOf: (inDeck: number, total: number) => `${inDeck} de ${total}`,
  worldCount: (count: number) => `${count} mundos`,
  wordCount: (count: number) => `${count} palabras`,
  inYourDeck: (count: number) => `${count} en tu mazo`,
  worldActive: 'En curso',
  worldNew: 'Sin empezar',
  levelsSection: 'Niveles',
  levelOf: (level: number) => `Nivel ${level} de 3`,
  stage: (stage: number) => `Etapa ${stage}`,
  searchInWorld: (name: string) => `Buscar en ${name}`,
  openWholeLibrary: 'Ver toda la biblioteca',
  worldsIntro:
    'Elige un mundo para aprender por tema, o explora todas las palabras.',
  viewTabsLabel: 'Vista de la biblioteca',
  tabWorlds: 'Por mundos',
  tabLibrary: 'Toda la biblioteca',
  continueWorld: (name: string) => `Continuar ${name}`,
  libraryIntro:
    'Las mismas palabras de los mundos, en una sola lista con búsqueda.',
  levelHint: 'en todos los mundos',
  stageOwned: (inDeck: number, total: number) =>
    `${inDeck} de ${total} en tu mazo`,
  backToWorlds: 'Mundos',
  viewInDeck: 'Ver en Mi mazo',
  locationLabel: 'Ubicación en Mundos',
  worldKind: 'Mundo',
  worldProgress: (name: string, inDeck: number, total: number) =>
    `${name}: ${inDeck}/${total}`,
  worldDescriptions: {
    daily: 'Rutina, casa, compras y calle',
    work: 'Oficina, reuniones y correos',
    travel: 'Aeropuertos, hoteles y restaurantes',
    phrases: 'Expresiones para cualquier momento'
  } satisfies Record<WorldId, string>
});

export const LEVEL_NUMBER: Record<WordLibraryLevel, number> = {
  basic: 1,
  intermediate: 2,
  advanced: 3
};
