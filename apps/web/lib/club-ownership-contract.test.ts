import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const root = path.resolve(import.meta.dirname, '../../..')
const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8')
const migration = read('supabase/migrations/20260724000000_create_club_with_owner.sql')

describe('club ownership transaction contract', () => {
  it('creates the club and owner membership inside one invoker-rights function', () => {
    expect(migration).toMatch(
      /create or replace function public\.create_club_with_owner\([\s\S]+security invoker/,
    )
    expect(migration).toContain('requester_id uuid := auth.uid()')
    expect(migration).toMatch(/insert into public\.clubs \([\s\S]+returning clubs\.id/)
    expect(migration).toMatch(
      /insert into public\.club_members \(club_id, user_id, role\)[\s\S]+values \(created_id, requester_id, 'owner'\)/,
    )
  })

  it('limits execution to authenticated callers', () => {
    expect(migration).toMatch(
      /revoke all on function public\.create_club_with_owner\([\s\S]+from public/,
    )
    expect(migration).toMatch(
      /grant execute on function public\.create_club_with_owner\([\s\S]+to authenticated/,
    )
  })

  it('routes club creation only through the transactional function', () => {
    const route = read('apps/web/app/api/clubs/route.ts')
    expect(route).toContain(".rpc('create_club_with_owner'")
    expect(route).not.toMatch(/\.from\(['"]clubs['"]\)|\.from\(['"]club_members['"]\)/)
  })
})
