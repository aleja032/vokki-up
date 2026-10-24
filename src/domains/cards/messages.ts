function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural;
}

export const cardsMessages = {
  overview: {
    title: 'Tarjetas',
    summaryCompact: (cards: number, groups: number, due: number) =>
      `${cards} ${pluralize(cards, 'tarjeta', 'tarjetas')} en ${groups} ${pluralize(groups, 'grupo', 'grupos')} · ${due} para hoy`,
    summaryWide: (cards: number, due: number) =>
      `${cards} ${pluralize(cards, 'tarjeta', 'tarjetas')} en tu mazo · ${due} para repasar hoy`,
    newCardTitle: 'Nueva tarjeta',
    newCardHint: 'Con IA o manual',
    reviewTitle: 'Repasar',
    reviewPending: (due: number) =>
      `${due} ${pluralize(due, 'pendiente', 'pendientes')} hoy`,
    reviewWide: (due: number) =>
      `Repasar ${due} ${pluralize(due, 'tarjeta', 'tarjetas')}`,
    groupsTitle: 'Grupos',
    groupsLabel: 'Grupos de tarjetas',
    allGroups: 'Todas',
    newGroup: 'Nuevo grupo',
    groupMeta: (cards: number, due: number) =>
      `${cards} ${pluralize(cards, 'tarjeta', 'tarjetas')} · ${due} hoy`,
    openGroup: 'Abrir grupo',
    groupCount: (cards: number) =>
      `${cards} ${pluralize(cards, 'tarjeta', 'tarjetas')}`,
    libraryTitleAll: 'Todas mis tarjetas',
    libraryTitleGroup: (name: string) => `Tarjetas de ${name}`,
    libraryTitleWide: 'Mis tarjetas',
    searchLabel: 'Buscar tarjetas',
    searchPlaceholder: 'Buscar palabra o significado…',
    filtersLabel: 'Filtrar por categoría',
    allCategories: 'Todas',
    emptyFilter: 'No hay tarjetas con ese filtro.',
    noGroup: 'Sin grupo'
  },
  learningState: {
    new: 'Nueva',
    learning: 'Aprendiendo',
    mastered: 'Dominada'
  },
  dueLabel: {
    today: 'hoy',
    tomorrow: 'mañana',
    inDays: (days: number) => `en ${days} días`
  },
  groupCreate: {
    backLabel: 'Volver a grupos',
    title: 'Nuevo grupo',
    previewLabel: 'Vista previa',
    previewFallbackName: 'Nombre del grupo',
    previewCardCount: '0 tarjetas',
    nameLabel: 'Nombre del grupo',
    namePlaceholder: 'Ej. Laboral, Tecnología…',
    ideasLabel: 'Ideas:',
    suggestions: ['Exámenes', 'Series y películas', 'Vida diaria', 'Laboral'],
    colorLegend: 'Color',
    colorNames: {
      indigo: 'Índigo',
      green: 'Verde',
      amber: 'Ámbar',
      teal: 'Turquesa',
      coral: 'Coral',
      gray: 'Gris'
    },
    descriptionLabel: 'Descripción',
    descriptionOptional: '(opcional)',
    descriptionPlaceholder: 'Para qué usarás este grupo',
    cancel: 'Cancelar',
    submit: 'Crear grupo'
  },
  groupDetail: {
    backLabel: 'Volver a grupos',
    eyebrow: 'Grupo',
    menuLabel: 'Más opciones del grupo',
    menuAriaLabel: 'Opciones del grupo',
    menuRename: 'Renombrar',
    menuRecolor: 'Cambiar color',
    menuDelete: 'Eliminar grupo',
    deleteTitle: (name: string) => `¿Eliminar el grupo “${name}”?`,
    deleteBody: (count: number) =>
      count === 1
        ? 'La 1 tarjeta no se borra: pasa a “Sin grupo” y conserva su progreso.'
        : `Las ${count} tarjetas no se borran: pasan a “Sin grupo” y conservan su progreso.`,
    deleteCancel: 'Cancelar',
    deleteConfirm: 'Eliminar grupo',
    statCards: (count: number) => pluralize(count, 'tarjeta', 'tarjetas'),
    statDue: 'para hoy',
    statMastered: 'dominadas',
    review: (due: number) => `Repasar este grupo · ${due}`,
    listTitle: 'Tarjetas del grupo',
    add: 'Añadir',
    emptyTitle: 'Este grupo todavía está vacío',
    emptyBody: 'Añade una tarjeta para empezar a reunir palabras aquí.',
    emptyAction: 'Añadir tarjeta'
  },
  cardEditor: {
    backLabel: 'Volver a Tarjetas',
    title: 'Nueva tarjeta',
    subtitleCompact: 'Solo 2 campos son obligatorios',
    subtitleWide: 'Solo la palabra y el significado son obligatorios.',
    modesLabel: 'Forma de crear',
    modeAi: 'Con IA',
    modeAiBadge: 'IA',
    modeManual: 'Manual',
    previewHeading: 'Así se verá tu tarjeta',
    previewLabel: 'Vista previa',
    previewTermFallback: 'Tu palabra',
    previewMeaningFallback: 'Su significado aparecerá aquí',
    aiHint: 'La sugerencia por IA requiere una conexión disponible',
    aiSuggest: 'Sugerir significado y ejemplo',
    aiSuggestOffline: ' · requiere conexión',
    essentialsTitle: 'Lo esencial',
    termLabel: 'Palabra o frase en inglés',
    termPlaceholder: 'Ej. take for granted',
    viewExisting: 'Ver la tarjeta existente',
    meaningLabel: 'Significado en español',
    meaningPlaceholder: 'Corto y claro',
    contextTitle: 'Para recordarla mejor',
    optional: 'Opcional',
    exampleLabel: 'Ejemplo natural',
    examplePlaceholder: 'Una frase real donde la usarías',
    exampleCounter: (count: number) => `${count} / 160`,
    phoneticsLabel: 'Pronunciación',
    phoneticsPlaceholder: '/ɪɡˈzɑːm.pəl/',
    groupLegend: 'Grupo',
    noGroup: 'Sin grupo',
    newGroup: 'Nuevo grupo',
    categoryLegend: 'Categoría',
    tagsLegend: 'Etiquetas por tema',
    tagsSuggestions: ['trabajo', 'viajes', 'entrevistas'],
    newTag: 'Nueva etiqueta',
    tagsInputLabel: 'Etiquetas separadas por comas',
    tagsPlaceholder: 'trabajo, viajes, entrevistas',
    errorSummary: (count: number) =>
      `Revisa ${count} ${pluralize(count, 'campo', 'campos')} antes de guardar`,
    errorSummaryHint:
      'Corrige los campos marcados en rojo para guardar la tarjeta.',
    cancel: 'Cancelar',
    clear: 'Limpiar',
    submit: 'Guardar tarjeta'
  },
  review: {
    loading: 'Preparando tu repaso…',
    closeLabel: 'Cerrar sesión de repaso',
    exit: 'Salir',
    progressLabel: 'Avance de la sesión',
    count: (position: number, total: number) => `${position} / ${total}`,
    offlineNotice: 'Funciona sin conexión',
    listenLabel: 'Pronunciación escrita; audio no disponible en esta versión',
    meaningLabel: 'Significado',
    exampleLabel: 'Ejemplo',
    revealHint: 'Intenta recordarla, luego toca para ver',
    revealAction: 'Mostrar significado',
    shortcutLabel: 'Atajo:',
    spaceKey: 'Espacio',
    ratingsLabel: 'Califica esta tarjeta',
    ratingPrompt: '¿Qué tan fácil fue recordarla?',
    ratings: { again: 'Difícil', good: 'Bien', easy: 'Fácil' },
    keyHint: (key: number) => `tecla ${key}`,
    intervals: {
      again: '<10 min',
      underHour: '<1 hora',
      oneDay: '1 día',
      days: (days: number) => `${days} días`
    },
    done: {
      title: 'Sesión completa',
      reviewed: (count: number) =>
        `${count} ${pluralize(count, 'tarjeta repasada', 'tarjetas repasadas')}.`,
      streakPrefix: 'Tu racha sube a',
      streakDays: (days: number) => `${days} ${pluralize(days, 'día', 'días')}`,
      nextReturn: 'Lo próximo vuelve mañana.',
      hardChip: (count: number) =>
        `${count} ${pluralize(count, 'difícil', 'difíciles')}`,
      goodChip: (count: number) => `${count} bien`,
      easyChip: (count: number) =>
        `${count} ${pluralize(count, 'fácil', 'fáciles')}`,
      backHome: 'Volver al inicio',
      repeat: 'Repasar otra vez',
      repeatSuffix: '(no cuenta para la meta)',
      repeatNote: 'Repasar otra vez no cuenta para la meta diaria.'
    },
    empty: {
      title: 'Por ahora, ya estás al día.',
      body: 'Las tarjetas volverán cuando llegue su próximo momento de repaso.',
      action: 'Volver a mis tarjetas'
    }
  }
} as const;
