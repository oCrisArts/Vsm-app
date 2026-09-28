create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text not null default '',
  slug text not null unique,
  description text not null default '',
  image_url text,
  tag text not null default '',
  is_published boolean not null default false,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text not null default '',
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, order_index)
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null,
  description text not null default '',
  duration text not null default '',
  is_published boolean not null default false,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (module_id, order_index)
);

create table public.lesson_blocks (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  type text not null check (type in ('text', 'video', 'image', 'audio')),
  title text,
  content text not null default '',
  media_url text,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  unique (lesson_id, order_index)
);

create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete cascade,
  title text not null,
  description text not null default '',
  created_at timestamptz not null default now(),
  check (course_id is not null or lesson_id is not null)
);

create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  question text not null,
  options jsonb not null check (jsonb_typeof(options) = 'array'),
  correct_answer integer not null check (correct_answer >= 0),
  order_index integer not null default 0,
  unique (quiz_id, order_index)
);

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  unique (user_id, course_id)
);

create table public.progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create index modules_course_id_idx on public.modules(course_id);
create index lessons_module_id_idx on public.lessons(module_id);
create index lesson_blocks_lesson_id_idx on public.lesson_blocks(lesson_id);
create index quizzes_course_id_idx on public.quizzes(course_id);
create index quizzes_lesson_id_idx on public.quizzes(lesson_id);
create index quiz_questions_quiz_id_idx on public.quiz_questions(quiz_id);
create index enrollments_user_id_idx on public.enrollments(user_id);
create index enrollments_course_id_idx on public.enrollments(course_id);
create index progress_user_id_idx on public.progress(user_id);
create index progress_lesson_id_idx on public.progress(lesson_id);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger courses_set_updated_at
before update on public.courses
for each row execute function private.set_updated_at();

create trigger modules_set_updated_at
before update on public.modules
for each row execute function private.set_updated_at();

create trigger lessons_set_updated_at
before update on public.lessons
for each row execute function private.set_updated_at();

alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_blocks enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.enrollments enable row level security;
alter table public.progress enable row level security;

create policy "authenticated read published courses"
on public.courses for select to authenticated
using (is_published or private.is_admin());

create policy "admins manage courses"
on public.courses for all to authenticated
using (private.is_admin()) with check (private.is_admin());

create policy "authenticated read published modules"
on public.modules for select to authenticated
using (private.is_admin() or exists (
  select 1 from public.courses c where c.id = course_id and c.is_published
));

create policy "admins manage modules"
on public.modules for all to authenticated
using (private.is_admin()) with check (private.is_admin());

create policy "authenticated read published lessons"
on public.lessons for select to authenticated
using (private.is_admin() or (is_published and exists (
  select 1 from public.modules m
  join public.courses c on c.id = m.course_id
  where m.id = module_id and c.is_published
)));

create policy "admins manage lessons"
on public.lessons for all to authenticated
using (private.is_admin()) with check (private.is_admin());

create policy "authenticated read published lesson blocks"
on public.lesson_blocks for select to authenticated
using (private.is_admin() or exists (
  select 1 from public.lessons l
  join public.modules m on m.id = l.module_id
  join public.courses c on c.id = m.course_id
  where l.id = lesson_id and l.is_published and c.is_published
));

create policy "admins manage lesson blocks"
on public.lesson_blocks for all to authenticated
using (private.is_admin()) with check (private.is_admin());

create policy "authenticated read published quizzes"
on public.quizzes for select to authenticated
using (private.is_admin() or exists (
  select 1 from public.courses c
  where c.id = course_id and c.is_published
) or exists (
  select 1 from public.lessons l
  join public.modules m on m.id = l.module_id
  join public.courses c on c.id = m.course_id
  where l.id = lesson_id and l.is_published and c.is_published
));

create policy "admins manage quizzes"
on public.quizzes for all to authenticated
using (private.is_admin()) with check (private.is_admin());

create policy "authenticated read published quiz questions"
on public.quiz_questions for select to authenticated
using (private.is_admin() or exists (
  select 1 from public.quizzes q
  left join public.courses qc on qc.id = q.course_id
  left join public.lessons l on l.id = q.lesson_id
  left join public.modules m on m.id = l.module_id
  left join public.courses lc on lc.id = m.course_id
  where q.id = quiz_id
    and (qc.is_published or (l.is_published and lc.is_published))
));

create policy "admins manage quiz questions"
on public.quiz_questions for all to authenticated
using (private.is_admin()) with check (private.is_admin());

create policy "users read own enrollments"
on public.enrollments for select to authenticated using (auth.uid() = user_id);
create policy "users create own enrollments"
on public.enrollments for insert to authenticated with check (auth.uid() = user_id);
create policy "users update own enrollments"
on public.enrollments for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users delete own enrollments"
on public.enrollments for delete to authenticated using (auth.uid() = user_id);

