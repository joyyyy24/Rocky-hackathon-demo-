import { Vector3 } from 'three'

/**
 * Challenge validation utilities
 * Separated from UI components for testability and maintainability
 */

export interface PlacedCube {
  id: number
  position: Vector3
}

/**
 * Validates if three cubes form a straight line
 * Used for the "Build a Line" challenge
 */
export function isLineChallengeComplete(cubes: PlacedCube[]): boolean {
  if (cubes.length !== 3) return false

  // Sort by x position to check alignment
  const sortedByX = [...cubes].sort((a, b) => a.position.x - b.position.x)

  // Check if cubes are aligned on x-axis (within tolerance)
  const TOLERANCE = 1.5
  const diff1 = Math.abs(sortedByX[1].position.x - sortedByX[0].position.x)
  const diff2 = Math.abs(sortedByX[2].position.x - sortedByX[1].position.x)

  return diff1 < TOLERANCE && diff2 < TOLERANCE
}

/**
 * Validates if cubes form a simple repeating pattern
 * Used for the "Create a Pattern" challenge
 */
export function isPatternChallengeComplete(cubes: PlacedCube[]): boolean {
  if (cubes.length < 3) return false

  // Simple pattern: alternating high/low or left/right
  // This is a placeholder - real pattern detection would be more complex
  const sortedByX = [...cubes].sort((a, b) => a.position.x - b.position.x)

  // Check for simple alternating pattern (e.g., high-low-high)
  let isAlternating = true
  for (let i = 1; i < sortedByX.length - 1; i++) {
    const prev = sortedByX[i - 1].position.y
    const current = sortedByX[i].position.y
    const next = sortedByX[i + 1].position.y

    // Simple check: each position should be different from neighbors
    if (Math.abs(current - prev) < 0.1 && Math.abs(current - next) < 0.1) {
      isAlternating = false
      break
    }
  }

  return isAlternating
}

/**
 * Generic challenge completion checker
 */
export function isChallengeComplete(challengeId: string, cubes: PlacedCube[]): boolean {
  switch (challengeId) {
    case 'line_challenge':
      return isLineChallengeComplete(cubes)
    case 'pattern_challenge':
      return isPatternChallengeComplete(cubes)
    default:
      return false
  }
}