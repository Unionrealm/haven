import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-5xl font-bold text-[var(--muted-foreground)] mb-4">404</p>
      <h1 className="text-xl font-semibold mb-2">페이지를 찾을 수 없습니다</h1>
      <p className="text-sm text-[var(--muted-foreground)] mb-8 max-w-sm">
        찾으시는 페이지가 존재하지 않거나 이동되었을 수 있습니다.
      </p>
      <div className="flex gap-3">
        <Link href="/">
          <Button>홈으로 이동</Button>
        </Link>
        <Link href="/events">
          <Button variant="outline">이벤트 탐색</Button>
        </Link>
      </div>
    </div>
  )
}
