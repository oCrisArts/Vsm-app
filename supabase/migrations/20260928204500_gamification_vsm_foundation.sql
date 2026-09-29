create table public.vsm_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  score integer not null check (score between 0 and 100),
  event_type text not null,
  description text,
  created_at timestamptz not null default now()
);

create table public.xp_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null check (event_type in ('lesson_completed', 'quiz_completed', 'course_completed', 'achievement')),
  points integer not null check (points > 0),
  source_type text not null check (source_type in ('lesson', 'quiz', 'course', 'achievement')),
  source_id uuid,
  created_at timestamptz not null default now()
);

create unique index xp_events_once_per_source_idx
on public.xp_events (user_id, event_type, source_type, source_id) nulls not distinct;

create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  description text not null default '',
  xp_reward integer not null default 0 check (xp_reward >= 0),
  is_active boolean not null default true
);

create table public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  unique (user_id, achievement_id)
);

create index vsm_history_user_created_idx on public.vsm_history(user_id, created_at);
create index xp_events_user_created_idx on public.xp_events(user_id, created_at);
create index user_achievements_user_idx on public.user_achievements(user_id);

create or replace function private.calculate_vsm_score(
  shape integer,
  finance integer,
  knowledge integer,
  social integer
)
returns integer
language sql
immutable
strict
set search_path = ''
as $$
  select least(100, greatest(0, round((shape + finance + knowledge + social)::numeric / 4)::integer));
$$;

create or replace function private.recalculate_profile_vsm()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.vsm_score := private.calculate_vsm_score(
    new.shape_score,
    new.finance_score,
    new.knowledge_score,
    new.social_score
  );
  new.vsm_level := least(5, greatest(1, floor(new.vsm_score / 20.0)::integer + 1));
  return new;
end;
$$;

create or replace function private.record_profile_vsm_history()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' or new.vsm_score is distinct from old.vsm_score then
    insert into public.vsm_history(user_id, score, event_type, description)
    values (
      new.id,
      new.vsm_score,
      case when tg_op = 'INSERT' then 'profile_created' else 'pillars_updated' end,
      case when tg_op = 'INSERT' then 'Perfil criado' else 'VSM recalculado a partir dos quatro pilares' end
    );
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_recalculate_vsm on public.profiles;
create trigger profiles_recalculate_vsm
before insert or update of shape_score, finance_score, knowledge_score, social_score
on public.profiles
for each row execute function private.recalculate_profile_vsm();

drop trigger if exists profiles_record_vsm_history on public.profiles;
create trigger profiles_record_vsm_history
after insert or update
on public.profiles
for each row execute function private.record_profile_vsm_history();

revoke all on function private.calculate_vsm_score(integer, integer, integer, integer) from public, anon, authenticated;
revoke all on function private.recalculate_profile_vsm() from public, anon, authenticated;
revoke all on function private.record_profile_vsm_history() from public, anon, authenticated;

-- Recalculate existing profiles with the same database function and create a
-- single real baseline for accounts that predate this migration.
update public.profiles
set shape_score = shape_score;

insert into public.vsm_history(user_id, score, event_type, description)
select id, vsm_score, 'migration_baseline', 'Pontuação existente ao ativar o histórico de VSM'
from public.profiles profile
where not exists (select 1 from public.vsm_history history where history.user_id = profile.id);

