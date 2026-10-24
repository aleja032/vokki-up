'use client';
import { useRef, useState, type ChangeEvent } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  FileDown,
  FileUp,
  Info,
  Upload
} from 'lucide-react';
import { CSV_SCHEMA, SAMPLE_CSV_ROWS, SAMPLE_CSV_VALIDATION } from '../data';
import type { CsvCardRow, CsvValidation } from '../types';
const REQUIRED_COLUMNS = ['word', 'meaning'];
type ParsedCsv = { rows: CsvCardRow[]; validation: CsvValidation };
function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let value = '';
  let isQuoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"' && isQuoted && line[index + 1] === '"') {
      value += '"';
      index += 1;
    } else if (character === '"') isQuoted = !isQuoted;
    else if (character === ',' && !isQuoted) {
      values.push(value);
      value = '';
    } else value += character;
  }
  values.push(value);
  return values;
}
function parseCsv(content: string): ParsedCsv {
  const lines = content
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .filter(line => line.trim());
  if (lines.length < 2)
    return {
      rows: [],
      validation: {
        validRows: 0,
        invalidRows: 0,
        issues: ['El archivo no contiene filas para revisar.'],
        missingHeaders: []
      }
    };
  const headers = parseCsvLine(lines[0]).map(header =>
    header.trim().toLowerCase()
  );
  const missingHeaders = REQUIRED_COLUMNS.filter(
    header => !headers.includes(header)
  );
  if (missingHeaders.length)
    return {
      rows: [],
      validation: {
        validRows: 0,
        invalidRows: 0,
        issues: [`Faltan columnas requeridas: ${missingHeaders.join(', ')}.`],
        missingHeaders
      }
    };
  const rows: CsvCardRow[] = [];
  let invalidRows = 0;
  const issues: string[] = [];
  for (const [index, line] of lines.slice(1).entries()) {
    const values = parseCsvLine(line);
    const get = (column: string) => {
      const position = headers.indexOf(column);
      return position >= 0 ? (values[position] ?? '') : '';
    };
    const word = get('word');
    const meaning = get('meaning');
    if (!word.trim() || !meaning.trim()) {
      invalidRows += 1;
      issues.push(`Fila ${index + 2}: falta palabra o significado.`);
      continue;
    }
    rows.push({
      sourceRow: index + 2,
      word,
      meaning,
      phonetics: get('phonetics'),
      example: get('example'),
      partOfSpeech: get('part_of_speech'),
      group: get('group'),
      tags: get('tags')
    });
  }
  return {
    rows,
    validation: {
      validRows: rows.length,
      invalidRows,
      issues,
      missingHeaders: []
    }
  };
}
function escapeCsv(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}
export function ImportExportWorkspace() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState(SAMPLE_CSV_ROWS);
  const [validation, setValidation] = useState(SAMPLE_CSV_VALIDATION);
  const [isSample, setIsSample] = useState(true);
  const [fileName, setFileName] = useState('Ejemplo de muestra');
  const [status, setStatus] = useState('');
  const [isExportReady, setIsExportReady] = useState(false);
  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setStatus('');
    setIsExportReady(false);
    if (!file.name.toLocaleLowerCase().endsWith('.csv')) {
      setRows([]);
      setValidation({
        validRows: 0,
        invalidRows: 0,
        issues: ['Elige un archivo con extensión .csv.'],
        missingHeaders: []
      });
      setFileName(file.name);
      setIsSample(false);
      return;
    }
    if (file.size > 2_000_000) {
      setRows([]);
      setValidation({
        validRows: 0,
        invalidRows: 0,
        issues: ['El archivo supera el límite de 2 MB para esta vista previa.'],
        missingHeaders: []
      });
      setFileName(file.name);
      setIsSample(false);
      return;
    }
    const parsed = parseCsv(await file.text());
    setRows(parsed.rows);
    setValidation(parsed.validation);
    setFileName(file.name);
    setIsSample(false);
  }
  function handleImport() {
    setStatus(
      `${validation.validRows} filas válidas revisadas localmente. No se guardan ni se agregan al mazo global.`
    );
  }
  function handleExport() {
    const headers = CSV_SCHEMA.map(column => column.column);
    const csv = [
      headers,
      ...rows.map(row => [
        row.word,
        row.meaning,
        row.phonetics,
        row.example,
        row.partOfSpeech,
        row.group,
        row.tags
      ])
    ]
      .map(line => line.map(escapeCsv).join(','))
      .join('\r\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vokki-up-tarjetas-ejemplo.csv';
    link.click();
    URL.revokeObjectURL(url);
    setIsExportReady(true);
  }
  return (
    <div className="portability-workspace">
      <div className="portability-top">
        <Link className="cards-back" href="/settings">
          <ArrowLeft size={18} /> Ajustes
        </Link>
        <span className="eyebrow">TUS DATOS, A TU MANERA</span>
      </div>
      <header className="portability-heading">
        <div>
          <span className="eyebrow">PORTABILIDAD</span>
          <h1>Importar o exportar</h1>
          <p>Una vista clara de los datos y de cómo viajan.</p>
        </div>
        <span className="portability-heading__icon">
          <FileDown size={21} />
        </span>
      </header>
      <section className="portability-card" aria-labelledby="csv-schema-title">
        <div className="portability-card__header">
          <div>
            <span className="eyebrow">FORMATO CSV</span>
            <h2 id="csv-schema-title">El esquema de tus tarjetas</h2>
            <p>
              Las columnas requeridas identifican cada palabra. Las demás
              completan el contexto.
            </p>
          </div>
          <span className="csv-badge">.CSV</span>
        </div>
        <div className="csv-schema-wrap">
          <table className="csv-schema">
            <thead>
              <tr>
                <th>Columna</th>
                <th>Campo</th>
                <th>Formato</th>
                <th>Requisito</th>
              </tr>
            </thead>
            <tbody>
              {CSV_SCHEMA.map(column => (
                <tr key={column.column}>
                  <td>
                    <code>{column.column}</code>
                  </td>
                  <td>{column.label}</td>
                  <td>{column.format}</td>
                  <td>
                    {column.required ? (
                      <span className="csv-required">Requerida</span>
                    ) : (
                      <span className="csv-optional">Opcional</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="csv-group-note">
          <Info size={16} />
          <span>
            Los nombres de grupo se conservan exactamente como aparecen en el
            archivo; no se traducen ni se reemplazan.
          </span>
        </div>
      </section>
      <div className="portability-columns">
        <section
          className="portability-card portability-card--import"
          aria-labelledby="csv-import-title"
        >
          <div className="portability-card__header">
            <div>
              <span className="eyebrow">ENTRADA</span>
              <h2 id="csv-import-title">Importar tarjetas</h2>
              <p>Revisa el archivo antes de usar sus filas.</p>
            </div>
            <span className="portability-action-icon">
              <FileUp size={18} />
            </span>
          </div>
          <input
            ref={inputRef}
            className="csv-file-input"
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
          />
          <button
            className="csv-file-button"
            type="button"
            onClick={() => inputRef.current?.click()}
          >
            <Upload size={17} /> Elegir archivo CSV
          </button>
          <div className="csv-file-name">
            <span>
              {isSample ? 'Muestra incluida' : 'Archivo seleccionado'}
            </span>
            <strong title={fileName}>{fileName}</strong>
          </div>
          <div
            className="csv-validation"
            data-valid={validation.issues.length === 0}
          >
            <div className="csv-validation__headline">
              <strong>
                {validation.issues.length === 0
                  ? 'Resumen de validación'
                  : 'Hay algo para corregir'}
              </strong>
              <span>
                {validation.validRows} válidas · {validation.invalidRows} con
                errores
              </span>
            </div>
            {validation.issues.length ? (
              <ul>
                {validation.issues.map(issue => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            ) : (
              <p>
                {isSample
                  ? 'La muestra tiene todas las columnas requeridas.'
                  : 'La estructura y las filas requeridas están listas para revisar.'}
              </p>
            )}
          </div>
          {rows.length > 0 && (
            <div className="csv-preview">
              <div className="csv-preview__heading">
                <strong>Vista previa</strong>
                <span>{rows.length} filas</span>
              </div>
              <div className="csv-preview__rows">
                {rows.slice(0, 3).map(row => (
                  <div
                    className="csv-preview__row"
                    key={`${row.sourceRow}-${row.word}`}
                  >
                    <strong title={row.word}>{row.word}</strong>
                    <span title={row.meaning}>{row.meaning}</span>
                    <em title={row.group || 'Sin grupo'}>
                      {row.group || 'Sin grupo'}
                    </em>
                  </div>
                ))}
              </div>
            </div>
          )}
          <button
            className="primary-action portability-primary"
            type="button"
            onClick={handleImport}
            disabled={
              validation.validRows === 0 || validation.missingHeaders.length > 0
            }
          >
            <span>
              {isSample
                ? 'Revisar muestra'
                : `Importar ${validation.validRows} filas`}
            </span>
            <ArrowRight size={17} />
          </button>
          {status && (
            <p className="portability-status" aria-live="polite">
              <Check size={15} />
              {status}
            </p>
          )}
        </section>
        <section
          className="portability-card portability-card--export"
          aria-labelledby="csv-export-title"
        >
          <div className="portability-card__header">
            <div>
              <span className="eyebrow">SALIDA</span>
              <h2 id="csv-export-title">Exportar una muestra</h2>
              <p>Descarga un CSV de ejemplo para revisar el formato.</p>
            </div>
            <span className="portability-action-icon portability-action-icon--export">
              <Download size={18} />
            </span>
          </div>
          <div className="csv-export-preview">
            <span>ARCHIVO DE EJEMPLO</span>
            <strong>vokki-up-tarjetas-ejemplo.csv</strong>
            <p>
              {rows.length} filas · {CSV_SCHEMA.length} columnas
            </p>
          </div>
          <button
            className="secondary-action portability-export"
            type="button"
            onClick={handleExport}
          >
            <Download size={16} /> Exportar CSV de muestra
          </button>
          {isExportReady && (
            <p className="portability-status" aria-live="polite">
              <Check size={15} />
              El CSV de muestra está listo en tus descargas.
            </p>
          )}
          <p className="portability-disclaimer">
            Esta maqueta solo usa las filas visibles de ejemplo. No accede a tus
            datos reales ni los guarda.
          </p>
        </section>
      </div>
    </div>
  );
}
