-- Chig'atoy.ai — initial schema (SPEC.md section 4)

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  role text not null default 'user',
  plan text not null default 'free',
  pages_used_this_month int not null default 0,
  quota_reset_at timestamptz not null default date_trunc('month', now()) + interval '1 month',
  created_at timestamptz not null default now()
);

create table documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles on delete cascade,
  title text not null,
  source_type text,
  source_lang text,
  translit_style text,
  page_count int not null default 0,
  created_at timestamptz not null default now()
);

create table pages (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents on delete cascade,
  page_no int not null,
  image_path text not null,
  status text not null default 'pending',
  error_message text,
  meta jsonb,
  modern_text text,
  notes jsonb,
  prompt_version text,
  processed_at timestamptz
);

create table lines (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references pages on delete cascade,
  line_no int not null,
  ar_text text,
  lat_raw text,
  lat_corrected text,
  cyr_text text,
  is_verified boolean not null default false,
  verified_by uuid references profiles,
  verified_at timestamptz
);

create table jobs (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references pages on delete cascade,
  status text not null default 'queued',
  attempts int not null default 0,
  created_at timestamptz not null default now()
);

create table usage_log (
  id bigserial primary key,
  user_id uuid references profiles,
  page_id uuid references pages,
  model text,
  input_tokens int,
  output_tokens int,
  created_at timestamptz not null default now()
);

create index on pages (document_id, page_no);
create index on lines (page_id, line_no);
create index on jobs (status, created_at);
create index on usage_log (user_id, created_at);

-- auto-create a profile row when a new auth user signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Row Level Security: every user sees only their own records
alter table profiles enable row level security;
alter table documents enable row level security;
alter table pages enable row level security;
alter table lines enable row level security;
alter table jobs enable row level security;
alter table usage_log enable row level security;

create policy "profiles_select_own" on profiles
  for select using (id = auth.uid());
create policy "profiles_update_own" on profiles
  for update using (id = auth.uid());

create policy "documents_all_own" on documents
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "pages_all_own" on pages
  for all using (
    exists (select 1 from documents d where d.id = pages.document_id and d.user_id = auth.uid())
  ) with check (
    exists (select 1 from documents d where d.id = pages.document_id and d.user_id = auth.uid())
  );

create policy "lines_all_own" on lines
  for all using (
    exists (
      select 1 from pages p join documents d on d.id = p.document_id
      where p.id = lines.page_id and d.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from pages p join documents d on d.id = p.document_id
      where p.id = lines.page_id and d.user_id = auth.uid()
    )
  );

create policy "jobs_select_own" on jobs
  for select using (
    exists (
      select 1 from pages p join documents d on d.id = p.document_id
      where p.id = jobs.page_id and d.user_id = auth.uid()
    )
  );

create policy "usage_log_select_own" on usage_log
  for select using (user_id = auth.uid());
