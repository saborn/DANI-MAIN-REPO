'use client'
import { useState, FormEvent } from 'react'
import { signInWithOtp } from '@/app/(auth)/actions'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setMsg(null)
    try {
      await signInWithOtp(email)
      setMsg('Check your email for the login link.')
    } catch (err: any) {
      setMsg(err.message ?? 'Sign-in failed')
    }
  }
  return (
    <div style={{ maxWidth: 420, margin: '80px auto', fontFamily: 'system-ui' }}>
      <h1>Sign in</h1>
      <form onSubmit={onSubmit}>
        <input
          type="email" value={email} onChange={(e)=>setEmail(e.target.value)}
          placeholder="you@example.com" required
          style={{ width:'100%', padding:10, margin:'12px 0' }}
        />
        <button type="submit" style={{ padding:10, width:'100%' }}>Send magic link</button>
      </form>
      {msg && <p style={{ marginTop:12 }}>{msg}</p>}
    </div>
  )
}
