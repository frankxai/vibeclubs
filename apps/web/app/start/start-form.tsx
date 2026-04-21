'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Field, Input, Textarea, Select } from '@/components/ui'
import { CLUB_TEMPLATES, findTemplate } from '@/lib/club-templates'
import type { ClubPlatform, ClubType, PomodoroPreset } from '@/lib/supabase/types'

const CLUB_TYPES: { value: ClubType; label: string }[] = [
  { value: 'coding', label: 'Coding' },
  { value: 'music', label: 'Music' },
  { value: 'design', label: 'Design' },
  { value: 'study', label: 'Study' },
  { value: 'writing', label: 'Writing' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'other', label: 'Other' },
]

const PLATFORMS: { value: ClubPlatform; label: string }[] = [
  { value: 'meet', label: 'Google Meet' },
  { value: 'discord', label: 'Discord' },
  { value: 'zoom', label: 'Zoom' },
  { value: 'in_person', label: 'In person' },
  { value: 'other', label: 'Other' },
]

const PRESETS: { value: PomodoroPreset; label: string }[] = [
  { value: '25_5', label: '25 / 5' },
  { value: '50_10', label: '50 / 10' },
  { value: '90_20', label: '90 / 20' },
  { value: 'custom', label: 'Custom' },
]

const AMBIENT_OPTIONS = [
  { value: 'lofi', label: 'Lo-fi' },
  { value: 'rain', label: 'Rain' },
  { value: 'cafe', label: 'Café' },
  { value: 'nature', label: 'Nature' },
  { value: 'space', label: 'Space' },
]

type FormState = {
  name: string
  slug: string
  description: string
  type: ClubType
  platform: ClubPlatform
  platform_url: string
  schedule: string
  pomodoro_preset: PomodoroPreset
  ambient_preset: string
}

const EMPTY: FormState = {
  name: '',
  slug: '',
  description: '',
  type: 'coding',
  platform: 'meet',
  platform_url: '',
  schedule: '',
  pomodoro_preset: '25_5',
  ambient_preset: 'lofi',
}

export function StartForm() {
  const router = useRouter()
  const search = useSearchParams()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null)

  // On mount: restore a pending club from sessionStorage (after signin redirect)
  // or pre-fill from ?template= query param.
  useEffect(() => {
    const pending = sessionStorage.getItem('vc:pending-club')
    if (pending) {
      try {
        setForm(JSON.parse(pending) as FormState)
        return
      } catch {
        /* ignore */
      }
    }
    const templateId = search.get('template')
    const t = findTemplate(templateId)
    if (t) applyTemplate(t.id)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function applyTemplate(id: string) {
    const t = findTemplate(id)
    if (!t) return
    setActiveTemplate(id)
    setForm((f) => ({
      ...f,
      type: t.defaults.type,
      platform: t.defaults.platform,
      pomodoro_preset: t.defaults.pomodoro_preset,
      ambient_preset: t.defaults.ambient_preset,
      description: f.description || t.defaults.description,
    }))
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    startTransition(async () => {
      const res = await fetch('/api/clubs', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const body = (await res.json().catch(() => ({ error: 'Something broke' }))) as {
          error?: string
          signin?: string
        }
        if (res.status === 401 && body.signin) {
          sessionStorage.setItem('vc:pending-club', JSON.stringify(form))
          router.push(body.signin)
          return
        }
        setError(body.error ?? 'Something broke')
        return
      }
      const { slug } = (await res.json()) as { slug: string }
      sessionStorage.removeItem('vc:pending-club')
      router.push(`/club/${slug}`)
    })
  }

  return (
    <div className="space-y-10">
      {/* Template picker */}
      <div>
        <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-white/40 mb-3">
          Start from a template
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          {CLUB_TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => applyTemplate(t.id)}
              className={
                'group text-left rounded-2xl border p-4 transition ' +
                (activeTemplate === t.id
                  ? 'border-amber-400/50 bg-amber-400/[0.05]'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/20')
              }
            >
              <div className="flex items-start gap-3">
                <span className="text-lg opacity-80">{t.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{t.label}</div>
                  <div className="text-xs text-white/50 mt-0.5">{t.tagline}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Name" hint="What your crew texts each other about.">
          <Input
            required
            value={form.name}
            onChange={(e) => {
              update('name', e.target.value)
              if (!form.slug) update('slug', slugify(e.target.value))
            }}
            placeholder="Lofi coders Amsterdam"
          />
        </Field>

        <Field label="URL" hint="vibeclubs.ai/club/<slug>">
          <Input
            required
            value={form.slug}
            onChange={(e) => update('slug', slugify(e.target.value))}
            placeholder="lofi-coders-amsterdam"
          />
        </Field>

        <Field label="What are you shipping?" hint="Two lines max. Specific = the right people show up.">
          <Textarea
            rows={3}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Thursdays 9am CET. Lofi + 50/10. Building side projects with Claude Code."
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Type">
            <Select
              value={form.type}
              onChange={(v) => update('type', v as ClubType)}
              options={CLUB_TYPES}
            />
          </Field>
          <Field label="Where you meet">
            <Select
              value={form.platform}
              onChange={(v) => update('platform', v as ClubPlatform)}
              options={PLATFORMS}
            />
          </Field>
        </div>

        <Field label="Meeting link" hint="Meet, Discord, Zoom URL. Leave blank if IRL.">
          <Input
            value={form.platform_url}
            onChange={(e) => update('platform_url', e.target.value)}
            placeholder="https://meet.google.com/xyz-abcd-efg"
          />
        </Field>

        <Field label="When" hint="e.g. 'Thursdays 9am Amsterdam' or 'Ad-hoc, check the link'">
          <Input
            value={form.schedule}
            onChange={(e) => update('schedule', e.target.value)}
            placeholder="Thursdays 9am Europe/Amsterdam"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Rhythm">
            <Select
              value={form.pomodoro_preset}
              onChange={(v) => update('pomodoro_preset', v as PomodoroPreset)}
              options={PRESETS}
            />
          </Field>
          <Field label="Soundtrack">
            <Select
              value={form.ambient_preset}
              onChange={(v) => update('ambient_preset', v)}
              options={AMBIENT_OPTIONS}
            />
          </Field>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 text-red-200 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <Button type="submit" size="xl" full disabled={pending}>
          {pending ? 'Hosting…' : 'Host it →'}
        </Button>

        <p className="text-xs text-white/40 text-center">
          Magic link to your email on submit. Your vibeclub goes public on the directory so your crew
          can find it.
        </p>
      </form>
    </div>
  )
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}
