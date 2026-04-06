// Shared types and interfaces for the Rocky MVP

export type UserRole = 'student' | 'teacher' | 'parent'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  // Additional fields based on role
  studentId?: string // for parents to link to child
}

export interface Challenge {
  id: string
  title: string
  description: string
  subject: 'science' | 'history' | 'maths' | 'arts'
  difficulty: 'easy' | 'medium' | 'hard'
  regionId: string
  createdBy: string // teacher id
  assignedTo?: string[] // student ids
}

export interface WorldRegion {
  id: string
  name: string
  subject: 'science' | 'history' | 'maths' | 'arts'
  description: string
  position: { x: number; y: number; z: number }
  challenges: string[] // challenge ids
}

export interface StudentProgress {
  studentId: string
  challengeId: string
  status: 'not-started' | 'in-progress' | 'completed'
  score?: number
  completedAt?: Date
}

export interface AIConversation {
  id: string
  studentId: string
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>
}

// Placeholder for 3D scene types
export interface SceneObject {
  id: string
  type: 'building' | 'npc' | 'item'
  position: { x: number; y: number; z: number }
  rotation?: { x: number; y: number; z: number }
  scale?: { x: number; y: number; z: number }
}

export interface PlayerState {
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  inventory: string[] // item ids
  currentRegion: string
}