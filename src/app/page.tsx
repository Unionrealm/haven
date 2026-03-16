import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { EventCard } from '@/components/events/event-card'
import { mockEvents } from '@/lib/mock-data'
import { ArrowRight, Zap, Shield, QrCode } from 'lucide-react'

export default function HomePage() {
  const featuredEvents = mockEvents.filter((e) => e.status === 'published').slice(0, 3)

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--muted)] text-xs font-medium text-[var(--muted-foreground)] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              지금 서울에서 열리는 이벤트
            </div>
            <h1 className="haven-title text-[var(--foreground)] mb-6">
              모든 공연의 시작,
              <br />
              <span className="text-[var(--muted-foreground)]">Haven</span>
            </h1>
            <p className="text-[var(--muted-foreground)] text-lg md:text-xl mb-8 leading-relaxed max-w-2xl">
              인디 밴드 단독공연부터 네트워킹 파티까지.
              구글폼과 계좌이체 없이, 3분 만에 전문적인 티켓 페이지를 만들어보세요.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/events/create">
                <Button size="lg">
                  이벤트 만들기
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/events">
                <Button size="lg" variant="outline">
                  이벤트 탐색하기
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
          <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-[var(--foreground)] blur-3xl" />
          <div className="absolute bottom-20 right-40 w-48 h-48 rounded-full bg-[var(--foreground)] blur-3xl" />
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--muted)] flex items-center justify-center">
                <Zap className="h-5 w-5 text-[var(--foreground)]" />
              </div>
              <h3 className="font-semibold">3분 만에 이벤트 생성</h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                제목, 날짜, 장소, 티켓 가격만 입력하면 바로 공유 가능한 페이지가 완성됩니다.
                인스타그램 바이오에 바로 붙여넣으세요.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--muted)] flex items-center justify-center">
                <Shield className="h-5 w-5 text-[var(--foreground)]" />
              </div>
              <h3 className="font-semibold">안전한 결제 · 정산</h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                토스페이먼츠 연동으로 카드, 계좌이체 모두 지원합니다.
                행사 종료 후 3% 수수료를 제외한 금액이 자동 정산됩니다.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--muted)] flex items-center justify-center">
                <QrCode className="h-5 w-5 text-[var(--foreground)]" />
              </div>
              <h3 className="font-semibold">QR 체크인</h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                구매 즉시 QR 티켓이 발급됩니다. 오프라인에서도 작동하는 QR 코드로
                빠르고 정확하게 입장을 확인하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold mb-1">주목할 이벤트</h2>
              <p className="text-sm text-[var(--muted-foreground)]">서울에서 곧 열리는 이벤트</p>
            </div>
            <Link href="/events">
              <Button variant="ghost" size="sm">
                전체보기
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-24">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">
              당신의 이벤트를 특별하게
            </h2>
            <p className="text-[var(--muted-foreground)] mb-8 max-w-md mx-auto">
              20명짜리 인디 공연도, Haven이 있으면 메이저 공연처럼 보입니다.
            </p>
            <Link href="/events/create">
              <Button size="lg">
                무료로 시작하기
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
