import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Cards, Question, ArrowCounterClockwise } from '@phosphor-icons/react'
import { FlashcardView } from './FlashcardView'
import { QuizView } from './QuizView'
import type { StudyContent } from '@/lib/types'

interface StudyModeProps {
  userName: string
  content: StudyContent
  onReset: () => void
}

export function StudyMode({ userName, content, onReset }: StudyModeProps) {
  const [activeTab, setActiveTab] = useState<'flashcards' | 'quiz'>('flashcards')

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl">Study Session</CardTitle>
                <CardDescription>Ready to test your knowledge, {userName}?</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={onReset}>
                <ArrowCounterClockwise className="mr-2" />
                New Material
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'flashcards' | 'quiz')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="flashcards" className="space-x-2">
                  <Cards />
                  <span>Flashcards</span>
                  <span className="text-xs text-muted-foreground">({content.flashcards.length})</span>
                </TabsTrigger>
                <TabsTrigger value="quiz" className="space-x-2">
                  <Question />
                  <span>Quiz</span>
                  <span className="text-xs text-muted-foreground">({content.quizQuestions.length})</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="flashcards" className="mt-6">
                {content.flashcards.length > 0 ? (
                  <FlashcardView flashcards={content.flashcards} />
                ) : (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">No flashcards available</p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="quiz" className="mt-6">
                {content.quizQuestions.length > 0 ? (
                  <QuizView questions={content.quizQuestions} />
                ) : (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">No quiz questions available</p>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
