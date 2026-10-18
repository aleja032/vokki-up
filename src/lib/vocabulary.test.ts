import 'fake-indexeddb/auto'
import { describe, expect, it, vi } from 'vitest'
import { createVocabularyCandidate, normalizeCandidateWord } from './vocabulary'
import { confirmStudyNoteCandidate, saveStudyNote, studyDb, updateStudyNote } from './studyDb'
import type { StudyNote } from '../types/study'

describe('vocabulary candidates', () => {
  it('normalizes spacing without changing the word', () => {
    expect(normalizeCandidateWord('  take   your time  ')).toBe('take your time')
  })

  it('does not create an empty candidate', () => {
    expect(createVocabularyCandidate('   ')).toBeNull()
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
