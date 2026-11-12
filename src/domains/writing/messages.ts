import { createLocalizedMessages } from '@/lib/i18n/locale';
import { getAppLanguage } from '@/lib/i18n/locale';

function localizedWritingCopy(spanish: string, english: string) {
  return getAppLanguage() === 'English' ? english : spanish;
}

export const writingMessages = createLocalizedMessages({
  heading: {
    title: 'Escritura',
    subtitle: () =>
      localizedWritingCopy(
        'Elige un tema y escribe a tu ritmo.',
        'Choose a topic and write at your own pace.'
      )
  },
  categories: {
    groupLabel: 'Categoría de escritura'
  },
  prompt: {
    labelPrefix: 'Reto de',
    changeTopic: 'Cambiar tema'
  },
  editor: {
    sectionLabel: 'Ejercicio de escritura',
    label: 'Tu respuesta',
    wordsSuffix: 'palabras',
    saved: 'Guardado en el dispositivo',
    submit: 'Analizar con IA',
    localFeedback: () =>
      localizedWritingCopy(
        'El análisis con IA está en construcción. Tu borrador se guarda en este dispositivo.',
        'AI analysis is under construction. Your draft is saved on this device.'
      )
  },
  feedback: {
    asideLabel: () =>
      localizedWritingCopy('Análisis de escritura', 'Writing analysis'),
    title: () => localizedWritingCopy('En construcción', 'Under construction'),
    body: () =>
      localizedWritingCopy(
        'El análisis de escritura estará disponible próximamente. Mientras tanto, puedes seguir escribiendo y guardando tu borrador.',
        'Writing analysis is not available yet. You can keep writing and saving your draft in the meantime.'
      )
  }
});
