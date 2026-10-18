import Dexie, { type Table } from 'dexie'
import { scheduleReview } from './srs'
import type { QuizAttempt, ReviewLog, StudyActivity, StudyCard, StudyNote, StudyRating, WritingSession } from '../types/study'

class StudyDatabase extends Dexie {
  cards!: Table<StudyCard, string>
  reviewLogs!: Table<ReviewLog, number>
  notes!: Table<StudyNote, string>
  quizAttempts!: Table<QuizAttempt, string>
  writingSessions!: Table<WritingSession, string>
  activityHistory!: Table<StudyActivity, string>

  constructor() {
    super('vokki-up-study')
    this.version(2).stores({
      cards: 'id, state, nextReviewAt, suspended, createdAt, updatedAt',
      reviewLogs: '++id, cardId, reviewedAt',
    })
    this.version(3).stores({
      cards: 'id, state, nextReviewAt, suspended, createdAt, updatedAt',
      reviewLogs: '++id, cardId, reviewedAt',
      notes: 'id, createdAt, updatedAt',
    })
    this.version(4).stores({
      cards: 'id, state, nextReviewAt, suspended, createdAt, updatedAt',
      reviewLogs: '++id, cardId, reviewedAt',
      notes: 'id, createdAt, updatedAt',
      quizAttempts: 'id, completedAt',
      writingSessions: 'id, createdAt, updatedAt, completedAt',
    })
    this.version(5).stores({
      cards: 'id, state, nextReviewAt, suspended, createdAt, updatedAt',
      reviewLogs: '++id, &syncId, cardId, reviewedAt',
      notes: 'id, createdAt, updatedAt, deletedAt',
      quizAttempts: 'id, completedAt',
      writingSessions: 'id, createdAt, updatedAt, completedAt',
    }).upgrade(async (transaction) => {
      await transaction.table<ReviewLog, number>('reviewLogs').toCollection().modify((log) => {
        if (!log.syncId) log.syncId = crypto.randomUUID()
      })
    })
    this.version(6).stores({
      cards: 'id, state, nextReviewAt, suspended, createdAt, updatedAt',
      reviewLogs: '++id, &syncId, cardId, reviewedAt',
      notes: 'id, createdAt, updatedAt, deletedAt',
      quizAttempts: 'id, completedAt',
      writingSessions: 'id, createdAt, updatedAt, completedAt',
      activityHistory: 'id, occurredAt, type',
    })
  }
}

export const studyDb = new StudyDatabase()

const initialCards: StudyCard[] = [
  { id: 'seed-bright', front: 'bright', back: 'brillante / luminoso', note: 'The room is bright in the morning.', createdAt: new Date('2026-10-17T09:00:00.000Z'), updatedAt: new Date('2026-10-17T09:00:00.000Z'), state: 'new', nextReviewAt: new Date(0), intervalMinutes: 0, easeFactor: 2.5, repetitions: 0, suspended: false },
  { id: 'seed-gently', front: 'gently', back: 'con suavidad', note: 'Please close the door gently.', createdAt: new Date('2026-10-17T09:00:00.000Z'), updatedAt: new Date('2026-10-17T09:00:00.000Z'), state: 'new', nextReviewAt: new Date(0), intervalMinutes: 0, easeFactor: 2.5, repetitions: 0, suspended: false },
  { id: 'seed-eventually', front: 'eventually', back: 'con el tiempo / finalmente', note: 'You will eventually feel more confident.', createdAt: new Date('2026-10-17T09:00:00.000Z'), updatedAt: new Date('2026-10-17T09:00:00.000Z'), state: 'new', nextReviewAt: new Date(0), intervalMinutes: 0, easeFactor: 2.5, repetitions: 0, suspended: false },
]

export async function seedCardsIfEmpty(): Promise<void> {
  await studyDb.transaction('rw', studyDb.cards, async () => {
    if (await studyDb.cards.count() === 0) {
      await studyDb.cards.bulkAdd(initialCards)
    }
  })
}

