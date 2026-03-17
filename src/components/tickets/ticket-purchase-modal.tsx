'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Event, TicketType } from '@/lib/supabase/types'
import { formatPrice, generateQRData, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { QRTicket } from './qr-ticket'
import { toast } from 'sonner'

interface Props {
  event: Event
  initialTicketTypeId: string
  onClose: () => void
}

const purchaseSchema = z.object({
  attendee_name: z.string().min(2, '이름을 2자 이상 입력하세요'),
  attendee_phone: z.string().regex(/^010-?\d{4}-?\d{4}$/, '올바른 휴대폰 번호를 입력하세요'),
  attendee_email: z.string().email('올바른 이메일을 입력하세요').optional().or(z.literal('')),
})

type PurchaseFormValues = z.infer<typeof purchaseSchema>
type Step = 'select' | 'info' | 'payment' | 'complete'

export function TicketPurchaseModal({ event, initialTicketTypeId, onClose }: Props) {
  const [step, setStep] = useState<Step>('select')
  const [selectedTicketType, setSelectedTicketType] = useState<TicketType | null>(
    event.ticket_types?.find((t) => t.id === initialTicketTypeId) || event.ticket_types?.[0] || null
  )
  const [quantity, setQuantity] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [generatedTickets, setGeneratedTickets] = useState<string[]>([])

  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: { attendee_name: '', attendee_phone: '', attendee_email: '' },
  })

  const totalPrice = (selectedTicketType?.price ?? 0) * quantity
  const isFree = selectedTicketType?.price === 0

  const handleInfoSubmit = async (data: PurchaseFormValues) => {
    if (isFree) {
      await processTickets(data)
    } else {
      setStep('payment')
    }
  }

  const processTickets = async (data: PurchaseFormValues) => {
    setIsProcessing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const tickets = Array.from({ length: quantity }, (_, i) => {
        const ticketId = `tkt-${Date.now()}-${i}`
        return generateQRData({
          id: ticketId,
          eventId: event.id,
          attendeeName: data.attendee_name,
          ticketTypeName: selectedTicketType?.name || '',
        })
      })
      setGeneratedTickets(tickets)
      setStep('complete')
    } catch {
      toast.error('티켓 발급에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleMockPayment = async () => {
    const data = form.getValues()
    await processTickets(data)
  }

  const stepLabel = {
    select: '티켓 선택',
    info: '참가자 정보',
    payment: '결제',
    complete: '구매 완료',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-md bg-[#111111] rounded-t-2xl sm:rounded-2xl border border-[#1e1e1e] max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1e1e1e] sticky top-0 bg-[#111111] z-10">
          <div className="flex items-center gap-3">
            {step !== 'select' && step !== 'complete' && (
              <button
                onClick={() => setStep(step === 'payment' ? 'info' : 'select')}
                className="text-[#888888] hover:text-white transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <h2 className="font-semibold text-sm text-white">{stepLabel[step]}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#888888] hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          {/* Step: Select ticket */}
          {step === 'select' && (
            <div className="space-y-4">
              <p className="text-sm text-[#888888]">티켓 종류를 선택하세요</p>

              <div className="space-y-2">
                {event.ticket_types?.map((tt) => {
                  const isAvailable = tt.quantity_sold < tt.quantity
                  const isSelected = selectedTicketType?.id === tt.id
                  const remaining = tt.quantity - tt.quantity_sold
                  return (
                    <button
                      key={tt.id}
                      disabled={!isAvailable}
                      onClick={() => setSelectedTicketType(tt)}
                      className={cn(
                        'w-full text-left px-4 py-4 rounded-xl border transition-all',
                        isSelected
                          ? 'border-[#5A42F5] bg-[#110D2E]'
                          : 'border-[#1e1e1e] bg-[#161616] hover:border-[#333]',
                        !isAvailable && 'opacity-40 cursor-not-allowed'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-sm font-medium text-white">{tt.name}</p>
                            {isSelected && <Check className="h-3.5 w-3.5 text-[#5A42F5]" />}
                          </div>
                          {tt.description && (
                            <p className="text-xs text-[#888888] mt-0.5">{tt.description}</p>
                          )}
                          <p className="text-xs text-[#444444] mt-1">
                            {isAvailable ? `${remaining}석 남음` : '매진'}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-[#5A42F5] shrink-0">
                          {tt.price === 0 ? '무료' : formatPrice(tt.price)}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Quantity selector */}
              {selectedTicketType && (
                <>
                  <div className="flex items-center justify-between py-3 border-t border-[#1e1e1e]">
                    <span className="text-sm font-medium text-white">수량</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-8 h-8 rounded-lg border border-[#1e1e1e] flex items-center justify-center text-sm text-white hover:bg-[#161616] transition-colors"
                      >
                        −
                      </button>
                      <span className="text-sm font-semibold text-white w-4 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(
                          selectedTicketType.quantity - selectedTicketType.quantity_sold, q + 1
                        ))}
                        className="w-8 h-8 rounded-lg border border-[#1e1e1e] flex items-center justify-center text-sm text-white hover:bg-[#161616] transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4 py-3 border-t border-[#1e1e1e]">
                      <span className="text-sm text-[#888888]">합계</span>
                      <span className="font-semibold text-white text-lg">
                        {totalPrice === 0 ? '무료' : formatPrice(totalPrice)}
                      </span>
                    </div>
                    <Button className="w-full" size="lg" onClick={() => setStep('info')}>
                      계속하기
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step: Attendee info */}
          {step === 'info' && (
            <form onSubmit={form.handleSubmit(handleInfoSubmit)} className="space-y-4">
              <div className="bg-[#161616] rounded-xl border border-[#1e1e1e] p-3 text-xs">
                <span className="font-medium text-white">{selectedTicketType?.name}</span>
                <span className="text-[#888888]"> · {quantity}매 · </span>
                <span className="font-medium text-[#5A42F5]">
                  {totalPrice === 0 ? '무료' : formatPrice(totalPrice)}
                </span>
              </div>

              <Input
                label="이름 *"
                placeholder="홍길동"
                error={form.formState.errors.attendee_name?.message}
                className="bg-[#161616] border-[#1e1e1e] focus:border-[#5A42F5] focus:ring-0"
                {...form.register('attendee_name')}
              />
              <Input
                label="휴대폰 번호 *"
                type="tel"
                placeholder="010-0000-0000"
                hint="QR 티켓 확인에 사용됩니다"
                error={form.formState.errors.attendee_phone?.message}
                className="bg-[#161616] border-[#1e1e1e] focus:border-[#5A42F5] focus:ring-0"
                {...form.register('attendee_phone')}
              />
              <Input
                label="이메일"
                type="email"
                placeholder="example@email.com"
                hint="선택 사항 — 티켓 이메일 발송 시 사용"
                error={form.formState.errors.attendee_email?.message}
                className="bg-[#161616] border-[#1e1e1e] focus:border-[#5A42F5] focus:ring-0"
                {...form.register('attendee_email')}
              />

              <Button type="submit" className="w-full" size="lg" loading={isProcessing}>
                {isFree ? '무료 신청하기' : `${formatPrice(totalPrice)} 결제하기`}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </form>
          )}

          {/* Step: Payment */}
          {step === 'payment' && (
            <div className="space-y-4">
              <div className="bg-[#161616] rounded-xl border border-[#1e1e1e] p-3 text-xs">
                <span className="font-medium text-white">{selectedTicketType?.name}</span>
                <span className="text-[#888888]"> · {quantity}매 · </span>
                <span className="font-medium text-[#5A42F5]">{formatPrice(totalPrice)}</span>
              </div>

              {/* Payment methods */}
              <div className="rounded-xl border border-[#1e1e1e] overflow-hidden">
                <div className="bg-[#161616] px-4 py-3 border-b border-[#1e1e1e]">
                  <p className="text-xs font-medium text-[#888888]">결제 방법 선택</p>
                </div>
                <div className="p-3 space-y-2">
                  {['신용/체크카드', '카카오페이', '네이버페이', '토스'].map((method) => (
                    <label
                      key={method}
                      className="flex items-center gap-3 p-3 rounded-lg border border-[#1e1e1e] cursor-pointer hover:bg-[#161616] transition-colors"
                    >
                      <input
                        type="radio"
                        name="payment"
                        className="accent-[#5A42F5]"
                        defaultChecked={method === '신용/체크카드'}
                      />
                      <span className="text-sm text-white">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="text-xs text-[#888888] bg-[#161616] border border-[#1e1e1e] rounded-xl p-3">
                ⚡ 데모 모드: 실제 결제가 진행되지 않습니다
              </div>

              <div className="border-t border-[#1e1e1e] pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-[#888888]">결제 금액</span>
                  <span className="font-semibold text-lg text-white">
                    ₩{totalPrice.toLocaleString()}
                  </span>
                </div>
                <Button className="w-full" size="lg" onClick={handleMockPayment} loading={isProcessing}>
                  결제하기
                </Button>
              </div>
            </div>
          )}

          {/* Step: Complete */}
          {step === 'complete' && (
            <div className="space-y-5">
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0d2818] border border-green-900 flex items-center justify-center mx-auto mb-4">
                  <Check className="h-7 w-7 text-green-400" />
                </div>
                <h3 className="font-semibold text-white mb-1">
                  {isFree ? '신청 완료!' : '결제 완료!'}
                </h3>
                <p className="text-sm text-[#888888]">
                  QR 티켓을 스크린샷으로 저장하세요
                </p>
              </div>

              {generatedTickets.map((qrData, i) => (
                <QRTicket
                  key={i}
                  event={event}
                  ticketType={selectedTicketType!}
                  attendeeName={form.getValues('attendee_name')}
                  qrData={qrData}
                  ticketNumber={i + 1}
                  totalTickets={quantity}
                />
              ))}

              <Button variant="outline" className="w-full" onClick={onClose}>
                닫기
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
