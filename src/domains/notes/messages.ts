import { createLocalizedMessages } from '@/lib/i18n/locale';
export const notesMessages = createLocalizedMessages({
  page: {
    title: 'Notas',
    mobileSubtitle: 'Tus apuntes, sin tarjetas',
    desktopSubtitle:
      'Expresiones, reglas y observaciones. Separadas de tus tarjetas.',
    newNote: 'Nueva nota',
    searchLabel: 'Buscar notas',
    searchPlaceholder: 'Buscar en tus notas…',
    filtersLabel: 'Filtrar notas',
    backToList: 'Volver a Notas',
    categories: {
      label: 'Administrar categorías',
      manage: 'Administrar categorías',
      hide: 'Ocultar categorías',
      createLabel: 'Nueva categoría',
      renameLabel: 'Cambiar nombre de categoría',
      create: 'Crear',
      save: 'Guardar',
      cancel: 'Cancelar',
      rename: 'Renombrar',
      delete: 'Eliminar',
      defaultLabel: 'Predeterminada',
      deletionNote: 'Las notas se conservarán en General.'
    }
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
});
