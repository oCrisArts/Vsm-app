create table public.library_items (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('audio', 'book', 'script', 'pdf')),
  title text not null,
  subtitle text,
  description text,
  category text,
  cover_url text,
  file_url text,
  content text,
  duration_minutes integer check (duration_minutes is null or duration_minutes >= 0),
  pages integer check (pages is null or pages >= 0),
  line_count integer check (line_count is null or line_count >= 0),
  views integer not null default 0 check (views >= 0),
  is_published boolean not null default false,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index library_items_published_order_idx
on public.library_items (is_published, order_index);

create index library_items_type_idx on public.library_items (type);

create trigger library_items_set_updated_at
before update on public.library_items
for each row execute function private.set_updated_at();

alter table public.library_items enable row level security;

create policy "authenticated read published library items"
on public.library_items for select to authenticated
using (is_published or private.is_admin());

create policy "admins insert library items"
on public.library_items for insert to authenticated
with check (private.is_admin());

create policy "admins update library items"
on public.library_items for update to authenticated
using (private.is_admin()) with check (private.is_admin());

create policy "admins delete library items"
on public.library_items for delete to authenticated
using (private.is_admin());

grant select, insert, update, delete on public.library_items to authenticated;

insert into storage.buckets (id, name, public, file_size_limit)
values
  ('library', 'library', false, 104857600),
  ('course-covers', 'course-covers', false, 10485760),
  ('lesson-media', 'lesson-media', false, 524288000),
  ('avatars', 'avatars', false, 10485760)
on conflict (id) do update set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit;

create policy "authenticated read published library files"
on storage.objects for select to authenticated
using (
  bucket_id = 'library'
  and (
    private.is_admin()
    or exists (
      select 1 from public.library_items item
      where item.is_published
        and (item.cover_url = name or item.file_url = name)
    )
  )
);

create policy "authenticated read published course covers"
on storage.objects for select to authenticated
using (
  bucket_id = 'course-covers'
  and (
    private.is_admin()
    or exists (
      select 1 from public.courses course
      where course.is_published and course.image_url = name
    )
  )
);

create policy "authenticated read published lesson media"
on storage.objects for select to authenticated
using (
  bucket_id = 'lesson-media'
  and (
    private.is_admin()
    or exists (
      select 1 from public.lesson_blocks block
      join public.lessons lesson on lesson.id = block.lesson_id
      join public.modules module on module.id = lesson.module_id
      join public.courses course on course.id = module.course_id
      where block.media_url = name and lesson.is_published and course.is_published
    )
  )
);

create policy "authenticated read avatars"
on storage.objects for select to authenticated
using (bucket_id = 'avatars');

create policy "admins upload managed media"
on storage.objects for insert to authenticated
with check (
  bucket_id in ('library', 'course-covers', 'lesson-media', 'avatars')
  and private.is_admin()
);

create policy "admins update managed media"
on storage.objects for update to authenticated
using (
  bucket_id in ('library', 'course-covers', 'lesson-media', 'avatars')
  and private.is_admin()
)
with check (
  bucket_id in ('library', 'course-covers', 'lesson-media', 'avatars')
  and private.is_admin()
);

create policy "admins delete managed media"
on storage.objects for delete to authenticated
using (
  bucket_id in ('library', 'course-covers', 'lesson-media', 'avatars')
  and private.is_admin()
);

create policy "users upload own avatars"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "users update own avatars"
on storage.objects for update to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "users delete own avatars"
on storage.objects for delete to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

insert into public.library_items (
  type, title, category, cover_url, duration_minutes, pages, line_count,
  views, is_published, order_index
)
values
  ('audio', 'Hipnose Conversacional', 'PNL', 'https://images.unsplash.com/photo-1697739348487-75f668fdb6fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', 45, null, null, 892, true, 1),
  ('audio', 'Afirmações De Poder', 'Mindset', 'https://images.unsplash.com/photo-1576629679906-08e08bfaed82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', 30, null, null, 634, true, 2),
  ('book', 'As 48 Leis Do Poder', 'Estratégia', 'https://images.unsplash.com/photo-1728731152406-8390889b2489?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', null, 452, null, 1243, true, 3),
  ('book', 'A Arte Da Sedução', 'Sedução', 'https://images.unsplash.com/photo-1487252502161-75020a813bf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', null, 420, null, 978, true, 4),
  ('script', 'Abertura Direta', 'Abordagem', 'https://images.unsplash.com/photo-1535311631117-da5b8ab9c505?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', null, null, 15, 756, true, 5),
  ('script', 'Rotina Do Cubo', 'Conforto', 'https://images.unsplash.com/photo-1680174716363-6d71e35014b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', null, null, 25, 543, true, 6),
  ('audio', 'Frequência Alfa Mental', 'Mindset', 'https://images.unsplash.com/photo-1724403126398-ea3505a400c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', 60, null, null, 421, true, 7),
  ('script', 'Escalada De Tensão', 'Sedução', 'https://images.unsplash.com/photo-1619198652021-75a0b4ac7462?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', null, null, 20, 389, true, 8),
  ('pdf', 'Guia De Abordagem', 'Abordagem', 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', null, 24, null, 667, true, 9),
  ('pdf', 'Manual Do Conforto', 'Conforto', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', null, 18, null, 512, true, 10),
  ('pdf', 'Scripts de Escalada', 'Sedução', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1080&q=80', null, 32, null, 445, true, 11),
  ('pdf', 'Guia de Frame Control', 'Estratégia', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1080&q=80', null, 28, null, 378, true, 12);
