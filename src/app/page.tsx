'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { initDB, getUser } from '@/lib/db'

export default function HomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkUser() {
      try {
        await initDB()
        const user = await getUser()

        if (!user) {
          router.push('/onboarding')
        } else {
          router.push('/home')
        }
      } catch (error) {
        console.error('Erro ao inicializar:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-4xl mb-4">🌊</div>
          <p className="text-gray-600">Carregando Flow...</p>
        </div>
      </div>
    )
  }

  return null
}
