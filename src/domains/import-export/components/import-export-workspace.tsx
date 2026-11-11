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
import { importExportMessages as messages } from '../messages';
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
        issues: [messages.issues.noRows],
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
        issues: [messages.issues.missingColumns(missingHeaders.join(', '))],
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
      issues.push(messages.issues.invalidRow(index + 2));
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
  const [fileName, setFileName] = useState<string>(messages.sampleFileName);
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
        issues: [messages.issues.wrongExtension],
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
        issues: [messages.issues.tooLarge],
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
    setStatus(messages.import.reviewed(validation.validRows));
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
          <ArrowLeft size={18} /> {messages.back}
        </Link>
        <span className="eyebrow">{messages.topEyebrow}</span>
      </div>
      <header className="portability-heading">
        <div>
          <span className="eyebrow">{messages.eyebrow}</span>
          <h1>{messages.title}</h1>
          <p>{messages.subtitle}</p>
        </div>
        <span className="portability-heading__icon">
          <FileDown size={21} />
        </span>
      </header>
      <section className="portability-card" aria-labelledby="csv-schema-title">
        <div className="portability-card__header">
          <div>
            <span className="eyebrow">{messages.schema.eyebrow}</span>
            <h2 id="csv-schema-title">{messages.schema.title}</h2>
            <p>{messages.schema.description}</p>
          </div>
          <span className="csv-badge">{messages.schema.badge}</span>
        </div>
        <div className="csv-schema-wrap">
          <table className="csv-schema">
            <thead>
              <tr>
                <th>{messages.schema.columnHeader}</th>
                <th>{messages.schema.fieldHeader}</th>
                <th>{messages.schema.formatHeader}</th>
                <th>{messages.schema.requirementHeader}</th>
              </tr>
            </thead>
            <tbody>
              {CSV_SCHEMA.map(column => (
                <tr key={column.column}>
                  <td>
                    <code>{column.column}</code>
                  </td>
                  <td>{messages.schema.fields[column.column]}</td>
                  <td>{messages.schema.formats[column.format]}</td>
                  <td>
                    {column.required ? (
                      <span className="csv-required">
                        {messages.schema.required}
                      </span>
                    ) : (
                      <span className="csv-optional">
                        {messages.schema.optional}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="csv-group-note">
          <Info size={16} />
          <span>{messages.schema.groupNote}</span>
        </div>
      </section>
      <div className="portability-columns">
        <section
          className="portability-card portability-card--import"
          aria-labelledby="csv-import-title"
        >
          <div className="portability-card__header">
            <div>
              <span className="eyebrow">{messages.import.eyebrow}</span>
              <h2 id="csv-import-title">{messages.import.title}</h2>
              <p>{messages.import.description}</p>
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
            <Upload size={17} /> {messages.import.chooseFile}
          </button>
          <div className="csv-file-name">
            <span>
              {isSample
                ? messages.import.sampleBadge
                : messages.import.selectedBadge}
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
                  ? messages.import.validationOk
                  : messages.import.validationIssues}
              </strong>
              <span>
                {messages.import.counts(
                  validation.validRows,
                  validation.invalidRows
                )}
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
                {isSample ? messages.import.sampleOk : messages.import.fileOk}
              </p>
            )}
          </div>
          {rows.length > 0 && (
            <div className="csv-preview">
              <div className="csv-preview__heading">
                <strong>{messages.import.previewTitle}</strong>
                <span>{messages.import.previewRows(rows.length)}</span>
              </div>
              <div className="csv-preview__rows">
                {rows.slice(0, 3).map(row => (
                  <div
                    className="csv-preview__row"
                    key={`${row.sourceRow}-${row.word}`}
                  >
                    <strong title={row.word}>{row.word}</strong>
                    <span title={row.meaning}>{row.meaning}</span>
                    <em title={row.group || messages.import.noGroup}>
                      {row.group || messages.import.noGroup}
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
                ? messages.import.reviewSample
                : messages.import.importRows(validation.validRows)}
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
              <span className="eyebrow">{messages.export.eyebrow}</span>
              <h2 id="csv-export-title">{messages.export.title}</h2>
              <p>{messages.export.description}</p>
            </div>
            <span className="portability-action-icon portability-action-icon--export">
              <Download size={18} />
            </span>
          </div>
          <div className="csv-export-preview">
            <span>{messages.export.previewLabel}</span>
            <strong>vokki-up-tarjetas-ejemplo.csv</strong>
            <p>{messages.export.summary(rows.length, CSV_SCHEMA.length)}</p>
          </div>
          <button
            className="secondary-action portability-export"
            type="button"
            onClick={handleExport}
          >
            <Download size={16} /> {messages.export.button}
          </button>
          {isExportReady && (
            <p className="portability-status" aria-live="polite">
              <Check size={15} />
              {messages.export.ready}
            </p>
          )}
          <p className="portability-disclaimer">{messages.export.disclaimer}</p>
        </section>
      </div>
    </div>
  );
}
