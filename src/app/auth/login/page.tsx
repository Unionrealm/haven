import { LoginClient } from '@/components/auth/login-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '로그인',
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--primary)] mb-4">
            <span className="text-[var(--primary-foreground)] font-bold">H</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Haven에 오신 것을 환영합니다</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-2">
            이벤트를 만들고 관리하려면 로그인하세요
          </p>
        </div>
        <LoginClient />
      </div>
    </div>
  )
}
