import { User, Habit } from './types'
import { createUser, createHabit } from './index'

export async function seedRafael(): Promise<void> {
  const user: User = {
    id: 'rafael',
    name: 'Rafael Camillo',
    createdAt: new Date().toISOString(),
    preferences: {
      notificationsEnabled: true,
      darkMode: false,
    },
  }

  await createUser(user)

  const habits: Habit[] = [
    {
      id: 'habit-1',
      userId: 'rafael',
      name: 'Meditação matinal',
      emoji: '🧘',
      frequency: 'daily',
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'habit-2',
      userId: 'rafael',
      name: 'Caminhada',
      emoji: '🚶',
      frequency: 'daily',
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'habit-3',
      userId: 'rafael',
      name: 'Journaling',
      emoji: '📝',
      frequency: 'daily',
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'habit-4',
      userId: 'rafael',
      name: 'Ler 20min',
      emoji: '📚',
      frequency: 'daily',
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'habit-5',
      userId: 'rafael',
      name: 'Exercício físico',
      emoji: '💪',
      frequency: 'weekly',
      weekDays: [1, 3, 5], // segunda, quarta, sexta
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'habit-6',
      userId: 'rafael',
      name: 'Terapia',
      emoji: '💬',
      frequency: 'weekly',
      weekDays: [2], // terça
      active: true,
      createdAt: new Date().toISOString(),
    },
  ]

  for (const habit of habits) {
    await createHabit(habit)
  }
}
