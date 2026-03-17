'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { CATEGORIES, LOCATIONS, generateSlug, cn } from '@/lib/utils'
import { Plus, Trash2, Image as ImageIcon, Calendar, MapPin, Ticket, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import Image from 'next/image'

const ticketTypeSchema = z.object({
  name: z.string().min(1, '티켓 이름을 입력하세요'),
  description: z.string().optional(),
  price: z.number().min(0, '가격은 0원 이상이어야 합니다'),
  quantity: z.number().min(1, '수량은 1개 이상이어야 합니다'),
})

const formSchema = z.object({
  title: z.string().min(2, '제목은 2자 이상 입력하세요').max(100),
  description: z.string().min(10, '내용을 10자 이상 입력하세요'),
  cover_image: z.string().optional(),
  date: z.string().min(1, '날짜를 선택하세요'),
  time: z.string().min(1, '시간을 선택하세요'),
  end_time: z.string().optional(),
  venue: z.string().min(1, '장소명을 입력하세요'),
  address: z.string().min(1, '주소를 입력하세요'),
  location: z.string().min(1, '지역을 선택하세요'),
  category: z.string().min(1, '카테고리를 선택하세요'),
  ticket_types: z.array(ticketTypeSchema).min(1, '티켓 타입을 하나 이상 추가하세요'),
})

type FormValues = z.infer<typeof formSchema>

const STEPS = [
  { id: 1, label: '기본 정보', icon: Calendar },
  { id: 2, label: '장소', icon: MapPin },
  { id: 3, label: '티켓 설정', icon: Ticket },
]

export function EventCreateForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState<string>('')

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      cover_image: '',
      date: '',
      time: '19:00',
      end_time: '',
      venue: '',
      address: '',
      location: '',
      category: '',
      ticket_types: [{ name: '사전예매', description: '', price: 0, quantity: 100 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'ticket_types',
  })

  const validateStep = async (stepNum: number) => {
    let stepFields: (keyof FormValues)[] = []
    if (stepNum === 1) stepFields = ['title', 'description', 'date', 'time', 'category']
    if (stepNum === 2) stepFields = ['venue', 'address', 'location']
    if (stepNum === 3) stepFields = ['ticket_types']
    return form.trigger(stepFields)
  }

  const nextStep = async () => {
    const valid = await validateStep(step)
    if (valid) setStep((s) => s + 1)
  }

  const prevStep = () => setStep((s) => s - 1)

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      const slug = generateSlug(data.title)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast.success('이벤트가 생성되었습니다!')
      router.push(`/event/${slug}?preview=true`)
    } catch {
      toast.error('이벤트 생성에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* Step indicator */}
      <div className="flex items-center gap-1">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => step > s.id && setStep(s.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                step === s.id
                  ? 'bg-[#5A42F5] text-white'
                  : step > s.id
                    ? 'text-[#888888] cursor-pointer hover:text-white hover:bg-[#161616]'
                    : 'text-[#444444] cursor-not-allowed'
              )}
            >
              {step > s.id ? (
                <Check className="h-3 w-3 text-[#5A42F5]" />
              ) : (
                <s.icon className="h-3 w-3" />
              )}
              {s.label}
            </button>
            {i < STEPS.length - 1 && (
              <ChevronRight className="h-3.5 w-3.5 text-[#1e1e1e]" />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="rounded-xl border border-[#1e1e1e] bg-[#161616] overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Cover image */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">커버 이미지</label>
              <div
                className="relative aspect-[16/7] rounded-lg border-2 border-dashed border-[#1e1e1e] overflow-hidden cursor-pointer hover:border-[#5A42F5] transition-colors group"
                onClick={() => {
                  const url = prompt('이미지 URL을 입력하세요 (Unsplash 링크 등):')
                  if (url) {
                    setPreviewImage(url)
                    form.setValue('cover_image', url)
                  }
                }}
              >
                {previewImage ? (
                  <>
                    <Image src={previewImage} alt="Cover" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-medium">이미지 변경</span>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[#888888]">
                    <div className="w-10 h-10 rounded-lg bg-[#111111] border border-[#1e1e1e] flex items-center justify-center">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                    <span className="text-sm">커버 이미지 추가 (선택)</span>
                    <span className="text-xs text-[#444444]">클릭하여 URL 입력</span>
                  </div>
                )}
              </div>
            </div>

            <Input
              label="이벤트 제목 *"
              placeholder="예: 소란 단독공연 — 봄의 끝에서"
              error={form.formState.errors.title?.message}
              className="bg-[#111111] border-[#1e1e1e] focus:border-[#5A42F5] focus:ring-0"
              {...form.register('title')}
            />

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white">이벤트 소개 *</label>
              <textarea
                placeholder="이벤트에 대해 소개해주세요. 공연 정보, 주의사항 등을 자유롭게 작성하세요."
                className={cn(
                  'w-full min-h-[160px] rounded-lg border border-[#1e1e1e] bg-[#111111] px-3 py-2.5 text-sm text-white',
                  'placeholder:text-[#444444] resize-none',
                  'focus:outline-none focus:border-[#5A42F5] transition-colors',
                  form.formState.errors.description && 'border-red-500'
                )}
                {...form.register('description')}
              />
              {form.formState.errors.description && (
                <p className="text-xs text-red-400">{form.formState.errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="날짜 *"
                type="date"
                error={form.formState.errors.date?.message}
                className="bg-[#111111] border-[#1e1e1e] focus:border-[#5A42F5] focus:ring-0"
                {...form.register('date')}
              />
              <Input
                label="시작 시간 *"
                type="time"
                error={form.formState.errors.time?.message}
                className="bg-[#111111] border-[#1e1e1e] focus:border-[#5A42F5] focus:ring-0"
                {...form.register('time')}
              />
              <Input
                label="종료 시간"
                type="time"
                hint="선택 사항"
                className="bg-[#111111] border-[#1e1e1e] focus:border-[#5A42F5] focus:ring-0"
                {...form.register('end_time')}
              />
            </div>

            <Select
              label="카테고리 *"
              placeholder="카테고리 선택"
              options={CATEGORIES.map((c) => ({ value: c, label: c }))}
              error={form.formState.errors.category?.message}
              {...form.register('category')}
            />
          </div>
        </div>
      )}

      {/* Step 2: Venue */}
      {step === 2 && (
        <div className="rounded-xl border border-[#1e1e1e] bg-[#161616]">
          <div className="p-6 space-y-6">
            <Input
              label="장소명 *"
              placeholder="예: 클럽 빵, 카페 온더레코드"
              error={form.formState.errors.venue?.message}
              className="bg-[#111111] border-[#1e1e1e] focus:border-[#5A42F5] focus:ring-0"
              {...form.register('venue')}
            />
            <Input
              label="상세 주소 *"
              placeholder="예: 서울 마포구 어울마당로 162"
              error={form.formState.errors.address?.message}
              className="bg-[#111111] border-[#1e1e1e] focus:border-[#5A42F5] focus:ring-0"
              {...form.register('address')}
            />
            <Select
              label="지역 *"
              placeholder="지역 선택"
              options={LOCATIONS.map((l) => ({ value: l, label: l }))}
              error={form.formState.errors.location?.message}
              {...form.register('location')}
            />

            <div className="rounded-lg bg-[#111111] border border-[#1e1e1e] p-4 text-sm">
              <p className="font-medium text-white mb-1">카카오맵 연동</p>
              <p className="text-[#888888] text-xs leading-relaxed">
                주소를 입력하면 이벤트 페이지에 카카오맵이 자동으로 표시됩니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Tickets */}
      {step === 3 && (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="rounded-xl border border-[#1e1e1e] bg-[#161616]">
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-sm text-white">티켓 {index + 1}</h3>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-[#444444] hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  <Input
                    label="티켓 이름 *"
                    placeholder="예: 사전예매, 현장예매, VIP"
                    error={form.formState.errors.ticket_types?.[index]?.name?.message}
                    className="bg-[#111111] border-[#1e1e1e] focus:border-[#5A42F5] focus:ring-0"
                    {...form.register(`ticket_types.${index}.name`)}
                  />
                  <Input
                    label="설명"
                    placeholder="예: 선착순 20매 할인 티켓"
                    className="bg-[#111111] border-[#1e1e1e] focus:border-[#5A42F5] focus:ring-0"
                    {...form.register(`ticket_types.${index}.description`)}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-white">가격 (원) *</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#888888]">₩</span>
                        <input
                          type="number"
                          min="0"
                          step="1000"
                          placeholder="0"
                          className="w-full h-10 pl-7 pr-3 rounded-lg border border-[#1e1e1e] bg-[#111111] text-sm text-white focus:outline-none focus:border-[#5A42F5] transition-colors placeholder:text-[#444444]"
                          {...form.register(`ticket_types.${index}.price`, { valueAsNumber: true })}
                        />
                      </div>
                      <p className="text-xs text-[#444444]">0원 = 무료 행사</p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-white">수량 *</label>
                      <input
                        type="number"
                        min="1"
                        placeholder="100"
                        className="w-full h-10 px-3 rounded-lg border border-[#1e1e1e] bg-[#111111] text-sm text-white focus:outline-none focus:border-[#5A42F5] transition-colors placeholder:text-[#444444]"
                        {...form.register(`ticket_types.${index}.quantity`, { valueAsNumber: true })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => append({ name: '', description: '', price: 0, quantity: 50 })}
            className="w-full h-11 rounded-xl border border-dashed border-[#1e1e1e] text-sm text-[#888888] hover:border-[#5A42F5] hover:text-[#5A42F5] transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            티켓 타입 추가
          </button>

          <div className="rounded-lg border border-[#1e1e1e] bg-[#161616] p-4 text-sm">
            <p className="font-medium text-white mb-1">수수료 안내</p>
            <p className="text-[#888888] text-xs leading-relaxed">
              유료 티켓의 경우 판매 금액의{' '}
              <strong className="text-white font-semibold">3%</strong>가 서비스 수수료로 공제됩니다.
              무료 이벤트는 수수료가 없습니다.
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        {step > 1 ? (
          <Button type="button" variant="outline" onClick={prevStep}>
            <ChevronLeft className="h-4 w-4" />
            이전
          </Button>
        ) : (
          <div />
        )}

        {step < STEPS.length ? (
          <Button type="button" onClick={nextStep}>
            다음
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              variant="outline"
              loading={isSubmitting}
            >
              임시저장
            </Button>
            <Button type="submit" loading={isSubmitting}>
              이벤트 발행하기
            </Button>
          </div>
        )}
      </div>
    </form>
  )
}
