'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { saveCheckIn, saveDailyState } from '@/lib/db'
import { calculateDayMode, getModeConfig } from '@/lib/utils/day-mode'
import {
  emotionLabels,
  getEnergyLabel,
  getCalmLabel,
  getSleepLabel,
} from '@/lib/utils/empathic-messages'
import type { CheckIn, DailyState } from '@/lib/db/types'

const emotions = ['😊', '😌', '😐', '😔', '😤', '😴', '🤔', '😰']

export default function MorningCheckInPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [emotion, setEmotion] = useState('')
  const [energy, setEnergy] = useState(5)
  const [calm, setCalm] = useState(5)
  const [sleepQuality, setSleepQuality] = useState(3)
  const [top3, setTop3] = useState(['', '', ''])
  const [loading, setLoading] = useState(false)

  const handleNext = () => {
    if (step === 1 && !emotion) {
      alert('Escolha uma emoção')
      return
    }
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handleTop3Change = (index: number, value: string) => {
    const newTop3 = [...top3]
    newTop3[index] = value
    setTop3(newTop3)
  }

  const handleSubmit = async () => {
    const validTop3 = top3.filter((item) => item.trim() !== '')

    if (validTop3.length === 0) {
      alert('Adicione pelo menos uma prioridade')
      return
    }

    setLoading(true)

    try {
      const today = new Date().toISOString().split('T')[0]
      const mode = calculateDayMode({ energy, calm, sleepQuality })

      const checkin: CheckIn = {
        id: `checkin-morning-${Date.now()}`,
        userId: 'rafael',
        date: today,
        type: 'morning',
        emotion,
        energy,
        calm,
        sleepQuality,
        timestamp: new Date().toISOString(),
      }

      const dailyState: DailyState = {
        id: `daily-${today}`,
        userId: 'rafael',
        date: today,
        mode,
        top3: validTop3,
        top3Completed: validTop3.map(() => false),
        habitsCompleted: [],
        microwins: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await saveCheckIn(checkin)
      await saveDailyState(dailyState)

      router.push('/home')
    } catch (error) {
      console.error('Erro ao salvar check-in:', error)
      alert('Erro ao salvar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
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
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Emoção e Sliders */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Como você está se sentindo?
                  </h1>
                  <p className="text-gray-600">Escolha a emoção que te representa agora</p>
                </div>

                {/* Emojis com legendas */}
                <div className="grid grid-cols-4 gap-4">
                  {emotions.map((e) => (
                    <button
                      key={e}
                      onClick={() => setEmotion(e)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200 ${
                        emotion === e
                          ? 'bg-blue-100 scale-110 ring-2 ring-blue-500'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      aria-label={`Selecionar emoção: ${emotionLabels[e]}`}
                    >
                      <span className="text-4xl">{e}</span>
                      <span className="text-xs font-medium text-gray-700">
                        {emotionLabels[e]}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Sliders com rótulos dinâmicos */}
                <div className="space-y-6">
                  {/* Energia */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-medium text-gray-700">Energia</label>
                      <span className="text-sm font-semibold text-blue-600">
                        {energy}/10 — {getEnergyLabel(energy)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={energy}
                      onChange={(e) => setEnergy(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      aria-valuetext={`Energia: ${energy} de 10, ${getEnergyLabel(energy)}`}
                      aria-label="Slider de energia"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Baixa</span>
                      <span>Média</span>
                      <span>Alta</span>
                    </div>
                  </div>

                  {/* Calma */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-medium text-gray-700">Calma</label>
                      <span className="text-sm font-semibold text-green-600">
                        {calm}/10 — {getCalmLabel(calm)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={calm}
                      onChange={(e) => setCalm(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                      aria-valuetext={`Calma: ${calm} de 10, ${getCalmLabel(calm)}`}
                      aria-label="Slider de calma"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Tensa</span>
                      <span>Estável</span>
                      <span>Serena</span>
                    </div>
                  </div>

                  {/* Sono */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-medium text-gray-700">
                        Qualidade do sono
                      </label>
                      <span className="text-sm font-semibold text-purple-600">
                        {sleepQuality}/5 — {getSleepLabel(sleepQuality)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={sleepQuality}
                      onChange={(e) => setSleepQuality(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                      aria-valuetext={`Qualidade do sono: ${sleepQuality} de 5, ${getSleepLabel(
                        sleepQuality
                      )}`}
                      aria-label="Slider de qualidade do sono"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Péssimo</span>
                      <span>Fraco</span>
                      <span>Ok</span>
                      <span>Bom</span>
                      <span>Ótimo</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-2xl transition-colors"
                >
                  Continuar
                </button>
              </motion.div>
            )}

            {/* Step 2: Modo do Dia */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {(() => {
                  const mode = calculateDayMode({ energy, calm, sleepQuality })
                  const config = getModeConfig(mode)
                  return (
                    <>
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        className="text-center space-y-4"
                      >
                        <div className="text-6xl mb-4">{config.emoji}</div>
                        <h1 className="text-2xl font-bold text-gray-900">
                          Modo do Dia: {config.label}
                        </h1>
                        <p className="text-gray-600">{config.description}</p>
                      </motion.div>

                      <div className={`mode-${config.color} rounded-2xl p-6 space-y-3`}>
                        <h3 className="font-semibold">Sugestões para hoje:</h3>
                        <ul className="space-y-2">
                          {config.suggestions.map((suggestion, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-start gap-2"
                            >
                              <span className="text-sm">•</span>
                              <span className="text-sm">{suggestion}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={handleNext}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-2xl transition-colors"
                      >
                        Definir prioridades
                      </button>
                    </>
                  )
                })()}
              </motion.div>
            )}

            {/* Step 3: Top 3 */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Top 3 prioridades de hoje
                  </h1>
                  <p className="text-gray-600">Foque no que realmente importa</p>
                </div>

                <div className="space-y-4">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <input
                        type="text"
                        value={top3[i]}
                        onChange={(e) => handleTop3Change(i, e.target.value)}
                        placeholder={`Prioridade ${i + 1}${i === 0 ? ' (obrigatória)' : ''}`}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        aria-label={`Prioridade ${i + 1}`}
                      />
                    </motion.div>
                  ))}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Salvando...' : 'Começar o dia'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
