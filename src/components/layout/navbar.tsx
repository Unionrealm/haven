'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Plus, Menu, X, Sun, Moon, Cloud, Home, Compass, LayoutDashboard, LogIn } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTheme } from '@/lib/theme'

const navLinks = [
  { href: '/events', label: '이벤트 탐색', icon: Compass },
  { href: '/dashboard', label: '대시보드', icon: LayoutDashboard },
  { href: '/auth/login', label: '로그인', icon: LogIn },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  // Close menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href + '/'))

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[var(--border-1)] bg-[var(--bg-1)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--bg-1)]/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 select-none group">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--accent)]">
                <Cloud className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
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

            {/* Desktop: CTA + theme toggle */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="h-9 w-9 rounded-lg flex items-center justify-center text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--bg-3)] transition-colors"
                aria-label="테마 전환"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <Link href="/auth/login">
                <Button variant="link" size="sm" className="px-3">로그인</Button>
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
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button
                className="h-9 w-9 rounded-lg flex items-center justify-center text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors"
                onClick={() => setMobileOpen(true)}
                aria-label="메뉴 열기"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu — floating overlay */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 z-[60] md:hidden"
            onClick={() => setMobileOpen(false)}
          />

          {/* Slide-in panel from right */}
          <div className="fixed top-0 right-0 h-full w-72 bg-[var(--bg-2)] border-l border-[var(--border-1)] z-[70] md:hidden flex flex-col shadow-2xl">
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-1)]">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--accent)]">
                  <Cloud className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="font-semibold text-sm text-[var(--text-1)]">Haven</span>
              </div>
              <button
                className="h-8 w-8 rounded-lg flex items-center justify-center text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--bg-3)] transition-colors"
                onClick={() => setMobileOpen(false)}
                aria-label="메뉴 닫기"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors',
                    isActive(href) && href !== '/auth/login'
                      ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                      : 'text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--bg-3)]'
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              ))}
            </nav>

            {/* CTA at bottom */}
            <div className="px-3 pb-8 pt-3 border-t border-[var(--border-1)]">
              <Link href="/events/create" onClick={() => setMobileOpen(false)}>
                <Button className="w-full" size="sm">
                  <Plus className="h-3.5 w-3.5" />
                  이벤트 만들기
                </Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  )
}
