export type StudyRating = 'again' | 'hard' | 'good' | 'easy'
export type StudyState = 'new' | 'learning' | 'review'

export interface StudyCard {
  id: string
  front: string
  back: string
  note: string
  createdAt: Date
  updatedAt: Date
  state: StudyState
  nextReviewAt: Date
  intervalMinutes: number
  easeFactor: number
  repetitions: number
  suspended: boolean
}

export interface ReviewLog {
  id?: number
  syncId?: string
  cardId: string
  rating: StudyRating
  reviewedAt: Date
  nextReviewAt: Date
}

export interface VocabularyCandidate {
  id: string
  word: string
  meaning: string
  status: 'pending' | 'rejected' | 'confirmed'
}

export interface StudyNote {
  id: string
  title: string
  body: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
  attachment?: { name: string; type: string; blob: Blob }
  candidates: VocabularyCandidate[]
}

export interface QuizQuestion {
  question: string
  options: string[]
  answer: string
  explanation: string
}

export interface QuizAttempt {
  id: string
  source: 'local' | 'ai'
  correctCount: number
  questionCount: number
  completedAt: Date
}

export interface WritingSession {
  id: string
  prompt: string
  text: string
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  feedback?: {
    correctedText: string
    feedback: string
    suggestions: string[]
  }
}
