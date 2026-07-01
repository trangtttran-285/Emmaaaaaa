import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import NavWrapper from '@/components/NavWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = { title: 'TA Tool — Crossian' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <SessionProvider>
          <NavWrapper />
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
