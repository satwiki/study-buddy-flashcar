import { useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { WelcomeScreen } from '@/components/WelcomeScreen'
import { UploadContent } from '@/components/UploadContent'
import { LoadingGeneration } from '@/components/LoadingGeneration'
import { StudyMode } from '@/components/StudyMode'
import { llmPrompt, llm } from '@/lib/spark-utils'
import type { StudyContent } from '@/lib/types'

type AppState = 'welcome' | 'upload' | 'generating' | 'study'

function App() {
  const [state, setState] = useState<AppState>('welcome')
  const [userName, setUserName] = useState('')
  const [studyContent, setStudyContent] = useState<StudyContent | null>(null)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationMessage, setGenerationMessage] = useState('')

  const handleStart = (name: string) => {
    setUserName(name)
    setState('upload')
  }

  const handleContentUploaded = async (content: string) => {
    setState('generating')
    setGenerationProgress(0)
    setGenerationMessage('Analyzing your content...')

    try {
      setGenerationProgress(20)
      await new Promise((resolve) => setTimeout(resolve, 500))

      setGenerationMessage('Creating flashcards...')
      setGenerationProgress(40)

      const flashcardsPrompt = llmPrompt`You are an educational content generator. Based on the following study material, create exactly 8 flashcard question-answer pairs.

Study Material:
${content}

Return the result as a valid JSON object with a single property called "flashcards" that contains the flashcard list. Each flashcard should have:
- id: a unique identifier (use sequential numbers like "fc1", "fc2", etc.)
- question: a clear, concise question that tests understanding of a key concept
- answer: a complete but concise answer

Format:
{
  "flashcards": [
    {"id": "fc1", "question": "...", "answer": "..."},
    {"id": "fc2", "question": "...", "answer": "..."}
  ]
}`

      const flashcardsResponse = await llm(flashcardsPrompt, 'gpt-4o', true)
      const flashcardsData = JSON.parse(flashcardsResponse)

      setGenerationMessage('Creating quiz questions...')
      setGenerationProgress(70)

      const quizPrompt = llmPrompt`You are an educational content generator. Based on the following study material, create exactly 8 multiple-choice quiz questions.

Study Material:
${content}

Return the result as a valid JSON object with a single property called "questions" that contains the question list. Each question should have:
- id: a unique identifier (use sequential numbers like "q1", "q2", etc.)
- question: a clear question that tests understanding
- options: an array of exactly 4 possible answers
- correctAnswer: the index (0-3) of the correct answer in the options array

Make sure the incorrect options are plausible but clearly wrong to someone who understands the material.

Format:
{
  "questions": [
    {
      "id": "q1",
      "question": "...",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": 0
    }
  ]
}`

      const quizResponse = await llm(quizPrompt, 'gpt-4o', true)
      const quizData = JSON.parse(quizResponse)

      setGenerationProgress(90)
      await new Promise((resolve) => setTimeout(resolve, 300))

      setStudyContent({
        flashcards: flashcardsData.flashcards || [],
        quizQuestions: quizData.questions || [],
      })

      setGenerationProgress(100)
      setGenerationMessage('All set!')
      await new Promise((resolve) => setTimeout(resolve, 500))

      setState('study')
    } catch (error) {
      console.error('Error generating content:', error)
      setGenerationMessage('Failed to generate content. Please try again.')
      setTimeout(() => {
        setState('upload')
      }, 2000)
    }
  }

  const handleReset = () => {
    setStudyContent(null)
    setState('upload')
  }

  return (
    <>
      {state === 'welcome' && <WelcomeScreen onStart={handleStart} />}
      {state === 'upload' && (
        <UploadContent userName={userName} onContentUploaded={handleContentUploaded} />
      )}
      {state === 'generating' && (
        <LoadingGeneration progress={generationProgress} message={generationMessage} />
      )}
      {state === 'study' && studyContent && (
        <StudyMode userName={userName} content={studyContent} onReset={handleReset} />
      )}
      <Toaster />
    </>
  )
}

export default App