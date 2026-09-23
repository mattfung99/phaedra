-- Explicit service_role grant on keep_alive.
--
-- From 2026-10-30 Supabase no longer auto-grants Data API access to newly
-- created tables in `public`; a table created by a migration is unreachable
-- until the migration grants it. `posts` already grants anon, authenticated
-- and service_role in the initial migration, and `keep_alive` grants anon
-- (all the keep-alive workflow needs), so CI's `supabase db reset` and
-- `supabase start` keep working unchanged.
--
-- This closes the one remaining gap for symmetry: nothing currently reaches
-- keep_alive as service_role, but a backup or maintenance script that did
-- would fail with 42501 on a freshly built database.
--
-- No-op against production, where the table predates the change.

grant select, update on keep_alive to service_role;
