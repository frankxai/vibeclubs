-- Create a club and its owner membership in one database transaction.
-- Postgres rolls the club insert back if membership creation fails.

alter type public.pomodoro_preset add value if not exists 'vibe_coding_sprint';
alter type public.pomodoro_preset add value if not exists 'music_jam';
alter type public.pomodoro_preset add value if not exists 'dance_break';
alter type public.pomodoro_preset add value if not exists 'lightning';

create or replace function public.create_club_with_owner(
  p_name text,
  p_slug text,
  p_description text,
  p_type public.club_type,
  p_platform public.club_platform,
  p_platform_url text,
  p_schedule text,
  p_pomodoro_preset public.pomodoro_preset,
  p_ambient_preset text
)
returns table (id uuid, slug text)
language plpgsql
security invoker
set search_path = ''
as $function$
declare
  requester_id uuid := auth.uid();
  created_id uuid;
begin
  if requester_id is null then
    raise sqlstate '42501' using message = 'Authentication required';
  end if;

  insert into public.clubs (
    name,
    slug,
    description,
    type,
    platform,
    platform_url,
    schedule,
    pomodoro_preset,
    ambient_preset,
    opener_id
  )
  values (
    p_name,
    p_slug,
    p_description,
    p_type,
    p_platform,
    p_platform_url,
    p_schedule,
    p_pomodoro_preset,
    p_ambient_preset,
    requester_id
  )
  returning clubs.id into created_id;

  insert into public.club_members (club_id, user_id, role)
  values (created_id, requester_id, 'owner');

  return query select created_id, p_slug;
end;
$function$;

revoke all on function public.create_club_with_owner(
  text,
  text,
  text,
  public.club_type,
  public.club_platform,
  text,
  text,
  public.pomodoro_preset,
  text
) from public, anon, service_role;

grant execute on function public.create_club_with_owner(
  text,
  text,
  text,
  public.club_type,
  public.club_platform,
  text,
  text,
  public.pomodoro_preset,
  text
) to authenticated;
