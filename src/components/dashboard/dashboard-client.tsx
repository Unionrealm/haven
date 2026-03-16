'use client'

import { useState } from 'react'
import Link from 'next/link'
import { mockEvents, mockTickets } from '@/lib/mock-data'
import { Event } from '@/lib/supabase/types'
import { formatDateShort, formatPrice, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Plus,
  Ticket,
  Users,
  TrendingUp,
  BarChart3,
  ExternalLink,
  QrCode,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
} from 'lucide-react'

export function DashboardClient() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(mockEvents[0])

  const events = mockEvents

  const stats = {
    totalRevenue: mockTickets
      .filter((t) => t.payment_status === 'paid')
      .reduce((sum, t) => sum + t.purchase_price, 0),
    totalTicketsSold: mockTickets.filter((t) => t.payment_status === 'paid').length,
    totalEvents: events.length,
    upcomingEvents: events.filter((e) => new Date(e.date) > new Date()).length,
  }

  const eventTickets = mockTickets.filter((t) => t.event_id === selectedEvent?.id)

  const downloadCSV = () => {
    if (!eventTickets.length) return
    const headers = ['이름', '연락처', '티켓 종류', '결제 상태', '체크인', '구매 시간']
    const rows = eventTickets.map((t) => [
      t.attendee_name,
      t.attendee_phone,
      t.ticket_type?.name || '',
      t.payment_status === 'paid' ? '결제완료' : t.payment_status,
      t.checked_in ? '완료' : '미완료',
      new Date(t.created_at).toLocaleDateString('ko-KR'),
    ])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedEvent?.title}-참가자명단.csv`
    a.click()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 md:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1 tracking-tight">대시보드</h1>
          <p className="text-sm text-[var(--muted-foreground)]">이벤트 현황을 한눈에 확인하세요</p>
        </div>
        <Link href="/events/create">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            이벤트 만들기
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-[var(--muted-foreground)]">총 수익</p>
              <TrendingUp className="h-4 w-4 text-[var(--muted-foreground)]" />
            </div>
            <p className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">수수료 제외 전</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-[var(--muted-foreground)]">판매 티켓</p>
              <Ticket className="h-4 w-4 text-[var(--muted-foreground)]" />
            </div>
            <p className="text-2xl font-bold">{stats.totalTicketsSold}매</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">전체 이벤트</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-[var(--muted-foreground)]">이벤트</p>
              <BarChart3 className="h-4 w-4 text-[var(--muted-foreground)]" />
            </div>
            <p className="text-2xl font-bold">{stats.totalEvents}개</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">전체</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-[var(--muted-foreground)]">예정 이벤트</p>
              <Users className="h-4 w-4 text-[var(--muted-foreground)]" />
            </div>
            <p className="text-2xl font-bold">{stats.upcomingEvents}개</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">진행 예정</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event list */}
        <div className="lg:col-span-1">
          <h2 className="text-sm font-semibold mb-3 text-[var(--muted-foreground)] uppercase tracking-wide">내 이벤트</h2>
          <div className="space-y-2">
            {events.map((event) => {
              const sold = event.ticket_types?.reduce((s, t) => s + t.quantity_sold, 0) ?? 0
              const total = event.ticket_types?.reduce((s, t) => s + t.quantity, 0) ?? 0
              return (
                <button
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className={cn(
                    'w-full text-left p-3 rounded-lg border transition-all',
                    selectedEvent?.id === event.id
                      ? 'border-[var(--primary)] bg-[var(--muted)]'
                      : 'border-[var(--border)] hover:border-[var(--foreground)]'
                  )}
                >
                  <p className="text-sm font-medium line-clamp-1 mb-1">{event.title}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[var(--muted-foreground)]">{formatDateShort(event.date)}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--muted-foreground)]">{sold}/{total}</span>
                      <Badge
                        variant={event.status === 'published' ? 'success' : 'secondary'}
                        className="text-[10px] px-1.5 py-0.5"
                      >
                        {event.status === 'published' ? '공개' : '초안'}
                      </Badge>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-2 h-1 rounded-full bg-[var(--border)] overflow-hidden">
                    <div
                      className="h-full bg-[var(--foreground)] rounded-full transition-all"
                      style={{ width: total > 0 ? `${Math.min((sold / total) * 100, 100)}%` : '0%' }}
                    />
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Event detail */}
        {selectedEvent && (
          <div className="lg:col-span-2 space-y-5">
            {/* Event header */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-lg leading-tight mb-2">{selectedEvent.title}</h2>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {formatDateShort(selectedEvent.date)} · {selectedEvent.venue}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/event/${selectedEvent.slug}`} target="_blank">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3.5 w-3.5" />
                        보기
                      </Button>
                    </Link>
                    <Link href="/events/create">
                      <Button variant="outline" size="sm">
                        <Edit className="h-3.5 w-3.5" />
                        수정
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Share URL */}
                <div className="mt-4 flex items-center gap-2 p-2.5 rounded-lg bg-[var(--muted)] text-xs">
                  <span className="text-[var(--muted-foreground)] truncate flex-1">
                    haven.kr/event/{selectedEvent.slug}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://haven.kr/event/${selectedEvent.slug}`)
                    }}
                    className="shrink-0 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <Link href={`/event/${selectedEvent.slug}`} target="_blank" className="shrink-0 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {/* Ticket stats */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {selectedEvent.ticket_types?.map((tt) => (
                    <div key={tt.id} className="text-center p-3 rounded-lg bg-[var(--muted)]">
                      <p className="text-lg font-bold">{tt.quantity_sold}</p>
                      <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{tt.name}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">/ {tt.quantity}매</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Attendee list */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">참가자 목록</CardTitle>
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/checkin/${selectedEvent.slug}`}>
                      <Button variant="outline" size="sm">
                        <QrCode className="h-3.5 w-3.5" />
                        체크인
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={downloadCSV}>
                      <Download className="h-3.5 w-3.5" />
                      CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {eventTickets.length > 0 ? (
                  <div className="divide-y divide-[var(--border)]">
                    {eventTickets.map((ticket) => (
                      <div key={ticket.id} className="flex items-center justify-between px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--muted)] flex items-center justify-center text-sm font-medium">
                            {ticket.attendee_name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{ticket.attendee_name}</p>
                            <p className="text-xs text-[var(--muted-foreground)]">{ticket.attendee_phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-xs text-[var(--muted-foreground)]">{ticket.ticket_type?.name}</p>
                            <Badge
                              variant={ticket.checked_in ? 'success' : ticket.payment_status === 'paid' ? 'secondary' : 'warning'}
                              className="text-[10px]"
                            >
                              {ticket.checked_in ? '입장완료' : ticket.payment_status === 'paid' ? '결제완료' : '미결제'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-[var(--muted-foreground)]">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">아직 참가자가 없습니다</p>
                    <p className="text-xs mt-1">이벤트 링크를 공유해보세요</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
