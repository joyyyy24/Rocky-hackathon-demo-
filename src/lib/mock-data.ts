// Shared mock data for MVP
// Centralizes all mock data to avoid duplication between services

import { User, Challenge, StudentProgress } from '@/types'

// Mock users
export const mockUsers: User[] = [
  {
    id: 'student1',
    name: 'Ava',
    email: 'alice@example.com',
    role: 'student'
  },
  {
    id: 'student2',
    name: 'Leo',
    email: 'bob@example.com',
    role: 'student'
  },
  {
    id: 'student3',
    name: 'Mia',
    email: 'charlie@example.com',
    role: 'student'
  },
  {
    id: 'student4',
    name: 'Noah',
    email: 'diana@example.com',
    role: 'student'
  },
  {
    id: 'student5',
    name: 'Sophia',
    email: 'eve@example.com',
    role: 'student'
  },
  {
    id: 'teacher1',
    name: 'Dr. Smith',
    email: 'teacher@example.com',
    role: 'teacher'
  }
]

// Mock challenges
export const mockChallenges: Challenge[] = [
  {
    id: 'line_challenge',
    title: 'Build a Line',
    description: 'Place 3 cubes in a straight line',
    subject: 'maths',
    difficulty: 'easy',
    regionId: 'math_region',
    createdBy: 'teacher1'
  },
  {
    id: 'pattern_challenge',
    title: 'Create a Pattern',
    description: 'Build a simple repeating pattern',
    subject: 'arts',
    difficulty: 'medium',
    regionId: 'art_region',
    createdBy: 'teacher1'
  }
]

// Mock progress data
export const mockProgress: StudentProgress[] = [
  {
    studentId: 'student1',
    challengeId: 'line_challenge',
    status: 'completed',
    score: 100,
    completedAt: new Date('2026-04-05T10:00:00Z')
  },
  {
    studentId: 'student1',
    challengeId: 'pattern_challenge',
    status: 'in-progress',
    score: undefined,
    completedAt: undefined
  },
  {
    studentId: 'student2',
    challengeId: 'line_challenge',
    status: 'completed',
    score: 95,
    completedAt: new Date('2026-04-05T11:30:00Z')
  },
  {
    studentId: 'student3',
    challengeId: 'line_challenge',
    status: 'not-started',
    score: undefined,
    completedAt: undefined
  },
  {
    studentId: 'student4',
    challengeId: 'line_challenge',
    status: 'completed',
    score: 100,
    completedAt: new Date('2026-04-05T09:15:00Z')
  },
  {
    studentId: 'student4',
    challengeId: 'pattern_challenge',
    status: 'completed',
    score: 90,
    completedAt: new Date('2026-04-05T14:20:00Z')
  },
  {
    studentId: 'student5',
    challengeId: 'line_challenge',
    status: 'in-progress',
    score: undefined,
    completedAt: undefined
  }
]