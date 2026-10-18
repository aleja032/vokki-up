import type { SupabaseClient } from '@supabase/supabase-js'
import { studyDb } from './studyDb'
import type { QuizAttempt, ReviewLog, StudyCard, StudyNote, WritingSession } from '../types/study'

export interface SyncRecord<T> {
  id: string
  updatedAt: string
  payload: T
}

type JsonObject = Record<string, unknown>
type TableName = 'study_cards' | 'study_notes' | 'study_review_logs' | 'study_quiz_attempts' | 'study_writing_sessions'
type RemoteRow = { id: string; updated_at: string; payload: JsonObject }

function timestamp(value: string): number {
  const time = Date.parse(value)
  if (!Number.isFinite(time)) throw new Error('Invalid sync timestamp')
  return time
}

export function mergeRecords<T>(local: SyncRecord<T>[], remote: SyncRecord<T>[]): SyncRecord<T>[] {
  const merged = new Map<string, SyncRecord<T>>()
  for (const record of local) {
    timestamp(record.updatedAt)
    merged.set(record.id, record)
  }
  for (const record of remote) {
    const remoteTime = timestamp(record.updatedAt)
    const current = merged.get(record.id)
    if (!current || remoteTime >= timestamp(current.updatedAt)) merged.set(record.id, record)
  }
  return [...merged.values()].sort((a, b) => a.id.localeCompare(b.id))
}

function readDate(value: unknown): Date {
  if (typeof value !== 'string') throw new Error('Invalid sync date')
  return new Date(timestamp(value))
}

function readObject(value: unknown): JsonObject {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid sync payload')
  return value as JsonObject
}

function readString(value: unknown): string {
  if (typeof value !== 'string') throw new Error('Invalid sync text')
  return value
}

function readId(payload: JsonObject, expectedId: string): void {
  if (readString(payload.id) !== expectedId) throw new Error('Sync identity mismatch')
}

export function noteToPayload(note: StudyNote): JsonObject {
  return {
    id: note.id, title: note.title, body: note.body,
    createdAt: note.createdAt.toISOString(), updatedAt: note.updatedAt.toISOString(),
    ...(note.deletedAt ? { deletedAt: note.deletedAt.toISOString() } : {}),
    candidates: note.candidates,
  }
}

export function noteFromPayload(payloadValue: unknown, local?: StudyNote): StudyNote {
  const payload = readObject(payloadValue)
  const id = readString(payload.id)
  if (!Array.isArray(payload.candidates)) throw new Error('Invalid note candidates')
  return {
    id, title: readString(payload.title), body: readString(payload.body),
    createdAt: readDate(payload.createdAt), updatedAt: readDate(payload.updatedAt),
    ...(payload.deletedAt ? { deletedAt: readDate(payload.deletedAt) } : {}),
    candidates: payload.candidates as StudyNote['candidates'],
    ...(local?.attachment ? { attachment: local.attachment } : {}),
  }
}

function cardToPayload(card: StudyCard): JsonObject {
  return { ...card, createdAt: card.createdAt.toISOString(), updatedAt: card.updatedAt.toISOString(), nextReviewAt: card.nextReviewAt.toISOString() }
}

function cardFromPayload(value: unknown): StudyCard {
  const payload = readObject(value)
  return { ...payload, id: readString(payload.id), createdAt: readDate(payload.createdAt), updatedAt: readDate(payload.updatedAt), nextReviewAt: readDate(payload.nextReviewAt) } as StudyCard
}

function reviewToPayload(log: ReviewLog): JsonObject {
  if (!log.syncId) throw new Error('Review log has no stable sync ID')
  return { id: log.syncId, cardId: log.cardId, rating: log.rating, reviewedAt: log.reviewedAt.toISOString(), nextReviewAt: log.nextReviewAt.toISOString() }
}

function reviewFromPayload(value: unknown): ReviewLog {
  const payload = readObject(value)
  return { syncId: readString(payload.id), cardId: readString(payload.cardId), rating: readString(payload.rating) as ReviewLog['rating'], reviewedAt: readDate(payload.reviewedAt), nextReviewAt: readDate(payload.nextReviewAt) }
}

function quizToPayload(attempt: QuizAttempt): JsonObject {
  return { ...attempt, completedAt: attempt.completedAt.toISOString() }
}

function quizFromPayload(value: unknown): QuizAttempt {
  const payload = readObject(value)
  return { ...payload, id: readString(payload.id), completedAt: readDate(payload.completedAt) } as QuizAttempt
}

function writingToPayload(session: WritingSession): JsonObject {
  return { ...session, createdAt: session.createdAt.toISOString(), updatedAt: session.updatedAt.toISOString(), ...(session.completedAt ? { completedAt: session.completedAt.toISOString() } : {}) }
}

function writingFromPayload(value: unknown): WritingSession {
  const payload = readObject(value)
  return { ...payload, id: readString(payload.id), createdAt: readDate(payload.createdAt), updatedAt: readDate(payload.updatedAt), ...(payload.completedAt ? { completedAt: readDate(payload.completedAt) } : {}) } as WritingSession
}

async function fetchRows(client: SupabaseClient, table: TableName, userId: string): Promise<RemoteRow[]> {
  const result: RemoteRow[] = []
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await client.from(table).select('id, updated_at, payload').eq('user_id', userId).order('id').range(offset, offset + 499)
    if (error) throw error
    if (!data) throw new Error('Sync response is unavailable')
    const page = data as RemoteRow[]
    result.push(...page)
    if (page.length < 500) return result
  }
}

