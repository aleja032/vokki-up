import type { StudyCard, StudyRating, StudyState } from '../types/study'

export type ScheduleResult = Pick<StudyCard, 'state' | 'nextReviewAt' | 'intervalMinutes' | 'easeFactor' | 'repetitions' | 'suspended'>

const MIN_EASE = 1.3
const MIN_INTERVAL_MINUTES = 1_440
const DAY_MINUTES = 1_440

export function formatReviewInterval(intervalMinutes: number): string {
  if (intervalMinutes < 60) return `${intervalMinutes} min`

  const totalHours = Math.round(intervalMinutes / 60)
  const days = Math.floor(totalHours / 24)
  const hours = totalHours % 24
  if (days === 0) return `${totalHours} h`
  if (hours === 0) return `${days} ${days === 1 ? 'día' : 'días'}`
  return `${days} ${days === 1 ? 'día' : 'días'} ${hours} h`
}

function roundedInterval(minutes: number): number {
  return Math.max(MIN_INTERVAL_MINUTES, Math.round(minutes))
}

export function scheduleReview(card: StudyCard, rating: StudyRating, reviewedAt: Date = new Date()): ScheduleResult {
  let state: StudyState = 'review'
  let intervalMinutes: number
  let easeFactor = card.easeFactor
  let repetitions = card.repetitions + 1

  if (rating === 'again') {
    state = 'learning'
    intervalMinutes = 10
    repetitions = 0
    easeFactor = Math.max(MIN_EASE, easeFactor - 0.2)
  } else if (rating === 'hard') {
    const normalInterval = card.repetitions === 0
      ? 2 * DAY_MINUTES
      : card.intervalMinutes * card.easeFactor
    intervalMinutes = roundedInterval(normalInterval * 0.5)
    easeFactor = Math.max(MIN_EASE, easeFactor - 0.15)
  } else if (rating === 'good') {
    intervalMinutes = roundedInterval(card.repetitions === 0
      ? 2 * DAY_MINUTES
      : card.intervalMinutes * card.easeFactor)
  } else {
    intervalMinutes = roundedInterval(card.repetitions === 0
      ? 4 * DAY_MINUTES
      : card.intervalMinutes * card.easeFactor * 1.3)
    easeFactor += 0.15
  }

  return {
    state,
    intervalMinutes,
    easeFactor,
    repetitions,
    suspended: card.suspended,
    nextReviewAt: new Date(reviewedAt.getTime() + intervalMinutes * 60_000),
  }
}
