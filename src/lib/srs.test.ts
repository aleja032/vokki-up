import { describe, expect, it } from 'vitest'
import { formatReviewInterval, scheduleReview } from './srs'
import type { StudyCard, StudyRating } from '../types/study'

const now = new Date('2026-10-17T12:00:00.000Z')

function card(overrides: Partial<StudyCard> = {}): StudyCard {
  return {
    id: 'card-1',
    front: 'despacio',
    back: 'slowly',
    note: '',
    createdAt: now,
    updatedAt: now,
    state: 'new',
    nextReviewAt: now,
    intervalMinutes: 0,
    easeFactor: 2.5,
    repetitions: 0,
    suspended: false,
    ...overrides,
  }
}

describe('scheduleReview', () => {
  it('returns Again to learning in ten minutes and resets repetitions', () => {
    const result = scheduleReview(card({ state: 'review', repetitions: 5, intervalMinutes: 10_080 }), 'again', now)

    expect(result).toMatchObject({ state: 'learning', intervalMinutes: 10, repetitions: 0 })
    expect(result.nextReviewAt).toEqual(new Date(now.getTime() + 10 * 60_000))
  })

  it('gives a new card distinct Hard, Good, and Easy intervals', () => {
    const intervals = (['hard', 'good', 'easy'] as StudyRating[])
      .map((rating) => scheduleReview(card(), rating, now).intervalMinutes)

    expect(intervals).toEqual([1_440, 2_880, 5_760])
  })

  it('advances Good and Easy using the prior interval and ease factor', () => {
    const mature = card({ state: 'review', repetitions: 2, intervalMinutes: 4_320, easeFactor: 2 })

    expect(scheduleReview(mature, 'good', now).intervalMinutes).toBe(8_640)
    expect(scheduleReview(mature, 'easy', now).intervalMinutes).toBe(11_232)
  })

  it('preserves suspension while scheduling and keeps ease within bounds', () => {
    const suspended = card({ suspended: true, easeFactor: 1.35 })
    const result = scheduleReview(suspended, 'again', now)

    expect(result.suspended).toBe(true)
    expect(result.easeFactor).toBe(1.3)
  })

  it('formats the actual scheduled interval for rating feedback', () => {
    expect(formatReviewInterval(10)).toBe('10 min')
    expect(formatReviewInterval(1_440)).toBe('1 día')
    expect(formatReviewInterval(5_400)).toBe('3 días 18 h')
  })
})
