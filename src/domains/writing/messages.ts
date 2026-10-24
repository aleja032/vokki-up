export const writingMessages = {
  heading: {
    title: 'Escritura',
    subtitle: 'Elige un tema, escribe y recibe feedback cuando haya conexión.',
    historyShort: 'Historial',
    historyLong: 'Ver historial'
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
    localFeedback:
      'Se muestra un ejemplo local; tu texto todavía no se envió ni se analizó.'
  },
  feedback: {
    asideLabel: 'Feedback de ejemplo',
    headline: 'Clara y bien organizada',
    deltaCopy: '+6 frente a tu promedio.',
    mobileDetail: 'Revisa 3 detalles de gramática.',
    desktopDetail: 'Revisa 2 detalles de gramática.',
    metrics: {
      clarity: 'Claridad',
      vocabulary: 'Vocabulario',
      grammar: 'Gramática'
    },
    corrections: 'Correcciones',
    createCard: (word: string) => `Crear tarjeta con “${word}”`,
    createCardWord: 'quieter',
    scoreOutOf: (score: number) => `${score} sobre 100`,
    metricLabel: (name: string, value: number) => `${name}: ${value} de 100`
  },
  history: {
    title: 'Últimos textos',
    openItem: (title: string, category: string, date: string) =>
      `Abrir ${title}, ${category}, ${date}`
  }
} as const;
