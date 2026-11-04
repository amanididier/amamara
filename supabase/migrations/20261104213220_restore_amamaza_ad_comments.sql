create table if not exists public.ad_comments (
  id uuid primary key default gen_random_uuid(),
  ad_id text not null,
  name text not null default 'Umushyitsi',
  body text not null,
  created_at timestamptz not null default now()
);
grant select, insert on public.ad_comments to anon, authenticated;
grant all on public.ad_comments to service_role;
alter table public.ad_comments enable row level security;
create policy "Anyone can read comments" on public.ad_comments
  for select to anon, authenticated using (true);
create policy "Anyone can post short comments" on public.ad_comments
  for insert to anon, authenticated
  with check (char_length(body) between 1 and 500 and char_length(name) between 1 and 60 and char_length(ad_id) <= 80);
create index ad_comments_ad_idx on public.ad_comments(ad_id,created_at);
