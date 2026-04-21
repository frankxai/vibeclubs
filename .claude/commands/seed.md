---
description: Seed the Supabase directory with 3 starter vibeclubs.
---

Seed three internal vibeclubs so the `/explore` page has content at launch.

For each template in `apps/web/lib/club-templates.ts` where `id` ∈ {`claude-code`, `morning-writers`, `suno-producers`}:

1. Insert a row into `public.clubs` with:
   - `slug`: matches the template id
   - `name`, `description`, `type`, `platform`, `pomodoro_preset`, `ambient_preset`: from the template defaults
   - `opener_id`: Frank's `auth.users.id` (fetch via `select id from auth.users where email = 'friemerx@gmail.com'`)
   - `is_active`: true
   - `tier`: `featured`
2. Also insert the opener as a `club_members` row with role `owner`.

Use `createSupabaseServiceClient()` from `apps/web/lib/supabase/server.ts` (service-role key required; never use anon key).

After seeding, print the three club URLs:
- https://vibeclubs.ai/club/claude-code
- https://vibeclubs.ai/club/morning-writers
- https://vibeclubs.ai/club/suno-producers
