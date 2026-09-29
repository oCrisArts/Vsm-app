drop policy if exists "admins manage achievements" on public.achievements;
create policy "admins insert achievements" on public.achievements for insert to authenticated with check (private.is_admin());
create policy "admins update achievements" on public.achievements for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "admins delete achievements" on public.achievements for delete to authenticated using (private.is_admin());

drop policy if exists "admins manage user achievements" on public.user_achievements;
create policy "admins insert user achievements" on public.user_achievements for insert to authenticated with check (private.is_admin());
create policy "admins update user achievements" on public.user_achievements for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "admins delete user achievements" on public.user_achievements for delete to authenticated using (private.is_admin());

drop policy if exists "users manage own contacts" on public.contacts;
drop policy if exists "admins read all contacts" on public.contacts;
create policy "users read own contacts and admins read all" on public.contacts for select to authenticated using ((select auth.uid()) = user_id or private.is_admin());
create policy "users insert own contacts" on public.contacts for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "users update own contacts" on public.contacts for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "users delete own contacts" on public.contacts for delete to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "users manage own body logs" on public.body_logs;
drop policy if exists "admins read all body logs" on public.body_logs;
create policy "users read own body logs and admins read all" on public.body_logs for select to authenticated using ((select auth.uid()) = user_id or private.is_admin());
create policy "users insert own body logs" on public.body_logs for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "users update own body logs" on public.body_logs for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "users delete own body logs" on public.body_logs for delete to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "users manage own diet logs" on public.diet_logs;
drop policy if exists "admins read all diet logs" on public.diet_logs;
create policy "users read own diet logs and admins read all" on public.diet_logs for select to authenticated using ((select auth.uid()) = user_id or private.is_admin());
create policy "users insert own diet logs" on public.diet_logs for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "users update own diet logs" on public.diet_logs for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "users delete own diet logs" on public.diet_logs for delete to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "users manage own finance records" on public.finance_records;
drop policy if exists "admins read all finance records" on public.finance_records;
create policy "users read own finance records and admins read all" on public.finance_records for select to authenticated using ((select auth.uid()) = user_id or private.is_admin());
create policy "users insert own finance records" on public.finance_records for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "users update own finance records" on public.finance_records for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "users delete own finance records" on public.finance_records for delete to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "users manage own evolution metrics" on public.evolution_metrics;
drop policy if exists "admins read all evolution metrics" on public.evolution_metrics;
create policy "users read own evolution metrics and admins read all" on public.evolution_metrics for select to authenticated using ((select auth.uid()) = user_id or private.is_admin());
create policy "users insert own evolution metrics" on public.evolution_metrics for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "users update own evolution metrics" on public.evolution_metrics for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "users delete own evolution metrics" on public.evolution_metrics for delete to authenticated using ((select auth.uid()) = user_id);
