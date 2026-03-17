import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: {
    default: 'Haven — 모든 공연의 시작',
    template: '%s | Haven',
  },
  description: '인디 공연, 네트워킹, 원데이클래스까지. Haven에서 당신의 이벤트를 특별하게.',
  keywords: ['공연', '티켓', '인디', '이벤트', '콘서트', '홍대', '서울'],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: 'Haven',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="dark" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-[#0a0a0a] text-white">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  )
}
