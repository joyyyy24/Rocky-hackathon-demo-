// AI Companion Service - Mock implementation for MVP
// This can be easily replaced with real AI API calls later

import { AIContext, AIResponse, AIResponseType, AIService } from '@/types/ai'

// Response templates for different scenarios
const RESPONSE_TEMPLATES = {
  celebration: [
    "Fantastic work! You did it!",
    "Amazing! You're a building expert!",
    "Wonderful! What did you learn from this?",
    "Great job! How does it feel to complete the challenge?"
  ],
  encouragement: [
    "You're doing great! Keep exploring.",
    "Every try teaches you something new.",
    "I believe in you! Try different approaches.",
    "Building takes patience. You're getting better!"
  ],
  question: [
    "What do you think comes next?",
    "How does this make you feel?",
    "What would you change about your design?",
    "Can you tell me about your creation?"
  ],
  greeting: [
    "Let's build something amazing! What do you think we should create?",
    "Welcome to the building world! Ready to start creating?",
    "I'm excited to see what you'll build today!"
  ]
} as const

class MockAIService implements AIService {
  private responses: AIResponse[] = []

  async generateResponse(context: AIContext): Promise<AIResponse> {
    const response = this.createMockResponse(context)
    // Validate response before storing
    if (validateResponse(response)) {
      this.responses.push(response)
      return response
    }
    // Fallback to safe response if validation fails
    return this.createFallbackResponse(context)
  }

  getRecentResponses(limit: number = 5): AIResponse[] {
    return this.responses.slice(-limit)
  }

  private createMockResponse(context: AIContext): AIResponse {
    const baseResponse: Omit<AIResponse, 'type' | 'message'> = {
      context,
      timestamp: new Date()
    }

    // Rule-based response generation
    if (context.action === 'completed_challenge') {
      return {
        ...baseResponse,
        type: 'celebration',
        message: this.getRandomMessage('celebration')
      }
    }

    if (context.action === 'placed_cube') {
      const progress = context.progress || 0
      if (progress >= 1) {
        return {
          ...baseResponse,
          type: 'celebration',
          message: this.getRandomMessage('celebration')
        }
      }
      if (progress >= 0.5) {
        return {
          ...baseResponse,
          type: 'encouragement',
          message: "You're almost there! Keep going!"
        }
      }
      return {
        ...baseResponse,
        type: 'question',
        message: this.getRandomMessage('question')
      }
    }

    if (context.action === 'started_challenge') {
      return {
        ...baseResponse,
        type: 'greeting',
        message: this.getRandomMessage('greeting')
      }
    }

    // Default fallback
    return {
      ...baseResponse,
      type: 'encouragement',
      message: this.getRandomMessage('encouragement')
    }
  }

  private createFallbackResponse(context: AIContext): AIResponse {
    return {
      type: 'encouragement',
      message: "You're doing great! Keep exploring.",
      context,
      timestamp: new Date()
    }
  }

  private getRandomMessage(type: keyof typeof RESPONSE_TEMPLATES): string {
    const messages = RESPONSE_TEMPLATES[type]
    return messages[Math.floor(Math.random() * messages.length)]
  }
}

// Safety guardrails for child-friendly content
export function validateResponse(response: AIResponse): boolean {
  const message = response.message.toLowerCase()

  // No direct answers or spoilers
  const forbiddenWords = ['answer', 'solution', 'correct', 'wrong', 'fail']
  if (forbiddenWords.some(word => message.includes(word))) {
    return false
  }

  // Keep messages short (under 100 characters)
  if (message.length > 100) {
    return false
  }

  // Must end with question mark for questions, or be positive
  if (response.type === 'question' && !message.includes('?')) {
    return false
  }

  return true
}

// Export singleton instance
export const aiService = new MockAIService()