export function getStudyCards(): Promise<StudyCard[]> {
  return studyDb.cards.orderBy('createdAt').reverse().toArray()
}

export function getDueCards(at: Date = new Date()): Promise<StudyCard[]> {
  return studyDb.cards
    .where('nextReviewAt').belowOrEqual(at)
    .filter((card) => !card.suspended)
    .toArray()
}

export async function saveStudyCard(card: StudyCard): Promise<void> {
  await studyDb.transaction('rw', studyDb.cards, studyDb.activityHistory, async () => {
    const existing = await studyDb.cards.get(card.id)
    await studyDb.cards.put({ ...card, updatedAt: new Date() })
    if (!existing) await appendActivity({
      type: 'card_created', occurredAt: card.createdAt, entityId: card.id,
      summary: `Guardaste “${card.front}”.`,
    })
  })
}

export async function reviewStudyCard(id: string, rating: StudyRating, reviewedAt: Date = new Date()): Promise<void> {
  await studyDb.transaction('rw', studyDb.cards, studyDb.reviewLogs, studyDb.activityHistory, async () => {
    const card = await studyDb.cards.get(id)
    if (!card) throw new Error('Study card not found')
    const schedule = scheduleReview(card, rating, reviewedAt)
    const updated = { ...card, ...schedule, updatedAt: reviewedAt }
    await studyDb.cards.put(updated)
    await studyDb.reviewLogs.add({ syncId: crypto.randomUUID(), cardId: id, rating, reviewedAt, nextReviewAt: schedule.nextReviewAt })
    await appendActivity({ type: 'review', occurredAt: reviewedAt, entityId: id, summary: `Repasaste “${card.front}”.` })
  })
}

export function getReviewHistory(): Promise<ReviewLog[]> {
  return studyDb.reviewLogs.orderBy('reviewedAt').reverse().toArray()
}

function appendActivity(activity: Omit<StudyActivity, 'id'>): Promise<string> {
  return studyDb.activityHistory.add({ ...activity, id: crypto.randomUUID() })
}

export function getActivityHistory(): Promise<StudyActivity[]> {
  return studyDb.activityHistory.orderBy('occurredAt').reverse().toArray()
}

export function getStudyNotes(): Promise<StudyNote[]> {
  return studyDb.notes.orderBy('createdAt').reverse().filter((note) => !note.deletedAt).toArray()
}

export function saveStudyNote(note: StudyNote): Promise<string> {
  return studyDb.notes.put({ ...note, updatedAt: new Date() })
}

export async function updateStudyNote(id: string, update: (current: StudyNote) => StudyNote): Promise<StudyNote> {
  return studyDb.transaction('rw', studyDb.notes, async () => {
    const current = await studyDb.notes.get(id)
    if (!current) throw new Error('Study note not found')
    const updated = { ...update(current), updatedAt: new Date() }
    await studyDb.notes.put(updated)
    return updated
  })
}

export async function confirmStudyNoteCandidate(noteId: string, candidateId: string): Promise<StudyCard | null> {
  const created = await confirmStudyNoteCandidates(noteId, [candidateId])
  return created[0] ?? null
}

