import { openDB, DBSchema, IDBPDatabase } from 'idb'
import type { User, Habit, CheckIn, DailyState, Insight } from './types'

interface FlowDB extends DBSchema {
  users: {
    key: string
    value: User
  }
  habits: {
    key: string
    value: Habit
    indexes: { 'by-user': string }
  }
  checkins: {
    key: string
    value: CheckIn
    indexes: { 'by-date': string; 'by-user': string }
  }
  dailyStates: {
    key: string
    value: DailyState
    indexes: { 'by-date': string; 'by-user': string }
  }
  insights: {
    key: string
    value: Insight
    indexes: { 'by-date': string; 'by-user': string }
  }
}

const DB_NAME = 'flow-db'
const DB_VERSION = 1

let dbInstance: IDBPDatabase<FlowDB> | null = null

export async function initDB(): Promise<IDBPDatabase<FlowDB>> {
  if (dbInstance) return dbInstance

  dbInstance = await openDB<FlowDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Users store
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'id' })
      }

      // Habits store
      if (!db.objectStoreNames.contains('habits')) {
        const habitStore = db.createObjectStore('habits', { keyPath: 'id' })
        habitStore.createIndex('by-user', 'userId')
      }

      // CheckIns store
      if (!db.objectStoreNames.contains('checkins')) {
        const checkinStore = db.createObjectStore('checkins', { keyPath: 'id' })
        checkinStore.createIndex('by-date', 'date')
        checkinStore.createIndex('by-user', 'userId')
      }

      // DailyStates store
      if (!db.objectStoreNames.contains('dailyStates')) {
        const dailyStore = db.createObjectStore('dailyStates', { keyPath: 'id' })
        dailyStore.createIndex('by-date', 'date')
        dailyStore.createIndex('by-user', 'userId')
      }

      // Insights store
      if (!db.objectStoreNames.contains('insights')) {
        const insightStore = db.createObjectStore('insights', { keyPath: 'id' })
        insightStore.createIndex('by-date', 'date')
        insightStore.createIndex('by-user', 'userId')
      }
    },
  })

  return dbInstance
}

export async function getUser(): Promise<User | undefined> {
  const db = await initDB()
  return db.get('users', 'rafael')
}

export async function createUser(user: User): Promise<void> {
  const db = await initDB()
  await db.put('users', user)
}

export async function getHabits(userId: string): Promise<Habit[]> {
  const db = await initDB()
  return db.getAllFromIndex('habits', 'by-user', userId)
}

export async function createHabit(habit: Habit): Promise<void> {
  const db = await initDB()
  await db.put('habits', habit)
}

export async function getTodayState(userId: string): Promise<DailyState | undefined> {
  const db = await initDB()
  const today = new Date().toISOString().split('T')[0]
  const states = await db.getAllFromIndex('dailyStates', 'by-date', today)
  return states.find((s) => s.userId === userId)
}

export async function saveDailyState(state: DailyState): Promise<void> {
  const db = await initDB()
  await db.put('dailyStates', state)
}

export async function getDailyStates(
  userId: string,
  startDate: string,
  endDate: string
): Promise<DailyState[]> {
  const db = await initDB()
  const allStates = await db.getAllFromIndex('dailyStates', 'by-user', userId)
  return allStates.filter((s) => s.date >= startDate && s.date <= endDate)
}

export async function getCheckIns(
  userId: string,
  startDate: string,
  endDate: string
): Promise<CheckIn[]> {
  const db = await initDB()
  const allCheckIns = await db.getAllFromIndex('checkins', 'by-user', userId)
  return allCheckIns.filter((c) => c.date >= startDate && c.date <= endDate)
}

export async function saveCheckIn(checkin: CheckIn): Promise<void> {
  const db = await initDB()
  await db.put('checkins', checkin)
}

export async function getInsights(userId: string, limit = 7): Promise<Insight[]> {
  const db = await initDB()
  const insights = await db.getAllFromIndex('insights', 'by-user', userId)
  return insights.slice(-limit)
}

export async function saveInsight(insight: Insight): Promise<void> {
  const db = await initDB()
  await db.put('insights', insight)
}

export { type User, type Habit, type CheckIn, type DailyState, type Insight }
