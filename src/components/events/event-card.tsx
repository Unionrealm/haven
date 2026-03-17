import Link from 'next/link'
import Image from 'next/image'
import { Event } from '@/lib/supabase/types'
import { formatDateShort, formatTime, formatPrice, cn } from '@/lib/utils'
import { MapPin, Calendar } from 'lucide-react'

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
  const remaining = totalQuantity - totalSold
  const isUrgent = remaining > 0 && remaining <= 10

  return (
    <Link href={`/event/${event.slug}`} className={cn('group block', className)}>
      <div className="event-card rounded-xl overflow-hidden border border-[var(--border-1)] bg-[var(--bg-3)]">
        {/* Cover image */}
        <div className="relative aspect-[3/2] overflow-hidden bg-[var(--bg-2)]">
          {event.cover_image ? (
            <Image
              src={event.cover_image}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-2)]">
              <div className="w-12 h-12 rounded-xl bg-[var(--bg-3)] border border-[var(--border-1)] flex items-center justify-center">
                <span className="text-[var(--text-3)] text-lg">♪</span>
              </div>
            </div>
          )}

          {isSoldOut && (
            <div className="absolute inset-0 bg-[var(--bg-1)]/70 flex items-center justify-center">
              <span className="text-[var(--text-2)] font-medium text-sm px-3 py-1 border border-[var(--border-2)] rounded-full bg-[var(--bg-1)]/60">
                매진
              </span>
            </div>
          )}

          {/* Genre tag: uppercase 10px, text-3 — no accent */}
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-medium uppercase tracking-wide text-white/80 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md">
              {event.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Date row — meta icons use text-3 */}
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-3)] mb-2">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>{formatDateShort(event.date)} · {formatTime(event.date)}</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-sm text-[var(--text-1)] leading-snug mb-2 line-clamp-2 group-hover:text-[var(--text-2)] transition-colors">
            {event.title}
          </h3>

          {/* Venue — meta icons use text-3 */}
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-2)] mb-4">
            <MapPin className="h-3 w-3 shrink-0 text-[var(--text-3)]" />
            <span className="truncate">{event.venue} · {event.location}</span>
          </div>

          {/* Price row — text-1 semibold, NO accent; urgency seats use accent */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[var(--text-1)]">
              {minPrice === 0 ? '무료' : formatPrice(minPrice)}
              {event.ticket_types && event.ticket_types.length > 1 && minPrice > 0 && (
                <span className="text-xs font-normal text-[var(--text-2)]"> ~</span>
              )}
            </span>

            {/* Remaining seats: accent ONLY when urgent (≤10), otherwise text-3 */}
            {!isSoldOut && totalQuantity > 0 && (
              <span className={cn(
                'text-xs font-medium',
                isUrgent ? 'text-[var(--accent)]' : 'text-[var(--text-3)]'
              )}>
                {isUrgent ? `${remaining}석 남음` : `${totalSold}/${totalQuantity}명`}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
