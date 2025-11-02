'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { seedRafael } from '@/lib/db/seed'

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleStart() {
    setLoading(true)
    try {
      await seedRafael()
      router.push('/checkin/morning')
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
      alert('Erro ao inicializar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="text-6xl mb-4 animate-pulse">🌊</div>
          <h1 className="text-4xl font-bold text-gray-900">Flow</h1>
          <p className="text-lg text-gray-600">
            Seu copiloto empático para ritmo, constância e bem-estar
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🕊️</span>
              <div>
                <h3 className="font-semibold text-gray-900">Acordar</h3>
                <p className="text-sm text-gray-600">
                  Check-in matinal para definir o clima do dia
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">⚙️</span>
              <div>
                <h3 className="font-semibold text-gray-900">Foco</h3>
                <p className="text-sm text-gray-600">
                  Mantenha ritmo nas suas prioridades
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">🌇</span>
              <div>
                <h3 className="font-semibold text-gray-900">Desligar</h3>
                <p className="text-sm text-gray-600">
                  Transição saudável do trabalho
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">🌙</span>
              <div>
                <h3 className="font-semibold text-gray-900">Relaxar</h3>
                <p className="text-sm text-gray-600">
                  Journaling e insights do dia
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando...' : 'Começar agora'}
          </button>
        </div>

        <p className="text-xs text-gray-500">
          Funciona 100% offline. Seus dados ficam apenas no seu dispositivo.
        </p>
      </div>
    </div>
  )
}
