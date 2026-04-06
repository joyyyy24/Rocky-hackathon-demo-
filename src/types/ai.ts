// AI companion types and interfaces

export type AIResponseType = 'greeting' | 'encouragement' | 'question' | 'hint' | 'celebration'

export interface AIContext {
  action?: string // e.g., 'placed_cube', 'completed_challenge'
  progress?: number // 0-1 progress indicator
  challengeId?: string
  region?: string
  timeSpent?: number // seconds
}

export interface AIResponse {
  type: AIResponseType
  message: string
  context: AIContext
  timestamp: Date
}

export interface AIService {
  generateResponse(context: AIContext): Promise<AIResponse>
  getRecentResponses(limit?: number): AIResponse[]
}