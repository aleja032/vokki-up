import { createLocalizedMessages } from '@/lib/i18n/locale';

// Texts of the Cards add hub (route-layer composition of manual + AI modes).
export const addHubMessages = createLocalizedMessages({
  title: 'Agregar vocabulario',
  subtitle: 'Elige cómo quieres cargar tus palabras.',
  modesLabel: 'Forma de agregar vocabulario',
  modes: {
    image: { label: 'Desde una imagen', hint: 'La IA lee tu foto' },
    words: { label: 'Lista de palabras', hint: 'La IA las organiza' },
    manual: { label: 'Manual', hint: 'Escribe y completa con IA' }
  },
  badge: 'IA',
  review: {
    title: 'Revisar propuestas',
    subtitle: 'Acepta, edita o descarta antes de crear las tarjetas.',
    back: 'Volver',
    backLabel: 'Volver al paso anterior',
    cancel: 'Cancelar',
    resume: (count: number) => `Tienes ${count} propuestas por revisar.`,
    resumeAction: 'Continuar revisión'
  }
});
