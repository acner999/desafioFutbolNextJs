import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/lib/i18n'
import { AuthProvider } from '@/lib/contexts/auth-context'
import { PWAProvider } from '@/components/layout/pwa-provider'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: 'TorneoApp - Desafios y Torneos Deportivos',
  description: 'La plataforma definitiva para equipos amateur. Desafia a rivales, gestiona torneos y lleva el control de tu equipo.',
  generator: 'v0.app',
  manifest: '/manifest.json',
  keywords: ['futbol', 'torneo', 'desafio', 'deportes', 'amateur', 'paraguay', 'brasil'],
  authors: [{ name: 'TorneoApp' }],
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'TorneoApp - Desafios y Torneos Deportivos',
    description: 'La plataforma definitiva para equipos amateur. Desafia a rivales, gestiona torneos y lleva el control de tu equipo.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#1E3A5F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <PWAProvider>
          <LanguageProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </LanguageProvider>
        </PWAProvider>
        <Analytics />
      </body>
    </html>
  )
}
