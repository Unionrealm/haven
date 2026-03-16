import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded bg-[var(--primary)]">
              <span className="text-[var(--primary-foreground)] text-xs font-bold">H</span>
            </div>
            <span className="font-semibold text-sm">Haven</span>
            <span className="text-[var(--muted-foreground)] text-sm">— 모든 공연의 시작</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-[var(--muted-foreground)]">
            <Link href="/about" className="hover:text-[var(--foreground)] transition-colors">소개</Link>
            <Link href="/terms" className="hover:text-[var(--foreground)] transition-colors">이용약관</Link>
            <Link href="/privacy" className="hover:text-[var(--foreground)] transition-colors">개인정보처리방침</Link>
            <Link href="/contact" className="hover:text-[var(--foreground)] transition-colors">문의</Link>
          </nav>
          <p className="text-xs text-[var(--muted-foreground)]">
            © 2025 Haven. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
