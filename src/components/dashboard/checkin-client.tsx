'use client'

import { useState, useRef } from 'react'
import { Event } from '@/lib/supabase/types'
import { mockTickets } from '@/lib/mock-data'
import { formatDateShort } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, QrCode, CheckCircle, XCircle, Search, Users } from 'lucide-react'
import Link from 'next/link'

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
  const [isScanning, setIsScanning] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const totalExpected = mockTickets.filter(
    (t) => t.event_id === event.id && t.payment_status === 'paid'
  ).length

  const processQRCode = (qrData: string) => {
    try {
      const data = JSON.parse(qrData)
      const ticket = mockTickets.find(
        (t) => t.event_id === event.id && JSON.parse(t.qr_code).t === data.t
      )

      if (!ticket) {
        setCheckInResult({
          status: 'not_found',
          message: '티켓을 찾을 수 없습니다',
        })
        return
      }

      if (ticket.payment_status !== 'paid') {
        setCheckInResult({
          status: 'invalid',
          message: '결제되지 않은 티켓입니다',
        })
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

      // Successful check-in
      setCheckedInCount((c) => c + 1)
      setCheckInResult({
        status: 'success',
        message: '입장 완료!',
        attendeeName: ticket.attendee_name,
        ticketType: ticket.ticket_type?.name,
      })
    } catch {
      // Try manual name/phone search
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
        setCheckInResult({
          status: 'not_found',
          message: '참가자를 찾을 수 없습니다',
        })
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
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--background)] border-b border-[var(--border)] px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[var(--muted-foreground)]">QR 체크인</p>
            <p className="text-sm font-semibold truncate">{event.title}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-lg font-bold">{checkedInCount}</p>
            <p className="text-xs text-[var(--muted-foreground)]">/ {totalExpected}명</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-[var(--muted-foreground)]">입장 현황</span>
            <span className="font-medium">{totalExpected > 0 ? Math.round((checkedInCount / totalExpected) * 100) : 0}%</span>
          </div>
          <div className="h-2 rounded-full bg-[var(--muted)] overflow-hidden">
            <div
              className="h-full bg-[var(--foreground)] rounded-full transition-all duration-500"
              style={{ width: totalExpected > 0 ? `${(checkedInCount / totalExpected) * 100}%` : '0%' }}
            />
          </div>
          <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-1.5">
            <span>입장완료 {checkedInCount}명</span>
            <span>예정 {totalExpected}명</span>
          </div>
        </div>

        {/* QR Scanner area */}
        <div className="mb-6">
          <div className="aspect-square max-h-72 rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--muted)] flex flex-col items-center justify-center gap-3 relative overflow-hidden">
            <QrCode className="h-16 w-16 text-[var(--border)]" />
            <p className="text-sm text-[var(--muted-foreground)] text-center px-4">
              카메라 QR 스캔은 실제 기기에서 지원됩니다
              <br />
              아래 수동 입력을 사용하세요
            </p>

            {/* Scan line animation */}
            {isScanning && (
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-0.5 bg-green-500 animate-bounce" />
              </div>
            )}
          </div>
        </div>

        {/* Check-in result */}
        {checkInResult && (
          <div
            className={`rounded-xl border p-5 mb-6 ${
              checkInResult.status === 'success'
                ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                : checkInResult.status === 'already'
                  ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'
                  : 'border-red-500 bg-red-50 dark:bg-red-950/20'
            }`}
          >
            <div className="flex items-center gap-3">
              {checkInResult.status === 'success' ? (
                <CheckCircle className="h-8 w-8 text-green-600 shrink-0" />
              ) : (
                <XCircle className={`h-8 w-8 shrink-0 ${checkInResult.status === 'already' ? 'text-yellow-600' : 'text-red-600'}`} />
              )}
              <div>
                <p className={`font-semibold ${
                  checkInResult.status === 'success' ? 'text-green-700 dark:text-green-400' :
                  checkInResult.status === 'already' ? 'text-yellow-700 dark:text-yellow-400' :
                  'text-red-700 dark:text-red-400'
                }`}>
                  {checkInResult.message}
                </p>
                {checkInResult.attendeeName && (
                  <p className="text-sm text-[var(--foreground)] mt-0.5">
                    {checkInResult.attendeeName}
                    {checkInResult.ticketType && ` · ${checkInResult.ticketType}`}
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full"
              onClick={resetResult}
            >
              다음 참가자
            </Button>
          </div>
        )}

        {/* Manual input */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">
            수동 검색
          </p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
              <input
                ref={inputRef}
                type="text"
                placeholder="이름 또는 전화번호 입력..."
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-[var(--border)] bg-transparent text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-colors"
              />
            </div>
            <Button onClick={handleManualSearch}>확인</Button>
          </div>

          {/* Quick test buttons */}
          <div className="pt-2">
            <p className="text-xs text-[var(--muted-foreground)] mb-2">테스트 (데모용)</p>
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
                    className="px-3 py-1.5 rounded-full text-xs border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
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
