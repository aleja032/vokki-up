import 'fake-indexeddb/auto'
import { describe, expect, it, vi } from 'vitest'
import { createVocabularyCandidate, normalizeCandidateWord } from './vocabulary'
import { confirmStudyNoteCandidate, confirmStudyNoteCandidates, saveStudyNote, studyDb, updateStudyNote } from './studyDb'
import type { StudyNote } from '../types/study'

describe('vocabulary candidates', () => {
  it('normalizes spacing without changing the word', () => {
    expect(normalizeCandidateWord('  take   your time  ')).toBe('take your time')
  })

  it('does not create an empty candidate', () => {
    expect(createVocabularyCandidate('   ')).toBeNull()
  })

  it('keeps raw input when creating a corrected candidate', () => {
    const candidate = createVocabularyCandidate('brigdge', 'puente', { originalInput: 'brigdge', canonicalWord: 'bridge', phonetic: '/brɪdʒ/' })
    expect(candidate).toMatchObject({ word: 'bridge', originalInput: 'brigdge', canonicalWord: 'bridge', meaning: 'puente', phonetic: '/brɪdʒ/' })
  })

  it('serializes concurrent note edits against the latest persisted candidate list', async () => {
    await studyDb.delete()
    await studyDb.open()
    const note: StudyNote = { id: 'race-note', title: 'Race', body: '', createdAt: new Date(), updatedAt: new Date(), candidates: [] }
    await saveStudyNote(note)
    const first = createVocabularyCandidate('first')!
    const second = createVocabularyCandidate('second')!

    await Promise.all([
      updateStudyNote(note.id, (current) => ({ ...current, candidates: [...current.candidates, first] })),
      updateStudyNote(note.id, (current) => ({ ...current, candidates: [...current.candidates, second] })),
    ])

    expect((await studyDb.notes.get(note.id))?.candidates.map((candidate) => candidate.word).sort()).toEqual(['first', 'second'])
    studyDb.close()
  })

  it('creates a card and confirms its source candidate atomically only once', async () => {
    await studyDb.delete()
    await studyDb.open()
    const candidate = createVocabularyCandidate('bright', 'brillante')!
    const note: StudyNote = { id: 'confirm-note', title: 'Confirm', body: 'The room is bright.', createdAt: new Date(), updatedAt: new Date(), candidates: [candidate] }
    await saveStudyNote(note)

    const created = await confirmStudyNoteCandidate(note.id, candidate.id)
    const duplicate = await confirmStudyNoteCandidate(note.id, candidate.id)

    expect(created?.front).toBe('bright')
    expect(duplicate).toBeNull()
    expect((await studyDb.cards.toArray()).filter((card) => card.front === 'bright')).toHaveLength(1)
    expect((await studyDb.notes.get(note.id))?.candidates[0].status).toBe('confirmed')
    studyDb.close()
  })

  it('confirms only selected candidates as one idempotent batch', async () => {
    await studyDb.delete()
    await studyDb.open()
    const first = createVocabularyCandidate('bridge', 'puente')!
    const second = createVocabularyCandidate('river', 'río')!
    const third = createVocabularyCandidate('cloud', 'nube')!
    const duplicate = createVocabularyCandidate('bridge', 'puente')!
    await saveStudyNote({ id: 'batch-note', title: 'Batch', body: 'A bridge over a river.', createdAt: new Date(), updatedAt: new Date(), candidates: [first, second, third, duplicate] })

    const created = await confirmStudyNoteCandidates('batch-note', [first.id, third.id, duplicate.id])
    const replay = await confirmStudyNoteCandidates('batch-note', [first.id, third.id, duplicate.id])

    expect(created.map((card) => card.front)).toEqual(['bridge', 'cloud'])
    expect(replay).toEqual([])
    expect((await studyDb.notes.get('batch-note'))?.candidates.map(({ status }) => status)).toEqual(['confirmed', 'pending', 'confirmed', 'confirmed'])
    expect((await studyDb.notes.get('batch-note'))?.body).toBe('A bridge over a river.')
    expect(await studyDb.cards.count()).toBe(2)
    studyDb.close()
  })

  it('rolls back every card and status if any selected batch candidate is invalid', async () => {
    await studyDb.delete()
    await studyDb.open()
    const valid = createVocabularyCandidate('bridge', 'puente')!
    const invalid = createVocabularyCandidate('river', '')!
    await saveStudyNote({ id: 'invalid-batch', title: 'Batch', body: '', createdAt: new Date(), updatedAt: new Date(), candidates: [valid, invalid] })

    await expect(confirmStudyNoteCandidates('invalid-batch', [valid.id, invalid.id])).rejects.toThrow('incomplete')

    expect(await studyDb.cards.count()).toBe(0)
    expect((await studyDb.notes.get('invalid-batch'))?.candidates.map(({ status }) => status)).toEqual(['pending', 'pending'])
    studyDb.close()
  })

  it('rolls back card creation when persisting the candidate confirmation fails', async () => {
    await studyDb.delete()
    await studyDb.open()
    const candidate = createVocabularyCandidate('gently', 'con suavidad')!
    const note: StudyNote = { id: 'rollback-note', title: 'Rollback', body: '', createdAt: new Date(), updatedAt: new Date(), candidates: [candidate] }
    await saveStudyNote(note)
    const putSpy = vi.spyOn(studyDb.notes, 'put').mockRejectedValueOnce(new Error('storage failure'))

    await expect(confirmStudyNoteCandidate(note.id, candidate.id)).rejects.toThrow('storage failure')
    putSpy.mockRestore()

    expect(await studyDb.cards.count()).toBe(0)
    expect((await studyDb.notes.get(note.id))?.candidates[0].status).toBe('pending')
    studyDb.close()
  })
})
