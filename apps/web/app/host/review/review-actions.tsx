'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Check, ShieldAlert, X } from 'lucide-react'
import { Button, Textarea, toast } from '@/components/ui'

type ReviewKind = 'agent-run' | 'social-draft'
type AgentDecision = 'approved' | 'rejected' | 'blocked'
type DraftDecision = 'approved' | 'rejected'

export function ReviewActions({ id, kind }: { id: string; kind: ReviewKind }) {
  const router = useRouter()
  const [note, setNote] = useState('')
  const [pending, startTransition] = useTransition()

  function decide(decision: AgentDecision | DraftDecision) {
    startTransition(async () => {
      const response = await fetch(endpointFor(kind), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id, decision, reason: note.trim() || undefined }),
      })

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string }
        toast.error(body.error ?? 'Review failed')
        return
      }

      toast.success(decision === 'approved' ? 'Approved' : 'Marked reviewed')
      setNote('')
      router.refresh()
    })
  }

  return (
    <div className="space-y-3">
      <Textarea
        rows={2}
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="Optional review note"
      />
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant="signal"
          disabled={pending}
          leading={<Check size={14} />}
          onClick={() => decide('approved')}
        >
          Approve
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={pending}
          leading={<X size={14} />}
          onClick={() => decide('rejected')}
        >
          Reject
        </Button>
        {kind === 'agent-run' && (
          <Button
            type="button"
            size="sm"
            variant="danger"
            disabled={pending}
            leading={<ShieldAlert size={14} />}
            onClick={() => decide('blocked')}
          >
            Block
          </Button>
        )}
      </div>
    </div>
  )
}

function endpointFor(kind: ReviewKind) {
  return kind === 'agent-run' ? '/api/agent-runs/approval' : '/api/social/drafts/approval'
}
