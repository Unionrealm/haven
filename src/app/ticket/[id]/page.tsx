import { notFound } from 'next/navigation'
import { mockTickets, mockEvents } from '@/lib/mock-data'
import { QRTicket } from '@/components/tickets/qr-ticket'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: '내 티켓',
}

export default async function TicketPage({ params }: Props) {
  const { id } = await params
  const ticket = mockTickets.find((t) => t.id === id)
  if (!ticket) notFound()

  const event = mockEvents.find((e) => e.id === ticket.event_id)
  if (!event) notFound()

  const ticketType = event.ticket_types?.find((tt) => tt.id === ticket.ticket_type_id)
  if (!ticketType) notFound()

  return (
    <div className="min-h-screen max-w-sm mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link href={`/event/${event.slug}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
            이벤트로 돌아가기
          </Button>
        </Link>
      </div>

      <h1 className="text-xl font-bold mb-6">내 티켓</h1>

      <QRTicket
        event={event}
        ticketType={ticketType}
        attendeeName={ticket.attendee_name}
        qrData={ticket.qr_code}
      />

      <div className="mt-6 text-center">
        <p className="text-xs text-[var(--muted-foreground)]">
          입장 시 QR 코드를 주최자에게 보여주세요.
          <br />
          스크린샷으로 저장해두면 오프라인에서도 사용 가능합니다.
        </p>
      </div>
    </div>
  )
}
