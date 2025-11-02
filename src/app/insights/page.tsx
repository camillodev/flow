'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { getCheckIns, getInsights, getHabits, getTodayState } from '@/lib/db'
import type { CheckIn, Insight } from '@/lib/db/types'

export default function InsightsPage() {
  const router = useRouter()
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      // Últimos 7 dias
      const today = new Date()
      const sevenDaysAgo = new Date(today)
      sevenDaysAgo.setDate(today.getDate() - 7)

      const startDate = sevenDaysAgo.toISOString().split('T')[0]
      const endDate = today.toISOString().split('T')[0]

      const userCheckIns = await getCheckIns('rafael', startDate, endDate)
      const userInsights = await getInsights('rafael', 7)

      setCheckIns(userCheckIns)
      setInsights(userInsights)
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

  // Agrupar check-ins por data
  const checkInsByDate = checkIns.reduce(
    (acc, checkIn) => {
      if (!acc[checkIn.date]) {
        acc[checkIn.date] = { morning: null, evening: null }
      }
      if (checkIn.type === 'morning') {
        acc[checkIn.date].morning = checkIn
      } else {
        acc[checkIn.date].evening = checkIn
      }
      return acc
    },
    {} as Record<string, { morning: CheckIn | null; evening: CheckIn | null }>
  )

  const dates = Object.keys(checkInsByDate).sort().slice(-7)

  // Calcular métricas
  const avgEnergy =
    checkIns.length > 0
      ? Math.round(checkIns.reduce((sum, c) => sum + c.energy, 0) / checkIns.length)
      : 0

  const avgCalm =
    checkIns.length > 0
      ? Math.round(checkIns.reduce((sum, c) => sum + c.calm, 0) / checkIns.length)
      : 0

  const totalMicrowins = insights.reduce((sum, i) => sum + i.metrics.microwins, 0)

  // Palavras mais frequentes no journaling
  const journalingTexts = checkIns.filter((c) => c.journaling).map((c) => c.journaling!)
  const words = journalingTexts
    .join(' ')
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 4)

  const wordFrequency = words.reduce(
    (acc, word) => {
      acc[word] = (acc[word] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const topWords = Object.entries(wordFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <div className="text-5xl mb-4">📊</div>
          <h1 className="text-3xl font-bold text-gray-900">Seus Insights</h1>
          <p className="text-gray-600">Visão geral dos últimos 7 dias</p>
        </motion.div>

        {/* Métricas Principais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4"
        >
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{avgEnergy}</div>
            <div className="text-sm text-gray-600">Energia Média</div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{avgCalm}</div>
            <div className="text-sm text-gray-600">Calma Média</div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600">{totalMicrowins}</div>
            <div className="text-sm text-gray-600">Microvitórias</div>
          </div>
        </motion.div>

        {/* Curva Energia × Calma */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm p-6 space-y-4"
        >
          <h2 className="text-xl font-bold text-gray-900">Curva Semanal</h2>

          <div className="space-y-4">
            {dates.map((date, index) => {
              const { morning, evening } = checkInsByDate[date]
              const dateObj = new Date(date)
              const dayName = dateObj.toLocaleDateString('pt-BR', { weekday: 'short' })

              return (
                <div key={date} className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">
                    {dayName} {dateObj.getDate()}
                  </div>

                  {morning && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-12">Manhã</span>
                      <div className="flex-1 flex gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                          <div
                            className="absolute inset-y-0 left-0 bg-blue-500 rounded-full flex items-center justify-end px-2"
                            style={{ width: `${(morning.energy / 10) * 100}%` }}
                          >
                            <span className="text-xs text-white font-medium">
                              {morning.energy}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                          <div
                            className="absolute inset-y-0 left-0 bg-green-500 rounded-full flex items-center justify-end px-2"
                            style={{ width: `${(morning.calm / 10) * 100}%` }}
                          >
                            <span className="text-xs text-white font-medium">
                              {morning.calm}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {evening && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-12">Noite</span>
                      <div className="flex-1 flex gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                          <div
                            className="absolute inset-y-0 left-0 bg-blue-500 rounded-full flex items-center justify-end px-2"
                            style={{ width: `${(evening.energy / 10) * 100}%` }}
                          >
                            <span className="text-xs text-white font-medium">
                              {evening.energy}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                          <div
                            className="absolute inset-y-0 left-0 bg-green-500 rounded-full flex items-center justify-end px-2"
                            style={{ width: `${(evening.calm / 10) * 100}%` }}
                          >
                            <span className="text-xs text-white font-medium">
                              {evening.calm}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="flex justify-center gap-6 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-xs text-gray-600">Energia</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-xs text-gray-600">Calma</span>
            </div>
          </div>
        </motion.div>

        {/* Insights Recentes */}
        {insights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm p-6 space-y-4"
          >
            <h2 className="text-xl font-bold text-gray-900">Insights Recentes</h2>

            <div className="space-y-3">
              {insights.slice(-3).reverse().map((insight) => (
                <div key={insight.id} className="bg-purple-50 rounded-xl p-4">
                  <div className="text-xs text-purple-700 mb-2">
                    {new Date(insight.date).toLocaleDateString('pt-BR')}
                  </div>
                  <p className="text-sm text-gray-800">{insight.content}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Palavras Frequentes */}
        {topWords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm p-6 space-y-4"
          >
            <h2 className="text-xl font-bold text-gray-900">Temas Recorrentes</h2>

            <div className="flex flex-wrap gap-2">
              {topWords.map((word) => (
                <span
                  key={word}
                  className="bg-blue-100 text-blue-900 px-4 py-2 rounded-full text-sm font-medium"
                >
                  {word}
                </span>
              ))}
            </div>
          </motion.div>
        )}

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
