-- Phaedra initial schema.
-- Single `posts` table. Identity/auth is owned by Supabase Auth (no role/user tables).
-- Writes go exclusively through the save-post / delete-post Edge Functions (service
-- role), so RLS grants clients READ-ONLY access — there are deliberately no client
-- insert/update/delete policies. This is what makes server-side sanitization
-- unbypassable.

create table if not exists posts (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  slug             text not null unique,
  author_name      text not null,
  cover_image_path text,
  image_caption    text,
  preview          text,
  content          text not null,          -- sanitized TipTap HTML (cleaned in the Edge Function)
  is_draft         boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  published_at     timestamptz
);

-- Public list ordering: published, newest first.
create index if not exists posts_published_idx on posts (is_draft, published_at desc);

alter table posts enable row level security;

-- Anyone (incl. anon) may read PUBLISHED posts.
drop policy if exists "public read published posts" on posts;
create policy "public read published posts"
  on posts for select
  to anon, authenticated
  using (is_draft = false);

-- Authenticated admins may additionally read drafts (for the admin list/editor).
drop policy if exists "authenticated read all posts" on posts;
create policy "authenticated read all posts"
  on posts for select
  to authenticated
  using (true);

-- No insert/update/delete policies: all writes are performed by the Edge Functions
-- using the service role, which bypasses RLS. Clients literally cannot write.

grant select on posts to anon, authenticated;
-- The Edge Functions write as service_role; grant it DML explicitly (Supabase's
-- default privileges did not cover DML for this table).
grant select, insert, update, delete on posts to service_role;

-- updated_at maintenance. Fixed empty search_path to avoid search-path injection.
create or replace function set_updated_at()
returns trigger language plpgsql
set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on posts;
create trigger posts_set_updated_at
  before update on posts
  for each row execute function set_updated_at();

-- Keep-alive singleton, pinged by the keep-alive workflow to stop the free-tier
-- project pausing after 7 idle days.
create table if not exists keep_alive (
  id         smallint primary key default 1 check (id = 1),
  pinged_at  timestamptz not null default now()
);
insert into keep_alive (id) values (1) on conflict (id) do nothing;

alter table keep_alive enable row level security;
drop policy if exists "anon can read keep_alive" on keep_alive;
create policy "anon can read keep_alive" on keep_alive for select to anon using (true);
drop policy if exists "anon can ping keep_alive" on keep_alive;
create policy "anon can ping keep_alive" on keep_alive for update to anon using (id = 1) with check (id = 1);
grant select, update on keep_alive to anon;

-- Storage: public-read bucket for cover images; authenticated may upload/replace.
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

-- No SELECT policy: a PUBLIC bucket already serves objects via their public URL
-- without one, and adding a broad SELECT policy would let clients LIST the bucket.
drop policy if exists "public read post-images" on storage.objects;

drop policy if exists "authenticated upload post-images" on storage.objects;
create policy "authenticated upload post-images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'post-images');

drop policy if exists "authenticated update post-images" on storage.objects;
create policy "authenticated update post-images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'post-images');

drop policy if exists "authenticated delete post-images" on storage.objects;
create policy "authenticated delete post-images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'post-images');
