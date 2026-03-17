'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Event } from '@/lib/supabase/types'
import { formatDateShort, formatTime, formatPrice, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { TicketPurchaseModal } from '@/components/tickets/ticket-purchase-modal'
import {
  Calendar,
  MapPin,
  Users,
  Share2,
  ExternalLink,
  ArrowLeft,
  Edit,
} from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  event: Event
  isPreview?: boolean
}

export function EventDetailClient({ event, isPreview }: Props) {
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false)
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState<string>('')

  const totalSold = event.ticket_types?.reduce((sum, t) => sum + t.quantity_sold, 0) ?? 0
  const totalQuantity = event.ticket_types?.reduce((sum, t) => sum + t.quantity, 0) ?? 0
  const isSoldOut = totalSold >= totalQuantity && totalQuantity > 0
  const minPrice = event.ticket_types ? Math.min(...event.ticket_types.map((t) => t.price)) : 0

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: event.title, url })
    } else {
      await navigator.clipboard.writeText(url)
      toast.success('링크가 복사되었습니다')
    }
  }

  const handleBuyTicket = (ticketTypeId?: string) => {
    setSelectedTicketTypeId(ticketTypeId || event.ticket_types?.[0]?.id || '')
    setPurchaseModalOpen(true)
  }

  return (
    <>
      {isPreview && (
        <div className="bg-[var(--accent)] text-white px-4 py-2.5 text-center text-xs font-medium">
          미리보기 모드 — 실제 공개 전 페이지입니다
          <Link href="/dashboard" className="ml-3 underline underline-offset-2 opacity-80 hover:opacity-100">
            대시보드로 이동
          </Link>
        </div>
      )}

      <div className="min-h-screen bg-[var(--bg-1)]">
        {/* Hero */}
        <div className="relative w-full aspect-[21/9] max-h-[500px] bg-[var(--bg-2)]">
          {event.cover_image ? (
            <Image
              src={event.cover_image}
              alt={event.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-[var(--bg-2)] flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-[var(--bg-3)] border border-[var(--border-1)] flex items-center justify-center">
                <span className="text-[var(--text-3)] text-4xl">♪</span>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-1)] via-transparent to-transparent opacity-70" />

          <div className="absolute top-4 left-4">
            <Link href="/events">
              <button className="h-9 px-3 rounded-lg backdrop-blur-md bg-black/50 border border-white/10 flex items-center gap-1.5 text-white text-xs font-medium hover:bg-black/70 transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" />
                목록
              </button>
            </Link>
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleShare}
              className="h-9 w-9 rounded-lg backdrop-blur-md bg-black/50 border border-white/10 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <Share2 className="h-4 w-4" />
            </button>
            {isPreview && (
              <Link href="/events/create">
                <button className="h-9 px-3 rounded-lg backdrop-blur-md bg-black/50 border border-white/10 flex items-center gap-1.5 text-white text-xs font-medium hover:bg-black/70 transition-colors">
                  <Edit className="h-3.5 w-3.5" />
                  수정
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main */}
            <div className="lg:col-span-2 space-y-10">
              <div>
                {/* Genre pills — bg-3 + text-2, NO accent */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-[var(--bg-3)] text-[var(--text-2)] border border-[var(--border-1)]">
                    {event.category}
                  </span>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-[var(--bg-3)] text-[var(--text-2)] border border-[var(--border-1)]">
                    {event.location}
                  </span>
                  {isSoldOut && (
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-[var(--bg-3)] text-red-500 border border-[var(--border-1)]">
                      매진
                    </span>
                  )}
                </div>

                <h1 className="text-2xl md:text-3xl font-semibold text-[var(--text-1)] tracking-tight mb-6 leading-tight">
                  {event.title}
                </h1>

                <div className="space-y-4">
                  {/* Meta icons — text-3, NOT accent */}
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-9 h-9 rounded-lg bg-[var(--bg-3)] border border-[var(--border-1)] flex items-center justify-center shrink-0">
                      <Calendar className="h-4 w-4 text-[var(--text-3)]" />
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-1)]">{formatDateShort(event.date)}</p>
                      <p className="text-[var(--text-2)] text-xs mt-0.5">
                        {formatTime(event.date)}
                        {event.end_date && ` — ${formatTime(event.end_date)}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-9 h-9 rounded-lg bg-[var(--bg-3)] border border-[var(--border-1)] flex items-center justify-center shrink-0">
                      <MapPin className="h-4 w-4 text-[var(--text-3)]" />
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-1)]">{event.venue}</p>
                      <p className="text-[var(--text-2)] text-xs mt-0.5">{event.address || event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-9 h-9 rounded-lg bg-[var(--bg-3)] border border-[var(--border-1)] flex items-center justify-center shrink-0">
                      <Users className="h-4 w-4 text-[var(--text-3)]" />
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-1)]">{totalSold}명 참가 예정</p>
                      <p className="text-[var(--text-2)] text-xs mt-0.5">총 {totalQuantity}석</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-base font-semibold text-[var(--text-1)] mb-4">이벤트 소개</h2>
                <div
                  className="prose-haven text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              </div>

              {/* Venue */}
              <div>
                <h2 className="text-base font-semibold text-[var(--text-1)] mb-4">오시는 길</h2>
                <div className="rounded-xl overflow-hidden border border-[var(--border-1)]">
                  <div className="bg-[var(--bg-2)] h-44 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-8 w-8 mx-auto mb-2 text-[var(--text-3)] opacity-40" />
                      <p className="text-sm font-medium text-[var(--text-1)]">{event.venue}</p>
                      <p className="text-xs text-[var(--text-2)] mt-1">{event.address || event.location}</p>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between bg-[var(--bg-3)] border-t border-[var(--border-1)]">
                    <span className="text-xs text-[var(--text-2)] truncate">{event.address || event.location}</span>
                    <button className="flex items-center gap-1 text-xs text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors shrink-0 ml-3">
                      카카오맵
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar — ticket purchase */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-4">
                <div className="rounded-xl border border-[var(--border-1)] bg-[var(--bg-3)] overflow-hidden">
                  <div className="p-5 border-b border-[var(--border-1)]">
                    <p className="text-xs text-[var(--text-2)] mb-1">티켓 가격</p>
                    <p className="text-2xl font-semibold text-[var(--text-1)]">
                      {minPrice === 0 ? '무료' : formatPrice(minPrice)}
                      {event.ticket_types && event.ticket_types.length > 1 && minPrice > 0 && (
                        <span className="text-sm font-normal text-[var(--text-2)]"> 부터</span>
                      )}
                    </p>
                  </div>

                  {/* Ticket types */}
                  <div className="p-4 space-y-2">
                    {event.ticket_types?.map((tt) => {
                      const isAvailable = tt.quantity_sold < tt.quantity
                      const remaining = tt.quantity - tt.quantity_sold
                      const isUrgent = isAvailable && remaining <= 10
                      return (
                        <button
                          key={tt.id}
                          disabled={!isAvailable}
                          onClick={() => isAvailable && handleBuyTicket(tt.id)}
                          className={cn(
                            'w-full text-left px-4 py-3.5 rounded-lg border transition-all',
                            isAvailable
                              ? 'border-[var(--border-1)] hover:border-[var(--accent)] hover:bg-[var(--accent-subtle)] cursor-pointer'
                              : 'border-[var(--border-1)] opacity-40 cursor-not-allowed'
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[var(--text-1)]">{tt.name}</p>
                              {tt.description && (
                                <p className="text-xs text-[var(--text-2)] mt-0.5 leading-relaxed">{tt.description}</p>
                              )}
                              {/* Remaining seats: accent for urgency */}
                              <p className={cn(
                                'text-xs mt-1',
                                isUrgent ? 'text-[var(--accent)] font-medium' : 'text-[var(--text-3)]'
                              )}>
                                {isAvailable
                                  ? isUrgent ? `${remaining}석 남음` : `${remaining}석 남음`
                                  : '매진'}
                              </p>
                            </div>
                            {/* Price: text-1, NOT accent */}
                            <span className="text-sm font-semibold text-[var(--text-1)] shrink-0">
                              {tt.price === 0 ? '무료' : formatPrice(tt.price)}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  <div className="px-4 pb-5">
                    {/* CTA button — the ONE place accent bg is allowed */}
                    <Button
                      className="w-full"
                      size="lg"
                      disabled={isSoldOut}
                      onClick={() => handleBuyTicket()}
                    >
                      {isSoldOut ? '매진되었습니다' : '티켓 구매하기'}
                    </Button>
                    <p className="text-xs text-[var(--text-3)] text-center mt-3">
                      회원가입 없이 구매 가능합니다
                    </p>
                  </div>
                </div>

                {event.organizer && (
                  <div className="p-4 rounded-xl border border-[var(--border-1)] bg-[var(--bg-3)]">
                    <p className="text-xs text-[var(--text-2)] mb-3">주최자</p>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[var(--bg-4)] flex items-center justify-center text-sm font-semibold text-[var(--text-2)]">
                        {event.organizer.name[0]}
                      </div>
                      <span className="text-sm font-medium text-[var(--text-1)]">{event.organizer.name}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {purchaseModalOpen && (
        <TicketPurchaseModal
          event={event}
          initialTicketTypeId={selectedTicketTypeId}
          onClose={() => setPurchaseModalOpen(false)}
        />
      )}
    </>
  )
}
