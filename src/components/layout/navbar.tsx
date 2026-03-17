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

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1e1e1e] bg-[#0a0a0a]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0a0a0a]/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 select-none group">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#5A42F5]">
              <span className="text-white text-xs font-semibold tracking-tight">H</span>
            </div>
            <span className="font-semibold text-base tracking-tight text-white">Haven</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/events"
              className={cn(
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive('/events') && pathname !== '/events/create'
                  ? 'text-white'
                  : 'text-[#888888] hover:text-white'
              )}
            >
              이벤트 탐색
            </Link>
            <Link
              href="/dashboard"
              className={cn(
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                pathname.startsWith('/dashboard')
                  ? 'text-white'
                  : 'text-[#888888] hover:text-white'
              )}
            >
              대시보드
            </Link>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/auth/login">
              <Button variant="link" size="sm" className="text-[#888888] hover:text-white text-sm px-3">
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

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-md text-[#888888] hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#1e1e1e] bg-[#0a0a0a]">
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/events"
              className="block px-3 py-2.5 rounded-md text-sm font-medium text-[#888888] hover:text-white transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              이벤트 탐색
            </Link>
            <Link
              href="/dashboard"
              className="block px-3 py-2.5 rounded-md text-sm font-medium text-[#888888] hover:text-white transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              대시보드
            </Link>
            <Link
              href="/auth/login"
              className="block px-3 py-2.5 rounded-md text-sm font-medium text-[#888888] hover:text-white transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              로그인
            </Link>
            <div className="pt-1">
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
