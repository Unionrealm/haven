import Link from 'next/link'
import Image from 'next/image'
import { Event } from '@/lib/supabase/types'
import { formatDateShort, formatTime, formatPrice, cn } from '@/lib/utils'
import { MapPin, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface EventCardProps {
  event: Event
  className?: string
}

export function EventCard({ event, className }: EventCardProps) {
  const minPrice = event.ticket_types
    ? Math.min(...event.ticket_types.map((t) => t.price))
    : 0
  const totalSold = event.ticket_types
    ? event.ticket_types.reduce((sum, t) => sum + t.quantity_sold, 0)
    : 0
  const totalQuantity = event.ticket_types
    ? event.ticket_types.reduce((sum, t) => sum + t.quantity, 0)
    : 0
  const isSoldOut = totalSold >= totalQuantity && totalQuantity > 0
  const soldPercent = totalQuantity > 0 ? Math.min((totalSold / totalQuantity) * 100, 100) : 0

  return (
    <Link href={`/event/${event.slug}`} className={cn('group block', className)}>
      <div className="event-card rounded-xl overflow-hidden border border-[#1e1e1e] bg-[#161616]">
        {/* Cover image */}
        <div className="relative aspect-[3/2] overflow-hidden bg-[#111111]">
          {event.cover_image ? (
            <Image
              src={event.cover_image}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[#111111]">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-[#161616] border border-[#1e1e1e] flex items-center justify-center mx-auto mb-2">
                  <span className="text-[#5A42F5] text-lg">♪</span>
                </div>
              </div>
            </div>
          )}

          {/* Overlays */}
          {isSoldOut && (
            <div className="absolute inset-0 bg-[#0a0a0a]/70 flex items-center justify-center">
              <span className="text-white font-semibold text-sm px-3 py-1 border border-white/20 rounded-full bg-black/60">
                매진
              </span>
            </div>
          )}

          <div className="absolute top-3 left-3">
            <Badge variant="default" className="backdrop-blur-sm bg-[#2A1E8A]/90 border-0 text-[#C4B5FD]">
              {event.category}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-1.5 text-xs text-[#888888] mb-2">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>{formatDateShort(event.date)} · {formatTime(event.date)}</span>
          </div>

          <h3 className="font-semibold text-sm text-white leading-snug mb-2 line-clamp-2 group-hover:text-[#C4B5FD] transition-colors">
            {event.title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-[#888888] mb-4">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{event.venue} · {event.location}</span>
          </div>

          {/* Price + progress */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#5A42F5]">
              {minPrice === 0 ? '무료' : formatPrice(minPrice)}
              {event.ticket_types && event.ticket_types.length > 1 && minPrice > 0 && (
                <span className="text-xs font-normal text-[#888888]"> ~</span>
              )}
            </span>
            <span className="text-xs text-[#444444]">{soldPercent.toFixed(0)}% 판매</span>
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-0.5 rounded-full bg-[#1e1e1e] overflow-hidden">
            <div
              className="h-full bg-[#5A42F5] rounded-full transition-all"
              style={{ width: `${soldPercent}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
