export const notesMessages = {
  page: {
    title: 'Notas',
    mobileSubtitle: 'Tus apuntes, sin tarjetas',
    desktopSubtitle:
      'Expresiones, reglas y observaciones. Separadas de tus tarjetas.',
    newNote: 'Nueva nota',
    searchLabel: 'Buscar notas',
    searchPlaceholder: 'Buscar en tus notas…',
    filtersLabel: 'Filtrar notas',
    backToList: 'Volver a Notas'
  },
  list: {
    label: 'Tus notas',
    untitled: 'Nota sin título',
    empty: 'Ninguna nota coincide con tu búsqueda.',
    markFavorite: (title: string) => `Marcar ${title} como favorita`,
    unmarkFavorite: (title: string) => `Quitar ${title} de favoritas`
  },
  detail: {
    label: 'Nota abierta',
    meta: (category: string, updatedAt: string) =>
      `${category} · editada el ${updatedAt}`,
    markFavorite: 'Marcar como favorita',
    unmarkFavorite: 'Quitar de favoritas',
    edit: 'Editar nota',
    toolbarLabel: 'Formato',
    bold: 'Negrita',
    italic: 'Cursiva',
    underline: 'Subrayado',
    bulletList: 'Lista',
    createCard: 'Crear tarjeta desde selección'
  },
  editor: {
    statusSaved: 'Guardada localmente',
    statusUnsaved: 'Cambios sin guardar',
    titleLabel: 'Título de la nota',
    titlePlaceholder: 'Dale un título a tu nota',
    categoryLabel: 'Categoría',
    bodyLabel: 'Contenido de la nota',
    bodyPlaceholder: 'Anota una idea, una frase o algo que quieras recordar…',
    footerHint: 'Un espacio solo tuyo para pensar en voz alta.',
    submit: 'Guardar nota'
  }
} as const;
