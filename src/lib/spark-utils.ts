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
