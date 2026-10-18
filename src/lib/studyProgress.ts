import type { QuizAttempt, QuizQuestion, ReviewLog, StudyCard, WritingSession } from '../types/study'

export const MASTERED_CARD_GOAL = 50

export function buildLocalQuiz(cards: StudyCard[]): QuizQuestion[] {
  const distinct = new Set<string>()
  const eligible = cards.filter((card) => {
    const meaning = card.back.trim().toLocaleLowerCase()
    if (card.suspended || !card.front.trim() || !meaning || distinct.has(meaning)) return false
    distinct.add(meaning)
    return true
  }).slice(0, 5)
  if (eligible.length < 2) return []

  return eligible.map((card, index) => {
    const options = Array.from({ length: eligible.length - 1 }, (_, offset) =>
      eligible[(index + offset + 1) % eligible.length].back)
    options.splice((index * 7 + 1) % eligible.length, 0, card.back)
    return {
      question: `¿Qué significa “${card.front}”?`,
      options,
      answer: card.back,
      explanation: card.note.trim() || `“${card.front}” significa “${card.back}”.`,
    }
  })
}

export function scoreQuiz(questions: QuizQuestion[], answers: Array<string | undefined>): { correct: number; total: number } {
  return {
    correct: questions.reduce((count, question, index) => count + (answers[index] === question.answer ? 1 : 0), 0),
    total: questions.length,
  }
}

function localDay(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

export function calculateProgress(
  cards: StudyCard[], reviews: ReviewLog[], quizzes: QuizAttempt[], writing: WritingSession[], now: Date = new Date(),
) {
  const activityDays = new Set([
    ...reviews.map((review) => localDay(review.reviewedAt)),
    ...quizzes.map((quiz) => localDay(quiz.completedAt)),
    ...writing.filter((session) => session.completedAt).map((session) => localDay(session.completedAt!)),
  ])
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (!activityDays.has(localDay(cursor))) cursor.setDate(cursor.getDate() - 1)
  let streakDays = 0
  while (activityDays.has(localDay(cursor))) {
    streakDays += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  const masteredCount = cards.filter((card) => !card.suspended && card.state === 'review' && card.repetitions >= 5).length

  return {
    cardCount: cards.length,
    dueCount: cards.filter((card) => !card.suspended && card.nextReviewAt <= now).length,
    masteredCount,
    quizCompletions: quizzes.length,
    writingSessions: writing.filter((session) => session.completedAt).length,
    streakDays,
    goalPercent: Math.min(100, Math.round(masteredCount / MASTERED_CARD_GOAL * 100)),
  }
}
