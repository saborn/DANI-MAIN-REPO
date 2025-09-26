// lib/supabaseServer.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function supabaseServer() {
  const store = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,        // make sure these are in .env.local
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,   // and set on Vercel later
    {
      cookies: {
        get(name: string) {
          return store.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          store.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          store.set({ name, value: '', ...options })
        },
      },
    }
  )
}

