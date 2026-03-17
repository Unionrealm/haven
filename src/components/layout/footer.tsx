import Link from 'next/link'
import { Cloud } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-1)] mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-[var(--accent)]">
                <Cloud className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-semibold text-sm text-[var(--text-1)]">Haven</span>
            </div>
            <p className="text-xs text-[var(--text-2)]">모든 공연의 시작</p>
          </div>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--text-2)]">
            <Link href="/about" className="hover:text-[var(--text-1)] transition-colors">소개</Link>
            <Link href="/terms" className="hover:text-[var(--text-1)] transition-colors">이용약관</Link>
            <Link href="/privacy" className="hover:text-[var(--text-1)] transition-colors">개인정보처리방침</Link>
            <Link href="/contact" className="hover:text-[var(--text-1)] transition-colors">문의</Link>
          </nav>

          <p className="text-xs text-[var(--text-3)]">
            © 2025 Haven. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
