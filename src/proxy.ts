import { type NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || supabaseUrl.includes('placeholder') ||
        !supabaseKey || supabaseKey.includes('placeholder')) {
      return NextResponse.next({ request })
    }

    const { updateSession } = await import('@/lib/supabase/middleware')
    return await updateSession(request)
  } catch {
    return NextResponse.next({ request })
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