create policy "users read own progress"
on public.progress for select to authenticated using (auth.uid() = user_id);
create policy "users create own progress"
on public.progress for insert to authenticated with check (auth.uid() = user_id);
create policy "users update own progress"
on public.progress for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users delete own progress"
on public.progress for delete to authenticated using (auth.uid() = user_id);

grant select on public.courses, public.modules, public.lessons, public.lesson_blocks, public.quizzes, public.quiz_questions to authenticated;
grant insert, update, delete on public.courses, public.modules, public.lessons, public.lesson_blocks, public.quizzes, public.quiz_questions to authenticated;
grant select, insert, update, delete on public.enrollments, public.progress to authenticated;

insert into public.courses (title, subtitle, slug, description, image_url, tag, is_published, order_index)
values
  ('Dominação Absoluta', 'Controle Total', 'dominacao-absoluta', 'Aprenda as técnicas mais avançadas de domínio social e controle de frame para se tornar a presença mais poderosa em qualquer ambiente.', 'https://images.unsplash.com/photo-1559335185-5b7ddef49716?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', 'Avançado', true, 1),
  ('Arte da Conquista', 'Sedução Refinada', 'arte-da-conquista', 'Domine a arte da sedução através de técnicas refinadas de aproximação, conexão emocional e escalação física.', 'https://images.unsplash.com/photo-1567115702188-ea12a355f14a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', 'Intermediário', true, 2),
  ('Psicologia Dark', 'Manipulação Ética', 'psicologia-dark', 'Compreenda os gatilhos mentais mais poderosos e aprenda a influenciar decisões de forma ética e eficaz.', 'https://images.unsplash.com/photo-1700739746391-26561c282181?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', 'Avançado', true, 3),
  ('Linguagem Corporal', 'Presença Alpha', 'linguagem-corporal', 'Domine a comunicação não-verbal para projetar confiança absoluta e atrair instantaneamente.', 'https://images.unsplash.com/photo-1757196892661-dd9d35f2d6c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', 'Iniciante', true, 4),
  ('Storytelling Avançado', 'Narrativas Poderosas', 'storytelling-avancado', 'Crie histórias magnéticas que prendem a atenção e geram conexão emocional imediata.', 'https://images.unsplash.com/photo-1608049429989-ce05a0c5e15c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', 'Novo', true, 5),
  ('Frame Control', 'Domínio De Situações', 'frame-control', 'Mantenha o controle da realidade em qualquer interação social e nunca seja reativo.', 'https://images.unsplash.com/photo-1684333876081-3139802878f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', 'Novo', true, 6),
  ('Atração De Alto Valor', 'Magnetismo Pessoal', 'atracao-de-alto-valor', 'Desenvolva o magnetismo natural que faz com que mulheres de alto valor se aproximem de você espontaneamente.', 'https://images.unsplash.com/photo-1562519766-9769dafbb374?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', 'Novo', true, 7),
  ('Calibração Social', 'Inteligência De Campo', 'calibracao-social', 'Leia com precisão qualquer ambiente social e ajuste sua estratégia em tempo real para maximizar seus resultados.', 'https://images.unsplash.com/photo-1694120105801-b51db377f758?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', 'Iniciante', true, 8);

insert into public.modules (course_id, title, description, order_index)
select c.id, seed.title, '', seed.order_index
from (values
  ('dominacao-absoluta', 'Fundamentos', 1), ('dominacao-absoluta', 'Frame Control', 2), ('dominacao-absoluta', 'Domínio', 3),
  ('arte-da-conquista', 'Aproximação', 1), ('arte-da-conquista', 'Conexão', 2),
  ('psicologia-dark', 'Gatilhos', 1),
  ('linguagem-corporal', 'Postura', 1), ('linguagem-corporal', 'Gestos', 2),
  ('storytelling-avancado', 'Conteúdo Principal', 1),
  ('frame-control', 'Conteúdo Principal', 1),
  ('atracao-de-alto-valor', 'Conteúdo Principal', 1),
  ('calibracao-social', 'Conteúdo Principal', 1)
) as seed(slug, title, order_index)
join public.courses c on c.slug = seed.slug;

