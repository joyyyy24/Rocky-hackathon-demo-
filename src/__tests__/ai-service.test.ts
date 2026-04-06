import { validateResponse } from '@/lib/ai-service'
import { AIResponse, AIContext } from '@/types/ai'

describe('AI Service Validation', () => {
  const mockContext: AIContext = {
    action: 'placed_cube',
    progress: 0.5,
  }

  describe('validateResponse', () => {
    it('accepts valid celebration messages', () => {
      const response: AIResponse = {
        type: 'celebration',
        message: 'Fantastic work! You did it!',
        context: mockContext,
        timestamp: new Date(),
      }
      expect(validateResponse(response)).toBe(true)
    })

    it('accepts valid question messages with question marks', () => {
      const response: AIResponse = {
        type: 'question',
        message: 'What do you think comes next?',
        context: mockContext,
        timestamp: new Date(),
      }
      expect(validateResponse(response)).toBe(true)
    })

    it('rejects question messages without question marks', () => {
      const response: AIResponse = {
        type: 'question',
        message: 'What do you think comes next',
        context: mockContext,
        timestamp: new Date(),
      }
      expect(validateResponse(response)).toBe(false)
    })

    it('rejects messages with forbidden words', () => {
      const forbiddenWords = ['answer', 'solution', 'correct', 'wrong', 'fail']

      forbiddenWords.forEach(word => {
        const response: AIResponse = {
          type: 'encouragement',
          message: `You got it ${word}!`,
          context: mockContext,
          timestamp: new Date(),
        }
        expect(validateResponse(response)).toBe(false)
      })
    })

    it('rejects messages that are too long', () => {
      const longMessage = 'A'.repeat(101) // 101 characters
      const response: AIResponse = {
        type: 'encouragement',
        message: longMessage,
        context: mockContext,
        timestamp: new Date(),
      }
      expect(validateResponse(response)).toBe(false)
    })

    it('accepts messages at the length limit', () => {
      const maxMessage = 'A'.repeat(100) // Exactly 100 characters
      const response: AIResponse = {
        type: 'encouragement',
        message: maxMessage,
        context: mockContext,
        timestamp: new Date(),
      }
      expect(validateResponse(response)).toBe(true)
    })
  })
})