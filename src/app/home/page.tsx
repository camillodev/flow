'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { getTodayState, getHabits, saveDailyState } from '@/lib/db'
import { getModeConfig } from '@/lib/utils/day-mode'
import { getRandomEmpatheticMessage } from '@/lib/utils/empathic-messages'
import type { DailyState, Habit } from '@/lib/db/types'

export default function HomePage() {
  const router = useRouter()
  const [dailyState, setDailyState] = useState<DailyState | null>(null)
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [empatheticMessage, setEmpatheticMessage] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const state = await getTodayState('rafael')
      if (!state) {
        router.push('/checkin/morning')
        return
      }

      const userHabits = await getHabits('rafael')
      const today = new Date().getDay()

      // Filtrar hábitos ativos para hoje
      const todayHabits = userHabits.filter((h) => {
        if (!h.active) return false
        if (h.frequency === 'daily') return true
        if (h.frequency === 'weekly' && h.weekDays) {
          return h.weekDays.includes(today)
        }
        return false
      })

      setDailyState(state)
      setHabits(todayHabits)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  function showEmpatheticMessage() {
    const message = getRandomEmpatheticMessage()
    setEmpatheticMessage(message)
    setTimeout(() => setEmpatheticMessage(null), 3000)
  }

  async function toggleTop3(index: number) {
    if (!dailyState) return

    const wasCompleted = dailyState.top3Completed[index]
    const newCompleted = [...dailyState.top3Completed]
    newCompleted[index] = !newCompleted[index]

    const updatedState = {
      ...dailyState,
      top3Completed: newCompleted,
      microwins: dailyState.microwins + (newCompleted[index] ? 1 : -1),
      updatedAt: new Date().toISOString(),
    }

    await saveDailyState(updatedState)
    setDailyState(updatedState)

    // Mostrar mensagem empática ao completar (não ao descompletar)
    if (!wasCompleted && newCompleted[index]) {
      showEmpatheticMessage()
    }
  }

  async function toggleHabit(habitId: string) {
    if (!dailyState) return

    const wasCompleted = dailyState.habitsCompleted.includes(habitId)
    const newHabits = wasCompleted
      ? dailyState.habitsCompleted.filter((id) => id !== habitId)
      : [...dailyState.habitsCompleted, habitId]

    const updatedState = {
      ...dailyState,
      habitsCompleted: newHabits,
      microwins: dailyState.microwins + (wasCompleted ? -1 : 1),
      updatedAt: new Date().toISOString(),
    }

    await saveDailyState(updatedState)
    setDailyState(updatedState)

    // Mostrar mensagem empática ao completar (não ao descompletar)
    if (!wasCompleted) {
      showEmpatheticMessage()
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-4xl">🌊</div>
      </div>
    )
  }

  if (!dailyState) return null

  const modeConfig = getModeConfig(dailyState.mode)
  const totalTasks = dailyState.top3.length + habits.length
  const completedTasks = dailyState.top3Completed.filter(Boolean).length + dailyState.habitsCompleted.length
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6 py-8">
        {/* Header com Modo do Dia */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mode-${modeConfig.color} rounded-2xl shadow-sm p-6`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{modeConfig.emoji}</span>
              <div>
                <h1 className="text-2xl font-bold">Modo {modeConfig.label}</h1>
                <p className="text-sm opacity-80">{modeConfig.description}</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{dailyState.microwins}</div>
              <div className="text-xs opacity-80">microvitórias</div>
            </div>
          </div>

          {/* Barra de Progresso */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso do dia</span>
              <span className="font-semibold">{progress}%</span>
            </div>
            <div className="h-3 bg-white/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-current rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Top 3 Prioridades */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm p-6 space-y-4"
        >
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>🎯</span>
            Top 3 Prioridades
          </h2>

          <div className="space-y-3">
            {dailyState.top3.map((task, index) => (
              <button
                key={index}
                onClick={() => toggleTop3(index)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  dailyState.top3Completed[index]
                    ? 'bg-green-50 border-green-500 line-through opacity-60'
                    : 'bg-white border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      dailyState.top3Completed[index]
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300'
                    }`}
                  >
                    {dailyState.top3Completed[index] && '✓'}
                  </div>
                  <span className="flex-1">{task}</span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Hábitos do Dia */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm p-6 space-y-4"
        >
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>🌱</span>
            Hábitos de Hoje
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {habits.map((habit) => (
              <button
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  dailyState.habitsCompleted.includes(habit.id)
                    ? 'bg-green-50 border-green-500'
                    : 'bg-white border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="text-3xl mb-2">{habit.emoji}</div>
                <div className="text-sm font-medium">{habit.name}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Navegação dos Macroprocessos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-4"
        >
          <button
            onClick={() => router.push('/focus')}
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-900 p-6 rounded-2xl shadow-sm transition-colors text-center"
          >
            <div className="text-3xl mb-2">⚙️</div>
            <div className="font-semibold">Foco</div>
          </button>

          <button
            onClick={() => router.push('/decompress')}
            className="bg-orange-100 hover:bg-orange-200 text-orange-900 p-6 rounded-2xl shadow-sm transition-colors text-center"
          >
            <div className="text-3xl mb-2">🌇</div>
            <div className="font-semibold">Desligar</div>
          </button>

          <button
            onClick={() => router.push('/relax')}
            className="bg-purple-100 hover:bg-purple-200 text-purple-900 p-6 rounded-2xl shadow-sm transition-colors text-center"
          >
            <div className="text-3xl mb-2">🌙</div>
            <div className="font-semibold">Relaxar</div>
          </button>

          <button
            onClick={() => router.push('/insights')}
            className="bg-blue-100 hover:bg-blue-200 text-blue-900 p-6 rounded-2xl shadow-sm transition-colors text-center"
          >
            <div className="text-3xl mb-2">📊</div>
            <div className="font-semibold">Insights</div>
          </button>
        </motion.div>
      </div>
    </div>
  )
}
