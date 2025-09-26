'use server'
import { supabaseServer } from '@/lib/supabaseServer'

export async function signInWithOtp(email: string) {
  const sb = supabaseServer()
  const { error } = await sb.auth.signInWithOtp({ email })
  if (error) throw new Error(error.message)
}

export async function signOut() {
  const sb = supabaseServer()
  await sb.auth.signOut()
}
