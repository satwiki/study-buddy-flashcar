import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Sparkle } from '@phosphor-icons/react'

interface LoadingGenerationProps {
  progress: number
  message: string
}

export function LoadingGeneration({ progress, message }: LoadingGenerationProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center animate-pulse">
            <Sparkle size={32} weight="duotone" className="text-accent" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">Generating Study Materials</CardTitle>
            <CardDescription className="text-base">{message}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-center text-sm text-muted-foreground">{progress}%</p>
        </CardContent>
      </Card>
    </div>
  )
}
