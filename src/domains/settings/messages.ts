import type { AiProvider, AppTheme } from './types';

export const settingsMessages = {
  title: 'Ajustes',
  backLabel: 'Volver al inicio',
  tabsLabel: 'Secciones de ajustes',
  tabs: {
    profile: 'Perfil',
    provider: 'Proveedor IA'
  },
  profile: {
    fallbackName: 'Kiev',
    noAccount: 'Sin cuenta · tus datos viven solo en este dispositivo',
    signIn: 'Iniciar sesión para sincronizar',
    nameLabel: 'Nombre',
    languageLabel: 'Idioma de la app',
    levelLabel: 'Nivel de inglés',
    dailyGoalTitle: 'Meta diaria',
    dailyGoalHint: 'Tarjetas por día',
    decreaseGoal: 'Reducir meta',
    increaseGoal: 'Aumentar meta',
    reminderTitle: 'Recordatorio diario',
    reminderOn: 'Todos los días cerca de las 20:00 UTC.',
    reminderOff: 'Desactivado',
    reminderLocalOn: 'Solo se guarda en este dispositivo; no se envían emails.',
    reminderLocalOff:
      'Solo para este dispositivo; inicia sesión para recibir emails.',
    reminderConsent: 'Acepto recibir recordatorios diarios por email.',
    reminderSetupRequired:
      'Email todavía no está configurado para enviar recordatorios.',
    reminderConsentRequired:
      'Acepta recibir emails antes de activar el recordatorio.',
    reminderSaveError:
      'No se pudieron guardar los ajustes del recordatorio. Inténtalo de nuevo.',
    themeLabel: 'Tema',
    dataTitle: 'Tus datos',
    dataSummary:
      '126 tarjetas, 14 notas y 9 textos guardados en este dispositivo.',
    exportNarrow: 'Exportar tarjetas y notas',
    exportWide: 'Exportar mis datos',
    deleteAll: 'Borrar todos mis datos',
    save: 'Guardar cambios'
  },
  themes: {
    light: 'Claro',
    dark: 'Oscuro',
    system: 'Automático'
  } satisfies Record<AppTheme, string>,
  provider: {
    statusLabel: 'Estado de la conexión con la IA',
    providerLabel: 'Proveedor',
    customUrlLabel: 'URL base del servicio',
    customUrlPlaceholder: 'https://mi-servidor.com/v1',
    modelLabel: 'Modelo',
    modelHint: 'Un modelo rápido es suficiente para tarjetas y correcciones.',
    apiKeyLabel: 'API key',
    apiKeyHelp: '¿Dónde la consigo?',
    showApiKey: 'Mostrar API key',
    hideApiKey: 'Ocultar API key',
    apiKeyPrivacy: (providerName: string, authenticated: boolean) =>
      authenticated
        ? `Se guarda cifrada en el servidor y solo se envía a ${providerName}.`
        : 'Sin iniciar sesión, la API key solo se conserva temporalmente en esta pestaña y no se guarda.',
    usesTitle: 'Usar IA para',
    useCards: 'Crear tarjetas',
    useCardsHint: 'Corrección, significados y ejemplos',
    useWriting: 'Feedback de escritura',
    useWritingHintNarrow: 'Análisis de claridad, vocabulario y gramática',
    useWritingHintWide: 'Claridad, vocabulario y gramática',
    removeApiKey: 'Eliminar API key',
    savedApiKey: 'API key guardada',
    noSavedApiKey: 'No hay una API key guardada.',
    testConnection: 'Probar conexión',
    testingConnection: 'Probando…',
    genericError: 'No se pudo completar la prueba. Inténtalo de nuevo.',
    save: 'Guardar',
    howTitle: 'Cómo funciona',
    howItems: [
      'Usas tu propia API key: el costo lo cobra tu proveedor.',
      'Sin conexión, el repaso y las notas siguen funcionando.',
      'Puedes cambiar de proveedor cuando quieras.'
    ]
  },
  providers: {
    gemini: { name: 'Google Gemini', hint: 'Recomendado para empezar' },
    openai: { name: 'OpenAI', hint: 'Modelos GPT' }
  } satisfies Record<AiProvider, { name: string; hint: string }>,
  connectionStatus: {
    unconfigured: {
      title: 'Sin configurar',
      text: () => 'Agrega una API key para activar las funciones con IA.'
    },
    untested: {
      title: 'Configurado, sin probar',
      text: () => 'Prueba la conexión antes de guardar.'
    },
    ok: {
      title: 'Conectado',
      text: (providerName: string, model: string) =>
        `${providerName} · ${model}`
    },
    error: {
      title: 'Sin conexión con la IA',
      text: () => 'La última prueba falló. Las funciones con IA están en pausa.'
    }
  },
  connectionTest: {
    testing: 'Probando conexión…',
    okTitle: 'Conexión correcta.',
    okText: (providerName: string, latencyMs?: number) =>
      `${providerName} respondió en ${latencyMs ?? 820} ms.`,
    errorGenericTitle: 'No se pudo probar la conexión.',
    errorLatency: (latencyMs: number) => ` (respuesta en ${latencyMs} ms).`,
    errorTitle: 'La API key no es válida (401).',
    errorText: (providerName: string) =>
      `Revisa que esté completa y que pertenezca a ${providerName}.`
  },
  save: {
    saved: 'Guardado en este dispositivo',
    unsaved: 'Cambios sin guardar'
  }
} as const;
