import { createLocalizedMessages, getAppLanguage } from '@/lib/i18n/locale';
function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural;
}

export const cardsMessages = createLocalizedMessages({
  overview: {
    title: 'Mi mazo',
    summary: (cards: number, folders: number) =>
      `${cards} ${pluralize(cards, 'tarjeta', 'tarjetas')} · ${folders} ${pluralize(folders, 'carpeta', 'carpetas')}`,
    newCardTitle: 'Nueva tarjeta',
    newCardMenuLabel: 'Opciones para agregar tarjetas',
    createCard: 'Crear tarjeta',
    importFile: 'Importar archivo',
    addFromLibrary: 'Agregar desde la biblioteca',
    fromLibrary: 'Desde la biblioteca',
    reviewShort: (due: number) =>
      due === 0
        ? 'Repasar tarjetas'
        : due === 1
          ? 'Repasar 1 tarjeta'
          : `Repasar ${due} tarjetas`,
    roundSizeLabel: 'Ronda de:',
    roundSizeGroupLabel: 'Tamaño de la ronda',
    roundSizeAll: 'Todas',
    reviewFolderLabel: (due: number, name: string) =>
      `${due === 1 ? 'Repasar 1 tarjeta' : `Repasar ${due} tarjetas`} · ${name}`,
    folderDueChip: (due: number) => `${due} para hoy`,
    folderMasteredChip: (percent: number) => `${percent}% dominadas`,
    folderSummary: (cards: number, due: number, percent: number) =>
      `${cards} ${pluralize(cards, 'tarjeta', 'tarjetas')} · ${due} para hoy · ${percent}% dominadas`,
    backToAllLabel: 'Volver a todas las carpetas',
    addToFolder: 'Agregar tarjeta a esta carpeta',
    memoryLabel: (level: number) => `Memoria ${level} de 5`,
    groupsTitle: 'Carpetas',
    foldersHint:
      'Tus grupos para ordenar las tarjetas. Las palabras nuevas salen de los Mundos, por tema.',
    exploreWorlds: 'Explorar Mundos',
    groupsLabel: 'Carpetas de tarjetas',
    allGroups: 'Todas',
    allFoldersTitle: 'Todas las carpetas',
    folderLabel: 'Carpeta',
    locationLabel: 'Ubicación en Mi mazo',
    newGroup: 'Nueva carpeta',
    folderSearchLabel: 'Buscar carpeta',
    noFolders: 'No hay carpetas con ese nombre.',
    viewAllFolders: (count: number) => `Ver las ${count}`,
    viewFewerFolders: 'Ver menos',
    folderDue: (due: number) => `${due} hoy`,
    showMoreCards: 'Ver más',
    addFolderChip: 'Carpeta',
    addShort: 'Agregar',
    reviewBannerLabel: 'Repaso de hoy',
    reviewBannerKicker: 'Hoy',
    reviewBannerTitle: (count: number) =>
      count === 0
        ? 'Todo al día'
        : `${count} ${pluralize(count, 'tarjeta lista', 'tarjetas listas')}`,
    reviewBannerLead: (count: number, minutes: number) =>
      count === 0
        ? 'Vuelve mañana o agrega tarjetas'
        : `~${minutes} min · disponible sin conexión`,
    shownOfTotal: (shown: number, total: number) =>
      `${shown} de ${total} ${pluralize(total, 'tarjeta', 'tarjetas')}`,
    groupMeta: (cards: number, due: number) =>
      `${cards} ${pluralize(cards, 'tarjeta', 'tarjetas')} · ${due} hoy`,
    cardCount: (cards: number) =>
      `${cards} ${pluralize(cards, 'tarjeta', 'tarjetas')}`,
    libraryTitleAll: 'Todas',
    libraryTitleGroup: (name: string) => name,
    searchLabel: 'Buscar tarjetas',
    searchPlaceholder: 'Buscar tarjetas',
    searchInGroup: (name: string) => `Buscar en ${name}`,
    statusFiltersLabel: 'Filtrar por próximo repaso',
    statusFilters: {
      all: 'Todas',
      due: 'Hoy',
      week: 'Esta semana',
      weekShort: 'Semana',
      safe: 'Seguras'
    },
    typeLabel: 'Tipo',
    allTypes: 'Todos',
    allCategories: 'Todas',
    emptyFilter: 'No hay tarjetas con ese filtro.',
    noGroup: 'Sin grupo',
    pagination: {
      label: 'Paginación de tarjetas',
      previousLabel: 'Página anterior',
      nextLabel: 'Página siguiente',
      pageLabel: (page: number) => `Página ${page}`,
      showing: (from: number, to: number, total: number) =>
        `Mostrando ${from}–${to} de ${total} ${pluralize(total, 'tarjeta', 'tarjetas')}`
    },
    manageCards: 'Gestionar',
    editCardLabel: (term: string) => `Editar ${term}`,
    editHint: 'Toca una tarjeta para editarla.',
    cardSelectLabel: (term: string) => `Seleccionar ${term}`,
    selectedCards: (count: number) =>
      count === 1
        ? '1 tarjeta seleccionada'
        : `${count} tarjetas seleccionadas`,
    selectAll: 'Seleccionar todas',
    clearSelection: 'Quitar selección',
    deleteAction: 'Eliminar',
    deleteSelectedTitle: (count: number) =>
      count === 1
        ? '¿Eliminar esta tarjeta?'
        : `¿Eliminar estas ${count} tarjetas?`,
    deleteSelectedBody:
      'Se eliminarán las tarjetas seleccionadas y se borrará su progreso de repaso.',
    cardDeleteCancel: 'Cancelar'
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
      lavender: 'Lavanda',
      blue: 'Azul',
      teal: 'Turquesa',
      green: 'Verde',
      gray: 'Gris'
    },
    descriptionLabel: 'Descripción',
    descriptionOptional: '(opcional)',
    descriptionPlaceholder: 'Para qué usarás este grupo',
    cancel: 'Cancelar',
    submit: 'Crear grupo'
  },
  addLocked: {
    title: 'Imagen y Palabras están bloqueadas',
    body: 'Estos modos usan la IA. Actívala y configura tu API key en Ajustes. Mientras tanto puedes agregar a mano o desde la biblioteca.',
    libraryLink: 'Ir a la biblioteca'
  },
  groupDetail: {
    menuLabel: 'Opciones de carpeta',
    menuAriaLabel: 'Acciones de la carpeta',
    menuRename: 'Renombrar',
    menuRecolor: 'Cambiar color',
    menuDelete: 'Eliminar carpeta',
    menuDeleteBlocked: 'Elimina sus tarjetas para poder borrar esta carpeta.',
    menuRenameLocked:
      'Esta carpeta recibe las tarjetas de las eliminadas: su nombre no cambia.',
    editTitle: 'Editar carpeta',
    editNameLabel: 'Nombre de la carpeta',
    editColorLegend: 'Color de la carpeta',
    editSave: 'Guardar',
    editCancel: 'Cancelar',
    deleteTitle: 'Eliminar grupo',
    deleteBody: (name: string, count: number) => {
      if (count === 0)
        return `Se eliminará “${name}”. El grupo no tiene tarjetas.`;
      return count === 1
        ? `Se eliminará “${name}”. Su 1 tarjeta pasará a “Otros” y conserva su progreso.`
        : `Se eliminará “${name}”. Sus ${count} tarjetas pasarán a “Otros” y conservan su progreso.`;
    },
    deleteCancel: 'Cancelar',
    deleteConfirm: 'Eliminar',
    add: 'Añadir',
    addFromLibrary: 'Agregar desde la biblioteca',
    emptyTitle: 'Este grupo todavía está vacío',
    emptyBody: 'Añade una tarjeta para empezar a reunir palabras aquí.',
    emptyAction: 'Añadir tarjeta'
  },
  cardEditor: {
    backLabel: 'Volver a Tarjetas',
    title: 'Nueva tarjeta',
    editTitle: 'Editar tarjeta',
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
    aiDisabledHint: 'La IA para tarjetas está desactivada en Ajustes.',
    aiSuggest: 'Sugerir significado y ejemplo',
    aiSuggestOffline: ' · requiere conexión',
    aiSuggestNeedsTerm: 'Escribe primero la palabra o frase en inglés',
    aiSuggestLoading: 'Pidiendo sugerencias a la IA…',
    aiSuggestHelp:
      'Con solo la palabra, la IA completa lo que falte. Podrás editarlo antes de guardar.',
    aiConflict: (count: number) =>
      `Ya escribiste ${count} ${pluralize(count, 'campo', 'campos')} que la IA sugiere distinto. ¿Quieres reemplazarlos?`,
    aiConflictReplace: 'Reemplazar con la IA',
    aiConflictKeep: 'Conservar lo mío',
    aiSettingsLink: 'Abrir Ajustes',
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
    exampleEsLabel: 'Ejemplo en español (opcional)',
    exampleEsPlaceholder: 'La misma frase, en español',
    phoneticsLabel: 'Pronunciación',
    phoneticsPlaceholder: '/ɪɡˈzɑːm.pəl/',
    pronunciationLocaleLabel: 'Idioma de pronunciación (BCP 47)',
    invalidPronunciationLocale:
      'Usa una etiqueta de idioma BCP 47 válida de hasta 35 caracteres.',
    groupLegend: 'Grupo',
    noGroup: 'Sin grupo',
    newGroup: 'Nuevo grupo',
    categoryLegend: 'Categoría',
    tagsLegend: 'Etiquetas por tema',
    // English tags match the English seed card tags.
    get tagsSuggestions() {
      return getAppLanguage() === 'English'
        ? ['work', 'travel', 'interviews']
        : ['trabajo', 'viajes', 'entrevistas'];
    },
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
  exampleEsToggle: {
    show: 'Mostrar ejemplo en español',
    hide: 'Ocultar ejemplo en español'
  },
  review: {
    loading: 'Preparando tu repaso…',
    closeLabel: 'Cerrar sesión de repaso',
    exit: 'Salir',
    progressLabel: 'Avance de la sesión',
    count: (position: number, total: number) => `${position} / ${total}`,
    offlineNotice: 'Funciona sin conexión',
    listenLabel: 'Escuchar pronunciación',
    speechUnavailable:
      'La síntesis de voz no está disponible en este navegador.',
    speechFailed: 'No se pudo reproducir el audio. Puedes volver a intentarlo.',
    meaningLabel: 'Significado',
    exampleLabel: 'Ejemplo',
    revealHint: 'Intenta recordarla, luego toca para ver',
    revealAction: 'Mostrar significado',
    ratingsLabel: 'Califica esta tarjeta',
    ratingPrompt: '¿Qué tan fácil lo recordaste?',
    ratings: {
      again: 'Otra vez',
      hard: 'Difícil',
      good: 'Bien',
      easy: 'Fácil'
    },
    intervals: {
      again: '<10 min',
      underHour: '<1 hora',
      oneDay: '1 día',
      days: (days: number) => `${days} días`
    },
    status: {
      combo: (count: number) => `COMBO x${count}`,
      accuracy: (correct: number, reviewed: number) =>
        `${correct} de ${reviewed} ${pluralize(reviewed, 'acierto', 'aciertos')}`,
      comboBubble: (count: number) => `¡Combo x${count}! Vas sin fallar.`
    },
    memory: {
      new: 'Palabra nueva',
      low: 'Memoria baja',
      medium: 'Memoria media',
      high: 'Memoria alta'
    },
    done: {
      title: 'Ronda completada',
      rescued: (count: number) =>
        `¡Rescataste ${count} ${pluralize(count, 'palabra', 'palabras')}!`,
      accuracyLabel: 'Aciertos',
      accuracyValue: (correct: number, reviewed: number) =>
        `${correct} / ${reviewed}`,
      bestComboLabel: 'Mejor combo',
      bestComboValue: (count: number) => `x${count}`,
      streakLabel: 'Racha',
      gainsTitle: 'Subieron de memoria',
      reviewed: (count: number) =>
        `${count} ${pluralize(count, 'tarjeta repasada', 'tarjetas repasadas')}.`,
      streakPrefix: 'Tu racha sube a',
      streakDays: (days: number) => `${days} ${pluralize(days, 'día', 'días')}`,
      nextReturn: 'Lo próximo vuelve mañana.',
      againChipSuffix: 'otra vez',
      hardChip: (count: number) =>
        `${count} ${pluralize(count, 'difícil', 'difíciles')}`,
      goodChip: (count: number) => `${count} bien`,
      easyChip: (count: number) =>
        `${count} ${pluralize(count, 'fácil', 'fáciles')}`,
      backHome: 'Volver al inicio',
      backCards: 'Volver a tarjetas',
      repeat: 'Repasar otra vez',
      repeatSuffix: '(no cuenta para la meta)',
      repeatNote: 'Repasar otra vez no cuenta para la meta diaria.',
      continueDue: (count: number) => `Repasar ${count} más`,
      remainingDue: (count: number) =>
        count === 1
          ? 'Te queda 1 por repasar hoy'
          : `Te quedan ${count} por repasar hoy`,
      studyAhead: 'Estudiar por adelantado',
      studyAheadHint:
        'Adelanta las próximas tarjetas. Cuentan para tu calendario.'
    },
    aheadNotice: 'Estás adelantando tarjetas que aún no tocan.',
    empty: {
      title: 'Por ahora, ya estás al día.',
      body: 'Las tarjetas volverán cuando llegue su próximo momento de repaso.',
      action: 'Volver a mis tarjetas'
    }
  }
});
