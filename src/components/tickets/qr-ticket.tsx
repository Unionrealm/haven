'use client'

import { Event, TicketType } from '@/lib/supabase/types'
import { formatDateShort, formatTime } from '@/lib/utils'
import QRCode from 'react-qr-code'
import { MapPin, Calendar, Cloud } from 'lucide-react'

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
    <div className="rounded-2xl overflow-hidden border border-[var(--border-1)] bg-[var(--bg-3)]">
      {/* Brand bar — accent bg is the ONE decorative exception for brand identity */}
      <div className="bg-[var(--accent)] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cloud className="w-4 h-4 text-white" strokeWidth={2.5} />
          <span className="text-white text-xs font-semibold tracking-wide">Haven Ticket</span>
        </div>
        {totalTickets > 1 && (
          <span className="text-white/70 text-xs font-medium">
            {ticketNumber} / {totalTickets}
          </span>
        )}
      </div>

      {/* Event info */}
      <div className="px-5 py-5 border-b border-dashed border-[var(--border-2)]">
        <p className="text-xs text-[var(--text-3)] mb-1">{ticketType.name}</p>
        <h3 className="font-semibold text-[var(--text-1)] text-base leading-snug mb-4">{event.title}</h3>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-[var(--text-2)]">
            <Calendar className="h-3.5 w-3.5 text-[var(--text-3)] shrink-0" />
            <span>{formatDateShort(event.date)} · {formatTime(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-2)]">
            <MapPin className="h-3.5 w-3.5 text-[var(--text-3)] shrink-0" />
            <span>{event.venue}</span>
          </div>
        </div>
      </div>

      {/* QR code */}
      <div className="px-5 py-6 flex flex-col items-center">
        <div className="bg-white p-4 rounded-xl mb-5">
          <QRCode value={qrData} size={160} level="M" style={{ display: 'block' }} />
        </div>

        <div className="w-full space-y-3 text-center">
          <div>
            <p className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-0.5">참가자</p>
            <p className="text-sm font-semibold text-[var(--text-1)]">{attendeeName}</p>
          </div>
          <div>
            <p className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-0.5">티켓 종류</p>
            <p className="text-sm font-medium text-[var(--text-1)]">{ticketType.name}</p>
          </div>
          <div>
            <p className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-0.5">가격</p>
            <p className="text-sm font-semibold text-[var(--text-1)]">
              {ticketType.price === 0 ? '무료' : `₩${ticketType.price.toLocaleString()}`}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-[var(--bg-2)] border-t border-[var(--border-1)]">
        <p className="text-[10px] text-[var(--text-3)] text-center tracking-wide uppercase">
          입장 시 QR 코드를 제시해주세요 · Haven
        </p>
      </div>
    </div>
  )
}
