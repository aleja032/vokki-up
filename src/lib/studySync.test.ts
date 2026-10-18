import 'fake-indexeddb/auto'
import type { SupabaseClient } from '@supabase/supabase-js'
import { describe, expect, it } from 'vitest'
import { studyDb } from './studyDb'
import { mergeRecords, noteFromPayload, noteToPayload, syncStudyData, type SyncRecord } from './studySync'
import type { StudyCard, StudyNote } from '../types/study'
import migration from '../../supabase/migrations/202610180001_initial_study_sync.sql?raw'

const earlier = '2026-10-17T09:00:00.000Z'
const later = '2026-10-18T09:00:00.000Z'

function row(id: string, updatedAt: string, payload: string): SyncRecord<{ value: string }> {
  return { id, updatedAt, payload: { value: payload } }
}

describe('study sync mapping and merge', () => {
  it('keeps local-only records and prefers the newer timestamp', () => {
    expect(mergeRecords([row('local', earlier, 'local'), row('shared', later, 'new')], [row('shared', earlier, 'old'), row('remote', earlier, 'remote')]))
      .toEqual([row('local', earlier, 'local'), row('remote', earlier, 'remote'), row('shared', later, 'new')])
  })

  it('prefers the server on a timestamp tie for repeatable reconciliation', () => {
    expect(mergeRecords([row('same', later, 'local')], [row('same', later, 'remote')]))
      .toEqual([row('same', later, 'remote')])
  })

  it('does not serialize a local image blob and keeps it when the same note returns', () => {
    const note: StudyNote = {
      id: 'note-1', title: 'Photo', body: 'caption', createdAt: new Date(earlier), updatedAt: new Date(later),
      candidates: [], attachment: { name: 'photo.png', type: 'image/png', blob: new Blob(['pixels'], { type: 'image/png' }) },
    }
    const payload = noteToPayload(note)
    expect(payload).not.toHaveProperty('attachment')
    expect(noteFromPayload(payload, note).attachment).toBe(note.attachment)
  })

  it('rejects invalid server timestamps instead of replacing local data', () => {
    expect(() => mergeRecords([row('safe', later, 'local')], [row('safe', 'invalid', 'remote')])).toThrow()
  })

  it('keeps IndexedDB records intact when a remote read fails', async () => {
    await studyDb.delete()
    await studyDb.open()
    const card: StudyCard = {
      id: 'offline-card', front: 'hello', back: 'hola', note: '',
      createdAt: new Date(earlier), updatedAt: new Date(later), state: 'new', nextReviewAt: new Date(0),
      intervalMinutes: 0, easeFactor: 2.5, repetitions: 0, suspended: false,
    }
    await studyDb.cards.put(card)
    const failingClient = {
      from: () => ({ select: () => ({ eq: () => ({ order: () => ({ range: async () => ({ data: null, error: new Error('offline') }) }) }) }) }),
    } as unknown as SupabaseClient
    await expect(syncStudyData(failingClient, 'anonymous-user')).rejects.toThrow('offline')
    expect(await studyDb.cards.get(card.id)).toEqual(card)
    studyDb.close()
  })

  it('reads each remote collection once before applying the validated snapshots', async () => {
    await studyDb.delete()
    await studyDb.open()
    let reads = 0
    const client = {
      from: () => ({
        select: () => ({ eq: () => ({ order: () => ({ range: async () => { reads += 1; return { data: [], error: null } } }) }) }),
        upsert: async () => ({ error: null }),
      }),
    } as unknown as SupabaseClient
    await syncStudyData(client, 'anonymous-user')
    expect(reads).toBe(5)
    studyDb.close()
  })

  it('uses insert-only conflict handling for immutable review and quiz events', async () => {
    await studyDb.delete()
    await studyDb.open()
    await studyDb.reviewLogs.add({ syncId: 'review-1', cardId: 'card-1', rating: 'good', reviewedAt: new Date(later), nextReviewAt: new Date(later) })
    await studyDb.quizAttempts.add({ id: 'quiz-1', source: 'local', correctCount: 1, questionCount: 1, completedAt: new Date(later) })
    const uploads: Array<{ table: string; options: unknown }> = []
    const client = {
      from: (table: string) => ({
        select: () => ({ eq: () => ({ order: () => ({ range: async () => ({ data: [], error: null }) }) }) }),
        upsert: async (_rows: unknown, options: unknown) => { uploads.push({ table, options }); return { error: null } },
      }),
    } as unknown as SupabaseClient
    await syncStudyData(client, 'anonymous-user')
    expect(uploads).toContainEqual({ table: 'study_review_logs', options: { onConflict: 'user_id,id', ignoreDuplicates: true } })
    expect(uploads).toContainEqual({ table: 'study_quiz_attempts', options: { onConflict: 'user_id,id', ignoreDuplicates: true } })
    studyDb.close()
  })

  it('declares database-level update and delete rejection for immutable events', () => {
    expect(migration).toContain('before update or delete')
    expect(migration).toContain('raise exception')
    expect(migration).toContain("'study_review_logs', 'study_quiz_attempts'")
  })
})