create or replace function private.award_xp(
  target_user_id uuid,
  target_event_type text,
  target_points integer,
  target_source_type text,
  target_source_id uuid
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  inserted_points integer;
begin
  insert into public.xp_events(user_id, event_type, points, source_type, source_id)
  values (target_user_id, target_event_type, target_points, target_source_type, target_source_id)
  on conflict (user_id, event_type, source_type, source_id) do nothing
  returning points into inserted_points;

  if inserted_points is not null then
    update public.profiles
    set total_xp = total_xp + inserted_points
    where id = target_user_id;
    return inserted_points;
  end if;

  return 0;
end;
$$;

revoke all on function private.award_xp(uuid, text, integer, text, uuid) from public, anon, authenticated;

create or replace function private.award_achievement_xp()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  reward integer;
begin
  select xp_reward into reward
  from public.achievements
  where id = new.achievement_id;

  if reward > 0 then
    perform private.award_xp(new.user_id, 'achievement', reward, 'achievement', new.achievement_id);
  end if;
  return new;
end;
$$;

revoke all on function private.award_achievement_xp() from public, anon, authenticated;

create trigger user_achievements_award_xp
after insert on public.user_achievements
for each row execute function private.award_achievement_xp();

create or replace function public.complete_lesson(target_lesson_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_id uuid := auth.uid();
  target_course_id uuid;
  progress_created boolean := false;
  awarded integer := 0;
  quiz_record record;
  lesson_total integer;
  lesson_completed integer;
  course_finished boolean := false;
  current_total integer;
begin
  if caller_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  select course.id into target_course_id
  from public.lessons lesson
  join public.modules module on module.id = lesson.module_id
  join public.courses course on course.id = module.course_id
  where lesson.id = target_lesson_id
    and lesson.is_published
    and course.is_published;

  if target_course_id is null then
    raise exception 'Published lesson not found' using errcode = 'P0002';
  end if;

  insert into public.progress(user_id, lesson_id)
  values (caller_id, target_lesson_id)
  on conflict (user_id, lesson_id) do nothing;
  progress_created := found;

  if progress_created then
    awarded := awarded + private.award_xp(caller_id, 'lesson_completed', 10, 'lesson', target_lesson_id);

    for quiz_record in
      select id from public.quizzes where lesson_id = target_lesson_id
    loop
      awarded := awarded + private.award_xp(caller_id, 'quiz_completed', 20, 'quiz', quiz_record.id);
    end loop;
  end if;

  select count(*) into lesson_total
  from public.lessons lesson
  join public.modules module on module.id = lesson.module_id
  where module.course_id = target_course_id and lesson.is_published;

  select count(*) into lesson_completed
  from public.progress progress
  join public.lessons lesson on lesson.id = progress.lesson_id
  join public.modules module on module.id = lesson.module_id
  where progress.user_id = caller_id
    and module.course_id = target_course_id
    and lesson.is_published;

  if lesson_total > 0 and lesson_completed = lesson_total then
    course_finished := true;
    awarded := awarded + private.award_xp(caller_id, 'course_completed', 100, 'course', target_course_id);
  end if;

  select total_xp into current_total from public.profiles where id = caller_id;
  return jsonb_build_object(
    'progress_created', progress_created,
    'xp_awarded', awarded,
    'total_xp', current_total,
    'course_completed', course_finished
  );
end;
$$;

revoke all on function public.complete_lesson(uuid) from public, anon;
grant execute on function public.complete_lesson(uuid) to authenticated;

create or replace function public.get_my_gamification_summary()
returns table(rank bigint, courses_completed bigint)
language sql
stable
security definer
set search_path = ''
as $$
  with me as (
    select id, total_xp from public.profiles where id = auth.uid()
  ), completed as (
    select course.id
    from public.courses course
    where exists (
      select 1 from public.lessons lesson
      join public.modules module on module.id = lesson.module_id
      where module.course_id = course.id and lesson.is_published
    )
    and not exists (
      select 1 from public.lessons lesson
      join public.modules module on module.id = lesson.module_id
      where module.course_id = course.id
        and lesson.is_published
        and not exists (
          select 1 from public.progress progress
          where progress.user_id = auth.uid() and progress.lesson_id = lesson.id
        )
    )
  )
  select
    (select 1 + count(*) from public.profiles profile, me where profile.total_xp > me.total_xp),
    (select count(*) from completed);
$$;

revoke all on function public.get_my_gamification_summary() from public, anon;
grant execute on function public.get_my_gamification_summary() to authenticated;

alter table public.vsm_history enable row level security;
alter table public.xp_events enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;

create policy "users read own vsm history and admins read all"
on public.vsm_history for select to authenticated
using ((select auth.uid()) = user_id or private.is_admin());

create policy "users read own xp events and admins read all"
on public.xp_events for select to authenticated
using ((select auth.uid()) = user_id or private.is_admin());

create policy "authenticated read active achievements"
on public.achievements for select to authenticated
using (is_active or private.is_admin());

create policy "admins manage achievements"
on public.achievements for all to authenticated
using (private.is_admin()) with check (private.is_admin());

create policy "users read own achievements and admins read all"
on public.user_achievements for select to authenticated
using ((select auth.uid()) = user_id or private.is_admin());

create policy "admins manage user achievements"
on public.user_achievements for all to authenticated
using (private.is_admin()) with check (private.is_admin());

grant select on public.vsm_history, public.xp_events, public.achievements, public.user_achievements to authenticated;
grant insert, update, delete on public.achievements, public.user_achievements to authenticated;

drop policy if exists "users create own progress" on public.progress;
drop policy if exists "users update own progress" on public.progress;
drop policy if exists "users delete own progress" on public.progress;
revoke insert, update, delete on public.progress from authenticated;

insert into public.achievements(code, title, description, xp_reward, is_active)
values
  ('mestre-da-persuasao', 'Mestre da Persuasão', 'Conquista de domínio das técnicas de persuasão.', 50, true),
  ('dominador', 'Dominador', 'Conquista de avanço nos conteúdos de domínio social.', 50, true),
  ('cem-aproximacoes', '100 Aproximações', 'Conquista de consistência em interações sociais.', 100, true),
  ('imparavel', 'Imparável', 'Conquista de consistência contínua na jornada.', 100, true)
on conflict (code) do update set
  title = excluded.title,
  description = excluded.description,
  xp_reward = excluded.xp_reward,
  is_active = excluded.is_active;

-- Preserve existing real progress as XP without creating duplicates.
insert into public.xp_events(user_id, event_type, points, source_type, source_id, created_at)
select user_id, 'lesson_completed', 10, 'lesson', lesson_id, completed_at
from public.progress
on conflict (user_id, event_type, source_type, source_id) do nothing;

insert into public.xp_events(user_id, event_type, points, source_type, source_id)
select profile.id, 'course_completed', 100, 'course', course.id
from public.profiles profile
cross join public.courses course
where exists (
  select 1 from public.lessons lesson
  join public.modules module on module.id = lesson.module_id
  where module.course_id = course.id and lesson.is_published
)
and not exists (
  select 1 from public.lessons lesson
  join public.modules module on module.id = lesson.module_id
  where module.course_id = course.id and lesson.is_published
    and not exists (
      select 1 from public.progress progress
      where progress.user_id = profile.id and progress.lesson_id = lesson.id
    )
)
on conflict (user_id, event_type, source_type, source_id) do nothing;

update public.profiles profile
set total_xp = coalesce((select sum(event.points) from public.xp_events event where event.user_id = profile.id), 0);
