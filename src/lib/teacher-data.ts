// Mock data service for teacher dashboard MVP
// This provides sample student data and progress for demonstration

import { User, StudentProgress, Challenge } from '@/types'
import { mockUsers, mockChallenges, mockProgress } from '@/lib/mock-data'

export interface StudentWithProgress {
  student: User
  progress: StudentProgress[]
  lastActivity: Date
  totalChallenges: number
  completedChallenges: number
}

export interface ClassSummary {
  totalStudents: number
  activeStudents: number
  totalChallenges: number
  completedChallenges: number
  averageProgress: number
}

// Filter to get only students
const mockStudents = mockUsers.filter(user => user.role === 'student')

// Generate student data with progress
export function getStudentsWithProgress(): StudentWithProgress[] {
  return mockStudents.map(student => {
    const progress = mockProgress.filter(p => p.studentId === student.id)
    const completedChallenges = progress.filter(p => p.status === 'completed').length
    const totalChallenges = mockChallenges.length
    const lastActivity = progress.length > 0
      ? new Date(Math.max(...progress.map(p => p.completedAt?.getTime() || 0)))
      : new Date()

    return {
      student,
      progress,
      lastActivity,
      totalChallenges,
      completedChallenges
    }
  })
}

export function getClassSummary(): ClassSummary {
  const students = getStudentsWithProgress()
  const totalStudents = students.length
  const activeStudents = students.filter(s => s.progress.length > 0).length
  const totalChallenges = students.reduce((sum, s) => sum + s.totalChallenges, 0)
  const completedChallenges = students.reduce((sum, s) => sum + s.completedChallenges, 0)
  const averageProgress = totalChallenges > 0 ? (completedChallenges / totalChallenges) * 100 : 0

  return {
    totalStudents,
    activeStudents,
    totalChallenges,
    completedChallenges,
    averageProgress
  }
}

export function getChallenges(): Challenge[] {
  return mockChallenges
}

export function getRecentActivity(limit: number = 10): Array<{
  studentName: string
  action: string
  timestamp: Date
  challengeTitle: string
}> {
  const activities = mockProgress
    .filter(p => p.completedAt)
    .map(p => {
      const student = mockStudents.find(s => s.id === p.studentId)
      const challenge = mockChallenges.find(c => c.id === p.challengeId)
      return {
        studentName: student?.name || 'Unknown Student',
        action: 'completed',
        timestamp: p.completedAt!,
        challengeTitle: challenge?.title || 'Unknown Challenge'
      }
    })
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit)

  return activities
}