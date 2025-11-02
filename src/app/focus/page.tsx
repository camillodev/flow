'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

const POMODORO_TIME = 25 * 60 // 25 minutos
const BREAK_TIME = 5 * 60 // 5 minutos

export default function FocusPage() {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState(POMODORO_TIME)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [intention, setIntention] = useState('')
  const [showIntentionInput, setShowIntentionInput] = useState(true)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsRunning(false)
      if (!isBreak) {
        alert('Pomodoro concluído! Hora de uma pausa.')
        setIsBreak(true)
        setTimeLeft(BREAK_TIME)
      } else {
        alert('Pausa concluída! Pronto para outro Pomodoro?')
        setIsBreak(false)
        setTimeLeft(POMODORO_TIME)
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft, isBreak])

  const handleStart = () => {
    if (showIntentionInput && intention.trim() === '') {
      alert('Defina sua intenção para este Pomodoro')
      return
    }
    setShowIntentionInput(false)
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setIsBreak(false)
    setTimeLeft(POMODORO_TIME)
    setIntention('')
    setShowIntentionInput(true)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
      <div className="max-w-2xl mx-auto pt-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="text-6xl mb-4">⚙️</div>
          <h1 className="text-3xl font-bold text-gray-900">Modo Foco</h1>
          <p className="text-gray-600">
            {isBreak ? 'Hora de descansar' : 'Técnica Pomodoro'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
        >
          {/* Timer Display */}
          <div className="text-center">
            <div className="text-7xl font-bold text-yellow-600">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
          </div>

          {/* Progress Ring */}
          <div className="flex justify-center">
            <svg className="transform -rotate-90" width="200" height="200">
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="#f3f4f6"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke={isBreak ? '#10b981' : '#f59e0b'}
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${
                  2 * Math.PI * 90 * (1 - timeLeft / (isBreak ? BREAK_TIME : POMODORO_TIME))
                }`}
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Intention Input */}
          {showIntentionInput && !isBreak && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Qual sua intenção para este Pomodoro?
              </label>
              <input
                type="text"
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="Ex: Revisar código do módulo X"
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none"
              />
            </div>
          )}

          {/* Current Intention */}
          {!showIntentionInput && intention && (
            <div className="bg-yellow-50 rounded-2xl p-4 text-center">
              <p className="text-sm text-yellow-900 font-medium">{intention}</p>
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-3">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-4 rounded-2xl transition-colors"
              >
                {timeLeft === (isBreak ? BREAK_TIME : POMODORO_TIME) ? 'Começar' : 'Continuar'}
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-2xl transition-colors"
              >
                Pausar
              </button>
            )}

            <button
              onClick={handleReset}
              className="px-6 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-2xl border-2 border-gray-200 transition-colors"
            >
              Reiniciar
            </button>
          </div>

          <button
            onClick={() => router.push('/home')}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-2xl border-2 border-gray-200 transition-colors"
          >
            Voltar para Home
          </button>
        </motion.div>

        {/* Dicas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm p-6 space-y-3"
        >
          <h3 className="font-bold text-gray-900">Dicas para melhor foco:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Desative notificações do celular</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Mantenha apenas uma tarefa por Pomodoro</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Use as pausas para se movimentar</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
