import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, formatStr = 'PPP') {
  return format(new Date(date), formatStr, { locale: ko })
}

export function formatDateTime(date: string | Date) {
  return format(new Date(date), 'PPP p', { locale: ko })
}

export function formatDateShort(date: string | Date) {
  return format(new Date(date), 'MM.dd (EEE)', { locale: ko })
}

export function formatTime(date: string | Date) {
  return format(new Date(date), 'a h:mm', { locale: ko })
}

export function timeFromNow(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ko })
}

export function formatPrice(price: number) {
  if (price === 0) return '무료'
  return `₩${price.toLocaleString('ko-KR')}`
}

export function generateSlug(title: string): string {
  const korean = title.replace(/[^\w\s가-힣]/g, '')
  const slug = korean
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-가-힣]/g, '')
    .slice(0, 60)
  const randomSuffix = Math.random().toString(36).substring(2, 7)
  return `${slug}-${randomSuffix}`
}

export function generateQRData(ticket: {
  id: string
  eventId: string
  attendeeName: string
  ticketTypeName: string
}): string {
  return JSON.stringify({
    t: ticket.id,
    e: ticket.eventId,
    n: ticket.attendeeName,
    tt: ticket.ticketTypeName,
  })
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`
  }
  return phone
}

export const CATEGORIES = [
  '공연/콘서트',
  '네트워킹',
  '원데이클래스',
  '파티',
  '기타',
] as const

export const LOCATIONS = [
  '홍대',
  '이태원',
  '성수',
  '대학로',
  '강남',
  '신촌',
  '합정',
  '을지로',
  '종로',
  '기타',
] as const

export const HAVEN_FEE_RATE = 0.03
