-- Run this in the Supabase SQL editor (Project -> SQL Editor -> New query)

create table if not exists chandhas (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  street text not null,
  amount numeric not null check (amount > 0),
  description text default '',
  paid boolean not null default false,
  created_at timestamptz not null default now()
);

-- Row Level Security: this app has no login yet, so we allow the
-- anon key to read and insert. Tighten this later if you add auth.
alter table chandhas enable row level security;

create policy "Public can read chandhas"
  on chandhas for select
  using (true);

create policy "Public can insert chandhas"
  on chandhas for insert
  with check (true);
