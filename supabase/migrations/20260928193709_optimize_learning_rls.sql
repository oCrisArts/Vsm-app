drop policy "admins manage courses" on public.courses;
drop policy "admins manage modules" on public.modules;
drop policy "admins manage lessons" on public.lessons;
drop policy "admins manage lesson blocks" on public.lesson_blocks;
drop policy "admins manage quizzes" on public.quizzes;
drop policy "admins manage quiz questions" on public.quiz_questions;

create policy "admins insert courses" on public.courses for insert to authenticated with check (private.is_admin());
create policy "admins update courses" on public.courses for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "admins delete courses" on public.courses for delete to authenticated using (private.is_admin());

create policy "admins insert modules" on public.modules for insert to authenticated with check (private.is_admin());
create policy "admins update modules" on public.modules for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "admins delete modules" on public.modules for delete to authenticated using (private.is_admin());

create policy "admins insert lessons" on public.lessons for insert to authenticated with check (private.is_admin());
create policy "admins update lessons" on public.lessons for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "admins delete lessons" on public.lessons for delete to authenticated using (private.is_admin());

create policy "admins insert lesson blocks" on public.lesson_blocks for insert to authenticated with check (private.is_admin());
create policy "admins update lesson blocks" on public.lesson_blocks for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "admins delete lesson blocks" on public.lesson_blocks for delete to authenticated using (private.is_admin());

create policy "admins insert quizzes" on public.quizzes for insert to authenticated with check (private.is_admin());
create policy "admins update quizzes" on public.quizzes for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "admins delete quizzes" on public.quizzes for delete to authenticated using (private.is_admin());

create policy "admins insert quiz questions" on public.quiz_questions for insert to authenticated with check (private.is_admin());
create policy "admins update quiz questions" on public.quiz_questions for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "admins delete quiz questions" on public.quiz_questions for delete to authenticated using (private.is_admin());

drop policy "users read own enrollments" on public.enrollments;
drop policy "users create own enrollments" on public.enrollments;
drop policy "users update own enrollments" on public.enrollments;
drop policy "users delete own enrollments" on public.enrollments;
drop policy "users read own progress" on public.progress;
drop policy "users create own progress" on public.progress;
drop policy "users update own progress" on public.progress;
drop policy "users delete own progress" on public.progress;

create policy "users read own enrollments" on public.enrollments for select to authenticated using ((select auth.uid()) = user_id);
create policy "users create own enrollments" on public.enrollments for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "users update own enrollments" on public.enrollments for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "users delete own enrollments" on public.enrollments for delete to authenticated using ((select auth.uid()) = user_id);

create policy "users read own progress" on public.progress for select to authenticated using ((select auth.uid()) = user_id);
create policy "users create own progress" on public.progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "users update own progress" on public.progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "users delete own progress" on public.progress for delete to authenticated using ((select auth.uid()) = user_id);
