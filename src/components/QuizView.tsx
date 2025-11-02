import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Check, X, Trophy } from '@phosphor-icons/react'
import type { QuizQuestion, QuizAnswer } from '@/lib/types'

interface QuizViewProps {
  questions: QuizQuestion[]
}

export function QuizView({ questions }: QuizViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [quizComplete, setQuizComplete] = useState(false)

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100

  const handleOptionSelect = (optionIndex: number) => {
    if (showResult) return
    setSelectedOption(optionIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return

    const isCorrect = selectedOption === currentQuestion.correctAnswer
    setAnswers([
      ...answers,
      {
        questionId: currentQuestion.id,
        selectedAnswer: selectedOption,
        isCorrect,
      },
    ])
    setShowResult(true)
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedOption(null)
      setShowResult(false)
    } else {
      setQuizComplete(true)
    }
  }

  const handleRetakeQuiz = () => {
    setCurrentIndex(0)
    setAnswers([])
    setSelectedOption(null)
    setShowResult(false)
    setQuizComplete(false)
  }

  if (quizComplete) {
    const correctCount = answers.filter((a) => a.isCorrect).length
    const percentage = Math.round((correctCount / questions.length) * 100)

    return (
      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
              <Trophy size={32} weight="duotone" className="text-accent" />
            </div>
            <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-5xl font-bold text-primary">{percentage}%</p>
              <p className="text-muted-foreground">
                You got {correctCount} out of {questions.length} questions correct
              </p>
            </div>

            <div className="space-y-3">
              {questions.map((question, idx) => {
                const answer = answers[idx]
                return (
                  <Card key={question.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          answer.isCorrect
                            ? 'bg-accent/10 text-accent'
                            : 'bg-destructive/10 text-destructive'
                        }`}
                      >
                        {answer.isCorrect ? <Check weight="bold" /> : <X weight="bold" />}
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="font-medium text-sm">{question.question}</p>
                        {!answer.isCorrect && (
                          <p className="text-xs text-muted-foreground">
                            Correct answer: {question.options[question.correctAnswer]}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            <Button onClick={handleRetakeQuiz} className="w-full">
              Retake Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-sm">
            Question {currentIndex + 1} of {questions.length}
          </Badge>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl leading-relaxed">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx
            const isCorrect = idx === currentQuestion.correctAnswer
            const showCorrect = showResult && isCorrect
            const showIncorrect = showResult && isSelected && !isCorrect

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                disabled={showResult}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  showCorrect
                    ? 'border-accent bg-accent/5 text-accent-foreground'
                    : showIncorrect
                    ? 'border-destructive bg-destructive/5 text-destructive'
                    : isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showCorrect && <Check weight="bold" className="text-accent" />}
                  {showIncorrect && <X weight="bold" className="text-destructive" />}
                </div>
              </button>
            )
          })}

          {showResult && currentQuestion.justification && (
            <Card className="mt-4 bg-muted/50">
              <CardContent className="pt-4">
                <div className="flex gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      selectedOption === currentQuestion.correctAnswer
                        ? 'bg-accent/10 text-accent'
                        : 'bg-destructive/10 text-destructive'
                    }`}
                  >
                    {selectedOption === currentQuestion.correctAnswer ? (
                      <Check weight="bold" />
                    ) : (
                      <X weight="bold" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">
                      {selectedOption === currentQuestion.correctAnswer
                        ? 'Correct!'
                        : 'Incorrect'}
                    </p>
                    <p className="text-sm text-muted-foreground">{currentQuestion.justification}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        {!showResult ? (
          <Button
            onClick={handleSubmitAnswer}
            disabled={selectedOption === null}
            className="w-full"
          >
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNext} className="w-full">
            {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
          </Button>
        )}
      </div>
    </div>
  )
}
