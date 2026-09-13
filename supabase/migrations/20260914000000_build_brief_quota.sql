-- Apply before enabling AI_BRIEF_ENABLED. No prompt content is persisted here.
create table if not exists public.build_brief_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_day date not null,
  used integer not null check (used between 1 and 10),
  primary key (user_id, usage_day)
);
alter table public.build_brief_usage enable row level security;
revoke all on public.build_brief_usage from anon, authenticated;

create or replace function public.claim_build_brief()
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller uuid := auth.uid();
  claimed integer;
begin
  if caller is null then return false; end if;
  delete from public.build_brief_usage where user_id = caller
    and usage_day < (now() at time zone 'UTC')::date;
  insert into public.build_brief_usage as usage (user_id, usage_day, used)
  values (caller, (now() at time zone 'UTC')::date, 1)
  on conflict (user_id, usage_day) do update set used = usage.used + 1
    where usage.used < 10
  returning used into claimed;
  return claimed is not null;
end;
$$;
revoke all on function public.claim_build_brief() from public, anon;
grant execute on function public.claim_build_brief() to authenticated;
