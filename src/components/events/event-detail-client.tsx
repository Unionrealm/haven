'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Event } from '@/lib/supabase/types'
import { formatDateShort, formatTime, formatPrice, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TicketPurchaseModal } from '@/components/tickets/ticket-purchase-modal'
import {
  Calendar,
  MapPin,
  Users,
  Share2,
  ExternalLink,
  Clock,
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
      {/* Preview banner */}
      {isPreview && (
        <div className="bg-amber-500 text-black px-4 py-2 text-center text-sm font-medium">
          미리보기 모드 — 실제 공개 전 페이지입니다
          <Link href="/dashboard" className="ml-3 underline">
            대시보드로 이동
          </Link>
        </div>
      )}

      <div className="min-h-screen">
        {/* Hero */}
        <div className="relative w-full aspect-[21/9] max-h-[480px] bg-[var(--muted)]">
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
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center">
              <span className="text-6xl">🎵</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent" />

          {/* Back button */}
          <div className="absolute top-4 left-4">
            <Link href="/events">
              <Button variant="secondary" size="sm" className="backdrop-blur-sm bg-black/40 text-white border-0 hover:bg-black/60">
                <ArrowLeft className="h-3.5 w-3.5" />
                목록
              </Button>
            </Link>
          </div>

          {/* Share + Edit buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={handleShare}
              className="backdrop-blur-sm bg-black/40 text-white border-0 hover:bg-black/60"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            {isPreview && (
              <Link href="/events/create">
                <Button variant="secondary" size="sm" className="backdrop-blur-sm bg-black/40 text-white border-0 hover:bg-black/60">
                  <Edit className="h-3.5 w-3.5" />
                  수정
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title & meta */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="secondary">{event.category}</Badge>
                  <Badge variant="secondary">{event.location}</Badge>
                  {isSoldOut && <Badge variant="destructive">매진</Badge>}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 leading-tight">
                  {event.title}
                </h1>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-[var(--muted)] flex items-center justify-center shrink-0">
                      <Calendar className="h-4 w-4 text-[var(--muted-foreground)]" />
                    </div>
                    <div>
                      <p className="font-medium">{formatDateShort(event.date)}</p>
                      <p className="text-[var(--muted-foreground)]">
                        {formatTime(event.date)}
                        {event.end_date && ` — ${formatTime(event.end_date)}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-[var(--muted)] flex items-center justify-center shrink-0">
                      <MapPin className="h-4 w-4 text-[var(--muted-foreground)]" />
                    </div>
                    <div>
                      <p className="font-medium">{event.venue}</p>
                      <p className="text-[var(--muted-foreground)]">{event.address || event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-[var(--muted)] flex items-center justify-center shrink-0">
                      <Users className="h-4 w-4 text-[var(--muted-foreground)]" />
                    </div>
                    <div>
                      <p className="font-medium">{totalSold}명 참가 예정</p>
                      <p className="text-[var(--muted-foreground)]">총 {totalQuantity}석</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold mb-3">이벤트 소개</h2>
                <div
                  className="prose-haven text-sm leading-relaxed text-[var(--muted-foreground)]"
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              </div>

              {/* Map placeholder */}
              <div>
                <h2 className="text-lg font-semibold mb-3">오시는 길</h2>
                <div className="rounded-xl overflow-hidden border border-[var(--border)]">
                  <div className="bg-[var(--muted)] h-48 flex items-center justify-center">
                    <div className="text-center text-[var(--muted-foreground)]">
                      <MapPin className="h-8 w-8 mx-auto mb-2 opacity-40" />
                      <p className="text-sm font-medium">{event.venue}</p>
                      <p className="text-xs mt-1">{event.address || event.location}</p>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between bg-[var(--card)] border-t border-[var(--border)]">
                    <span className="text-sm text-[var(--muted-foreground)]">{event.address || event.location}</span>
                    <button className="flex items-center gap-1 text-xs text-[var(--foreground)] font-medium hover:opacity-70 transition-opacity">
                      카카오맵으로 보기
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar: Ticket purchase */}
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
                  <div className="p-5 border-b border-[var(--border)]">
                    <p className="text-xs text-[var(--muted-foreground)] mb-1">티켓</p>
                    <p className="text-2xl font-bold">
                      {formatPrice(minPrice)}
                      {event.ticket_types && event.ticket_types.length > 1 && minPrice > 0 && (
                        <span className="text-sm font-normal text-[var(--muted-foreground)]"> 부터</span>
                      )}
                    </p>
                  </div>

                  {/* Ticket types */}
                  <div className="p-5 space-y-3">
                    {event.ticket_types?.map((tt) => {
                      const isAvailable = tt.quantity_sold < tt.quantity
                      return (
                        <div
                          key={tt.id}
                          className={cn(
                            'flex items-center justify-between py-3 px-4 rounded-lg border transition-colors',
                            isAvailable
                              ? 'border-[var(--border)] hover:border-[var(--foreground)] cursor-pointer'
                              : 'border-[var(--border)] opacity-50'
                          )}
                          onClick={() => isAvailable && handleBuyTicket(tt.id)}
                        >
                          <div>
                            <p className="text-sm font-medium">{tt.name}</p>
                            {tt.description && (
                              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{tt.description}</p>
                            )}
                            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                              {isAvailable
                                ? `${tt.quantity - tt.quantity_sold}석 남음`
                                : '매진'}
                            </p>
                          </div>
                          <span className="text-sm font-semibold">
                            {formatPrice(tt.price)}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  <div className="px-5 pb-5">
                    <Button
                      className="w-full"
                      size="lg"
                      disabled={isSoldOut}
                      onClick={() => handleBuyTicket()}
                    >
                      {isSoldOut ? '매진되었습니다' : '티켓 구매하기'}
                    </Button>
                    <p className="text-xs text-[var(--muted-foreground)] text-center mt-3">
                      회원가입 없이 구매 가능합니다
                    </p>
                  </div>
                </div>

                {/* Organizer */}
                {event.organizer && (
                  <div className="mt-4 p-4 rounded-xl border border-[var(--border)]">
                    <p className="text-xs text-[var(--muted-foreground)] mb-2">주최자</p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[var(--muted)] flex items-center justify-center text-sm font-medium">
                        {event.organizer.name[0]}
                      </div>
                      <span className="text-sm font-medium">{event.organizer.name}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket purchase modal */}
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
