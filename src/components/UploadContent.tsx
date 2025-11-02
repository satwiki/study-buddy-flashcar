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
  const [urls, setUrls] = useState<string[]>(['', '', '', '', ''])
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
    const validUrls = urls.filter(url => url.trim() !== '')
    
    if (validUrls.length === 0) {
      toast.error('Please enter at least one URL')
      return
    }

    const invalidUrls = validUrls.filter(url => !url.startsWith('http://') && !url.startsWith('https://'))
    if (invalidUrls.length > 0) {
      toast.error('Please enter valid URLs starting with http:// or https://')
      return
    }

    setIsProcessing(true)
    setProgress(10)

    try {
      const allContent: string[] = []
      const progressStep = 80 / validUrls.length

      for (let i = 0; i < validUrls.length; i++) {
        const url = validUrls[i]
        try {
          const response = await fetch(url)
          
          if (!response.ok) {
            toast.error(`Failed to fetch content from URL ${i + 1}`)
            continue
          }

          const html = await response.text()
          const parser = new DOMParser()
          const doc = parser.parseFromString(html, 'text/html')
          const text = doc.body.innerText || doc.body.textContent || ''
          
          if (text.trim().length >= 100) {
            allContent.push(text)
          } else {
            toast.error(`Content from URL ${i + 1} is too short`)
          }

          setProgress(10 + progressStep * (i + 1))
        } catch (error) {
          toast.error(`Failed to load URL ${i + 1}`)
        }
      }

      if (allContent.length === 0) {
        toast.error('No valid content could be extracted from the URLs')
        setIsProcessing(false)
        setProgress(0)
        return
      }

      const combinedContent = allContent.join('\n\n---\n\n')
      
      setProgress(100)
      setTimeout(() => {
        onContentUploaded(combinedContent)
      }, 300)
    } catch (error) {
      toast.error('Failed to load webpages. Make sure the URLs are public and accessible.')
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
          <Tabs defaultValue="url" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">
                <Link className="mr-2" />
                Paste URL
              </TabsTrigger>
              <TabsTrigger value="file">
                <UploadSimple className="mr-2" />
                Upload File
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4 mt-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Add up to 5 URLs. Webpages must be publicly accessible (not behind a login or paywall)
                </AlertDescription>
              </Alert>
              
              <div className="space-y-3">
                {urls.map((url, index) => (
                  <div key={index} className="space-y-2">
                    <label htmlFor={`url-${index}`} className="text-sm font-medium">
                      {index === 0 ? 'Webpage URL (required)' : `Webpage URL ${index + 1} (optional)`}
                    </label>
                    <Input
                      id={`url-${index}`}
                      type="url"
                      placeholder="https://example.com/article"
                      value={url}
                      onChange={(e) => {
                        const newUrls = [...urls]
                        newUrls[index] = e.target.value
                        setUrls(newUrls)
                      }}
                      disabled={isProcessing}
                    />
                  </div>
                ))}

                <Button
                  onClick={handleUrlSubmit}
                  className="w-full"
                  disabled={isProcessing || urls[0].trim() === ''}
                >
                  Load Content
                </Button>
              </div>
            </TabsContent>

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
