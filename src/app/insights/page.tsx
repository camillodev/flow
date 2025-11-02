'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { getCheckIns, getHabits, getDailyStates } from '@/lib/db'
import type { CheckIn, Habit, DailyState } from '@/lib/db/types'

type TimePeriod = '7d' | '15d' | '1m' | '2m' | '6m' | '1y'

interface PeriodConfig {
  label: string
  days: number
}

const periodConfigs: Record<TimePeriod, PeriodConfig> = {
  '7d': { label: '7 dias', days: 7 },
  '15d': { label: '15 dias', days: 15 },
  '1m': { label: '1 mês', days: 30 },
  '2m': { label: '2 meses', days: 60 },
  '6m': { label: '6 meses', days: 180 },
  '1y': { label: '1 ano', days: 365 },
}

export default function InsightsPage() {
  const router = useRouter()
  const [period, setPeriod] = useState<TimePeriod>('7d')
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])
  const [dailyStates, setDailyStates] = useState<DailyState[]>([])
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [period])

  async function loadData() {
    try {
      setLoading(true)
      const days = periodConfigs[period].days
      const today = new Date()
      const startDate = new Date(today)
      startDate.setDate(today.getDate() - days)

      const start = startDate.toISOString().split('T')[0]
      const end = today.toISOString().split('T')[0]

      const [userCheckIns, userDailyStates, userHabits] = await Promise.all([
        getCheckIns('rafael', start, end),
        getDailyStates('rafael', start, end),
        getHabits('rafael'),
      ])

      setCheckIns(userCheckIns)
      setDailyStates(userDailyStates)
      setHabits(userHabits)
    } catch (error) {
      console.error('Erro ao carregar insights:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-4xl">📊</div>
      </div>
    )
  }

  // Processar dados para gráficos
  const energyCalmData = checkIns
    .filter((c) => c.type === 'morning')
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((c) => ({
      date: new Date(c.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      energia: c.energy,
      calma: c.calm,
      sono: c.sleepQuality ? c.sleepQuality * 2 : 0,
    }))

  const sleepData = checkIns
    .filter((c) => c.type === 'morning' && c.sleepQuality)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((c) => ({
      date: new Date(c.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      qualidade: c.sleepQuality,
    }))

  // Consistência de hábitos
  const habitConsistency = habits.map((habit) => {
    const completions = dailyStates.filter((ds) => ds.habitsCompleted.includes(habit.id)).length
    const total = dailyStates.length
    const percentage = total > 0 ? Math.round((completions / total) * 100) : 0
    return {
      name: habit.name,
      emoji: habit.emoji,
      percentage,
      completions,
      total,
    }
  })

  // Top 3 completion rate
  const top3Stats = dailyStates.reduce(
    (acc, ds) => {
      const completed = ds.top3Completed.filter(Boolean).length
      const total = ds.top3.length
      return {
        completed: acc.completed + completed,
        total: acc.total + total,
      }
    },
    { completed: 0, total: 0 }
  )
  const top3Rate = top3Stats.total > 0 ? Math.round((top3Stats.completed / top3Stats.total) * 100) : 0

  // Microwins ao longo do tempo
  const microwinsData = dailyStates
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((ds) => ({
      date: new Date(ds.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      microwins: ds.microwins,
    }))

  // Métricas resumidas
  const avgEnergy =
    energyCalmData.length > 0
      ? Math.round(energyCalmData.reduce((sum, d) => sum + d.energia, 0) / energyCalmData.length)
      : 0
  const avgCalm =
    energyCalmData.length > 0
      ? Math.round(energyCalmData.reduce((sum, d) => sum + d.calma, 0) / energyCalmData.length)
      : 0
  const avgSleep =
    sleepData.length > 0
      ? (sleepData.reduce((sum, d) => sum + d.qualidade, 0) / sleepData.length).toFixed(1)
      : '0'
  const totalMicrowins = dailyStates.reduce((sum, ds) => sum + ds.microwins, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <div className="text-5xl mb-4">📊</div>
          <h1 className="text-3xl font-bold text-gray-900">Insights e Evolução</h1>
          <p className="text-gray-600">Acompanhe sua jornada de consistência</p>
        </motion.div>

        {/* Period Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {(Object.keys(periodConfigs) as TimePeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                period === p
                  ? 'bg-blue-500 text-white shadow-md scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {periodConfigs[p].label}
            </button>
          ))}
        </motion.div>

        {/* Key Metrics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{avgEnergy}</div>
            <div className="text-sm text-gray-600">Energia Média</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{avgCalm}</div>
            <div className="text-sm text-gray-600">Calma Média</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{avgSleep}</div>
            <div className="text-sm text-gray-600">Sono Médio</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{totalMicrowins}</div>
            <div className="text-sm text-gray-600">Microvitórias</div>
          </div>
        </motion.div>

        {/* Energy, Calm & Sleep Trend */}
        {energyCalmData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Evolução: Energia, Calma & Sono</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={energyCalmData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" style={{ fontSize: '12px' }} />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="energia" stroke="#3B82F6" strokeWidth={2} name="Energia" />
                <Line type="monotone" dataKey="calma" stroke="#10B981" strokeWidth={2} name="Calma" />
                <Line type="monotone" dataKey="sono" stroke="#A855F7" strokeWidth={2} name="Sono" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Microwins Over Time */}
        {microwinsData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Microvitórias ao Longo do Tempo</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={microwinsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" style={{ fontSize: '12px' }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="microwins" fill="#F59E0B" name="Microvitórias" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Habit Consistency */}
        {habitConsistency.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Consistência de Hábitos</h2>
            <div className="space-y-4">
              {habitConsistency.map((habit) => (
                <div key={habit.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{habit.emoji}</span>
                      <span className="font-medium text-gray-900">{habit.name}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {habit.completions}/{habit.total} dias ({habit.percentage}%)
                    </div>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${habit.percentage}%` }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Top 3 Completion Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Taxa de Conclusão - Top 3</h2>
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <div className="text-4xl font-bold text-blue-600 mb-2">{top3Rate}%</div>
              <p className="text-sm text-gray-600">
                {top3Stats.completed} de {top3Stats.total} prioridades concluídas
              </p>
            </div>
            <div className="w-32 h-32">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="8"
                  strokeDasharray={`${(top3Rate / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Back Button */}
        <button
          onClick={() => router.push('/home')}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-2xl transition-colors"
        >
          Voltar para Home
        </button>
      </div>
    </div>
  )
}
