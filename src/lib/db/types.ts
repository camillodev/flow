export type DayMode = 'calm' | 'focus' | 'connect' | 'recover'

export type CheckInType = 'morning' | 'evening'

export interface User {
  id: string
  name: string
  createdAt: string
  preferences: {
    notificationsEnabled: boolean
    darkMode: boolean
  }
}

export interface Habit {
  id: string
  userId: string
  name: string
  emoji: string
  frequency: 'daily' | 'weekly'
  weekDays?: number[] // 0-6 (domingo a sábado)
  active: boolean
  createdAt: string
}

export interface CheckIn {
  id: string
  userId: string
  date: string // YYYY-MM-DD
  type: CheckInType
  emotion: string // emoji
  energy: number // 0-10
  calm: number // 0-10
  sleepQuality?: number // 1-5
  journaling?: string
  timestamp: string
}

export interface DailyState {
  id: string
  userId: string
  date: string // YYYY-MM-DD
  mode: DayMode
  top3: string[]
  top3Completed: boolean[]
  habitsCompleted: string[] // habit IDs
  microwins: number
  relaxActivity?: string
  createdAt: string
  updatedAt: string
}

export interface Insight {
  id: string
  userId: string
  date: string // YYYY-MM-DD
  type: 'daily' | 'weekly'
  content: string
  metrics: {
    avgEnergy: number
    avgCalm: number
    habitStreak: number
    microwins: number
  }
  createdAt: string
}
