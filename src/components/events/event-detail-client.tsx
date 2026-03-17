'use client'

import { useState, useRef } from 'react'
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
  ChevronLeft,
  ChevronRight,
  Instagram,
} from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  event: Event
  isPreview?: boolean
}

// Mock gallery images for the artist intro tab
const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80',
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&q=80',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
  'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=600&q=80',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
  'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=600&q=80',
  'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&q=80',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80',
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80',
]

// Additional slider images
const SLIDER_IMAGES_EXTRA = [
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80',
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&q=80',
]

export function EventDetailClient({ event, isPreview }: Props) {
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false)
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'info' | 'about'>('info')

  // Slider state
  const sliderImages = [
    event.cover_image,
    ...SLIDER_IMAGES_EXTRA,
  ].filter(Boolean) as string[]
  const [currentSlide, setCurrentSlide] = useState(0)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const prevSlide = () => setCurrentSlide((i) => (i === 0 ? sliderImages.length - 1 : i - 1))
  const nextSlide = () => setCurrentSlide((i) => (i === sliderImages.length - 1 ? 0 : i + 1))

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX
    const delta = touchStartX.current - touchEndX.current
    if (Math.abs(delta) > 40) {
      if (delta > 0) nextSlide()
      else prevSlide()
    }
  }

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

  const tabs = [
    { id: 'info' as const, label: '공연 정보' },
    { id: 'about' as const, label: '아티스트 소개' },
  ]

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

        {/* ── Image Slider ─────────────────────────────── */}
        <div
          className="relative w-full overflow-hidden bg-[var(--bg-2)]"
          style={{ aspectRatio: '16/9', maxHeight: '520px' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Slides */}
          <div
            className="flex h-full transition-transform duration-300 ease-out will-change-transform"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {sliderImages.map((src, i) => (
              <div key={i} className="relative w-full h-full shrink-0">
                <Image
                  src={src}
                  alt={`${event.title} — ${i + 1}`}
                  fill
                  priority={i === 0}
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            ))}
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-1)] via-transparent to-transparent opacity-75 pointer-events-none" />

          {/* Back + share buttons */}
          <div className="absolute top-4 left-4 z-10">
            <Link href="/events">
              <button className="h-9 px-3 rounded-lg backdrop-blur-md bg-black/50 border border-white/10 flex items-center gap-1.5 text-white text-xs font-medium hover:bg-black/70 transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" />
                목록
              </button>
            </Link>
          </div>
          <div className="absolute top-4 right-4 flex gap-2 z-10">
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

          {/* Desktop prev/next arrows */}
          {sliderImages.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full backdrop-blur-md bg-black/50 border border-white/10 items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextSlide}
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full backdrop-blur-md bg-black/50 border border-white/10 items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Dot indicators */}
          {sliderImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {sliderImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-200',
                    i === currentSlide ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Content ──────────────────────────────────── */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6">

          {/* Title + meta chips */}
          <div className="pt-6 pb-0">
            {/* Category chips — brand tint for accent */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-[var(--accent-tag)] text-[var(--accent)] border border-[var(--accent-subtle)]">
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

            <h1 className="text-2xl md:text-3xl font-semibold text-[var(--text-1)] tracking-tight mb-2 leading-tight">
              {event.title}
            </h1>
            <p className="text-sm text-[var(--text-2)] mb-6">{event.venue} · {event.location}</p>
          </div>

          {/* Tab bar */}
          <div className="flex gap-0 border-b border-[var(--border-1)] mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-4 py-3 text-sm font-medium transition-colors relative',
                  activeTab === tab.id
                    ? 'text-[var(--text-1)]'
                    : 'text-[var(--text-2)] hover:text-[var(--text-1)]'
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Grid: main content + desktop sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-28 lg:pb-16">

            {/* ── Tab content ── */}
            <div className="lg:col-span-2">

              {/* TAB 1: 공연 정보 */}
              {activeTab === 'info' && (
                <div className="space-y-8">
                  {/* Meta */}
                  <div className="space-y-4">
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

                  {/* Ticket types on mobile (shown in info tab, not bottom bar detail) */}
                  <div className="lg:hidden rounded-xl border border-[var(--border-1)] bg-[var(--bg-3)] overflow-hidden">
                    <div className="p-4 border-b border-[var(--border-1)]">
                      <p className="text-xs text-[var(--text-2)] mb-1">티켓 가격</p>
                      <p className="text-xl font-semibold text-[var(--text-1)]">
                        {minPrice === 0 ? '무료' : formatPrice(minPrice)}
                        {event.ticket_types && event.ticket_types.length > 1 && minPrice > 0 && (
                          <span className="text-sm font-normal text-[var(--text-2)]"> 부터</span>
                        )}
                      </p>
                    </div>
                    <div className="p-3 space-y-2">
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
                              'w-full text-left px-4 py-3 rounded-lg border transition-all',
                              isAvailable
                                ? 'border-[var(--border-1)] hover:border-[var(--accent)] hover:bg-[var(--accent-subtle)] cursor-pointer'
                                : 'border-[var(--border-1)] opacity-40 cursor-not-allowed'
                            )}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[var(--text-1)]">{tt.name}</p>
                                {tt.description && (
                                  <p className="text-xs text-[var(--text-2)] mt-0.5">{tt.description}</p>
                                )}
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-sm font-semibold text-[var(--text-1)]">
                                  {tt.price === 0 ? '무료' : formatPrice(tt.price)}
                                </p>
                                <p className={cn('text-xs', isUrgent ? 'text-[var(--accent)] font-medium' : 'text-[var(--text-3)]')}>
                                  {isAvailable ? `${remaining}석 남음` : '매진'}
                                </p>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Venue map */}
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

                  {/* Organizer */}
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
              )}

              {/* TAB 2: 아티스트 소개 */}
              {activeTab === 'about' && (
                <div className="space-y-10">
                  {/* Event description */}
                  <div>
                    <h2 className="text-base font-semibold text-[var(--text-1)] mb-4">이벤트 소개</h2>
                    <div
                      className="prose-haven text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: event.description }}
                    />

                    {/* Artist intro block */}
                    <div className="mt-6 p-5 rounded-xl bg-[var(--bg-3)] border border-[var(--border-1)] space-y-3">
                      <p className="text-sm font-semibold text-[var(--text-1)]">소란 (Soran)</p>
                      <p className="text-sm text-[var(--text-2)] leading-relaxed">
                        2011년 결성된 인디 밴드 소란은 서정적인 가사와 탄탄한 라이브 연주로 국내 인디씬을 대표하는
                        팀입니다. '봄', '청춘', '안녕' 등 수록된 모든 곡이 꾸준히 사랑받고 있으며,
                        단독 공연마다 전석 매진을 기록하고 있습니다.
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <button className="flex items-center gap-1.5 text-xs text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors">
                          <Instagram className="h-3.5 w-3.5" />
                          @soran_official
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Instagram-style gallery grid */}
                  <div>
                    <h2 className="text-base font-semibold text-[var(--text-1)] mb-4">이전 공연 사진</h2>
                    <div className="grid grid-cols-3 gap-1 rounded-xl overflow-hidden">
                      {GALLERY_IMAGES.map((src, i) => (
                        <div
                          key={i}
                          className="relative aspect-square overflow-hidden bg-[var(--bg-3)] cursor-pointer group"
                        >
                          <Image
                            src={src}
                            alt={`공연 사진 ${i + 1}`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 33vw, 200px"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-[var(--text-3)] text-center mt-3">이전 공연 현장 사진</p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Desktop sidebar ── */}
            <div className="hidden lg:block lg:col-span-1">
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
                              <p className={cn('text-xs mt-1', isUrgent ? 'text-[var(--accent)] font-medium' : 'text-[var(--text-3)]')}>
                                {isAvailable ? `${remaining}석 남음` : '매진'}
                              </p>
                            </div>
                            <span className="text-sm font-semibold text-[var(--text-1)] shrink-0">
                              {tt.price === 0 ? '무료' : formatPrice(tt.price)}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  <div className="px-4 pb-5">
                    <Button className="w-full" size="lg" disabled={isSoldOut} onClick={() => handleBuyTicket()}>
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

      {/* ── Mobile floating buy button ──────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[var(--bg-1)]/95 backdrop-blur border-t border-[var(--border-1)] px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[var(--text-2)] truncate">{event.title}</p>
            <p className="text-sm font-semibold text-[var(--text-1)]">
              {minPrice === 0 ? '무료' : formatPrice(minPrice)}
              {event.ticket_types && event.ticket_types.length > 1 && minPrice > 0 && (
                <span className="text-xs font-normal text-[var(--text-2)]"> 부터</span>
              )}
            </p>
          </div>
          <Button
            className="shrink-0 min-w-[120px]"
            size="sm"
            disabled={isSoldOut}
            onClick={() => handleBuyTicket()}
          >
            {isSoldOut ? '매진' : '티켓 구매하기'}
          </Button>
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
