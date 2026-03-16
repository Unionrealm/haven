'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Plus, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) => pathname === href

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 select-none">
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-[var(--primary)]">
              <span className="text-[var(--primary-foreground)] text-xs font-bold">H</span>
            </div>
            <span className="font-bold text-lg tracking-tight">Haven</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/events"
              className={cn(
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive('/events')
                  ? 'text-[var(--foreground)]'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              )}
            >
              이벤트 탐색
            </Link>
            <Link
              href="/dashboard"
              className={cn(
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                pathname.startsWith('/dashboard')
                  ? 'text-[var(--foreground)]'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              )}
            >
              대시보드
            </Link>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">로그인</Button>
            </Link>
            <Link href="/events/create">
              <Button size="sm">
                <Plus className="h-4 w-4" />
                이벤트 만들기
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--background)]">
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/events"
              className="block px-3 py-2 rounded-md text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              onClick={() => setMobileOpen(false)}
            >
              이벤트 탐색
            </Link>
            <Link
              href="/dashboard"
              className="block px-3 py-2 rounded-md text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              onClick={() => setMobileOpen(false)}
            >
              대시보드
            </Link>
            <Link
              href="/auth/login"
              className="block px-3 py-2 rounded-md text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              onClick={() => setMobileOpen(false)}
            >
              로그인
            </Link>
            <Link href="/events/create" onClick={() => setMobileOpen(false)}>
              <Button size="sm" className="w-full mt-2">
                <Plus className="h-4 w-4" />
                이벤트 만들기
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
