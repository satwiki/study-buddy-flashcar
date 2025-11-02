import { useState } from 'react'
import { Toaster, toast } from 'sonner'
import { WelcomeScreen } from '@/components/WelcomeScreen'
import { UploadContent } from '@/components/UploadContent'
import { LoadingGeneration } from '@/components/LoadingGeneration'
import { StudyMode } from '@/components/StudyMode'
import { llmPrompt, llmWithFallback } from '@/lib/spark-utils'
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

  const truncateContent = (text: string, maxTokens: number = 100000): string => {
    const estimatedCharsPerToken = 4
    const maxChars = maxTokens * estimatedCharsPerToken
    
    if (text.length <= maxChars) {
      return text
    }
    
    return text.substring(0, maxChars) + '\n\n[Content truncated due to length...]'
  }

  const handleContentUploaded = async (content: string) => {
    setState('generating')
    setGenerationProgress(0)
    setGenerationMessage('Analyzing your content...')

    try {
      setGenerationProgress(20)
      await new Promise((resolve) => setTimeout(resolve, 500))

      const truncatedContent = truncateContent(content)

      setGenerationMessage('Creating flashcards...')
      setGenerationProgress(40)

      const flashcardsPrompt = llmPrompt`You are an educational content generator. Based on the following study material, create exactly 25 flashcard question-answer pairs.

Study Material:
${truncatedContent}

CRITICAL: You must return ONLY a valid JSON object with no additional text, markdown formatting, or code blocks.

The JSON must have this exact structure:
{
  "flashcards": [
    {
      "id": "fc1",
      "question": "Clear, concise question testing understanding of a key concept",
      "answer": "Complete but concise answer in 2-3 sentences maximum"
    }
  ]
}

Rules:
- Create exactly 25 flashcards
- Use sequential IDs: "fc1", "fc2", ... "fc25"
- Questions must be clear and concise
- Answers must be 2-3 sentences maximum
- All strings must be properly escaped (escape quotes, newlines, etc.)
- Do NOT include any text outside the JSON object
- Do NOT wrap in markdown code blocks
- Ensure the JSON is valid and parseable`

      const flashcardsResponse = await llmWithFallback(flashcardsPrompt, true)
      
      const flashcardsData = JSON.parse(flashcardsResponse)
      
      if (!flashcardsData.flashcards || !Array.isArray(flashcardsData.flashcards)) {
        throw new Error('Invalid flashcards format: missing or invalid flashcards array')
      }
      
      if (flashcardsData.flashcards.length === 0) {
        throw new Error('No flashcards were generated')
      }
      
      for (const card of flashcardsData.flashcards) {
        if (!card.id || !card.question || !card.answer) {
          throw new Error('Invalid flashcard structure: missing required fields')
        }
      }

      setGenerationMessage('Creating quiz questions...')
      setGenerationProgress(70)

      const quizPrompt = llmPrompt`You are an educational content generator. Based on the following study material, create exactly 25 multiple-choice quiz questions.

Study Material:
${truncatedContent}

CRITICAL: You must return ONLY a valid JSON object with no additional text, markdown formatting, or code blocks.

The JSON must have this exact structure:
{
  "questions": [
    {
      "id": "q1",
      "question": "Clear question testing understanding",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": 0,
      "justification": "Brief 1-2 sentence explanation of why the correct answer is right"
    }
  ]
}

Rules:
- Create exactly 25 questions
- Use sequential IDs: "q1", "q2", ... "q25"
- Each question must have exactly 4 options
- correctAnswer must be 0, 1, 2, or 3 (the index of the correct option)
- Incorrect options should be plausible but clearly wrong to someone who understands the material
- Justification must be 1-2 sentences
- All strings must be properly escaped (escape quotes, newlines, etc.)
- Do NOT include any text outside the JSON object
- Do NOT wrap in markdown code blocks
- Ensure the JSON is valid and parseable`

      const quizResponse = await llmWithFallback(quizPrompt, true)
      
      const quizData = JSON.parse(quizResponse)
      
      if (!quizData.questions || !Array.isArray(quizData.questions)) {
        throw new Error('Invalid quiz format: missing or invalid questions array')
      }
      
      if (quizData.questions.length === 0) {
        throw new Error('No quiz questions were generated')
      }
      
      for (const question of quizData.questions) {
        if (!question.id || !question.question || !Array.isArray(question.options) || 
            question.correctAnswer === undefined || !question.justification) {
          throw new Error('Invalid quiz question structure: missing required fields')
        }
        if (question.options.length !== 4) {
          throw new Error('Invalid quiz question: must have exactly 4 options')
        }
        if (question.correctAnswer < 0 || question.correctAnswer > 3) {
          throw new Error('Invalid quiz question: correctAnswer must be between 0 and 3')
        }
      }

      setGenerationProgress(90)
      await new Promise((resolve) => setTimeout(resolve, 300))

      setStudyContent({
        flashcards: flashcardsData.flashcards,
        quizQuestions: quizData.questions,
      })

      setGenerationProgress(100)
      setGenerationMessage('All set!')
      await new Promise((resolve) => setTimeout(resolve, 500))

      setState('study')
    } catch (error) {
      console.error('Error generating content:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate content. Please try again.'
      setGenerationMessage(errorMessage)
      toast.error(errorMessage)
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