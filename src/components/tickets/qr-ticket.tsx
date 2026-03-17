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
    <div className="rounded-2xl overflow-hidden border border-[#1e1e1e] bg-[#161616]">
      {/* Top brand bar */}
      <div className="bg-[#5A42F5] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center">
            <span className="text-white text-[10px] font-semibold">H</span>
          </div>
          <span className="text-white text-xs font-semibold tracking-wide">Haven Ticket</span>
        </div>
        {totalTickets > 1 && (
          <span className="text-white/70 text-xs font-medium">
            {ticketNumber} / {totalTickets}
          </span>
        )}
      </div>

      {/* Event info */}
      <div className="px-5 py-5 border-b border-dashed border-[#1e1e1e]">
        <p className="text-xs text-[#888888] mb-1">{ticketType.name}</p>
        <h3 className="font-semibold text-white text-base leading-snug mb-4">{event.title}</h3>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#888888]">
            <Calendar className="h-3.5 w-3.5 text-[#5A42F5] shrink-0" />
            <span>{formatDateShort(event.date)} · {formatTime(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#888888]">
            <MapPin className="h-3.5 w-3.5 text-[#5A42F5] shrink-0" />
            <span>{event.venue}</span>
          </div>
        </div>
      </div>

      {/* QR code */}
      <div className="px-5 py-6 flex flex-col items-center">
        <div className="bg-white p-4 rounded-xl mb-5">
          <QRCode
            value={qrData}
            size={160}
            level="M"
            style={{ display: 'block' }}
          />
        </div>

        <div className="w-full space-y-2.5 text-center">
          <div>
            <p className="text-xs text-[#888888] mb-0.5">참가자</p>
            <p className="text-sm font-semibold text-white">{attendeeName}</p>
          </div>
          <div>
            <p className="text-xs text-[#888888] mb-0.5">티켓 종류</p>
            <p className="text-sm font-medium text-white">{ticketType.name}</p>
          </div>
          <div>
            <p className="text-xs text-[#888888] mb-0.5">가격</p>
            <p className="text-sm font-semibold text-[#5A42F5]">
              {ticketType.price === 0 ? '무료' : `₩${ticketType.price.toLocaleString()}`}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-[#111111] border-t border-[#1e1e1e]">
        <p className="text-[10px] text-[#444444] text-center tracking-wide uppercase">
          입장 시 QR 코드를 제시해주세요 · Haven
        </p>
      </div>
    </div>
  )
}