export async function confirmStudyNoteCandidates(noteId: string, candidateIds: string[]): Promise<StudyCard[]> {
  const selectedIds = [...new Set(candidateIds)]
  if (selectedIds.length === 0) return []
  return studyDb.transaction('rw', studyDb.notes, studyDb.cards, studyDb.activityHistory, async () => {
    const note = await studyDb.notes.get(noteId)
    if (!note) throw new Error('Study note not found')
    const selected = selectedIds.map((id) => note.candidates.find((item) => item.id === id))
    if (selected.some((candidate) => !candidate)) throw new Error('Vocabulary candidate not found')
    const pending = selected.filter((candidate) => candidate?.status === 'pending')
    if (pending.length === 0) return []
    const cards = await studyDb.cards.toArray()
    const existingWords = new Set(cards.map((card) => card.front.trim().replace(/\s+/g, ' ').toLocaleLowerCase()))
    const now = new Date()
    const created: StudyCard[] = []
    for (const candidate of pending) {
      if (!candidate) continue
      const front = (candidate.canonicalWord ?? candidate.word).trim().replace(/\s+/g, ' ')
      const back = [candidate.meaning.trim(), candidate.phonetic?.trim()].filter(Boolean).join(' · ')
      if (!front || !back) throw new Error('Vocabulary candidate is incomplete')
      const normalizedFront = front.toLocaleLowerCase()
      if (existingWords.has(normalizedFront)) continue
      existingWords.add(normalizedFront)
      created.push({
        id: `candidate-${candidate.id}`,
        front,
        back,
        note: note.body,
        createdAt: now,
        updatedAt: now,
        state: 'new',
        nextReviewAt: new Date(0),
        intervalMinutes: 0,
        easeFactor: 2.5,
        repetitions: 0,
        suspended: false,
      })
    }
    if (created.length) await studyDb.cards.bulkAdd(created)
    if (pending.length) await appendActivity({
      type: 'candidate_batch_confirmed', occurredAt: now, entityId: noteId, count: created.length,
      summary: created.length
        ? `Sumaste ${created.length} ${created.length === 1 ? 'palabra' : 'palabras'} desde una nota.`
        : 'Confirmaste palabras de una nota; no se agregaron duplicados.',
    })
    const confirmedIds = new Set(pending.map((candidate) => candidate!.id))
    await studyDb.notes.put({
      ...note,
      updatedAt: now,
      candidates: note.candidates.map((item) => confirmedIds.has(item.id) ? { ...item, status: 'confirmed' } : item),
    })
    return created
  })
}

export async function deleteStudyNote(id: string): Promise<void> {
  await studyDb.transaction('rw', studyDb.notes, async () => {
    const note = await studyDb.notes.get(id)
    if (note) await studyDb.notes.put({ ...note, updatedAt: new Date(), deletedAt: new Date() })
  })
}

export function getQuizAttempts(): Promise<QuizAttempt[]> {
  return studyDb.quizAttempts.orderBy('completedAt').reverse().toArray()
}

export async function saveQuizAttempt(attempt: QuizAttempt): Promise<string> {
  return studyDb.transaction('rw', studyDb.quizAttempts, studyDb.activityHistory, async () => {
    await studyDb.quizAttempts.add(attempt)
    return appendActivity({
      type: 'quiz_completed', occurredAt: attempt.completedAt, entityId: attempt.id,
      summary: `Completaste un quiz: ${attempt.correctCount} de ${attempt.questionCount} correctas.`,
    })
  })
}

export function getWritingSessions(): Promise<WritingSession[]> {
  return studyDb.writingSessions.orderBy('updatedAt').reverse().toArray()
}

export class StaleWritingSessionError extends Error {
  constructor() {
    super('A newer writing draft is saved.')
  }
}

export async function saveWritingDraft(session: WritingSession): Promise<void> {
  await studyDb.transaction('rw', studyDb.writingSessions, async () => {
    const current = await studyDb.writingSessions.get(session.id)
    if (current?.completedAt || (current && current.updatedAt > session.updatedAt)) return
    await studyDb.writingSessions.put(session)
  })
}

export async function completeWritingSession(session: WritingSession): Promise<void> {
  await studyDb.transaction('rw', studyDb.writingSessions, studyDb.activityHistory, async () => {
    const current = await studyDb.writingSessions.get(session.id)
    if (current && current.updatedAt > session.updatedAt) throw new StaleWritingSessionError()
    if (current?.completedAt) return
    const completedAt = session.completedAt ?? new Date()
    await studyDb.writingSessions.put({ ...session, updatedAt: completedAt, completedAt })
    await appendActivity({ type: 'writing_completed', occurredAt: completedAt, entityId: session.id, summary: 'Finalizaste una sesión de escritura.' })
  })
}
