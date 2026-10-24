export type AppLanguage = 'Español' | 'English';

const DEFAULT_LANGUAGE: AppLanguage = 'Español';
let activeLanguage: AppLanguage = DEFAULT_LANGUAGE;
const listeners = new Set<() => void>();

const translations: Record<string, string> = {
  'Conexión…': 'Connecting…',
  Sincronizado: 'Synced',
  'Al día': 'Up to date',
  'Sin conexión': 'Offline',
  'Esta página no existe': 'This page does not exist',
  'Ir al inicio': 'Go home',
  'Ver mis tarjetas': 'View my cards',
  'Buscar en Vokki Up': 'Search Vokki Up',
  'Busca una palabra o una nota…': 'Search for a word or note…',
  'Algo salió mal': 'Something went wrong',
  Reintentar: 'Try again',
  'Cargando…': 'Loading…',
  'Nivel B1': 'B1 level',
  'Inicia sesión': 'Sign in',
  'Guarda tu progreso y sincronízalo entre dispositivos.':
    'Save your progress and sync it across devices.',
  'Correo electrónico': 'Email',
  Contraseña: 'Password',
  'Mostrar contraseña': 'Show password',
  'Ocultar contraseña': 'Hide password',
  'Iniciar sesión': 'Sign in',
  'Iniciando sesión…': 'Signing in…',
  'Continuar sin cuenta': 'Continue without an account',
  'No pudimos iniciar sesión. Inténtalo de nuevo.':
    'We could not sign you in. Try again.',
  'Revisando sesión…': 'Checking session…',
  'Sesión iniciada': 'Signed in',
  'Estás usando Vokki Up con esta cuenta.':
    'You are using Vokki Up with this account.',
  'Volver a aprender': 'Back to learning',
  'Cerrar sesión': 'Sign out',
  Notas: 'Notes',
  'Tus apuntes, sin tarjetas': 'Your notes, separate from cards',
  'Expresiones, reglas y observaciones. Separadas de tus tarjetas.':
    'Expressions, rules, and observations. Separate from your cards.',
  'Nueva nota': 'New note',
  'Buscar notas': 'Search notes',
  'Buscar en tus notas…': 'Search your notes…',
  'Filtrar notas': 'Filter notes',
  'Volver a Notas': 'Back to Notes',
  'Administrar categorías': 'Manage categories',
  'Ocultar categorías': 'Hide categories',
  'Nueva categoría': 'New category',
  'Cambiar nombre de categoría': 'Rename category',
  Crear: 'Create',
  Guardar: 'Save',
  Cancelar: 'Cancel',
  Renombrar: 'Rename',
  Eliminar: 'Delete',
  Predeterminada: 'Default',
  'Las notas se conservarán en General.': 'Notes will be kept in General.',
  'Tus notas': 'Your notes',
  'Nota sin título': 'Untitled note',
  'Ninguna nota coincide con tu búsqueda.': 'No notes match your search.',
  'Marcar como favorita': 'Mark as favorite',
  'Quitar de favoritas': 'Remove from favorites',
  'Nota abierta': 'Open note',
  Formato: 'Formatting',
  Negrita: 'Bold',
  Cursiva: 'Italic',
  Subrayado: 'Underline',
  Lista: 'List',
  'Crear tarjeta desde selección': 'Create card from selection',
  'Guardada localmente': 'Saved locally',
  'Cambios sin guardar': 'Unsaved changes',
  'Título de la nota': 'Note title',
  'Dale un título a tu nota': 'Give your note a title',
  Categoría: 'Category',
  'Contenido de la nota': 'Note content',
  'Anota una idea, una frase o algo que quieras recordar…':
    'Write an idea, a phrase, or something you want to remember…',
  'Un espacio solo tuyo para pensar en voz alta.':
    'A space just for you to think out loud.',
  'Guardar nota': 'Save note',
  Escritura: 'Writing',
  'Elige un tema, escribe y recibe feedback cuando haya conexión.':
    'Choose a topic, write, and get feedback when you are online.',
  Historial: 'History',
  'Ver historial': 'View history',
  'Categoría de escritura': 'Writing category',
  'Reto de': 'Challenge:',
  'Cambiar tema': 'Change topic',
  'Ejercicio de escritura': 'Writing exercise',
  'Tu respuesta': 'Your response',
  palabras: 'words',
  'Guardado en el dispositivo': 'Saved on this device',
  'Analizar con IA': 'Analyze with AI',
  'Feedback de ejemplo': 'Example feedback',
  'Clara y bien organizada': 'Clear and well organized',
  Claridad: 'Clarity',
  Vocabulario: 'Vocabulary',
  Gramática: 'Grammar',
  Correcciones: 'Corrections',
  'Últimos textos': 'Recent writing',
  Tarjetas: 'Cards',
  'Nueva tarjeta': 'New card',
  'Con IA o manual': 'With AI or manually',
  Repasar: 'Review',
  pendientes: 'pending',
  pendiente: 'pending',
  hoy: 'today',
  mañana: 'tomorrow',
  Grupos: 'Groups',
  'Grupos de tarjetas': 'Card groups',
  Todas: 'All',
  'Nuevo grupo': 'New group',
  'Abrir grupo': 'Open group',
  'Todas mis tarjetas': 'All my cards',
  'Mis tarjetas': 'My cards',
  'Buscar tarjetas': 'Search cards',
  'Buscar palabra o significado…': 'Search word or meaning…',
  'Filtrar por categoría': 'Filter by category',
  'No hay tarjetas con ese filtro.': 'No cards match this filter.',
  'Sin grupo': 'No group',
  Nueva: 'New',
  Aprendiendo: 'Learning',
  Dominada: 'Mastered',
  'Volver a grupos': 'Back to groups',
  Grupo: 'Group',
  'Más opciones del grupo': 'More group options',
  'Opciones del grupo': 'Group options',
  'Cambiar color': 'Change color',
  'Eliminar grupo': 'Delete group',
  'Tarjetas del grupo': 'Cards in this group',
  Añadir: 'Add',
  'Este grupo todavía está vacío': 'This group is still empty',
  'Añade una tarjeta para empezar a reunir palabras aquí.':
    'Add a card to start collecting words here.',
  'Añadir tarjeta': 'Add card',
  'Volver a Tarjetas': 'Back to Cards',
  'Solo 2 campos son obligatorios': 'Only 2 fields are required',
  'Solo la palabra y el significado son obligatorios.':
    'Only the word and meaning are required.',
  'Forma de crear': 'Creation method',
  'Con IA': 'With AI',
  IA: 'AI',
  Manual: 'Manual',
  'Así se verá tu tarjeta': 'This is how your card will look',
  'Tu palabra': 'Your word',
  'Su significado aparecerá aquí': 'Its meaning will appear here',
  'Sugerir significado y ejemplo': 'Suggest meaning and example',
  'Lo esencial': 'Essentials',
  'Palabra o frase en inglés': 'English word or phrase',
  'Significado en español': 'Meaning in Spanish',
  'Corto y claro': 'Short and clear',
  'Para recordarla mejor': 'To remember it better',
  Opcional: 'Optional',
  'Ejemplo natural': 'Natural example',
  Pronunciación: 'Pronunciation',
  'Etiquetas por tema': 'Topic tags',
  'Nueva etiqueta': 'New tag',
  'Etiquetas separadas por comas': 'Tags separated by commas',
  Limpiar: 'Clear',
  'Guardar tarjeta': 'Save card',
  'Preparando tu repaso…': 'Preparing your review…',
  Salir: 'Exit',
  'Avance de la sesión': 'Session progress',
  'Funciona sin conexión': 'Works offline',
  Significado: 'Meaning',
  Ejemplo: 'Example',
  'Intenta recordarla, luego toca para ver':
    'Try to remember it, then tap to reveal',
  'Mostrar significado': 'Show meaning',
  'Califica esta tarjeta': 'Rate this card',
  '¿Qué tan fácil fue recordarla?': 'How easy was it to remember?',
  Difícil: 'Hard',
  Bien: 'Good',
  Fácil: 'Easy',
  'Sesión completa': 'Session complete',
  'Tu racha sube a': 'Your streak is now',
  'Lo próximo vuelve mañana.': 'The next cards return tomorrow.',
  'Volver al inicio': 'Back home',
  'Repasar otra vez': 'Review again',
  '(no cuenta para la meta)': '(does not count toward the goal)',
  'Repasar otra vez no cuenta para la meta diaria.':
    'Reviewing again does not count toward the daily goal.',
  'Por ahora, ya estás al día.': 'You are up to date for now.',
  'Volver a mis tarjetas': 'Back to my cards',
  'Nueva tarjeta con IA': 'New card with AI',
  Pasos: 'Steps',
  'En línea': 'Online',
  Agregar: 'Add',
  Revisar: 'Review',
  'Requiere conexión': 'Requires a connection',
  'Escribe una o varias palabras': 'Write one or more words',
  'o también': 'or',
  'Sube una imagen con vocabulario': 'Upload an image with vocabulary',
  'Tus apuntes, una página del libro o la pizarra de clase.':
    'Your notes, a book page, or the classroom board.',
  'Tomar foto': 'Take a photo',
  'Elegir imagen': 'Choose image',
  'Quitar imagen': 'Remove image',
  'Guardar en el grupo': 'Save to group',
  'Puedes cambiar el grupo de cada tarjeta al revisarlas.':
    'You can change each card’s group while reviewing them.',
  'Nada se guarda hasta que lo confirmes.':
    'Nothing is saved until you confirm it.',
  'Generar propuestas': 'Generate suggestions',
  'Agrega palabras o una imagen para continuar':
    'Add words or an image to continue',
  'Preparando tus tarjetas': 'Preparing your cards',
  'Suele tardar menos de 15 segundos.':
    'It usually takes less than 15 seconds.',
  'propuestas listas': 'suggestions ready',
  'Revisa las propuestas': 'Review suggestions',
  'Aceptar todas': 'Accept all',
  'Descartar todas': 'Discard all',
  'Sí, descartar': 'Yes, discard',
  Deshacer: 'Undo',
  'Empezar de nuevo': 'Start over',
  'Ortografía corregida:': 'Spelling corrected:',
  Relacionadas: 'Related',
  Rechazar: 'Reject',
  Editar: 'Edit',
  Aceptar: 'Accept',
  Aceptada: 'Accepted',
  Pendiente: 'Pending',
  Incompleta: 'Incomplete',
  'Escribirlo yo': 'Write it myself',
  'Escrita por ti': 'Written by you',
  'De la imagen': 'From the image',
  'tarjetas creadas': 'cards created',
  'Tarjetas creadas': 'Created cards',
  'Repasarlas ahora': 'Review them now',
  'Crear más': 'Create more',
  'La IA necesita internet': 'AI needs an internet connection',
  'Palabras en espera': 'Queued words',
  'Tomar otra foto': 'Take another photo',
  'Continuar solo con las palabras escritas': 'Continue with typed words only',
  'No pudimos generar las propuestas': 'We could not generate suggestions',
  'Detalles del error': 'Error details',
  Código: 'Code',
  Intentos: 'Attempts',
  'ID para soporte': 'Support ID',
  copiar: 'copy',
  copiado: 'copied',
  'Reintentando…': 'Retrying…',
  Ajustes: 'Settings',
  'Secciones de ajustes': 'Settings sections',
  Perfil: 'Profile',
  'Proveedor IA': 'AI provider',
  'Sin cuenta · tus datos viven solo en este dispositivo':
    'No account · your data lives only on this device',
  'Iniciar sesión para sincronizar': 'Sign in to sync',
  Nombre: 'Name',
  'Idioma de la app': 'App language',
  'Nivel de inglés': 'English level',
  'Meta diaria': 'Daily goal',
  'Tarjetas por día': 'Cards per day',
  'Reducir meta': 'Decrease goal',
  'Aumentar meta': 'Increase goal',
  'Recordatorio diario': 'Daily reminder',
  Desactivado: 'Off',
  Tema: 'Theme',
  'Tus datos': 'Your data',
  'Exportar tarjetas y notas': 'Export cards and notes',
  'Exportar mis datos': 'Export my data',
  'Guardar cambios': 'Save changes',
  Claro: 'Light',
  Oscuro: 'Dark',
  Automático: 'System',
  'API key': 'API key',
  '¿Dónde la consigo?': 'Where do I get it?',
  'Mostrar API key': 'Show API key',
  'Ocultar API key': 'Hide API key',
  'Usar IA para': 'Use AI for',
  'Crear tarjetas': 'Create cards',
  'Feedback de escritura': 'Writing feedback',
  'Eliminar API key': 'Remove API key',
  'API key guardada': 'Saved API key',
  'No hay una API key guardada.': 'No API key saved.',
  'Probar conexión': 'Test connection',
  'Probando…': 'Testing…',
  'Cómo funciona': 'How it works',
  Conectado: 'Connected',
  'Sin configurar': 'Not configured',
  'Configurado, sin probar': 'Configured, not tested',
  'Conexión correcta.': 'Connection successful.',
  'Probando conexión…': 'Testing connection…',
  'Navegación principal': 'Main navigation',
  Principal: 'Main',
  'Ajustes y perfil': 'Settings and profile',
  'Contraer menú': 'Collapse menu',
  'Expandir menú': 'Expand menu',
  'Vokki Up, inicio': 'Vokki Up, home',
  Inicio: 'Home',
  'Vokki Up — Aprende a tu ritmo': 'Vokki Up — Learn at your pace',
  'Aprende vocabulario en contexto, cinco minutos a la vez.':
    'Learn vocabulary in context, five minutes at a time.',
  '¡Hola de nuevo!': 'Welcome back!',
  'Buenas noches': 'Good evening',
  'Cinco minutos hoy mantienen tu racha.':
    'Five minutes today keep your streak going.',
  'Un repaso corto antes de dormir fija mejor.':
    'A short review before bed helps it stick.',
  'Tu próxima sesión': 'Your next session',
  'Meta de hoy': 'Today’s goal',
  'Tu semana': 'Your week',
  'Ver estadísticas': 'View statistics',
  'Actividad de hoy': 'Today’s activity',
  'Repasar tarjetas': 'Review cards',
  'Practicar escritura': 'Practice writing',
  'Revisar notas': 'Review notes',
  'disponible offline': 'available offline',
  'reto de conversación': 'conversation challenge',
  'favoritas sin leer': 'unread favorites'
};

