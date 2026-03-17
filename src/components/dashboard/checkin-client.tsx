'use client'

import { useState, useRef } from 'react'
import { Event } from '@/lib/supabase/types'
import { mockTickets } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { ArrowLeft, QrCode, CheckCircle, XCircle, Search } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface CheckInResult {
  status: 'success' | 'already' | 'not_found' | 'invalid'
  message: string
  attendeeName?: string
  ticketType?: string
}

interface Props {
  event: Event
}

export function CheckInClient({ event }: Props) {
  const [manualInput, setManualInput] = useState('')
  const [checkInResult, setCheckInResult] = useState<CheckInResult | null>(null)
  const [checkedInCount, setCheckedInCount] = useState(
    mockTickets.filter((t) => t.event_id === event.id && t.checked_in).length
  )
  const inputRef = useRef<HTMLInputElement>(null)

  const totalExpected = mockTickets.filter(
    (t) => t.event_id === event.id && t.payment_status === 'paid'
  ).length

  const checkPercent = totalExpected > 0 ? Math.round((checkedInCount / totalExpected) * 100) : 0

  const processQRCode = (qrData: string) => {
    try {
      const data = JSON.parse(qrData)
      const ticket = mockTickets.find(
        (t) => t.event_id === event.id && JSON.parse(t.qr_code).t === data.t
      )
      if (!ticket) {
        setCheckInResult({ status: 'not_found', message: '티켓을 찾을 수 없습니다' })
        return
      }
      if (ticket.payment_status !== 'paid') {
        setCheckInResult({ status: 'invalid', message: '결제되지 않은 티켓입니다' })
        return
      }
      if (ticket.checked_in) {
        setCheckInResult({
          status: 'already',
          message: '이미 입장한 티켓입니다',
          attendeeName: ticket.attendee_name,
          ticketType: ticket.ticket_type?.name,
        })
        return
      }
      setCheckedInCount((c) => c + 1)
      setCheckInResult({
        status: 'success',
        message: '입장 완료!',
        attendeeName: ticket.attendee_name,
        ticketType: ticket.ticket_type?.name,
      })
    } catch {
      const ticket = mockTickets.find(
        (t) =>
          t.event_id === event.id &&
          (t.attendee_name.includes(qrData) || t.attendee_phone.includes(qrData))
      )
      if (ticket) {
        setCheckInResult({
          status: ticket.checked_in ? 'already' : 'success',
          message: ticket.checked_in ? '이미 입장한 참가자입니다' : '입장 완료!',
          attendeeName: ticket.attendee_name,
          ticketType: ticket.ticket_type?.name,
        })
        if (!ticket.checked_in) setCheckedInCount((c) => c + 1)
      } else {
        setCheckInResult({ status: 'not_found', message: '참가자를 찾을 수 없습니다' })
      }
    }
  }

  const handleManualSearch = () => {
    if (!manualInput.trim()) return
    processQRCode(manualInput.trim())
    setManualInput('')
  }

  const resetResult = () => {
    setCheckInResult(null)
    inputRef.current?.focus()
  }

  return (
    <div className="min-h-screen bg-[var(--bg-1)]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--bg-1)] border-b border-[var(--border-1)] px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Link href="/dashboard">
            <button className="h-9 w-9 rounded-lg border border-[var(--border-1)] flex items-center justify-center text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--bg-3)] transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[var(--text-2)]">QR 체크인</p>
            <p className="text-sm font-semibold text-[var(--text-1)] truncate">{event.title}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xl font-semibold text-[var(--text-1)]">{checkedInCount}</p>
            <p className="text-xs text-[var(--text-2)]">/ {totalExpected}명</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-8 p-5 rounded-xl border border-[var(--border-1)] bg-[var(--bg-3)]">
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-[var(--text-2)]">입장 현황</span>
            <span className="font-semibold text-[var(--text-1)]">{checkPercent}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-[var(--bg-4)] overflow-hidden">
            <div
              className="h-full bg-[var(--accent)] rounded-full transition-all duration-500"
              style={{ width: `${checkPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-[var(--text-2)] mt-2.5">
            <span>입장완료 {checkedInCount}명</span>
            <span>예정 {totalExpected}명</span>
          </div>
        </div>

        {/* QR scanner area */}
        <div className="mb-6">
          <div className="aspect-square max-h-64 rounded-2xl border border-dashed border-[var(--border-2)] bg-[var(--bg-2)] flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[var(--bg-3)] border border-[var(--border-1)] flex items-center justify-center">
              <QrCode className="h-8 w-8 text-[var(--text-2)]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-[var(--text-1)] mb-1">QR 스캔 준비됨</p>
              <p className="text-xs text-[var(--text-2)]">카메라 스캔은 실제 기기에서 지원됩니다</p>
            </div>
          </div>
        </div>

        {/* Check-in result */}
        {checkInResult && (
          <div
            className={cn(
              'rounded-xl border p-5 mb-6',
              checkInResult.status === 'success'
                ? 'border-green-800/40 bg-green-900/10'
                : checkInResult.status === 'already'
                  ? 'border-yellow-800/40 bg-yellow-900/10'
                  : 'border-red-900/40 bg-red-900/10'
            )}
          >
            <div className="flex items-center gap-4">
              {checkInResult.status === 'success' ? (
                <CheckCircle className="h-9 w-9 text-green-500 shrink-0" />
              ) : (
                <XCircle className={cn(
                  'h-9 w-9 shrink-0',
                  checkInResult.status === 'already' ? 'text-yellow-500' : 'text-red-500'
                )} />
              )}
              <div>
                <p className={cn(
                  'font-semibold text-sm',
                  checkInResult.status === 'success' ? 'text-green-500' :
                  checkInResult.status === 'already' ? 'text-yellow-500' :
                  'text-red-500'
                )}>
                  {checkInResult.message}
                </p>
                {checkInResult.attendeeName && (
                  <p className="text-sm text-[var(--text-1)] mt-1">
                    {checkInResult.attendeeName}
                    {checkInResult.ticketType && (
                      <span className="text-[var(--text-2)]"> · {checkInResult.ticketType}</span>
                    )}
                  </p>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-4 w-full" onClick={resetResult}>
              다음 참가자
            </Button>
          </div>
        )}

        {/* Manual input */}
        <div className="space-y-3">
          <p className="text-[10px] font-medium text-[var(--text-3)] uppercase tracking-widest">수동 검색</p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-3)]" />
              <input
                ref={inputRef}
                type="text"
                placeholder="이름 또는 전화번호..."
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                className="w-full h-11 pl-9 pr-3 rounded-lg border border-[var(--border-1)] bg-[var(--bg-2)] text-sm text-[var(--text-1)] placeholder:text-[var(--text-3)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>
            <Button onClick={handleManualSearch}>확인</Button>
          </div>

          {/* Demo attendee buttons */}
          <div>
            <p className="text-xs text-[var(--text-3)] mb-2">테스트 (데모용)</p>
            <div className="flex flex-wrap gap-2">
              {mockTickets
                .filter((t) => t.event_id === event.id)
                .map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setManualInput(t.attendee_name)
                      processQRCode(t.attendee_name)
                    }}
                    className="px-3 py-1.5 rounded-full text-xs border border-[var(--border-1)] text-[var(--text-2)] hover:border-[var(--border-2)] hover:text-[var(--text-1)] transition-colors"
                  >
                    {t.attendee_name}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
