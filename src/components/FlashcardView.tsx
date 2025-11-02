import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, ArrowsClockwise } from '@phosphor-icons/react'
import type { Flashcard } from '@/lib/types'

interface FlashcardViewProps {
  flashcards: Flashcard[]
}

export function FlashcardView({ flashcards }: FlashcardViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const currentCard = flashcards[currentIndex]

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
    }
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Badge variant="secondary" className="text-sm">
          Card {currentIndex + 1} of {flashcards.length}
        </Badge>
      </div>

      <div className="flex justify-center items-center min-h-[400px]">
        <div
          className="relative w-full max-w-2xl cursor-pointer"
          style={{ perspective: '1000px' }}
          onClick={handleFlip}
        >
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
            style={{
              transformStyle: 'preserve-3d',
            }}
            className="relative"
          >
            <Card
              className="p-8 md:p-12 shadow-lg min-h-[300px] flex items-center justify-center"
              style={{
                backfaceVisibility: 'hidden',
              }}
            >
              <div className="text-center space-y-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Question
                </p>
                <p className="text-xl md:text-2xl font-medium leading-relaxed">
                  {currentCard.question}
                </p>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <ArrowsClockwise size={16} />
                  Click to reveal answer
                </p>
              </div>
            </Card>

            <Card
              className="absolute inset-0 p-8 md:p-12 shadow-lg min-h-[300px] flex items-center justify-center bg-accent/5"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <div className="text-center space-y-4">
                <p className="text-xs uppercase tracking-wider text-accent-foreground font-medium">
                  Answer
                </p>
                <p className="text-lg md:text-xl leading-relaxed">
                  {currentCard.answer}
                </p>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <ArrowsClockwise size={16} />
                  Click to see question
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex-1 md:flex-none"
        >
          <ArrowLeft className="mr-2" />
          Previous
        </Button>

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
          className="flex-1 md:flex-none"
        >
          Next
          <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  )
}