export function getAppLanguage(): AppLanguage {
  return activeLanguage;
}
export function setAppLanguage(language: AppLanguage): void {
  if (activeLanguage === language) return;
  activeLanguage = language;
  listeners.forEach(listener => listener());
}
export function subscribeAppLanguage(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function translateString(value: string): string {
  if (activeLanguage !== 'English') return value;
  let result = translations[value] ?? value;
  if (result === value) {
    for (const [spanish, english] of Object.entries(translations).sort(
      ([a], [b]) => b.length - a.length
    )) {
      if (spanish.length >= 4 && result.includes(spanish))
        result = result.split(spanish).join(english);
    }
  }
  return translateDynamic(result);
}

function translateDynamic(value: string): string {
  return value
    .replace(/^(\d+) por repasar$/, '$1 to review')
    .replace(/^(\d+) nuevas$/, '$1 new')
    .replace(
      /^Cinco minutos hoy mantienen tu racha de (\d+) días\.$/,
      'Five minutes today keep your $1-day streak.'
    )
    .replace(
      /^(\d+) por repasar · (\d+) nuevas · ~(\d+) min$/,
      '$1 to review · $2 new · ~$3 min'
    )
    .replace(/^(\d+) más y cumples la meta$/, '$1 more to reach your goal')
    .replace(/^de (\d+) tarjetas$/, 'of $1 cards')
    .replace(/^Repasar (\d+) tarjetas?$/, 'Review $1 cards')
    .replace(/^(\d+) pendientes hoy$/, '$1 pending today')
    .replace(
      /^(\d+) tarjetas? en (\d+) grupos? · (\d+) para hoy$/,
      '$1 cards in $2 groups · $3 due today'
    )
    .replace(
      /^(\d+) tarjetas? en tu mazo · (\d+) para repasar hoy$/,
      '$1 cards in your deck · $2 to review today'
    )
    .replace(/^(\d+) tarjetas? · (\d+) hoy$/, '$1 cards · $2 today')
    .replace(/^(\d+) tarjetas?$/, '$1 cards')
    .replace(/^en (\d+) días$/, 'in $1 days')
    .replace(
      /^Revisa (\d+) campos? antes de guardar$/,
      'Review $1 fields before saving'
    )
    .replace(/^(\d+) tarjetas repasadas\.$/, '$1 cards reviewed.')
    .replace(/^(\d+) días$/, '$1 days')
    .replace(/^(\d+) difíciles$/, '$1 hard')
    .replace(/^(\d+) fáciles$/, '$1 easy')
    .replace(/^(\d+) bien$/, '$1 good')
    .replace(/^(\d+) palabras$/, '$1 words')
    .replace(/^Vas a enviar (.+)$/, 'You are about to send $1')
    .replace(/^(\d+) propuestas listas$/, '$1 suggestions ready')
    .replace(
      /^(\d+) propuestas · (\d+) aceptadas · (\d+) rechazadas$/,
      '$1 suggestions · $2 accepted · $3 rejected'
    )
    .replace(/^Crear (\d+) tarjetas?$/, 'Create $1 cards')
    .replace(/^(\d+) tarjetas creadas$/, '$1 cards created')
    .replace(/^(.+) · editada el (.+)$/, '$1 · edited on $2')
    .replace(/^(.+) respondió en (\d+) ms\.$/, '$1 responded in $2 ms.')
    .replace(
      /^Se guarda cifrada en el servidor y solo se envía a (.+)\.$/,
      'Stored encrypted on the server and only sent to $1.'
    )
    .replace(/^(.+) de (\d+)$/, '$1 of $2');
}

function wrapValue(value: unknown): unknown {
  if (typeof value === 'string') return translateString(value);
  if (typeof value === 'function')
    return (...args: unknown[]) => {
      const result = value(...args);
      return typeof result === 'string' ? translateString(result) : result;
    };
  if (Array.isArray(value))
    return new Proxy(
      value.map(item => wrapValue(item)),
      {
        get(target, property, receiver) {
          if (property === Symbol.iterator)
            return target[Symbol.iterator].bind(target);
          return Reflect.get(target, property, receiver);
        }
      }
    );
  if (value && typeof value === 'object')
    return new Proxy(value as object, {
      get(target, property, receiver) {
        return wrapValue(Reflect.get(target, property, receiver));
      }
    });
  return value;
}

export function createLocalizedMessages<T>(messages: T): T {
  return new Proxy(messages as object, {
    get(target, property, receiver) {
      return wrapValue(Reflect.get(target, property, receiver));
    }
  }) as T;
}
