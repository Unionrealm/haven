import { EventCreateForm } from '@/components/events/event-create-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '이벤트 만들기',
}

export default function CreateEventPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1 tracking-tight">이벤트 만들기</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          3분 안에 공유 가능한 티켓 페이지를 만들어보세요
        </p>
      </div>
      <EventCreateForm />
    </div>
  )
}
