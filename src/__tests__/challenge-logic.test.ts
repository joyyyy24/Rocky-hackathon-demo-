import { Vector3 } from 'three'
import {
  isLineChallengeComplete,
  isPatternChallengeComplete,
  isChallengeComplete,
  PlacedCube
} from '@/lib/challenge-logic'

describe('Challenge Logic', () => {
  describe('isLineChallengeComplete', () => {
    it('returns false for less than 3 cubes', () => {
      const cubes: PlacedCube[] = [
        { id: 1, position: new Vector3(0, 0.5, 0) },
        { id: 2, position: new Vector3(1, 0.5, 0) },
      ]
      expect(isLineChallengeComplete(cubes)).toBe(false)
    })

    it('returns true for 3 cubes in a straight line', () => {
      const cubes: PlacedCube[] = [
        { id: 1, position: new Vector3(0, 0.5, 0) },
        { id: 2, position: new Vector3(1, 0.5, 0) },
        { id: 3, position: new Vector3(2, 0.5, 0) },
      ]
      expect(isLineChallengeComplete(cubes)).toBe(true)
    })

    it('returns false for scattered cubes', () => {
      const cubes: PlacedCube[] = [
        { id: 1, position: new Vector3(0, 0.5, 0) },
        { id: 2, position: new Vector3(3, 0.5, 0) }, // Too far
        { id: 3, position: new Vector3(2, 0.5, 0) },
      ]
      expect(isLineChallengeComplete(cubes)).toBe(false)
    })

    it('handles cubes in any order', () => {
      const cubes: PlacedCube[] = [
        { id: 3, position: new Vector3(2, 0.5, 0) },
        { id: 1, position: new Vector3(0, 0.5, 0) },
        { id: 2, position: new Vector3(1, 0.5, 0) },
      ]
      expect(isLineChallengeComplete(cubes)).toBe(true)
    })
  })

  describe('isPatternChallengeComplete', () => {
    it('returns false for less than 3 cubes', () => {
      const cubes: PlacedCube[] = [
        { id: 1, position: new Vector3(0, 0.5, 0) },
        { id: 2, position: new Vector3(1, 1.5, 0) },
      ]
      expect(isPatternChallengeComplete(cubes)).toBe(false)
    })

    it('returns true for alternating high-low pattern', () => {
      const cubes: PlacedCube[] = [
        { id: 1, position: new Vector3(0, 0.5, 0) },  // low
        { id: 2, position: new Vector3(1, 1.5, 0) },  // high
        { id: 3, position: new Vector3(2, 0.5, 0) },  // low
      ]
      expect(isPatternChallengeComplete(cubes)).toBe(true)
    })

    it('returns false for all same height', () => {
      const cubes: PlacedCube[] = [
        { id: 1, position: new Vector3(0, 0.5, 0) },
        { id: 2, position: new Vector3(1, 0.5, 0) },
        { id: 3, position: new Vector3(2, 0.5, 0) },
      ]
      expect(isPatternChallengeComplete(cubes)).toBe(false)
    })
  })

  describe('isChallengeComplete', () => {
    it('routes to correct validator for line challenge', () => {
      const cubes: PlacedCube[] = [
        { id: 1, position: new Vector3(0, 0.5, 0) },
        { id: 2, position: new Vector3(1, 0.5, 0) },
        { id: 3, position: new Vector3(2, 0.5, 0) },
      ]
      expect(isChallengeComplete('line_challenge', cubes)).toBe(true)
    })

    it('routes to correct validator for pattern challenge', () => {
      const cubes: PlacedCube[] = [
        { id: 1, position: new Vector3(0, 0.5, 0) },
        { id: 2, position: new Vector3(1, 1.5, 0) },
        { id: 3, position: new Vector3(2, 0.5, 0) },
      ]
      expect(isChallengeComplete('pattern_challenge', cubes)).toBe(true)
    })

    it('returns false for unknown challenge', () => {
      const cubes: PlacedCube[] = [
        { id: 1, position: new Vector3(0, 0.5, 0) },
      ]
      expect(isChallengeComplete('unknown_challenge', cubes)).toBe(false)
    })
  })
})