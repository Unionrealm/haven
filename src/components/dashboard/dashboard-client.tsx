'use client'

import { useState } from 'react'
import Link from 'next/link'
import { mockEvents, mockTickets } from '@/lib/mock-data'
import { Event } from '@/lib/supabase/types'
import { formatDateShort, formatPrice, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  Ticket,
  Users,
  TrendingUp,
  BarChart3,
  ExternalLink,
  QrCode,
  Download,
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

  const statCards = [
    {
      label: '총 수익',
      value: formatPrice(stats.totalRevenue),
      sub: '수수료 제외 전',
      icon: TrendingUp,
    },
    {
      label: '판매 티켓',
      value: `${stats.totalTicketsSold}매`,
      sub: '전체 이벤트',
      icon: Ticket,
    },
    {
      label: '이벤트',
      value: `${stats.totalEvents}개`,
      sub: '전체',
      icon: BarChart3,
    },
    {
      label: '예정 이벤트',
      value: `${stats.upcomingEvents}개`,
      sub: '진행 예정',
      icon: Users,
    },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1 tracking-tight">대시보드</h1>
          <p className="text-sm text-[#888888]">이벤트 현황을 한눈에 확인하세요</p>
        </div>
        <Link href="/events/create">
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" />
            이벤트 만들기
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        {statCards.map(({ label, value, sub, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-[#1e1e1e] bg-[#161616] p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-[#888888]">{label}</p>
              <Icon className="h-4 w-4 text-[#444444]" />
            </div>
            <p className="text-2xl font-semibold text-white">{value}</p>
            <p className="text-xs text-[#444444] mt-1">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event list */}
        <div className="lg:col-span-1">
          <p className="text-xs font-medium text-[#888888] uppercase tracking-widest mb-4">내 이벤트</p>
          <div className="space-y-2">
            {events.map((event) => {
              const sold = event.ticket_types?.reduce((s, t) => s + t.quantity_sold, 0) ?? 0
              const total = event.ticket_types?.reduce((s, t) => s + t.quantity, 0) ?? 0
              const isSelected = selectedEvent?.id === event.id
              return (
                <button
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className={cn(
                    'w-full text-left p-4 rounded-xl border transition-all',
                    isSelected
                      ? 'border-[#5A42F5] bg-[#110D2E]'
                      : 'border-[#1e1e1e] bg-[#161616] hover:border-[#333]'
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-medium text-white line-clamp-1">{event.title}</p>
                    <Badge
                      variant={event.status === 'published' ? 'default' : 'secondary'}
                      className="text-[10px] px-1.5 py-0.5 shrink-0"
                    >
                      {event.status === 'published' ? '공개' : '초안'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-[#888888]">{formatDateShort(event.date)}</p>
                    <span className="text-xs text-[#888888]">{sold}/{total}매</span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-0.5 rounded-full bg-[#1e1e1e] overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        isSelected ? 'bg-[#5A42F5]' : 'bg-[#333]'
                      )}
                      style={{ width: total > 0 ? `${Math.min((sold / total) * 100, 100)}%` : '0%' }}
                    />
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Event detail panel */}
        {selectedEvent && (
          <div className="lg:col-span-2 space-y-4">
            {/* Event header card */}
            <div className="rounded-xl border border-[#1e1e1e] bg-[#161616] p-5">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h2 className="font-semibold text-white leading-tight mb-1">{selectedEvent.title}</h2>
                  <p className="text-sm text-[#888888]">
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
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[#111111] border border-[#1e1e1e] text-xs mb-4">
                <span className="text-[#888888] truncate flex-1">
                  haven.kr/event/{selectedEvent.slug}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://haven.kr/event/${selectedEvent.slug}`)
                  }}
                  className="shrink-0 text-[#888888] hover:text-white transition-colors"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
                <Link href={`/event/${selectedEvent.slug}`} target="_blank" className="shrink-0 text-[#888888] hover:text-white transition-colors">
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Ticket stats */}
              <div className="grid grid-cols-3 gap-3">
                {selectedEvent.ticket_types?.map((tt) => (
                  <div key={tt.id} className="text-center p-3 rounded-lg bg-[#111111] border border-[#1e1e1e]">
                    <p className="text-xl font-semibold text-white">{tt.quantity_sold}</p>
                    <p className="text-xs text-[#888888] mt-0.5 truncate">{tt.name}</p>
                    <p className="text-xs text-[#444444]">/ {tt.quantity}매</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Attendee list */}
            <div className="rounded-xl border border-[#1e1e1e] bg-[#161616] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e1e1e]">
                <h3 className="font-semibold text-sm text-white">참가자 목록</h3>
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/checkin/${selectedEvent.slug}`}>
                    <Button variant="outline" size="sm">
                      <QrCode className="h-3.5 w-3.5" />
                      QR 체크인
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={downloadCSV}>
                    <Download className="h-3.5 w-3.5" />
                    CSV
                  </Button>
                </div>
              </div>

              {eventTickets.length > 0 ? (
                <div className="divide-y divide-[#1e1e1e]">
                  {eventTickets.map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#2A1E8A] flex items-center justify-center text-xs font-semibold text-[#C4B5FD]">
                          {ticket.attendee_name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{ticket.attendee_name}</p>
                          <p className="text-xs text-[#888888]">{ticket.attendee_phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-xs text-[#888888]">{ticket.ticket_type?.name}</p>
                          <Badge
                            variant={ticket.checked_in ? 'success' : ticket.payment_status === 'paid' ? 'secondary' : 'warning'}
                            className="text-[10px] mt-0.5"
                          >
                            {ticket.checked_in ? '입장완료' : ticket.payment_status === 'paid' ? '결제완료' : '미결제'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-14 text-[#888888]">
                  <Users className="h-8 w-8 mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium text-white mb-1">아직 참가자가 없습니다</p>
                  <p className="text-xs">이벤트 링크를 공유해보세요</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
