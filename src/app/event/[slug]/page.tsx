import { notFound } from 'next/navigation'
import { mockEvents } from '@/lib/mock-data'
import { EventDetailClient } from '@/components/events/event-detail-client'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ preview?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const event = mockEvents.find((e) => e.slug === slug)

  if (!event) return { title: '이벤트를 찾을 수 없습니다' }

  return {
    title: event.title,
    description: event.description.replace(/<[^>]*>/g, '').slice(0, 160),
    openGraph: {
      title: event.title,
      images: event.cover_image ? [event.cover_image] : [],
    },
  }
}

export default async function EventDetailPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { preview } = await searchParams

  // In production, fetch from Supabase
  const event = mockEvents.find((e) => e.slug === slug)

  if (!event) notFound()

  return <EventDetailClient event={event} isPreview={preview === 'true'} />
}
