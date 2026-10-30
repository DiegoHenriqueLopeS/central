-- CENTRAL: tabela única para sua conta, protegida por RLS.
create table if not exists public.central_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.central_data enable row level security;
drop policy if exists "central_select_own" on public.central_data;
drop policy if exists "central_insert_own" on public.central_data;
drop policy if exists "central_update_own" on public.central_data;
create policy "central_select_own" on public.central_data for select to authenticated using (auth.uid() = user_id);
create policy "central_insert_own" on public.central_data for insert to authenticated with check (auth.uid() = user_id);
create policy "central_update_own" on public.central_data for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
