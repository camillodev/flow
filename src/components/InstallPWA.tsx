'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Verificar se já está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Verificar se foi instalado via navigator
    if ((window.navigator as any).standalone === true) {
      setIsInstalled(true)
      return
    }

    // Listener para o evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(promptEvent)
      setShowInstallPrompt(true)
    }

    // Listener para verificar se foi instalado
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Mostrar o prompt de instalação
    await deferredPrompt.prompt()

    // Esperar pela escolha do usuário
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('PWA instalado com sucesso')
    } else {
      console.log('Instalação do PWA cancelada')
    }

    // Limpar o prompt
    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
  }

  // Não mostrar nada se já estiver instalado ou não houver prompt disponível
  if (isInstalled || !showInstallPrompt) {
    return null
  }

  return (
    <AnimatePresence>
      {showInstallPrompt && (
        <>
          {/* Botão flutuante (mobile) */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-2xl p-4 text-white">
              <button
                onClick={handleDismiss}
                className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-start gap-3 mb-3">
                <div className="text-4xl">🌊</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">Instalar Flow</h3>
                  <p className="text-sm text-white/90">
                    Adicione à tela inicial para acesso rápido e offline
                  </p>
                </div>
              </div>

              <button
                onClick={handleInstallClick}
                className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Instalar Aplicativo
              </button>

              <p className="text-xs text-white/70 text-center mt-2">
                100% offline • Sem rastreamento • Dados locais
              </p>
            </div>
          </motion.div>

          {/* Banner alternativo (desktop - se preferir) */}
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="hidden lg:block fixed top-4 right-4 z-50 w-96"
          >
            <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-200 p-5">
              <button
                onClick={handleDismiss}
                className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Fechar"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>

              <div className="flex items-start gap-3 mb-4">
                <div className="text-4xl">🌊</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    Instalar Flow
                  </h3>
                  <p className="text-sm text-gray-600">
                    Adicione à área de trabalho para acesso rápido e funcionamento offline
                  </p>
                </div>
              </div>

              <button
                onClick={handleInstallClick}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Instalar Aplicativo
              </button>

              <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Offline
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Privado
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Rápido
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
