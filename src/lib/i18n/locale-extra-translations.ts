// Spanish -> English entries for screens closed in the language audit.
// Merged over the base map in `locale.ts`; keep each key identical to the
// Spanish source string used in the domain messages.
export const extraTranslations: Record<string, string> = {
  // Parts of speech (stored as Spanish data values, shown translated)
  Sustantivo: 'Noun',
  Verbo: 'Verb',
  Adjetivo: 'Adjective',
  Adverbio: 'Adverb',
  Expresión: 'Expression',
  'Verbo frasal': 'Phrasal verb',

  // Import / export
  'TUS DATOS, A TU MANERA': 'YOUR DATA, YOUR WAY',
  PORTABILIDAD: 'PORTABILITY',
  'Importar o exportar': 'Import or export',
  'Una vista clara de los datos y de cómo viajan.':
    'A clear view of your data and how it travels.',
  'Ejemplo de muestra': 'Sample example',
  'FORMATO CSV': 'CSV FORMAT',
  'El esquema de tus tarjetas': 'Your cards schema',
  'Las columnas requeridas identifican cada palabra. Las demás completan el contexto.':
    'Required columns identify each word. The rest add context.',
  Columna: 'Column',
  Campo: 'Field',
  'Formato del campo': 'Field format',
  Requisito: 'Requirement',
  Requerida: 'Required',
  Opcional: 'Optional',
  'Palabra o frase': 'Word or phrase',
  Significado: 'Meaning',
  Pronunciación: 'Pronunciation',
  Ejemplo: 'Example',
  'Tipo de palabra': 'Part of speech',
  Grupo: 'Group',
  Etiquetas: 'Tags',
  Texto: 'Text',
  'Texto libre': 'Free text',
  'Texto separado por punto y coma': 'Semicolon-separated text',
  'Los nombres de grupo se conservan exactamente como aparecen en el archivo; no se traducen ni se reemplazan.':
    'Group names are kept exactly as they appear in the file; they are not translated or replaced.',
  ENTRADA: 'INPUT',
  'Importar tarjetas': 'Import cards',
  'Revisa el archivo antes de usar sus filas.':
    'Review the file before using its rows.',
  'Elegir archivo CSV': 'Choose CSV file',
  'Muestra incluida': 'Included sample',
  'Archivo seleccionado': 'Selected file',
  'Resumen de validación': 'Validation summary',
  'Hay algo para corregir': 'Something needs fixing',
  'La muestra tiene todas las columnas requeridas.':
    'The sample has all the required columns.',
  'La estructura y las filas requeridas están listas para revisar.':
    'The structure and required rows are ready for review.',
  'Vista previa': 'Preview',
  'Sin grupo': 'No group',
  'Revisar muestra': 'Review sample',
  SALIDA: 'OUTPUT',
  'Exportar una muestra': 'Export a sample',
  'Descarga un CSV de ejemplo para revisar el formato.':
    'Download a sample CSV to review the format.',
  'ARCHIVO DE EJEMPLO': 'SAMPLE FILE',
  'Exportar CSV de muestra': 'Export sample CSV',
  'El CSV de muestra está listo en tus descargas.':
    'The sample CSV is ready in your downloads.',
  'Esta maqueta solo usa las filas visibles de ejemplo. No accede a tus datos reales ni los guarda.':
    'This mockup only uses the visible sample rows. It does not access or save your real data.',
  'El archivo no contiene filas para revisar.':
    'The file has no rows to review.',
  'Elige un archivo con extensión .csv.':
    'Choose a file with a .csv extension.',
  'El archivo supera el límite de 2 MB para esta vista previa.':
    'The file exceeds the 2 MB limit for this preview.',

  // Notes validation
  'Escribe un nombre para la categoría.': 'Enter a name for the category.',
  'Usa 40 caracteres o menos.': 'Use 40 characters or fewer.',
  'Ya existe una categoría con ese nombre.':
    'A category with that name already exists.',

  // Cards pagination
  'Paginación de tarjetas': 'Cards pagination',
  'Página anterior': 'Previous page',
  'Página siguiente': 'Next page',
  Anterior: 'Previous',
  Siguiente: 'Next',

  // AI capture workflow
  'Procesando…': 'Processing…',
  'La IA solo se usa cuando estás conectado.':
    'AI is only used when you are online.',
  'Palabras o frases': 'Words or phrases',
  'Escribe varias palabras separadas por comas o líneas nuevas':
    'Write several words separated by commas or new lines',
  'La IA corregirá la ortografía y agregará significado, fonética, ejemplo y dos palabras relacionadas.':
    'AI will fix spelling and add meaning, phonetics, an example, and two related words.',
  o: 'or',
  'Captura vocabulario desde una imagen': 'Capture vocabulary from an image',
  'Elige una foto o toma una captura con tu teléfono.':
    'Choose a photo or take a picture with your phone.',
  'Elegir imagen': 'Choose image',
  'JPG o PNG, máximo 10 MB': 'JPG or PNG, up to 10 MB',
  'Descartar imagen': 'Discard image',
  'Las tarjetas aceptadas se guardarán en este grupo.':
    'Accepted cards will be saved to this group.',
  'Revisar propuestas': 'Review suggestions',
  'Volver a capturar': 'Back to capture',
  'Tarjetas creadas': 'Cards created',
  'Volver a tarjetas': 'Back to cards',
  'Crear más': 'Create more',
  'Se guardaron localmente en tu grupo y están listas para repasar.':
    'They were saved locally in your group and are ready to review.',
  'Guardadas en este dispositivo': 'Saved on this device',

  // Language audit round 2
  'Puede que el enlace esté mal escrito o que la tarjeta o nota se haya eliminado.':
    'The link may be misspelled, or the card or note may have been deleted.',
  'No pudimos mostrar esta pantalla. Tus tarjetas y notas siguen guardadas en tu dispositivo. Inténtalo de nuevo.':
    'We could not show this screen. Your cards and notes are still saved on your device. Try again.',
  'La aplicación tuvo un problema inesperado. Tus tarjetas y notas siguen guardadas en tu dispositivo.':
    'The app ran into an unexpected problem. Your cards and notes are still saved on your device.',
  'Separa con comas o una por línea · máximo 20. No te preocupes por la ortografía.':
    'Separate with commas or one per line · up to 20. Do not worry about spelling.',
  'Nada se guarda hasta que pulses ': 'Nothing is saved until you press ',
  'Descartaste todas las propuestas': 'You discarded all the suggestions',
  'Guardadas en el dispositivo · se sincronizan solas':
    'Saved on the device · they sync on their own',
  'Tus palabras quedaron guardadas en el dispositivo. Puedes crearlas a mano ahora o generarlas cuando vuelvas a estar en línea.':
    'Your words are saved on the device. You can create the cards by hand now or generate them when you are back online.',
  'Conéctate a internet para generar propuestas. Crear tarjetas a mano sigue disponible.':
    'Connect to the internet to generate suggestions. Creating cards by hand is still available.',
  'Agrega vocabulario o elige una imagen para continuar.':
    'Add vocabulary or choose an image to continue.',
  'La imagen supera los 10 MB. Elige un JPG o PNG más ligero.':
    'The image is over 10 MB. Choose a lighter JPG or PNG.',
  'Ese formato de imagen no es compatible. Elige un JPG o PNG.':
    'That image format is not supported. Choose a JPG or PNG.',
  'No encontramos vocabulario claro. Prueba con un texto más claro, una imagen más nítida o crea la tarjeta a mano.':
    'We did not find clear vocabulary. Try a clearer text, a sharper image, or create the card by hand.',
  'El servicio de IA no pudo generar propuestas. Inténtalo de nuevo o crea las tarjetas a mano.':
    'The AI service could not generate suggestions. Try again or create the cards by hand.',
  'Tu biblioteca local todavía se está cargando. Inténtalo en un momento.':
    'Your local library is still loading. Try again in a moment.',
  'Elige un grupo existente antes de crear estas tarjetas.':
    'Choose an existing group before creating these cards.',
  'Acepta al menos una propuesta antes de crear las tarjetas.':
    'Accept at least one suggestion before creating the cards.',
  'Alguna propuesta aceptada está incompleta. Edítala antes de guardar.':
    'An accepted suggestion is incomplete. Edit it before saving.',
  'No pudimos leer la imagen. Elígela de nuevo.':
    'We could not read the image. Choose it again.',
  'Desde una imagen': 'From an image',
  'Sube tus apuntes, una página del libro o la pizarra y la IA extrae el vocabulario.':
    'Upload your notes, a book page, or the whiteboard and AI extracts the vocabulary.',
  'Arrastra una imagen aquí o elígela desde tu equipo.':
    'Drag an image here or pick it from your device.',
  'Suelta la imagen para cargarla': 'Drop the image to upload it',
  'Lista de palabras': 'Word list',
  'Escríbelas en cualquier orden y con cualquier separador. La IA las organiza y prepara las tarjetas.':
    'Write them in any order with any separator. AI organizes them and prepares the cards.',
  'La IA corrige la ortografía y agrega significado, fonética, ejemplo y dos palabras relacionadas.':
    'AI fixes spelling and adds meaning, phonetics, an example, and two related words.',
  'Revisa tus tarjetas': 'Review your cards',
  'Corrección:': 'Correction:',
  'Sin fonética': 'No phonetics',
  'Edita cualquier campo antes de guardarla.':
    'Edit any field before saving it.',
  'Ejemplo en inglés': 'Example in English',
  'Se guardaron en tu mazo y ya están listas para repasar.':
    'They were saved to your deck and are ready to review.',
  'Para usar la IA primero configura un proveedor en Ajustes > Proveedor IA.':
    'To use AI, first set up a provider in Settings > AI provider.',
  'La IA no pudo sugerir los campos. Inténtalo de nuevo o complétalos a mano.':
    'AI could not suggest the fields. Try again or fill them in by hand.',
  'Conéctate a internet para usar la sugerencia por IA.':
    'Connect to the internet to use the AI suggestion.',
  'La IA no encontró sugerencias para esta palabra.':
    'AI found no suggestions for this word.',
  'tu@correo.com': 'you@email.com',
  'Revisa tu correo: parece que no es válido.':
    'Check your email: it does not look valid.',
  Exámenes: 'Exams',
  tarjeta: 'card',
  tarjetas: 'cards',
  'para hoy': 'due today',
  'La sugerencia por IA requiere una conexión disponible':
    'The AI suggestion needs an available connection',
  ' · requiere conexión': ' · needs a connection',
  'Escribe primero la palabra o frase en inglés':
    'First write the word or phrase in English',
  'Pidiendo sugerencias a la IA…': 'Asking AI for suggestions…',
  'Con solo la palabra, la IA completa lo que falte. Podrás editarlo antes de guardar.':
    'With just the word, AI fills in what is missing. You can edit it before saving.',
  'Reemplazar con la IA': 'Replace with AI',
  'Conservar lo mío': 'Keep mine',
  'Una frase real donde la usarías': 'A real sentence where you would use it',
  'Las tarjetas volverán cuando llegue su próximo momento de repaso.':
    'Cards will come back when their next review time arrives.',
  'Editar nota': 'Edit note',
  '126 tarjetas, 14 notas y 9 textos guardados en este dispositivo.':
    '126 cards, 14 notes, and 9 texts saved on this device.',
  'Estado de la conexión con la IA': 'AI connection status',
  'URL base del servicio': 'Service base URL',
  'Un modelo rápido es suficiente para tarjetas y correcciones.':
    'A fast model is enough for cards and corrections.',
  'Funciona sin conexión. Tu progreso se sincroniza después.':
    'Works offline. Your progress syncs later.',
  'Elige cómo quieres cargar tus palabras.':
    'Choose how you want to load your words.',

  // Settings: credential errors
  'Este proveedor necesita su propia API key.':
    'This provider needs its own API key.',
  'La API key no tiene un formato válido. Revísala e inténtalo de nuevo.':
    'The API key does not have a valid format. Check it and try again.',
  'El proveedor o el modelo elegido no es válido. Elige otro e inténtalo de nuevo.':
    'The selected provider or model is not valid. Choose another and try again.',
  'Inicia sesión para guardar la API key en tu cuenta.':
    'Sign in to save the API key to your account.',
  'Escribe o guarda una API key de este proveedor antes de probar la conexión.':
    'Enter or save an API key for this provider before testing the connection.',
  'La API key guardada es de otro proveedor. Escribe una API key para este proveedor.':
    'The saved API key belongs to another provider. Enter an API key for this provider.',
  'Todavía no hay una API key guardada. Escribe una para continuar.':
    'There is no saved API key yet. Enter one to continue.',
  'El servicio no está disponible ahora mismo. Inténtalo de nuevo en unos minutos.':
    'The service is not available right now. Try again in a few minutes.',
  'No se pudo guardar la configuración. Inténtalo de nuevo.':
    'The settings could not be saved. Try again.',
  'No se pudo eliminar la API key guardada. Inténtalo de nuevo.':
    'The saved API key could not be deleted. Try again.',
  'No se pudo cargar el estado de la API key.':
    'The API key status could not be loaded.',
  'Escribe una API key para el proveedor elegido antes de guardar.':
    'Enter an API key for the selected provider before saving.',
  'Algo salió mal. Inténtalo de nuevo.': 'Something went wrong. Try again.',

  // Add hub
  'Forma de agregar vocabulario': 'Way to add vocabulary',
  'La IA lee tu foto': 'AI reads your photo',
  'La IA las organiza': 'AI organizes them',
  'Escribe y completa con IA': 'Write and complete with AI',

  'Acepta, edita o descarta antes de crear las tarjetas.':
    'Accept, edit, or discard before creating the cards.',
  'Continuar revisión': 'Continue review',

  // Home
  días: 'days',
  'Todo al día': 'All caught up',
  'Empezar ahora': 'Start now'
};

