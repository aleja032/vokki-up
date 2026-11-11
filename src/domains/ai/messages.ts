import { createLocalizedMessages } from '@/lib/i18n/locale';
// Static UI text for the AI card-capture flow (mockup screens).
export const aiMessages = createLocalizedMessages({
  frame: {
    mobileTitle: 'Nueva tarjeta',
    mobileAiTitle: 'Nueva tarjeta con IA',
    desktopTitle: 'Nueva tarjeta',
    backToCards: 'Tarjetas',
    backToCardsLabel: 'Volver a Tarjetas',
    backLabel: 'Volver',
    backToAddLabel: 'Volver a agregar palabras',
    online: 'En línea',
    offline: 'Sin conexión',
    modesLabel: 'Forma de crear',
    modeAi: 'Con IA',
    modeAiBadge: 'IA',
    modeManual: 'Manual',
    stepsLabel: 'Pasos'
  },
  steps: {
    add: '1 · Agregar',
    review: '2 · Revisar',
    save: '3 · Guardar'
  },
  badge: {
    label: 'IA',
    text: 'Requiere conexión'
  },
  add: {
    wordsLabel: 'Escribe una o varias palabras',
    wordsPlaceholder: 'Ej. oportunity, take for granted, reliable',
    wordsHint:
      'Separa con comas o una por línea · máximo 20. No te preocupes por la ortografía.',
    or: 'o también',
    imageTitle: 'Sube una imagen con vocabulario',
    dropzoneHint: 'Tus apuntes, una página del libro o la pizarra de clase.',
    takePhoto: 'Tomar foto',
    chooseImage: 'Elegir imagen',
    imageLimits: 'JPG o PNG · máximo 10 MB',
    removeImage: 'Quitar imagen',
    groupTitle: 'Guardar en el grupo',
    newGroup: 'Nuevo grupo',
    groupHint: 'Puedes cambiar el grupo de cada tarjeta al revisarlas.',
    infoBody:
      'La IA corrige la ortografía y prepara significado, pronunciación, categoría, un ejemplo y 2 palabras relacionadas. ',
    infoStrong: 'Nada se guarda hasta que lo confirmes.',
    generate: 'Generar propuestas',
    summaryEmpty: 'Agrega palabras o una imagen para continuar',
    summary: (parts: string) => `Vas a enviar ${parts}`,
    wordCount: (count: number) =>
      `${count} ${count === 1 ? 'palabra' : 'palabras'}`,
    imageCount: '1 imagen'
  },
  processing: {
    working: 'Preparando tus tarjetas',
    workingHint: 'Suele tardar menos de 15 segundos.',
    ready: (count: number) => `${count} propuestas listas`,
    readyHint: 'Revísalas antes de guardar. Nada se ha creado todavía.',
    cancel: 'Cancelar',
    review: (count: number) => `Revisar ${count} propuestas`
  },
  review: {
    title: 'Revisa las propuestas',
    desktopInputTitle: '1 · Tu entrada',
    desktopInputHint: 'Escribe palabras, sube una imagen o ambas.',
    desktopWords: 'Palabras',
    desktopWordsHint: 'Separa con comas · máximo 20',
    desktopImage: 'Imagen',
    desktopImageFound: '2 palabras encontradas',
    desktopChange: 'Cambiar',
    desktopRegenerate: 'Volver a generar',
    desktopNote: 'Nada se guarda hasta que pulses ',
    desktopNoteStrong: 'Crear tarjetas',
    desktopNoteEnd: '.',
    desktopReviewTitle: '2 · Revisa las propuestas',
    counts: (total: number, accepted: number, rejected: number) =>
      `${total} propuestas · ${accepted} aceptadas · ${rejected} rechazadas`,
    acceptAll: 'Aceptar todas',
    discardAll: 'Descartar todas',
    confirmTitle: '¿Descartar todas las propuestas?',
    confirmBody:
      'No se creará ninguna tarjeta. Tus palabras originales siguen en el paso 1.',
    confirmBodyWide: 'No se creará ninguna tarjeta.',
    confirmCancel: 'Cancelar',
    confirmAccept: 'Sí, descartar',
    discardedTitle: 'Descartaste todas las propuestas',
    discardedBody: 'No se creó ninguna tarjeta.',
    undo: 'Deshacer',
    startOver: 'Empezar de nuevo',
    rejectedPrefix: 'Rechazada · ',
    spellingFixed: 'Ortografía corregida:',
    keepOriginal: 'Mantener original',
    related: 'Relacionadas',
    reject: 'Rechazar',
    edit: 'Editar',
    accept: 'Aceptar',
    accepted: 'Aceptada',
    pillAccepted: 'Aceptada',
    pillPending: 'Pendiente',
    pillIncomplete: 'Incompleta',
    rowError: 'No pudimos generar el ejemplo ni las palabras relacionadas.',
    rowErrorWide: 'No pudimos generar el ejemplo ni las relacionadas.',
    retry: 'Reintentar',
    writeIt: 'Escribirlo yo',
    createCards: (count: number) =>
      count > 0
        ? `Crear ${count} ${count === 1 ? 'tarjeta' : 'tarjetas'}`
        : 'Acepta al menos una',
    saveHint: (pending: number) =>
      pending > 0
        ? `${pending} ${pending === 1 ? 'pendiente no se guardará' : 'pendientes no se guardarán'}`
        : 'Solo se crean las propuestas aceptadas',
    cancel: 'Cancelar',
    sourceTyped: 'Escrita por ti',
    sourceImage: 'De la imagen'
  },
  created: {
    title: (count: number) => `${count} tarjetas creadas`,
    body: (skipped: number) =>
      `Ya están en tu mazo y aparecerán en tu próximo repaso. ${skipped} propuestas no se guardaron.`,
    listLabel: 'Tarjetas creadas',
    stored: 'Guardadas en el dispositivo · se sincronizan solas',
    reviewNow: 'Repasarlas ahora',
    viewCards: 'Ver mis tarjetas',
    createMore: 'Crear más'
  },
  offline: {
    title: 'La IA necesita internet',
    body: 'Tus palabras quedaron guardadas en el dispositivo. Puedes crearlas a mano ahora o generarlas cuando vuelvas a estar en línea.',
    queueLabel: 'Palabras en espera',
    queueTitle: 'En espera · 3 palabras y 1 imagen',
    queuedNotice:
      'Listo. Generaremos las propuestas al reconectar y te avisaremos para que las revises.',
    createManually: 'Crear manualmente',
    queue: 'Generar al reconectar',
    cancelQueue: 'Cancelar generación automática'
  },
  noWords: {
    title: 'No encontramos palabras en esta imagen',
    body: 'La foto está borrosa o el texto es muy pequeño. Tus 3 palabras escritas siguen intactas.',
    tipsTitle: 'Para una mejor lectura',
    tips: [
      'Toma la foto con buena luz y sin sombras.',
      'Acerca la cámara hasta que el texto ocupe la pantalla.',
      'Mantén el teléfono quieto y paralelo a la hoja.'
    ],
    warningsTitle: 'Otros avisos al subir una imagen',
    retakePhoto: 'Tomar otra foto',
    continueWithWords: 'Continuar solo con las palabras escritas'
  },
  serviceError: {
    title: 'No pudimos generar las propuestas',
    body: 'El servicio de IA tardó demasiado en responder. No es un problema de tu conexión y tus palabras siguen guardadas.',
    detailsLabel: 'Detalles del error',
    code: 'Código',
    attempts: 'Intentos',
    attemptsValue: (attempt: number) => `${attempt} de 3`,
    supportId: 'ID para soporte',
    copy: 'copiar',
    copied: 'copiado',
    retrying: 'Reintentando…',
    retry: 'Reintentar',
    createManually: 'Crear manualmente'
  },
  flow: {
    offline:
      'Conéctate a internet para generar propuestas. Crear tarjetas a mano sigue disponible.',
    nothingToSend: 'Agrega vocabulario o elige una imagen para continuar.',
    tooManyTerms: (max: number) =>
      `Escribiste demasiadas palabras. El máximo es ${max}.`,
    imageTooLarge: 'La imagen supera los 10 MB. Elige un JPG o PNG más ligero.',
    imageFormat: 'Ese formato de imagen no es compatible. Elige un JPG o PNG.',
    noVocabulary:
      'No encontramos vocabulario claro. Prueba con un texto más claro, una imagen más nítida o crea la tarjeta a mano.',
    failed:
      'El servicio de IA no pudo generar propuestas. Inténtalo de nuevo o crea las tarjetas a mano.',
    libraryLoading:
      'Tu biblioteca local todavía se está cargando. Inténtalo en un momento.',
    chooseGroup: 'Elige un grupo existente antes de crear estas tarjetas.',
    acceptOne: 'Acepta al menos una propuesta antes de crear las tarjetas.',
    incomplete:
      'Alguna propuesta aceptada está incompleta. Edítala antes de guardar.',
    imageUnreadable: 'No pudimos leer la imagen. Elígela de nuevo.'
  },
  panes: {
    imageTitle: 'Desde una imagen',
    imageHint:
      'Sube tus apuntes, una página del libro o la pizarra y la IA extrae el vocabulario.',
    dropzoneText: 'Arrastra una imagen aquí o elígela desde tu equipo.',
    dropzoneActive: 'Suelta la imagen para cargarla',
    chooseImage: 'Elegir imagen',
    imageLimits: 'JPG o PNG · máximo 10 MB',
    imageReady: (kilobytes: number) => `${kilobytes} KB · lista para analizar`,
    removeImage: 'Quitar imagen',
    wordsTitle: 'Lista de palabras',
    wordsHint:
      'Escríbelas en cualquier orden y con cualquier separador. La IA las organiza y prepara las tarjetas.',
    wordsLabel: 'Palabras o frases',
    wordsPlaceholder: 'Ej. oportunity, take for granted, reliable',
    wordsCounter: (count: number, max: number) =>
      `${count} / ${max} palabras o frases`,
    wordsNote:
      'La IA corrige la ortografía y agrega significado, fonética, ejemplo y dos palabras relacionadas.',
    groupLegend: 'Guardar en el grupo',
    groupHint: 'Las tarjetas aceptadas se guardarán en este grupo.',
    generate: 'Generar propuestas',
    generating: 'Procesando…',
    onlineHint: 'La IA solo se usa cuando estás conectado.',
    processingTitle: 'Preparando tus tarjetas',
    processingHint: 'Suele tardar menos de 15 segundos.'
  },
  proposals: {
    title: 'Revisa tus tarjetas',
    counts: (total: number, accepted: number) =>
      `${total} propuestas · ${accepted} seleccionadas`,
    sourceImage: 'Desde imagen',
    sourceTyped: 'Texto ingresado',
    selected: 'Seleccionada',
    pending: 'Pendiente',
    correction: 'Corrección:',
    noPhonetics: 'Sin fonética',
    related: 'Relacionadas',
    discardedSuffix: ' · descartada',
    undo: 'Deshacer',
    discard: 'Descartar',
    edit: 'Editar',
    done: 'Listo',
    accept: 'Aceptar',
    remove: 'Quitar',
    acceptAll: 'Aceptar todas',
    discardAll: 'Descartar todas',
    editHint: 'Edita cualquier campo antes de guardarla.',
    cancel: 'Cancelar',
    back: 'Volver',
    createCards: (count: number) => `Crear ${count} tarjetas`,
    pendingCount: (count: number) => `${count} pendientes de revisar`,
    wordLabel: 'Palabra',
    meaningLabel: 'Significado',
    exampleLabel: 'Ejemplo en inglés',
    categoryLabel: 'Categoría',
    relatedLabel: 'Palabras relacionadas'
  },
  createdPanel: {
    title: (count: number) => `${count} tarjetas creadas`,
    body: 'Se guardaron en tu mazo y ya están listas para repasar.',
    listLabel: 'Tarjetas creadas',
    done: 'Listo',
    createMore: 'Crear más'
  },
  autofill: {
    unconfigured:
      'Para usar la IA primero configura un proveedor en Ajustes > Proveedor IA.',
    unconfiguredLink: 'Abrir Ajustes',
    failed:
      'La IA no pudo sugerir los campos. Inténtalo de nuevo o complétalos a mano.',
    offline: 'Conéctate a internet para usar la sugerencia por IA.',
    empty: 'La IA no encontró sugerencias para esta palabra.'
  },
  workflow: {
    processing: 'Procesando…',
    generate: 'Generar propuestas',
    onlineHint: 'La IA solo se usa cuando estás conectado.',
    wordsLabel: 'Palabras o frases',
    wordsPlaceholder:
      'Escribe varias palabras separadas por comas o líneas nuevas',
    wordsHint:
      'La IA corregirá la ortografía y agregará significado, fonética, ejemplo y dos palabras relacionadas.',
    divider: 'o',
    imageTitle: 'Captura vocabulario desde una imagen',
    dropzoneText: 'Elige una foto o toma una captura con tu teléfono.',
    chooseImage: 'Elegir imagen',
    imageLimits: 'JPG o PNG, máximo 10 MB',
    fileDetail: (kilobytes: number) => `${kilobytes} KB · lista para analizar`,
    discardImage: 'Descartar imagen',
    groupLabel: 'Grupo',
    groupHint: 'Las tarjetas aceptadas se guardarán en este grupo.',
    reviewTitle: 'Revisar propuestas',
    reviewSubtitle: (accepted: number, total: number) =>
      `${accepted} seleccionadas · ${total} encontradas`,
    backToCapture: 'Volver a capturar',
    createCards: (count: number) => `Crear ${count} tarjetas`,
    pendingHint: (count: number) => `${count} pendientes de revisar`,
    cancel: 'Cancelar',
    createdTitle: 'Tarjetas creadas',
    backToCards: 'Volver a tarjetas',
    viewCards: 'Ver mis tarjetas',
    createMore: 'Crear más',
    createdHeading: (count: number) => `${count} tarjetas creadas`,
    createdBody:
      'Se guardaron localmente en tu grupo y están listas para repasar.',
    createdListLabel: 'Tarjetas creadas',
    storedHere: 'Guardadas en este dispositivo'
  }
});
