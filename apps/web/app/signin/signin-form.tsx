'use client'

import { useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button, Field, Input } from '@/components/ui'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export function SigninForm() {
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/start'
  const [email, setEmail] = useState('')
  const [pending, startTransition] = useTransition()
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    startTransition(async () => {
      const supabase = createSupabaseBrowserClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      })
      if (error) {
        setError(error.message)
        return
      }
      setSent(true)
    })
  }

  if (sent) {
    return (
      <div className="rounded-3xl border border-amber-400/30 bg-amber-400/5 p-6">
        <div className="text-amber-300 text-sm font-mono mb-2">✓ link sent</div>
        <p className="text-white/80 leading-relaxed">
          Check <strong className="text-white">{email}</strong> for the magic link. Clicking it
          drops you straight into <code className="text-amber-300">{next}</code>.
        </p>
        <button
          onClick={() => {
            setSent(false)
            setEmail('')
          }}
          className="mt-4 text-xs text-white/50 hover:text-white/80 transition underline"
        >
          Use a different email
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="Email">
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@crew.rocks"
          autoComplete="email"
          className="text-base"
        />
      </Field>
      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 text-red-200 px-4 py-3 text-sm">
          {error}
        </div>
      )}
      <Button type="submit" size="xl" full disabled={pending || !email}>
        {pending ? 'Sending…' : 'Send the link →'}
      </Button>
    </form>
  )
}
