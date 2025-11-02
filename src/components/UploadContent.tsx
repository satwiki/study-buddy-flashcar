import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { UploadSimple, Link, Info, FileText } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface UploadContentProps {
  userName: string
  onContentUploaded: (content: string) => void
}

export function UploadContent({ userName, onContentUploaded }: UploadContentProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [url, setUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!validTypes.includes(file.type) && !file.name.endsWith('.txt') && !file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
      toast.error('Please upload a TXT, PDF, or DOCX file')
      return
    }

    setIsProcessing(true)
    setProgress(30)

    try {
      const text = await file.text()
      setProgress(70)
      
      if (text.trim().length < 100) {
        toast.error('Content is too short. Please provide at least 100 characters of study material.')
        setIsProcessing(false)
        setProgress(0)
        return
      }

      setProgress(100)
      setTimeout(() => {
        onContentUploaded(text)
      }, 300)
    } catch (error) {
      toast.error('Failed to read file. Please try again.')
      setIsProcessing(false)
      setProgress(0)
    }
  }

  const handleUrlSubmit = async () => {
    if (!url.trim()) {
      toast.error('Please enter a URL')
      return
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      toast.error('Please enter a valid URL starting with http:// or https://')
      return
    }

    setIsProcessing(true)
    setProgress(30)

    try {
      const response = await fetch(url)
      setProgress(50)
      
      if (!response.ok) {
        throw new Error('Failed to fetch content')
      }

      const html = await response.text()
      setProgress(70)
      
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      const text = doc.body.innerText || doc.body.textContent || ''
      
      if (text.trim().length < 100) {
        toast.error('Content is too short. Please provide a page with at least 100 characters.')
        setIsProcessing(false)
        setProgress(0)
        return
      }

      setProgress(100)
      setTimeout(() => {
        onContentUploaded(text)
      }, 300)
    } catch (error) {
      toast.error('Failed to load webpage. Make sure the URL is public and accessible.')
      setIsProcessing(false)
      setProgress(0)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back, {userName}! 👋</CardTitle>
          <CardDescription className="text-base">
            Upload your study materials to get started with flashcards and quizzes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="file" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="file">
                <UploadSimple className="mr-2" />
                Upload File
              </TabsTrigger>
              <TabsTrigger value="url">
                <Link className="mr-2" />
                Paste URL
              </TabsTrigger>
            </TabsList>

            <TabsContent value="file" className="space-y-4 mt-6">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-4 hover:border-primary/50 transition-colors">
                <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  <FileText size={24} className="text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Drop your file here or click to browse</p>
                  <p className="text-xs text-muted-foreground">Supports TXT, PDF, and DOCX files</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.pdf,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                >
                  <UploadSimple className="mr-2" />
                  Choose File
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="url" className="space-y-4 mt-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  The webpage must be publicly accessible (not behind a login or paywall)
                </AlertDescription>
              </Alert>
              
              <div className="space-y-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-2">
                        <label htmlFor="url" className="text-sm font-medium flex items-center gap-2">
                          Webpage URL
                          <Info size={16} className="text-muted-foreground" />
                        </label>
                        <Input
                          id="url"
                          type="url"
                          placeholder="https://example.com/article"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          disabled={isProcessing}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Make sure the webpage is public and accessible</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button
                  onClick={handleUrlSubmit}
                  className="w-full"
                  disabled={isProcessing || !url.trim()}
                >
                  Load Content
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {isProcessing && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Processing your content...</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
