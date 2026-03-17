'use client'

import { useState, useRef } from 'react'
import { Event } from '@/lib/supabase/types'
import { mockTickets } from '@/lib/mock-data'
import { formatDateShort } from '@/lib/utils'
import { Button } from '@/components/ui/button'
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
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0a0a0a] border-b border-[#1e1e1e] px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Link href="/dashboard">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#888888]">QR 체크인</p>
            <p className="text-sm font-semibold text-white truncate">{event.title}</p>
          </div>
          <div className="text-right shrink-0 min-w-[60px]">
            <p className="text-xl font-semibold text-white">{checkedInCount}</p>
            <p className="text-xs text-[#888888]">/ {totalExpected}명</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-8 p-5 rounded-xl border border-[#1e1e1e] bg-[#161616]">
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-[#888888]">입장 현황</span>
            <span className="font-semibold text-white">{checkPercent}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-[#1e1e1e] overflow-hidden">
            <div
              className="h-full bg-[#5A42F5] rounded-full transition-all duration-500"
              style={{ width: `${checkPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-[#888888] mt-2.5">
            <span>입장완료 {checkedInCount}명</span>
            <span>예정 {totalExpected}명</span>
          </div>
        </div>

        {/* QR Scanner placeholder */}
        <div className="mb-6">
          <div className="aspect-square max-h-64 rounded-2xl border border-dashed border-[#1e1e1e] bg-[#111111] flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#161616] border border-[#1e1e1e] flex items-center justify-center">
              <QrCode className="h-8 w-8 text-[#5A42F5]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-white mb-1">QR 스캔 준비됨</p>
              <p className="text-xs text-[#888888]">
                카메라 스캔은 실제 기기에서 지원됩니다
              </p>
            </div>
          </div>
        </div>

        {/* Check-in result */}
        {checkInResult && (
          <div
            className={`rounded-xl border p-5 mb-6 ${
              checkInResult.status === 'success'
                ? 'border-green-800 bg-[#0a1f12]'
                : checkInResult.status === 'already'
                  ? 'border-yellow-800 bg-[#1a1500]'
                  : 'border-red-900 bg-[#1a0808]'
            }`}
          >
            <div className="flex items-center gap-4">
              {checkInResult.status === 'success' ? (
                <CheckCircle className="h-9 w-9 text-green-400 shrink-0" />
              ) : (
                <XCircle className={`h-9 w-9 shrink-0 ${checkInResult.status === 'already' ? 'text-yellow-400' : 'text-red-400'}`} />
              )}
              <div>
                <p className={`font-semibold text-sm ${
                  checkInResult.status === 'success' ? 'text-green-400' :
                  checkInResult.status === 'already' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {checkInResult.message}
                </p>
                {checkInResult.attendeeName && (
                  <p className="text-sm text-white mt-1">
                    {checkInResult.attendeeName}
                    {checkInResult.ticketType && (
                      <span className="text-[#888888]"> · {checkInResult.ticketType}</span>
                    )}
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full"
              onClick={resetResult}
            >
              다음 참가자
            </Button>
          </div>
        )}

        {/* Manual input */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-[#888888] uppercase tracking-widest">수동 검색</p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888888]" />
              <input
                ref={inputRef}
                type="text"
                placeholder="이름 또는 전화번호 입력..."
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#1e1e1e] bg-[#111111] text-sm text-white placeholder:text-[#444444] focus:outline-none focus:border-[#5A42F5] transition-colors"
              />
            </div>
            <Button onClick={handleManualSearch}>확인</Button>
          </div>

          {/* Quick test buttons */}
          <div className="pt-1">
            <p className="text-xs text-[#444444] mb-2">테스트 (데모용)</p>
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
                    className="px-3 py-1.5 rounded-full text-xs border border-[#1e1e1e] text-[#888888] hover:border-[#5A42F5] hover:text-[#C4B5FD] transition-colors"
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
