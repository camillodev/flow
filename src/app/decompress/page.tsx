'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { getTodayState, saveDailyState } from '@/lib/db'
import type { DailyState } from '@/lib/db/types'
import activities from '@/lib/data/relax-activities.json'

type Activity = {
  id: string
  name: string
  emoji: string
  category: string
  duration: string
  description: string
}

const empathicMessages = [
  'Você trabalhou bem hoje. Hora de desacelerar.',
  'O trabalho pode esperar. Cuide de você agora.',
  'Seu corpo e mente precisam deste momento.',
  'Você merece essa pausa. Permita-se.',
  'Pequenos rituais fazem grande diferença.',
]

export default function DecompressPage() {
  const router = useRouter()
  const [dailyState, setDailyState] = useState<DailyState | null>(null)
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [confirmed, setConfirmed] = useState(false)

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

      setDailyState(state)

      // Se já tem atividade escolhida, carregar ela
      if (state.relaxActivity) {
        const savedActivity = activities.find((a) => a.id === state.relaxActivity)
        if (savedActivity) {
          setCurrentActivity(savedActivity)
          setConfirmed(true)
        }
      } else {
        // Escolher atividade aleatória
        pickRandomActivity()
      }

      // Mensagem empática aleatória
      setMessage(empathicMessages[Math.floor(Math.random() * empathicMessages.length)])
    } catch (error) {
      console.error('Erro ao carregar:', error)
    } finally {
      setLoading(false)
    }
  }

  function pickRandomActivity() {
    const randomIndex = Math.floor(Math.random() * activities.length)
    setCurrentActivity(activities[randomIndex])
  }

  async function handleConfirm() {
    if (!dailyState || !currentActivity) return

    setLoading(true)

    try {
      const updatedState = {
        ...dailyState,
        relaxActivity: currentActivity.id,
        updatedAt: new Date().toISOString(),
      }

      await saveDailyState(updatedState)
      setConfirmed(true)
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (loading || !currentActivity) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-4xl">🌇</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-4">
      <div className="max-w-2xl mx-auto pt-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="text-6xl mb-4">🌇</div>
          <h1 className="text-3xl font-bold text-gray-900">Ritual de Descompressão</h1>
          <p className="text-lg text-gray-600 italic">{message}</p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentActivity.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
          >
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">{currentActivity.emoji}</div>
              <h2 className="text-2xl font-bold text-gray-900">{currentActivity.name}</h2>
              <div className="inline-block bg-orange-100 text-orange-900 px-4 py-2 rounded-full text-sm font-medium">
                {currentActivity.duration}
              </div>
            </div>

            <p className="text-center text-gray-700 text-lg leading-relaxed">
              {currentActivity.description}
            </p>

            {!confirmed ? (
              <div className="space-y-3">
                <button
                  onClick={handleConfirm}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-2xl transition-colors"
                >
                  Vou fazer essa atividade
                </button>

                <button
                  onClick={pickRandomActivity}
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-4 rounded-2xl border-2 border-gray-200 transition-colors"
                >
                  Trocar sugestão
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-6 text-center">
                  <div className="text-3xl mb-2">✓</div>
                  <p className="text-green-900 font-medium">
                    Ótimo! Quando terminar, volte para registrar o final do dia.
                  </p>
                </div>

                <button
                  onClick={() => router.push('/home')}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-2xl transition-colors"
                >
                  Voltar para Home
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Resumo do Dia */}
        {dailyState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm p-6 space-y-4"
          >
            <h3 className="font-bold text-gray-900">Resumo de Hoje</h3>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-900">
                  {dailyState.top3Completed.filter(Boolean).length}/{dailyState.top3.length}
                </div>
                <div className="text-xs text-blue-700">Top 3</div>
              </div>

              <div className="bg-green-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-900">
                  {dailyState.habitsCompleted.length}
                </div>
                <div className="text-xs text-green-700">Hábitos</div>
              </div>

              <div className="bg-yellow-50 rounded-xl p-4 col-span-2">
                <div className="text-3xl font-bold text-yellow-900">{dailyState.microwins}</div>
                <div className="text-xs text-yellow-700">Microvitórias 🌱</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
