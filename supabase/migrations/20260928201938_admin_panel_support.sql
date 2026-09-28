alter table public.modules drop constraint if exists modules_course_id_order_index_key;
alter table public.lessons drop constraint if exists lessons_module_id_order_index_key;
alter table public.quiz_questions drop constraint if exists quiz_questions_quiz_id_order_index_key;

create index if not exists modules_course_order_idx on public.modules(course_id, order_index);
create index if not exists lessons_module_order_idx on public.lessons(module_id, order_index);
create index if not exists quiz_questions_quiz_order_idx on public.quiz_questions(quiz_id, order_index);

drop policy if exists "users read own enrollments" on public.enrollments;
drop policy if exists "users read own progress" on public.progress;

create policy "users read own enrollments and admins read all"
on public.enrollments for select to authenticated
using ((select auth.uid()) = user_id or private.is_admin());

create policy "users read own progress and admins read all"
on public.progress for select to authenticated
using ((select auth.uid()) = user_id or private.is_admin());
