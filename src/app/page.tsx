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
      <section className="border-b border-[var(--border-1)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-24 md:py-36">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border-1)] bg-[var(--bg-2)] text-xs font-medium text-[var(--text-2)] mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-3)]" />
              서울에서 지금 열리는 이벤트
            </div>

            <h1 className="haven-title text-[var(--text-1)] mb-6">
              모든 공연의 시작,
              <br />
              <span className="text-[var(--accent)]">Haven</span>
            </h1>

            <p className="text-[var(--text-2)] text-lg leading-relaxed mb-10 max-w-lg">
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
      </section>

      {/* Why Haven — icons use text-3 (neutral), NOT accent */}
      <section className="border-b border-[var(--border-1)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-[var(--bg-3)] border border-[var(--border-1)] flex items-center justify-center">
                <Zap className="h-5 w-5 text-[var(--text-2)]" />
              </div>
              <h3 className="font-semibold text-[var(--text-1)]">3분 만에 이벤트 생성</h3>
              <p className="text-sm text-[var(--text-2)] leading-relaxed">
                제목, 날짜, 장소, 티켓 가격만 입력하면 바로 공유 가능한 페이지가 완성됩니다.
                인스타그램 바이오에 바로 붙여넣으세요.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-[var(--bg-3)] border border-[var(--border-1)] flex items-center justify-center">
                <Shield className="h-5 w-5 text-[var(--text-2)]" />
              </div>
              <h3 className="font-semibold text-[var(--text-1)]">안전한 결제 · 정산</h3>
              <p className="text-sm text-[var(--text-2)] leading-relaxed">
                토스페이먼츠 연동으로 카드, 계좌이체 모두 지원합니다.
                행사 종료 후 3% 수수료를 제외한 금액이 자동 정산됩니다.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-[var(--bg-3)] border border-[var(--border-1)] flex items-center justify-center">
                <QrCode className="h-5 w-5 text-[var(--text-2)]" />
              </div>
              <h3 className="font-semibold text-[var(--text-1)]">QR 체크인</h3>
              <p className="text-sm text-[var(--text-2)] leading-relaxed">
                구매 즉시 QR 티켓이 발급됩니다. 오프라인에서도 작동하는 QR 코드로
                빠르고 정확하게 입장을 확인하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="border-b border-[var(--border-1)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              {/* Section label: text-3, NOT accent */}
              <p className="text-xs text-[var(--text-3)] font-medium uppercase tracking-widest mb-2">지금 뜨는 공연</p>
              {/* Section heading: text-1, NOT accent */}
              <h2 className="text-2xl font-semibold text-[var(--text-1)] tracking-tight">주목할 이벤트</h2>
            </div>
            <Link href="/events">
              <Button variant="link" size="sm" className="gap-1">
                전체보기
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
          <div className="rounded-2xl border border-[var(--border-1)] bg-[var(--bg-2)] px-8 py-16 md:px-16 md:py-20 text-center">
            <p className="text-xs text-[var(--text-3)] font-medium uppercase tracking-widest mb-4">Haven으로 시작하기</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-[var(--text-1)] mb-4 tracking-tight">
              당신의 이벤트를 특별하게
            </h2>
            <p className="text-[var(--text-2)] mb-8 max-w-sm mx-auto leading-relaxed">
              20명짜리 인디 공연도, Haven이 있으면
              메이저 공연처럼 보입니다.
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