insert into public.lessons (module_id, title, description, duration, is_published, order_index)
select m.id, seed.title, '', seed.duration, true, seed.order_index
from (values
  ('dominacao-absoluta', 'Fundamentos', 'Fundamentos do Poder', '15 min', 1),
  ('dominacao-absoluta', 'Frame Control', 'Frame Control Avançado', '20 min', 1),
  ('dominacao-absoluta', 'Domínio', 'Linguagem Corporal Alpha', '18 min', 1),
  ('dominacao-absoluta', 'Domínio', 'Domínio Verbal', '22 min', 2),
  ('dominacao-absoluta', 'Domínio', 'Manipulação Ética', '25 min', 3),
  ('arte-da-conquista', 'Aproximação', 'A Regra dos 3 Segundos', '12 min', 1),
  ('arte-da-conquista', 'Aproximação', 'Openers Magnéticos', '16 min', 2),
  ('arte-da-conquista', 'Conexão', 'Conexão Profunda', '20 min', 1),
  ('arte-da-conquista', 'Conexão', 'Escalação Física', '18 min', 2),
  ('psicologia-dark', 'Gatilhos', 'Gatilhos Mentais', '14 min', 1),
  ('psicologia-dark', 'Gatilhos', 'PNL Avançada', '22 min', 2),
  ('psicologia-dark', 'Gatilhos', 'Persuasão Subliminar', '19 min', 3),
  ('psicologia-dark', 'Gatilhos', 'Leitura Corporal', '17 min', 4),
  ('linguagem-corporal', 'Postura', 'Postura de Poder', '15 min', 1),
  ('linguagem-corporal', 'Postura', 'Micro-expressões', '18 min', 2),
  ('linguagem-corporal', 'Gestos', 'O Toque Sutil', '20 min', 1),
  ('storytelling-avancado', 'Conteúdo Principal', 'A Jornada do Herói', '25 min', 1),
  ('storytelling-avancado', 'Conteúdo Principal', 'Gatilhos Narrativos', '20 min', 2),
  ('storytelling-avancado', 'Conteúdo Principal', 'Vulnerabilidade Seletiva', '22 min', 3),
  ('frame-control', 'Conteúdo Principal', 'A Psicologia do Frame', '30 min', 1),
  ('frame-control', 'Conteúdo Principal', 'Neutralizando Testes', '25 min', 2),
  ('frame-control', 'Conteúdo Principal', 'Liderança Social', '28 min', 3),
  ('atracao-de-alto-valor', 'Conteúdo Principal', 'O Efeito Halo', '18 min', 1),
  ('atracao-de-alto-valor', 'Conteúdo Principal', 'Pré-seleção Social', '22 min', 2),
  ('atracao-de-alto-valor', 'Conteúdo Principal', 'Abundância Genuína', '20 min', 3),
  ('atracao-de-alto-valor', 'Conteúdo Principal', 'Missão de Vida', '25 min', 4),
  ('calibracao-social', 'Conteúdo Principal', 'Leitura de Ambiente', '16 min', 1),
  ('calibracao-social', 'Conteúdo Principal', 'Dinâmicas de Grupo', '20 min', 2),
  ('calibracao-social', 'Conteúdo Principal', 'Adaptação Rápida', '18 min', 3)
) as seed(slug, module_title, title, duration, order_index)
join public.courses c on c.slug = seed.slug
join public.modules m on m.course_id = c.id and m.title = seed.module_title;

insert into public.lesson_blocks (lesson_id, type, title, content, media_url, order_index)
select l.id, 'text', null, seed.content, null, seed.order_index
from (values
  (1, 'O PODER NÃO É DADO. É TOMADO.'),
  (2, 'QUEM CONTROLA O FRAME CONTROLA A INTERAÇÃO.'),
  (3, 'SUA PRESENÇA DEVE SER SENTIDA ANTES MESMO DE VOCÊ FALAR.'),
  (5, 'PARABÉNS! VOCÊ DOMINOU OS FUNDAMENTOS DO PODER.')
) as seed(order_index, content)
join public.modules m on m.title = 'Fundamentos'
join public.courses c on c.id = m.course_id and c.slug = 'dominacao-absoluta'
join public.lessons l on l.module_id = m.id and l.title = 'Fundamentos do Poder';

insert into public.quizzes (course_id, lesson_id, title, description)
select c.id, l.id, seed.title, ''
from (values
  ('dominacao-absoluta', 'Quiz: Frame Control', 'Fundamentos do Poder'),
  ('arte-da-conquista', 'Quiz: Sedução Avançada', null),
  ('psicologia-dark', 'Quiz: PNL Básica', null),
  ('linguagem-corporal', 'Quiz: Corpo e Postura', null)
) as seed(slug, title, lesson_title)
join public.courses c on c.slug = seed.slug
left join lateral (
  select lesson.id
  from public.lessons lesson
  join public.modules module on module.id = lesson.module_id
  where module.course_id = c.id and lesson.title = seed.lesson_title
  limit 1
) l on true;

insert into public.quiz_questions (quiz_id, question, options, correct_answer, order_index)
select q.id,
  'Qual é o elemento mais importante do frame control?',
  '["Falar mais alto que os outros", "Manter sua realidade inabalável", "Concordar com tudo", "Ser agressivo"]'::jsonb,
  1,
  1
from public.quizzes q
join public.courses c on c.id = q.course_id
where c.slug = 'dominacao-absoluta' and q.title = 'Quiz: Frame Control';
