---
description: Run the Supabase migration against the linked project.
argument-hint: "[--dry]"
---

Run the Supabase schema migration.

Steps:
1. Confirm the Supabase project is linked: `supabase status`. If not linked, prompt Frank to run `supabase link --project-ref <ref>`.
2. If `$ARGUMENTS` contains `--dry`, run `supabase db diff` instead of pushing.
3. Otherwise: `supabase db push`.
4. Verify the migration took: check that `public.clubs`, `public.users`, `public.sessions`, `public.tool_recommendations` exist.
5. Report success with the exact table list + row counts.

Migration file: `supabase/migrations/20260419000000_init.sql`.

If the project isn't linked or credentials aren't set, write the blocker to `BLOCKERS.md` and skip rather than fail. Follow the ENVIRONMENT.md §1 checklist for the fix.
