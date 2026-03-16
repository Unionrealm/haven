'use client'

import { Event, TicketType } from '@/lib/supabase/types'
import { formatDateShort, formatTime } from '@/lib/utils'
import QRCode from 'react-qr-code'
import { MapPin, Calendar } from 'lucide-react'

interface Props {
  event: Event
  ticketType: TicketType
  attendeeName: string
  qrData: string
  ticketNumber?: number
  totalTickets?: number
}

export function QRTicket({ event, ticketType, attendeeName, qrData, ticketNumber = 1, totalTickets = 1 }: Props) {
  return (
    <div className="rounded-xl border border-[var(--border)] overflow-hidden bg-[var(--card)]">
      {/* Top section */}
      <div className="p-5 border-b border-dashed border-[var(--border)]">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-xs font-medium text-[var(--muted-foreground)] mb-1">Haven Ticket</p>
            <h3 className="font-bold text-base leading-tight">{event.title}</h3>
          </div>
          {totalTickets > 1 && (
            <span className="shrink-0 text-xs font-medium px-2 py-1 rounded bg-[var(--muted)] text-[var(--muted-foreground)]">
              {ticketNumber}/{totalTickets}
            </span>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>{formatDateShort(event.date)} {formatTime(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span>{event.venue}</span>
          </div>
        </div>
      </div>

      {/* Bottom section: QR + info */}
      <div className="p-5 flex items-center gap-5">
        <div className="bg-white p-2 rounded-lg shrink-0">
          <QRCode
            value={qrData}
            size={96}
            level="M"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="space-y-2">
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">참가자</p>
              <p className="text-sm font-semibold">{attendeeName}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">티켓 종류</p>
              <p className="text-sm font-medium">{ticketType.name}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">가격</p>
              <p className="text-sm font-medium">
                {ticketType.price === 0 ? '무료' : `₩${ticketType.price.toLocaleString()}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-[var(--muted)] border-t border-[var(--border)]">
        <p className="text-xs text-[var(--muted-foreground)] text-center">
          입장 시 QR 코드를 제시해주세요 · Haven
        </p>
      </div>
    </div>
  )
}
