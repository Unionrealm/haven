import { CheckInClient } from '@/components/dashboard/checkin-client'
import { mockEvents } from '@/lib/mock-data'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export const metadata: Metadata = {
  title: 'QR 체크인',
}

export default async function CheckInPage({ params }: Props) {
  const { slug } = await params
  const event = mockEvents.find((e) => e.slug === slug)
  if (!event) notFound()
  return <CheckInClient event={event} />
}
