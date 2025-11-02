'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { getTodayState, saveCheckIn, saveInsight, getCheckIns } from '@/lib/db'
import { generateDailyInsight, getEmpathicPhrase } from '@/lib/utils/insights'
import type { DailyState, CheckIn } from '@/lib/db/types'

const emotions = ['😊', '😌', '😐', '😔', '😤', '😴', '🤔', '😰']

export default function RelaxPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [dailyState, setDailyState] = useState<DailyState | null>(null)
  const [journaling, setJournaling] = useState('')
  const [emotion, setEmotion] = useState('')
  const [energy, setEnergy] = useState(5)
  const [calm, setCalm] = useState(5)
  const [insight, setInsight] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const state = await getTodayState('rafael')
    if (!state) {
      router.push('/checkin/morning')
      return
    }
    setDailyState(state)
  }

  const handleNext = () => {
    if (step === 1 && journaling.trim() === '') {
      alert('Escreva pelo menos uma frase')
      return
    }
    if (step === 2 && !emotion) {
      alert('Escolha uma emoção')
      return
    }
    if (step < 3) {
      setStep(step + 1)
    }
  }

  async function handleSubmit() {
    if (!dailyState) return

    setLoading(true)

    try {
      const today = dailyState.date

      // Salvar check-in noturno
      const eveningCheckIn: CheckIn = {
        id: `checkin-evening-${Date.now()}`,
        userId: 'rafael',
        date: today,
        type: 'evening',
        emotion,
        energy,
        calm,
        journaling,
        timestamp: new Date().toISOString(),
      }

      await saveCheckIn(eveningCheckIn)

      // Buscar check-in matinal
      const checkIns = await getCheckIns('rafael', today, today)
      const morningCheckIn = checkIns.find((c) => c.type === 'morning')

      if (morningCheckIn) {
        // Gerar insight
        const dailyInsight = generateDailyInsight(morningCheckIn, eveningCheckIn, dailyState)
        await saveInsight(dailyInsight)
        setInsight(dailyInsight.content)
      }

      setStep(3)
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (!dailyState) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-4xl">🌙</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-8 space-y-8"
        >
          {/* Progress Bar */}
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  s <= step ? 'bg-purple-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Step 1: Journaling */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="text-5xl mb-4">🌙</div>
                <h1 className="text-2xl font-bold text-gray-900">Reflexão do Dia</h1>
                <p className="text-gray-600">O que te fez bem hoje?</p>
              </div>

              <textarea
                value={journaling}
                onChange={(e) => setJournaling(e.target.value)}
                placeholder="Escreva o que vier à mente. Pode ser algo pequeno..."
                rows={6}
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none"
              />

              <button
                onClick={handleNext}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-2xl transition-colors"
              >
                Continuar
              </button>
            </motion.div>
          )}

          {/* Step 2: Check-in Final */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">Como você termina o dia?</h1>
                <p className="text-gray-600">Última checagem antes de descansar</p>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {emotions.map((e) => (
                  <button
                    key={e}
                    onClick={() => setEmotion(e)}
                    className={`p-4 text-4xl rounded-2xl transition-all ${
                      emotion === e
                        ? 'bg-purple-100 scale-110 ring-2 ring-purple-500'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Energia agora: {energy}/10
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={energy}
                    onChange={(e) => setEnergy(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calma agora: {calm}/10
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={calm}
                    onChange={(e) => setCalm(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-2xl transition-colors disabled:opacity-50"
              >
                {loading ? 'Processando...' : 'Finalizar dia'}
              </button>
            </motion.div>
          )}

          {/* Step 3: Insight */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">✨</div>
                <h1 className="text-2xl font-bold text-gray-900">Insight do Dia</h1>
              </div>

              <div className="bg-purple-50 rounded-2xl p-6 space-y-4">
                <p className="text-gray-800 leading-relaxed">{insight}</p>

                <div className="pt-4 border-t border-purple-200">
                  <p className="text-sm text-purple-900 italic">
                    {getEmpathicPhrase(energy, calm)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="text-xl font-bold text-blue-900">{energy}</div>
                  <div className="text-xs text-blue-700">Energia</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="text-xl font-bold text-green-900">{calm}</div>
                  <div className="text-xs text-green-700">Calma</div>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4">
                  <div className="text-xl font-bold text-yellow-900">
                    {dailyState.microwins}
                  </div>
                  <div className="text-xs text-yellow-700">Vitórias</div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => router.push('/insights')}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-2xl transition-colors"
                >
                  Ver painel de insights
                </button>

                <button
                  onClick={() => router.push('/home')}
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-2xl border-2 border-gray-200 transition-colors"
                >
                  Voltar para Home
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
