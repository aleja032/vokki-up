import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { confirmStudyNoteCandidates, getActivityHistory, getReviewHistory, getStudyCards, reviewStudyCard, saveStudyCard, saveStudyNote, seedCardsIfEmpty, studyDb } from './studyDb'
import type { StudyCard, StudyNote } from '../types/study'

const now = new Date('2026-10-17T12:00:00.000Z')

function makeCard(id: string): StudyCard {
  return {
    id,
    front: 'take your time',
    back: 'tomate tu tiempo',
    note: 'There is no rush.',
    createdAt: now,
    updatedAt: now,
    state: 'new',
    nextReviewAt: new Date(0),
    intervalMinutes: 0,
    easeFactor: 2.5,
    repetitions: 0,
    suspended: false,
  }
}

describe('studyDb', () => {
  beforeEach(async () => {
    await studyDb.delete()
    await studyDb.open()
  })

  afterEach(() => {
    studyDb.close()
  })

  it('persists the scheduled card and its review log together across a database reopen', async () => {
    await saveStudyCard(makeCard('persistent-card'))

    await reviewStudyCard('persistent-card', 'good', now)
    const updatedCard = await studyDb.cards.get('persistent-card')
    const history = await getReviewHistory()

    expect(updatedCard).toMatchObject({ state: 'review', intervalMinutes: 2_880, repetitions: 1 })
    expect(history).toHaveLength(1)
    expect(history[0]).toMatchObject({ cardId: 'persistent-card', rating: 'good', reviewedAt: now, nextReviewAt: new Date(now.getTime() + 2_880 * 60_000) })

    studyDb.close()
    await studyDb.open()
    expect(await getStudyCards()).toHaveLength(1)
    expect(await studyDb.cards.get('persistent-card')).toMatchObject({ intervalMinutes: 2_880 })
    expect(await getReviewHistory()).toHaveLength(1)
  })

  it('seeds only an empty database and keeps user cards on subsequent starts', async () => {
    await seedCardsIfEmpty()
    expect(await studyDb.cards.count()).toBe(3)

    await saveStudyCard(makeCard('user-card'))
    await seedCardsIfEmpty()

    expect(await studyDb.cards.count()).toBe(4)
    expect(await studyDb.cards.get('user-card')).toBeDefined()
  })

  it('keeps append-only activity events for card creation and reviews across reopen', async () => {
    await saveStudyCard(makeCard('trace-card'))
    await reviewStudyCard('trace-card', 'good', now)

    expect((await getActivityHistory()).map(({ type, entityId, occurredAt, summary }) => ({ type, entityId, occurredAt, summary }))).toEqual(expect.arrayContaining([
      { type: 'review', entityId: 'trace-card', occurredAt: now, summary: 'Repasaste “take your time”.' },
      { type: 'card_created', entityId: 'trace-card', occurredAt: now, summary: 'Guardaste “take your time”.' },
    ]))
    expect(await studyDb.activityHistory.count()).toBe(2)
    studyDb.close()
    await studyDb.open()
    expect(await getActivityHistory()).toHaveLength(2)
  })

  it('records an image-candidate batch confirmation as one local study activity', async () => {
    const note: StudyNote = {
      id: 'note', title: 'Photo words', body: 'A note', createdAt: now, updatedAt: now,
      candidates: [{ id: 'candidate-1', word: 'bright', meaning: 'brillante', status: 'pending' }],
    }
    await saveStudyNote(note)
    await confirmStudyNoteCandidates(note.id, ['candidate-1'])

    expect(await getActivityHistory()).toMatchObject([
      { type: 'candidate_batch_confirmed', entityId: note.id, count: 1, summary: 'Sumaste 1 palabra desde una nota.' },
    ])
  })
})
