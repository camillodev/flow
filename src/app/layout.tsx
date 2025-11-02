'use client'

import { useEffect } from 'react'
import { Inter } from 'next/font/google'
import { registerServiceWorker } from '@/lib/register-sw'
import InstallPWA from '@/components/InstallPWA'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    registerServiceWorker()
  }, [])

  return (
    <html lang="pt-BR">
      <head>
        <title>Flow - Seu copiloto de bem-estar</title>
        <meta name="description" content="PWA offline-first para ritmo, constância e estabilidade emocional" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Flow" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={inter.className}>
        {children}
        <InstallPWA />
      </body>
    </html>
  )
}
