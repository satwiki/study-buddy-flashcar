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

CRITICAL INSTRUCTIONS:
1. Return ONLY a valid JSON object
2. Do NOT add any text before or after the JSON
3. Do NOT use markdown code blocks or formatting
4. Start your response with { and end with }
5. Ensure all strings are properly escaped
6. Use double quotes for all keys and string values
7. Do not use any control characters or unescaped newlines in strings

Required JSON structure:
{
  "flashcards": [
    {"id": "fc1", "question": "Question text here", "answer": "Answer text here"},
    {"id": "fc2", "question": "Question text here", "answer": "Answer text here"}
  ]
}

Requirements:
- Create exactly 25 flashcards (fc1 through fc25)
- Questions: Clear and concise, testing key concepts
- Answers: Complete but brief (2-3 sentences max)
- Escape all special characters properly (quotes, newlines, etc.)
- Make sure the JSON is complete and valid`

      const flashcardsResponse = await llmWithFallback(flashcardsPrompt, true)
      
      let flashcardsData
      try {
        flashcardsData = JSON.parse(flashcardsResponse)
      } catch (parseError) {
        console.error('Failed to parse flashcards JSON:', flashcardsResponse)
        throw new Error(`Failed to parse flashcards: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`)
      }
      
      if (!flashcardsData.flashcards || !Array.isArray(flashcardsData.flashcards)) {
        console.error('Invalid flashcards structure:', flashcardsData)
        throw new Error('Invalid flashcards format: missing or invalid flashcards array')
      }
      
      if (flashcardsData.flashcards.length === 0) {
        throw new Error('No flashcards were generated')
      }
      
      for (const card of flashcardsData.flashcards) {
        if (!card.id || !card.question || !card.answer) {
          console.error('Invalid flashcard:', card)
          throw new Error('Invalid flashcard structure: missing required fields')
        }
      }

      setGenerationMessage('Creating quiz questions...')
      setGenerationProgress(70)

      const quizPrompt = llmPrompt`You are an educational content generator. Based on the following study material, create exactly 25 multiple-choice quiz questions.

Study Material:
${truncatedContent}

CRITICAL INSTRUCTIONS:
1. Return ONLY a valid JSON object
2. Do NOT add any text before or after the JSON
3. Do NOT use markdown code blocks or formatting
4. Start your response with { and end with }
5. Ensure all strings are properly escaped
6. Use double quotes for all keys and string values
7. Do not use any control characters or unescaped newlines in strings

Required JSON structure:
{
  "questions": [
    {
      "id": "q1",
      "question": "Question text here",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": 0,
      "justification": "Explanation text here"
    }
  ]
}

Requirements:
- Create exactly 25 questions (q1 through q25)
- Each question has exactly 4 options
- correctAnswer is 0, 1, 2, or 3 (index of correct option)
- Incorrect options should be plausible distractors
- Justification: 1-2 sentences explaining the correct answer
- Escape all special characters properly (quotes, newlines, etc.)
- Make sure the JSON is complete and valid`

      const quizResponse = await llmWithFallback(quizPrompt, true)
      
      let quizData
      try {
        quizData = JSON.parse(quizResponse)
      } catch (parseError) {
        console.error('Failed to parse quiz JSON:', quizResponse)
        throw new Error(`Failed to parse quiz questions: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`)
      }
      
      if (!quizData.questions || !Array.isArray(quizData.questions)) {
        console.error('Invalid quiz structure:', quizData)
        throw new Error('Invalid quiz format: missing or invalid questions array')
      }
      
      if (quizData.questions.length === 0) {
        throw new Error('No quiz questions were generated')
      }
      
      for (const question of quizData.questions) {
        if (!question.id || !question.question || !Array.isArray(question.options) || 
            question.correctAnswer === undefined || !question.justification) {
          console.error('Invalid quiz question:', question)
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