function parseRows<T>(rows: RemoteRow[], parse: (payload: unknown) => T, getId: (item: T) => string): SyncRecord<T>[] {
  return rows.map((row) => {
    const payload = readObject(row.payload)
    readId(payload, row.id)
    const item = parse(payload)
    if (getId(item) !== row.id) throw new Error('Sync identity mismatch')
    return { id: row.id, updatedAt: new Date(timestamp(row.updated_at)).toISOString(), payload: item }
  })
}

async function reconcile<T>(
  client: SupabaseClient, table: TableName, userId: string, localItems: T[], remote: SyncRecord<T>[],
  getId: (item: T) => string, getUpdatedAt: (item: T) => Date,
  toPayload: (item: T) => JsonObject,
  applyRemote: (remote: T) => Promise<void>,
  appendOnly = false,
): Promise<number> {
  const local = localItems.map((item) => ({ id: getId(item), updatedAt: getUpdatedAt(item).toISOString(), payload: item }))
  const merged = mergeRecords(local, remote)
  const remoteById = new Map(remote.map((item) => [item.id, item]))
  const localById = new Map(local.map((item) => [item.id, item]))
  const uploads = merged.filter((item) => {
    const existing = remoteById.get(item.id)
    return localById.get(item.id) === item && (!existing || timestamp(item.updatedAt) > timestamp(existing.updatedAt))
  })
  if (uploads.length) {
    const { error } = await client.from(table).upsert(uploads.map((item) => ({
      user_id: userId, id: item.id, updated_at: item.updatedAt, payload: toPayload(item.payload),
    })), { onConflict: 'user_id,id', ...(appendOnly ? { ignoreDuplicates: true } : {}) })
    if (error) throw error
  }
  // Never touch IndexedDB until the full read and this table's remote upsert succeeded.
  for (const item of merged) {
    if (remoteById.get(item.id) === item) await applyRemote(item.payload)
  }
  return merged.length
}

export async function syncStudyData(client: SupabaseClient, userId: string): Promise<number> {
  // Read all remote collections before any local write, so a failed read cannot erase local work.
  const [cards, notes, logs, quizzes, writing] = await Promise.all([
    studyDb.cards.toArray(), studyDb.notes.toArray(), studyDb.reviewLogs.toArray(),
    studyDb.quizAttempts.toArray(), studyDb.writingSessions.toArray(),
  ])
  const [remoteCards, remoteNotes, remoteLogs, remoteQuizzes, remoteWriting] = await Promise.all([
    fetchRows(client, 'study_cards', userId), fetchRows(client, 'study_notes', userId),
    fetchRows(client, 'study_review_logs', userId), fetchRows(client, 'study_quiz_attempts', userId),
    fetchRows(client, 'study_writing_sessions', userId),
  ])
  // Validate every collection before uploading or applying anything.
  const parsedCards = parseRows(remoteCards, cardFromPayload, (card) => card.id)
  const parsedNotes = parseRows(remoteNotes, noteFromPayload, (note) => note.id)
  const parsedLogs = parseRows(remoteLogs, reviewFromPayload, (log) => log.syncId ?? '')
  const parsedQuizzes = parseRows(remoteQuizzes, quizFromPayload, (attempt) => attempt.id)
  const parsedWriting = parseRows(remoteWriting, writingFromPayload, (session) => session.id)

  // Reconciliation is idempotent; partial remote success is safe to retry.
  let count = 0
  count += await reconcile(client, 'study_cards', userId, cards, parsedCards, (item) => item.id, (item) => item.updatedAt, cardToPayload, async (item) => {
    const current = await studyDb.cards.get(item.id)
    if (!current || current.updatedAt <= item.updatedAt) await studyDb.cards.put(item)
  })
  count += await reconcile(client, 'study_notes', userId, notes, parsedNotes, (item) => item.id, (item) => item.updatedAt, noteToPayload, async (item) => {
    const current = await studyDb.notes.get(item.id)
    if (!current || current.updatedAt <= item.updatedAt) await studyDb.notes.put({ ...item, ...(current?.attachment ? { attachment: current.attachment } : {}) })
  })
  count += await reconcile(client, 'study_review_logs', userId, logs, parsedLogs, (item) => item.syncId ?? '', (item) => item.reviewedAt, reviewToPayload, async (item) => {
    if (!await studyDb.reviewLogs.where('syncId').equals(item.syncId ?? '').first()) await studyDb.reviewLogs.add(item)
  }, true)
  count += await reconcile(client, 'study_quiz_attempts', userId, quizzes, parsedQuizzes, (item) => item.id, (item) => item.completedAt, quizToPayload, async (item) => {
    if (!await studyDb.quizAttempts.get(item.id)) await studyDb.quizAttempts.add(item)
  }, true)
  count += await reconcile(client, 'study_writing_sessions', userId, writing, parsedWriting, (item) => item.id, (item) => item.updatedAt, writingToPayload, async (item) => {
    const current = await studyDb.writingSessions.get(item.id)
    if (!current || current.updatedAt <= item.updatedAt) await studyDb.writingSessions.put(item)
  })
  return count
}
