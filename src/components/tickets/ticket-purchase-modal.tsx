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
    if (isFree) await processTickets(data)
    else setStep('payment')
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

  const stepLabel: Record<Step, string> = {
    select: '티켓 선택',
    info: '참가자 정보',
    payment: '결제',
    complete: '구매 완료',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-md bg-[var(--bg-2)] rounded-t-2xl sm:rounded-2xl border border-[var(--border-1)] max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-1)] sticky top-0 bg-[var(--bg-2)] z-10">
          <div className="flex items-center gap-3">
            {step !== 'select' && step !== 'complete' && (
              <button
                onClick={() => setStep(step === 'payment' ? 'info' : 'select')}
                className="text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <h2 className="font-semibold text-sm text-[var(--text-1)]">{stepLabel[step]}</h2>
          </div>
          <button onClick={onClose} className="text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          {/* Select ticket */}
          {step === 'select' && (
            <div className="space-y-4">
              <p className="text-sm text-[var(--text-2)]">티켓 종류를 선택하세요</p>
              <div className="space-y-2">
                {event.ticket_types?.map((tt) => {
                  const isAvailable = tt.quantity_sold < tt.quantity
                  const isSelected = selectedTicketType?.id === tt.id
                  const remaining = tt.quantity - tt.quantity_sold
                  const isUrgent = isAvailable && remaining <= 10
                  return (
                    <button
                      key={tt.id}
                      disabled={!isAvailable}
                      onClick={() => setSelectedTicketType(tt)}
                      className={cn(
                        'w-full text-left px-4 py-4 rounded-xl border transition-all',
                        isSelected
                          ? 'border-[var(--accent)] bg-[var(--accent-subtle)]'
                          : 'border-[var(--border-1)] bg-[var(--bg-3)] hover:border-[var(--border-2)]',
                        !isAvailable && 'opacity-40 cursor-not-allowed'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-sm font-medium text-[var(--text-1)]">{tt.name}</p>
                            {isSelected && <Check className="h-3.5 w-3.5 text-[var(--accent)]" />}
                          </div>
                          {tt.description && (
                            <p className="text-xs text-[var(--text-2)] mt-0.5">{tt.description}</p>
                          )}
                          {/* Remaining: accent if urgent */}
                          <p className={cn(
                            'text-xs mt-1',
                            isUrgent ? 'text-[var(--accent)] font-medium' : 'text-[var(--text-3)]'
                          )}>
                            {isAvailable ? `${remaining}석 남음` : '매진'}
                          </p>
                        </div>
                        {/* Price: text-1, NOT accent */}
                        <span className="text-sm font-semibold text-[var(--text-1)] shrink-0">
                          {tt.price === 0 ? '무료' : formatPrice(tt.price)}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>

              {selectedTicketType && (
                <>
                  <div className="flex items-center justify-between py-3 border-t border-[var(--border-1)]">
                    <span className="text-sm font-medium text-[var(--text-1)]">수량</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-9 h-9 rounded-lg border border-[var(--border-1)] flex items-center justify-center text-sm text-[var(--text-1)] hover:bg-[var(--bg-3)] transition-colors"
                      >
                        −
                      </button>
                      <span className="text-sm font-semibold text-[var(--text-1)] w-4 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(selectedTicketType.quantity - selectedTicketType.quantity_sold, q + 1))}
                        className="w-9 h-9 rounded-lg border border-[var(--border-1)] flex items-center justify-center text-sm text-[var(--text-1)] hover:bg-[var(--bg-3)] transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4 py-3 border-t border-[var(--border-1)]">
                      <span className="text-sm text-[var(--text-2)]">합계</span>
                      <span className="font-semibold text-[var(--text-1)] text-lg">
                        {totalPrice === 0 ? '무료' : formatPrice(totalPrice)}
                      </span>
                    </div>
                    {/* CTA: accent bg ✓ */}
                    <Button className="w-full" size="lg" onClick={() => setStep('info')}>
                      계속하기
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Attendee info */}
          {step === 'info' && (
            <form onSubmit={form.handleSubmit(handleInfoSubmit)} className="space-y-4">
              <div className="bg-[var(--bg-3)] rounded-xl border border-[var(--border-1)] p-3 text-xs">
                <span className="font-medium text-[var(--text-1)]">{selectedTicketType?.name}</span>
                <span className="text-[var(--text-2)]"> · {quantity}매 · </span>
                <span className="font-semibold text-[var(--text-1)]">
                  {totalPrice === 0 ? '무료' : formatPrice(totalPrice)}
                </span>
              </div>

              <Input label="이름 *" placeholder="홍길동" error={form.formState.errors.attendee_name?.message} {...form.register('attendee_name')} />
              <Input label="휴대폰 번호 *" type="tel" placeholder="010-0000-0000" hint="QR 티켓 확인에 사용됩니다" error={form.formState.errors.attendee_phone?.message} {...form.register('attendee_phone')} />
              <Input label="이메일" type="email" placeholder="example@email.com" hint="선택 사항 — 티켓 이메일 발송 시 사용" error={form.formState.errors.attendee_email?.message} {...form.register('attendee_email')} />

              <Button type="submit" className="w-full" size="lg" loading={isProcessing}>
                {isFree ? '무료 신청하기' : `${formatPrice(totalPrice)} 결제하기`}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </form>
          )}

          {/* Payment */}
          {step === 'payment' && (
            <div className="space-y-4">
              <div className="bg-[var(--bg-3)] rounded-xl border border-[var(--border-1)] p-3 text-xs">
                <span className="font-medium text-[var(--text-1)]">{selectedTicketType?.name}</span>
                <span className="text-[var(--text-2)]"> · {quantity}매 · </span>
                <span className="font-semibold text-[var(--text-1)]">{formatPrice(totalPrice)}</span>
              </div>

              <div className="rounded-xl border border-[var(--border-1)] overflow-hidden">
                <div className="bg-[var(--bg-3)] px-4 py-3 border-b border-[var(--border-1)]">
                  <p className="text-xs font-medium text-[var(--text-2)]">결제 방법 선택</p>
                </div>
                <div className="p-3 space-y-2">
                  {['신용/체크카드', '카카오페이', '네이버페이', '토스'].map((method) => (
                    <label key={method} className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border-1)] cursor-pointer hover:bg-[var(--bg-3)] transition-colors">
                      <input type="radio" name="payment" className="accent-[var(--accent)]" defaultChecked={method === '신용/체크카드'} />
                      <span className="text-sm text-[var(--text-1)]">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="text-xs text-[var(--text-2)] bg-[var(--bg-3)] border border-[var(--border-1)] rounded-xl p-3">
                ⚡ 데모 모드: 실제 결제가 진행되지 않습니다
              </div>

              <div className="border-t border-[var(--border-1)] pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-[var(--text-2)]">결제 금액</span>
                  <span className="font-semibold text-[var(--text-1)] text-lg">₩{totalPrice.toLocaleString()}</span>
                </div>
                <Button className="w-full" size="lg" onClick={handleMockPayment} loading={isProcessing}>
                  결제하기
                </Button>
              </div>
            </div>
          )}

          {/* Complete */}
          {step === 'complete' && (
            <div className="space-y-5">
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-2xl bg-[var(--bg-3)] border border-[var(--border-1)] flex items-center justify-center mx-auto mb-4">
                  <Check className="h-7 w-7 text-green-500" />
                </div>
                <h3 className="font-semibold text-[var(--text-1)] mb-1">
                  {isFree ? '신청 완료!' : '결제 완료!'}
                </h3>
                <p className="text-sm text-[var(--text-2)]">QR 티켓을 스크린샷으로 저장하세요</p>
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

              <Button variant="outline" className="w-full" onClick={onClose}>닫기</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