// Interpolated messages: [Spanish pattern, English replacement].
export const extraDynamicTranslations: ReadonlyArray<[RegExp, string]> = [
  [
    /^Tienes (\d+) propuestas por revisar\.$/,
    'You have $1 suggestions to review.'
  ],
  [
    /^(\d+) de (\d+) tarjetas completadas hoy$/,
    '$1 of $2 cards completed today'
  ],
  [
    /^Ya están en tu mazo y aparecerán en tu próximo repaso\. (\d+) propuestas no se guardaron\.$/,
    'They are already in your deck and will appear in your next review. $1 suggestions were not saved.'
  ],
  [
    /^Escribiste demasiadas palabras\. El máximo es (\d+)\.$/,
    'You wrote too many words. The maximum is $1.'
  ],
  [/^Tarjetas de (.+)$/, 'Cards in $1'],
  [/^¿Eliminar el grupo “(.+)”\?$/, 'Delete the group “$1”?'],
  [
    /^La 1 tarjeta no se borra: pasa a “Sin grupo” y conserva su progreso\.$/,
    'The 1 card is not deleted: it moves to “No group” and keeps its progress.'
  ],
  [
    /^Las (\d+) tarjetas no se borran: pasan a “Sin grupo” y conservan su progreso\.$/,
    'The $1 cards are not deleted: they move to “No group” and keep their progress.'
  ],
  [
    /^Ya escribiste (\d+) campos? que la IA sugiere distinto\. ¿Quieres reemplazarlos\?$/,
    'You already wrote $1 field(s) that AI suggests differently. Do you want to replace them?'
  ],
  [
    /^Ya tienes un grupo llamado “(.+)”\.$/,
    'You already have a group called “$1”.'
  ],
  [/^Ya tienes “(.+)” en tu mazo\.$/, 'You already have “$1” in your deck.'],
  [/^Quitar (.+) de favoritas$/, 'Remove $1 from favorites'],
  [/^Marcar (.+) como favorita$/, 'Mark $1 as favorite'],
  [
    /^Revisa que esté completa y que pertenezca a (.+)\.$/,
    'Check that it is complete and belongs to $1.'
  ],
  [/^Faltan columnas requeridas: (.+)\.$/, 'Missing required columns: $1.'],
  [
    /^Fila (\d+): falta palabra o significado\.$/,
    'Row $1: missing word or meaning.'
  ],
  [/^(\d+) válidas · (\d+) con errores$/, '$1 valid · $2 with errors'],
  [/^(\d+) filas · (\d+) columnas$/, '$1 rows · $2 columns'],
  [/^(\d+) filas$/, '$1 rows'],
  [/^Importar (\d+) filas$/, 'Import $1 rows'],
  [
    /^(\d+) filas válidas revisadas localmente\. No se guardan ni se agregan al mazo global\.$/,
    '$1 valid rows reviewed locally. They are not saved or added to the global deck.'
  ],
  [/^Página (\d+) de (\d+)$/, 'Page $1 of $2'],
  [/^(\d+) KB · lista para analizar$/, '$1 KB · ready to analyze'],
  [/^(\d+) seleccionadas · (\d+) encontradas$/, '$1 selected · $2 found'],
  [/^(\d+) pendientes de revisar$/, '$1 left to review'],
  [/^(\d+) pendientes · disponible offline$/, '$1 pending · available offline']
];
