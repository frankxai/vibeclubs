'use client'

import { useState } from 'react'
import { createPomodoro } from '@vibeclubs/pomodoro-sync'
import { Card, CardEyebrow, CardTitle, CardBody, Button } from '@/components/ui'
import type { PomodoroPreset } from '@/lib/supabase/types'

interface LocalTrackProps {
  clubSlug: string
  preset: PomodoroPreset
}

export function LocalTrack({ clubSlug, preset }: LocalTrackProps) {
  const [isRunning, setIsRunning] = useState(false)

  // Unknown preset: render nothing
  if (!preset || preset === 'custom') {
    return null
  }

  function startTrack() {
    const pomodoro = createPomodoro({
      clubId: clubSlug,
      preset,
    })
    pomodoro.start()
    setIsRunning(true)
  }

  return (
    <Card pad="lg" className="mt-10">
      <CardEyebrow>Local track</CardEyebrow>
      <CardTitle className="mb-3">No public room yet.</CardTitle>
      <CardBody>
        <p className="text-white/70 text-sm leading-relaxed mb-6">
          This runs in this tab. Same rhythm as the listing. No room link, no upload.
        </p>
        <Button variant="primary" size="md" onClick={startTrack} disabled={isRunning}>
          {isRunning ? 'Track started' : 'Start the track'}
        </Button>
      </CardBody>
    </Card>
  )
}
