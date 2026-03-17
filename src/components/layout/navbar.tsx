'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Plus, Menu, X, Sun, Moon, Cloud } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '@/lib/theme'

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href + '/'))

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border-1)] bg-[var(--bg-1)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--bg-1)]/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 select-none group">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--accent)]">
              <Cloud className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            {/* Wordmark: textPrimary, NOT accent */}
            <span className="font-semibold text-base tracking-tight text-[var(--text-1)]">Haven</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/events"
              className={cn(
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive('/events') && !isActive('/events/create')
                  ? 'text-[var(--text-1)]'
                  : 'text-[var(--text-2)] hover:text-[var(--text-1)]'
              )}
            >
              이벤트 탐색
            </Link>
            <Link
              href="/dashboard"
              className={cn(
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive('/dashboard')
                  ? 'text-[var(--text-1)]'
                  : 'text-[var(--text-2)] hover:text-[var(--text-1)]'
              )}
            >
              대시보드
            </Link>
          </nav>

          {/* CTA + theme toggle */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="h-9 w-9 rounded-lg flex items-center justify-center text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--bg-3)] transition-colors"
              aria-label="테마 전환"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            <Link href="/auth/login">
              <Button variant="link" size="sm" className="px-3">
                로그인
              </Button>
            </Link>
            <Link href="/events/create">
              <Button size="sm">
                <Plus className="h-3.5 w-3.5" />
                이벤트 만들기
              </Button>
            </Link>
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              onClick={toggleTheme}
              className="h-9 w-9 rounded-lg flex items-center justify-center text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors"
              aria-label="테마 전환"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
            <button
              className="h-9 w-9 rounded-lg flex items-center justify-center text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border-1)] bg-[var(--bg-1)]">
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/events"
              className="block px-3 py-3 rounded-lg text-sm font-medium text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--bg-3)] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              이벤트 탐색
            </Link>
            <Link
              href="/dashboard"
              className="block px-3 py-3 rounded-lg text-sm font-medium text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--bg-3)] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              대시보드
            </Link>
            <Link
              href="/auth/login"
              className="block px-3 py-3 rounded-lg text-sm font-medium text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--bg-3)] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              로그인
            </Link>
            <div className="pt-1 pb-1">
              <Link href="/events/create" onClick={() => setMobileOpen(false)}>
                <Button size="sm" className="w-full">
                  <Plus className="h-3.5 w-3.5" />
                  이벤트 만들기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
