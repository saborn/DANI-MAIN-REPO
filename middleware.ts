// middleware.ts (at project root)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // forward options to Next's response cookie setter
          res.cookies.set(name, value, options)
        },
        remove(name: string) {
          // Next's delete only needs the name
          res.cookies.delete(name)
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isProtected = req.nextUrl.pathname.startsWith('/app')
  if (isProtected && !user) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: ['/app/:path*'], // protect everything under /app
}
