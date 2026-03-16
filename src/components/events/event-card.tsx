import Link from 'next/link'
import Image from 'next/image'
import { Event } from '@/lib/supabase/types'
import { formatDateShort, formatTime, formatPrice, cn } from '@/lib/utils'
import { MapPin, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface EventCardProps {
  event: Event
  className?: string
}

export function EventCard({ event, className }: EventCardProps) {
  const firstTicketType = event.ticket_types?.[0]
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

  return (
    <Link href={`/event/${event.slug}`} className={cn('group block', className)}>
      <div className="event-card rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--card)]">
        {/* Cover image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-[var(--muted)]">
          {event.cover_image ? (
            <Image
              src={event.cover_image}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
              <span className="text-4xl">🎵</span>
            </div>
          )}
          {isSoldOut && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold text-sm px-3 py-1 bg-black/60 rounded-full">
                매진
              </span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="text-xs backdrop-blur-sm bg-black/40 text-white border-0">
              {event.category}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-[var(--muted-foreground)] mb-1.5 font-medium">
            {formatDateShort(event.date)} · {formatTime(event.date)}
          </p>
          <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-[var(--muted-foreground)] transition-colors">
            {event.title}
          </h3>
          <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)] mb-3">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{event.venue} · {event.location}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">
              {formatPrice(minPrice)}
              {event.ticket_types && event.ticket_types.length > 1 && minPrice > 0 && (
                <span className="text-xs font-normal text-[var(--muted-foreground)]"> ~</span>
              )}
            </span>
            <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
              <Users className="h-3 w-3" />
              <span>{totalSold}/{totalQuantity}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
