'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Event, TicketType } from '@/lib/supabase/types'
import { formatPrice, generateQRData, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, ChevronRight, ChevronLeft, Check, Download } from 'lucide-react'
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
    defaultValues: {
      attendee_name: '',
      attendee_phone: '',
      attendee_email: '',
    },
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

      // Generate QR codes for each ticket
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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-md bg-[var(--background)] rounded-t-2xl sm:rounded-2xl border border-[var(--border)] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)] sticky top-0 bg-[var(--background)] z-10">
          <div className="flex items-center gap-3">
            {step !== 'select' && step !== 'complete' && (
              <button
                onClick={() => setStep(step === 'payment' ? 'info' : 'select')}
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <h2 className="font-semibold text-sm">
              {step === 'select' && '티켓 선택'}
              {step === 'info' && '참가자 정보'}
              {step === 'payment' && '결제'}
              {step === 'complete' && '구매 완료'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          {/* Step: Select ticket */}
          {step === 'select' && (
            <div className="space-y-4">
              <p className="text-sm text-[var(--muted-foreground)]">티켓 종류를 선택하세요</p>

              <div className="space-y-2">
                {event.ticket_types?.map((tt) => {
                  const isAvailable = tt.quantity_sold < tt.quantity
                  const isSelected = selectedTicketType?.id === tt.id
                  return (
                    <button
                      key={tt.id}
                      disabled={!isAvailable}
                      onClick={() => setSelectedTicketType(tt)}
                      className={cn(
                        'w-full text-left px-4 py-3 rounded-lg border transition-all',
                        isSelected
                          ? 'border-[var(--primary)] bg-[var(--muted)]'
                          : 'border-[var(--border)] hover:border-[var(--foreground)]',
                        !isAvailable && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{tt.name}</p>
                          {tt.description && (
                            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{tt.description}</p>
                          )}
                          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                            {isAvailable ? `${tt.quantity - tt.quantity_sold}석 남음` : '매진'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{formatPrice(tt.price)}</span>
                          {isSelected && <Check className="h-4 w-4 text-[var(--foreground)]" />}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Quantity */}
              {selectedTicketType && (
                <div className="flex items-center justify-between py-3 border-t border-[var(--border)]">
                  <span className="text-sm font-medium">수량</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center text-sm hover:bg-[var(--muted)] transition-colors"
                    >
                      −
                    </button>
                    <span className="text-sm font-medium w-4 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(
                        selectedTicketType.quantity - selectedTicketType.quantity_sold, q + 1
                      ))}
                      className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center text-sm hover:bg-[var(--muted)] transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {selectedTicketType && (
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-[var(--muted-foreground)]">합계</span>
                    <span className="font-bold">{formatPrice(totalPrice)}</span>
                  </div>
                  <Button className="w-full" onClick={() => setStep('info')}>
                    계속하기
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step: Attendee info */}
          {step === 'info' && (
            <form onSubmit={form.handleSubmit(handleInfoSubmit)} className="space-y-4">
              <div className="bg-[var(--muted)] rounded-lg p-3 text-xs text-[var(--muted-foreground)]">
                <span className="font-medium text-[var(--foreground)]">{selectedTicketType?.name}</span>
                {' · '}{quantity}매{' · '}
                <span className="font-medium text-[var(--foreground)]">{formatPrice(totalPrice)}</span>
              </div>

              <Input
                label="이름 *"
                placeholder="홍길동"
                error={form.formState.errors.attendee_name?.message}
                {...form.register('attendee_name')}
              />
              <Input
                label="휴대폰 번호 *"
                type="tel"
                placeholder="010-0000-0000"
                hint="QR 티켓 확인에 사용됩니다"
                error={form.formState.errors.attendee_phone?.message}
                {...form.register('attendee_phone')}
              />
              <Input
                label="이메일"
                type="email"
                placeholder="example@email.com"
                hint="선택 사항 — 티켓 이메일 발송 시 사용"
                error={form.formState.errors.attendee_email?.message}
                {...form.register('attendee_email')}
              />

              <Button type="submit" className="w-full" loading={isProcessing}>
                {isFree ? '무료 신청하기' : `₩${totalPrice.toLocaleString()} 결제하기`}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </form>
          )}

          {/* Step: Payment (mock Toss Payments) */}
          {step === 'payment' && (
            <div className="space-y-4">
              <div className="bg-[var(--muted)] rounded-lg p-3 text-xs text-[var(--muted-foreground)]">
                <span className="font-medium text-[var(--foreground)]">{selectedTicketType?.name}</span>
                {' · '}{quantity}매{' · '}
                <span className="font-medium text-[var(--foreground)]">{formatPrice(totalPrice)}</span>
              </div>

              {/* Mock payment UI */}
              <div className="border border-[var(--border)] rounded-xl overflow-hidden">
                <div className="bg-[var(--muted)] px-4 py-3 border-b border-[var(--border)]">
                  <p className="text-xs font-medium text-[var(--muted-foreground)]">결제 방법 선택</p>
                </div>
                <div className="p-4 space-y-2">
                  {['신용/체크카드', '카카오페이', '네이버페이', '토스'].map((method) => (
                    <label key={method} className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] cursor-pointer hover:bg-[var(--muted)] transition-colors">
                      <input type="radio" name="payment" className="accent-[var(--foreground)]" defaultChecked={method === '신용/체크카드'} />
                      <span className="text-sm">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="text-xs text-[var(--muted-foreground)] bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                ⚡ 데모 모드: 실제 결제가 진행되지 않습니다
              </div>

              <div className="border-t border-[var(--border)] pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm">결제 금액</span>
                  <span className="font-bold text-lg">₩{totalPrice.toLocaleString()}</span>
                </div>
                <Button className="w-full" size="lg" onClick={handleMockPayment} loading={isProcessing}>
                  결제하기
                </Button>
              </div>
            </div>
          )}

          {/* Step: Complete - Show QR ticket */}
          {step === 'complete' && (
            <div className="space-y-5">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
                  <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold mb-1">
                  {isFree ? '신청 완료!' : '결제 완료!'}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  QR 티켓을 스크린샷으로 저장하세요
                </p>
              </div>

              {/* QR Tickets */}
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
