import { createLocalizedMessages } from '@/lib/i18n/locale';

export const importExportMessages = createLocalizedMessages({
  back: 'Ajustes',
  topEyebrow: 'TUS DATOS, A TU MANERA',
  eyebrow: 'PORTABILIDAD',
  title: 'Importar o exportar',
  subtitle: 'Una vista clara de los datos y de cómo viajan.',
  sampleFileName: 'Ejemplo de muestra',
  exportFileName: 'vokki-up-tarjetas-ejemplo.csv',
  schema: {
    eyebrow: 'FORMATO CSV',
    title: 'El esquema de tus tarjetas',
    description:
      'Las columnas requeridas identifican cada palabra. Las demás completan el contexto.',
    badge: '.CSV',
    columnHeader: 'Columna',
    fieldHeader: 'Campo',
    formatHeader: 'Formato del campo',
    requirementHeader: 'Requisito',
    required: 'Requerida',
    optional: 'Opcional',
    groupNote:
      'Los nombres de grupo se conservan exactamente como aparecen en el archivo; no se traducen ni se reemplazan.',
    fields: {
      word: 'Palabra o frase',
      meaning: 'Significado',
      phonetics: 'Pronunciación',
      example: 'Ejemplo',
      // CSV column name is part of the file format.
      // eslint-disable-next-line camelcase
      part_of_speech: 'Tipo de palabra',
      group: 'Grupo',
      tags: 'Etiquetas'
    },
    formats: {
      text: 'Texto',
      freeText: 'Texto libre',
      semicolonText: 'Texto separado por punto y coma'
    }
  },
  import: {
    eyebrow: 'ENTRADA',
    title: 'Importar tarjetas',
    description: 'Revisa el archivo antes de usar sus filas.',
    chooseFile: 'Elegir archivo CSV',
    sampleBadge: 'Muestra incluida',
    selectedBadge: 'Archivo seleccionado',
    validationOk: 'Resumen de validación',
    validationIssues: 'Hay algo para corregir',
    counts: (valid: number, invalid: number) =>
      `${valid} válidas · ${invalid} con errores`,
    sampleOk: 'La muestra tiene todas las columnas requeridas.',
    fileOk: 'La estructura y las filas requeridas están listas para revisar.',
    previewTitle: 'Vista previa',
    previewRows: (count: number) => `${count} filas`,
    noGroup: 'Sin grupo',
    reviewSample: 'Revisar muestra',
    importRows: (count: number) => `Importar ${count} filas`,
    reviewed: (count: number) =>
      `${count} filas válidas revisadas localmente. No se guardan ni se agregan al mazo global.`
  },
  export: {
    eyebrow: 'SALIDA',
    title: 'Exportar una muestra',
    description: 'Descarga un CSV de ejemplo para revisar el formato.',
    previewLabel: 'ARCHIVO DE EJEMPLO',
    summary: (rows: number, columns: number) =>
      `${rows} filas · ${columns} columnas`,
    button: 'Exportar CSV de muestra',
    ready: 'El CSV de muestra está listo en tus descargas.',
    disclaimer:
      'Esta maqueta solo usa las filas visibles de ejemplo. No accede a tus datos reales ni los guarda.'
  },
  issues: {
    noRows: 'El archivo no contiene filas para revisar.',
    missingColumns: (columns: string) =>
      `Faltan columnas requeridas: ${columns}.`,
    invalidRow: (row: number) => `Fila ${row}: falta palabra o significado.`,
    wrongExtension: 'Elige un archivo con extensión .csv.',
    tooLarge: 'El archivo supera el límite de 2 MB para esta vista previa.'
  }
});
