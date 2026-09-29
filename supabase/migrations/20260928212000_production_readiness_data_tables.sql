create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  age integer,
  photo_url text,
  stage text not null default 'Abridor Enviado' check (stage in ('Abridor Enviado', 'Conversa Fluindo', 'Conforto Estabelecido', 'Encontro Solicitado')),
  platform text not null default '',
  last_contact timestamptz,
  notes text not null default '',
  meeting_date date,
  meeting_time time,
  meeting_location text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.body_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  weight numeric,
  body_fat numeric,
  logged_at date not null default current_date,
  created_at timestamptz not null default now(),
  unique(user_id, logged_at)
);

create table public.diet_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  calories integer not null check (calories > 0),
  meal_label text,
  logged_at date not null default current_date,
  created_at timestamptz not null default now()
);

create table public.finance_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  month_year text not null check (month_year ~ '^\d{4}-\d{2}$'),
  income numeric not null default 0 check (income >= 0),
  expenses numeric not null default 0 check (expenses >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, month_year)
);

create table public.evolution_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  metric_name text not null,
  value numeric not null,
  recorded_at timestamptz not null default now()
);

create index contacts_user_updated_idx on public.contacts(user_id, updated_at desc);
create index body_logs_user_logged_idx on public.body_logs(user_id, logged_at);
create index diet_logs_user_logged_idx on public.diet_logs(user_id, logged_at);
create index finance_records_user_month_idx on public.finance_records(user_id, month_year);
create index evolution_metrics_user_recorded_idx on public.evolution_metrics(user_id, recorded_at desc);

create trigger contacts_set_updated_at before update on public.contacts
for each row execute function private.set_updated_at();
create trigger finance_records_set_updated_at before update on public.finance_records
for each row execute function private.set_updated_at();

alter table public.contacts enable row level security;
alter table public.body_logs enable row level security;
alter table public.diet_logs enable row level security;
alter table public.finance_records enable row level security;
alter table public.evolution_metrics enable row level security;

create policy "users manage own contacts"
on public.contacts for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy "admins read all contacts"
on public.contacts for select to authenticated
using (private.is_admin());

create policy "users manage own body logs"
on public.body_logs for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy "admins read all body logs"
on public.body_logs for select to authenticated
using (private.is_admin());

create policy "users manage own diet logs"
on public.diet_logs for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy "admins read all diet logs"
on public.diet_logs for select to authenticated
using (private.is_admin());

create policy "users manage own finance records"
on public.finance_records for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy "admins read all finance records"
on public.finance_records for select to authenticated
using (private.is_admin());

create policy "users manage own evolution metrics"
on public.evolution_metrics for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy "admins read all evolution metrics"
on public.evolution_metrics for select to authenticated
using (private.is_admin());

grant select, insert, update, delete on
  public.contacts,
  public.body_logs,
  public.diet_logs,
  public.finance_records,
  public.evolution_metrics
to authenticated;
