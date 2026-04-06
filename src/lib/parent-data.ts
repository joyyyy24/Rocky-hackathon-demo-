// Mock data service for parent viewer MVP
// This provides sample parent-child relationships and read-only access to child progress

import { User, StudentProgress, Challenge } from '@/types'
import { StudentWithProgress } from '@/lib/teacher-data'
import { mockUsers, mockChallenges, mockProgress } from '@/lib/mock-data'

export interface ParentWithChild {
  parent: User
  child: StudentWithProgress
  relationship: 'mother' | 'father' | 'guardian'
}

// Mock parent data
const mockParents = mockUsers.filter(user => user.role === 'parent')

// Mock parent-child relationships
const mockRelationships: ParentWithChild[] = [
  {
    parent: mockParents[0],
    child: {
      student: mockUsers.find(u => u.id === 'student1')!,
      progress: mockProgress.filter(p => p.studentId === 'student1'),
      lastActivity: new Date('2026-04-05T14:00:00Z'),
      totalChallenges: 2,
      completedChallenges: 1
    },
    relationship: 'mother'
  },
  {
    parent: mockParents[1],
    child: {
      student: mockUsers.find(u => u.id === 'student2')!,
      progress: mockProgress.filter(p => p.studentId === 'student2'),
      lastActivity: new Date('2026-04-05T11:30:00Z'),
      totalChallenges: 2,
      completedChallenges: 1
    },
    relationship: 'father'
  }
]

// For MVP, we'll simulate a single parent viewing their child
// In a real app, this would be based on authentication
export function getCurrentParentWithChild(): ParentWithChild {
  // Return the first relationship for demo purposes
  return mockRelationships[0]
}

export function getChildProgress(childId: string): StudentWithProgress | null {
  const relationship = mockRelationships.find(r => r.child.student.id === childId)
  return relationship?.child || null
}

export function getChallenges(): Challenge[] {
  return mockChallenges
}

export function getChildRecentActivity(childId: string, limit: number = 5): Array<{
  action: string
  challengeTitle: string
  timestamp: Date
  details?: string
}> {
  const child = getChildProgress(childId)
  if (!child) return []

  const activities = child.progress
    .filter(p => p.completedAt)
    .map(p => {
      const challenge = mockChallenges.find(c => c.id === p.challengeId)
      return {
        action: 'completed',
        challengeTitle: challenge?.title || 'Unknown Challenge',
        timestamp: p.completedAt!,
        details: p.score ? `Score: ${p.score}%` : undefined
      }
    })
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit)

  return activities
}