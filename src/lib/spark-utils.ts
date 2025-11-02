export function llmPrompt(strings: TemplateStringsArray, ...values: any[]): string {
  let result = ''
  for (let i = 0; i < strings.length; i++) {
    result += strings[i]
    if (i < values.length) {
      result += values[i]
    }
  }
  return result
}

export function llm(prompt: string, modelName?: string, jsonMode?: boolean): Promise<string> {
  return window.spark.llm(prompt, modelName, jsonMode)
}

const MODEL_FALLBACK_CHAIN = ['gpt-4o-mini', 'gpt-4o'] as const

type ModelName = typeof MODEL_FALLBACK_CHAIN[number]

function isTokenLimitError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    return (
      message.includes('token') && 
      (message.includes('limit') || message.includes('exceeded') || message.includes('maximum'))
    )
  }
  return false
}

export async function llmWithFallback(
  prompt: string,
  jsonMode: boolean = false,
  models: ModelName[] = [...MODEL_FALLBACK_CHAIN]
): Promise<string> {
  let lastError: Error | null = null
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i]
    const isLastModel = i === models.length - 1
    
    try {
      const result = await llm(prompt, model, jsonMode)
      return result
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      
      if (isTokenLimitError(error) && !isLastModel) {
        console.warn(`Model ${model} hit token limit, falling back to ${models[i + 1]}...`)
        continue
      }
      
      if (isLastModel) {
        throw lastError
      }
      
      throw error
    }
  }
  
  throw lastError || new Error('All models failed')
}
