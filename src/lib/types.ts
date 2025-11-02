export interface Flashcard {
  id: string
  question: string
  answer: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  justification: string
}

export interface StudyContent {
  flashcards: Flashcard[]
  quizQuestions: QuizQuestion[]
}

export interface QuizAnswer {
  questionId: string
  selectedAnswer: number
  isCorrect: boolean
}
