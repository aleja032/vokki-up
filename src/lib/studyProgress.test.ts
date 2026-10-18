import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { buildLocalQuiz, calculateProgress, scoreQuiz } from './studyProgress'
import { completeWritingSession, getQuizAttempts, getWritingSessions, saveQuizAttempt, saveWritingDraft, studyDb } from './studyDb'
import type { QuizAttempt, ReviewLog, StudyCard, WritingSession } from '../types/study'

const now = new Date('2026-10-17T12:00:00')

function card(id: string, back: string, overrides: Partial<StudyCard> = {}): StudyCard {
  return {
    id, front: id, back, note: '', createdAt: now, updatedAt: now,
    state: 'new', nextReviewAt: new Date(0), intervalMinutes: 0,
    easeFactor: 2.5, repetitions: 0, suspended: false, ...overrides,
  }
}

describe('local quiz', () => {
  it('creates answerable questions from distinct active cards without inventing vocabulary', () => {
    const questions = buildLocalQuiz([
      card('bright', 'brillante'), card('quick', 'rápido'), card('duplicate', 'brillante'),
      card('paused', 'pausado', { suspended: true }),
    ])

    expect(questions).toHaveLength(2)
    expect(questions.map((question) => question.answer)).toEqual(['brillante', 'rápido'])
    expect(questions.every((question) => question.options.includes(question.answer) && question.options.length === 2)).toBe(true)
    expect(buildLocalQuiz([card('only', 'único')])).toEqual([])
  })

  it('scores unanswered questions as incorrect and does not mutate answers', () => {
    const questions = buildLocalQuiz([card('bright', 'brillante'), card('quick', 'rápido')])
    const answers = ['brillante']

    expect(scoreQuiz(questions, answers)).toEqual({ correct: 1, total: 2 })
    expect(answers).toEqual(['brillante'])
  })

  it('rotates correct-option positions reproducibly across a local quiz', () => {
    const cards = [card('bright', 'brillante'), card('quick', 'rápido'), card('gentle', 'suave')]
    const questions = buildLocalQuiz(cards)

    expect(new Set(questions.map((question) => question.options.indexOf(question.answer))).size).toBe(3)
    expect(buildLocalQuiz(cards)).toEqual(questions)
  })
})

describe('study progress', () => {
  it('counts completed activities and a streak ending yesterday without treating drafts as finished', () => {
    const cards = [
      card('mastered', 'dominado', { state: 'review', repetitions: 5, nextReviewAt: new Date('2026-10-18T12:00:00') }),
      card('due', 'pendiente'),
      card('paused', 'pausado', { state: 'review', repetitions: 8, suspended: true }),
    ]
    const reviews: ReviewLog[] = [{ cardId: 'due', rating: 'good', reviewedAt: new Date('2026-10-15T20:00:00'), nextReviewAt: now }]
    const quizzes: QuizAttempt[] = [{ id: 'quiz-1', source: 'local', correctCount: 2, questionCount: 3, completedAt: new Date('2026-10-16T12:00:00') }]
    const writing: WritingSession[] = [
      { id: 'finished', prompt: 'Write', text: 'Some writing', createdAt: now, updatedAt: now, completedAt: new Date('2026-10-14T12:00:00') },
      { id: 'draft', prompt: 'Write', text: 'Draft', createdAt: now, updatedAt: now },
    ]

    expect(calculateProgress(cards, reviews, quizzes, writing, now)).toMatchObject({
      cardCount: 3, dueCount: 1, masteredCount: 1, quizCompletions: 1,
      writingSessions: 1, streakDays: 3, goalPercent: 2,
    })
  })

  it('resets a broken streak and caps the mastered goal at one hundred percent', () => {
    const mastered = Array.from({ length: 51 }, (_, index) => card(`card-${index}`, `meaning-${index}`, { state: 'review', repetitions: 5 }))
    const progress = calculateProgress(mastered, [], [], [], now)

    expect(progress.streakDays).toBe(0)
    expect(progress.masteredCount).toBe(51)
    expect(progress.goalPercent).toBe(100)
  })
})

describe('activity persistence', () => {
  beforeEach(async () => {
    await studyDb.delete()
    await studyDb.open()
  })

  afterEach(() => studyDb.close())

  it('retains quiz completion and writing feedback across a database reopen', async () => {
    const attempt: QuizAttempt = { id: 'attempt', source: 'local', correctCount: 2, questionCount: 3, completedAt: now }
    const session: WritingSession = {
      id: 'session', prompt: 'Write about travel', text: 'I like travel.', createdAt: now, updatedAt: now,
      feedback: { correctedText: 'I like travelling.', feedback: 'Good start.', suggestions: ['Use a gerund.'] },
    }
    await saveQuizAttempt(attempt)
    await saveWritingDraft(session)
    await completeWritingSession({ ...session, completedAt: now })

    studyDb.close()
    await studyDb.open()
    expect(await getQuizAttempts()).toEqual([attempt])
    expect(await getWritingSessions()).toEqual([{ ...session, completedAt: now }])
  })

  it('does not let an old draft overwrite a completed writing session', async () => {
    const session: WritingSession = { id: 'session', prompt: 'Write', text: 'Final text', createdAt: now, updatedAt: now }
    await completeWritingSession({ ...session, completedAt: now })
    await saveWritingDraft({ ...session, text: 'Old text', updatedAt: new Date(now.getTime() - 1000) })

    expect((await getWritingSessions())[0].text).toBe('Final text')
  })

  it('rejects a stale completion instead of replacing a newer saved draft', async () => {
    const session: WritingSession = { id: 'session', prompt: 'Write', text: 'Old text', createdAt: now, updatedAt: now }
    const newer = { ...session, text: 'Latest text', updatedAt: new Date(now.getTime() + 2000) }
    await saveWritingDraft(newer)

    await expect(completeWritingSession({ ...session, completedAt: new Date(now.getTime() + 3000) })).rejects.toThrow('newer')
    expect((await getWritingSessions())[0]).toEqual(newer)
  })

  it('rejects a stale completion after the session was finished elsewhere', async () => {
    const session: WritingSession = { id: 'session', prompt: 'Write', text: 'Final text', createdAt: now, updatedAt: now }
    const finished = { ...session, updatedAt: new Date(now.getTime() + 2000), completedAt: new Date(now.getTime() + 2000) }
    await completeWritingSession({ ...session, completedAt: finished.completedAt })

    await expect(completeWritingSession({ ...session, text: 'Old text', completedAt: new Date(now.getTime() + 3000) })).rejects.toThrow('newer')
    expect((await getWritingSessions())[0]).toEqual(finished)
  })
})
