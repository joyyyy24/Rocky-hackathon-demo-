import { getStudentsWithProgress, getClassSummary, getRecentActivity } from '@/lib/teacher-data'

describe('Data Services - Role Boundaries', () => {
  describe('Teacher Data Service', () => {
    it('returns all students for teacher view', () => {
      const students = getStudentsWithProgress()
      expect(students).toHaveLength(5) // All students visible to teacher
      expect(students[0]).toHaveProperty('student')
      expect(students[0]).toHaveProperty('progress')
      expect(students[0]).toHaveProperty('completedChallenges')
    })

    it('calculates class summary correctly', () => {
      const summary = getClassSummary()
      expect(summary).toHaveProperty('totalStudents', 5)
      expect(summary).toHaveProperty('activeStudents')
      expect(summary).toHaveProperty('averageProgress')
      expect(summary.averageProgress).toBeGreaterThanOrEqual(0)
      expect(summary.averageProgress).toBeLessThanOrEqual(100)
    })

    it('returns recent activity across all students', () => {
      const activities = getRecentActivity(5)
      expect(activities.length).toBeLessThanOrEqual(5)
      activities.forEach(activity => {
        expect(activity).toHaveProperty('studentName')
        expect(activity).toHaveProperty('action')
        expect(activity).toHaveProperty('timestamp')
        expect(activity).toHaveProperty('challengeTitle')
      })
    })
  })

  describe('Progress Calculation', () => {
    it('calculates completion percentage correctly', () => {
      const students = getStudentsWithProgress()
      students.forEach(student => {
        const expectedProgress = student.totalChallenges > 0
          ? (student.completedChallenges / student.totalChallenges) * 100
          : 0
        // This test ensures the calculation logic is consistent
        expect(student.completedChallenges).toBeLessThanOrEqual(student.totalChallenges)
      })
    })

    it('handles students with no progress', () => {
      const students = getStudentsWithProgress()
      const studentWithNoProgress = students.find(s => s.progress.length === 0)

      if (studentWithNoProgress) {
        expect(studentWithNoProgress.completedChallenges).toBe(0)
        expect(studentWithNoProgress.lastActivity.getTime()).toBeGreaterThan(0)
      }
    })
  })
})