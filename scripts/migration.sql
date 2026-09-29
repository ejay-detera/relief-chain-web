-- ============================================================
-- Relief Chain – Database Migration
-- Run this SQL in the Supabase SQL Editor (Dashboard → SQL)
-- ============================================================

-- ----------------------------------------------------------------
-- 1.  audit_logs table
-- ----------------------------------------------------------------
create table if not exists public.audit_logs (
  id            uuid primary key default gen_random_uuid(),
  actor_email   text        not null,
  action        text        not null,   -- e.g. 'approve', 'reject', 'suspend', 'reactivate', 'deactivate'
  target_name   text        not null,   -- human-readable target (org name or 'organization')
  target_id     text        not null,   -- registration / org id
  reason        text,                   -- nullable – only required for reject/suspend/deactivate
  created_at    timestamptz not null default now()
);

-- Index for chronological queries (the most common access pattern)
create index if not exists audit_logs_created_at_idx on public.audit_logs (created_at desc);

-- Row Level Security: super_admin may read all rows; no user may write directly (only server-side)
alter table public.audit_logs enable row level security;

drop policy if exists "super_admin read audit_logs" on public.audit_logs;
create policy "super_admin read audit_logs"
  on public.audit_logs for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'super_admin'
    )
  );

drop policy if exists "super_admin delete audit_logs" on public.audit_logs;
create policy "super_admin delete audit_logs"
  on public.audit_logs for delete
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'super_admin'
    )
  );

-- ----------------------------------------------------------------
-- 2.  Add Suspended / Deactivated status support to registrations
-- ----------------------------------------------------------------
-- Only run the alter if the column is still the old type.
-- Supabase uses text for status; add the new values via a check constraint.

-- Drop old check constraint if it exists (name may differ in your schema)
alter table public.registrations
  drop constraint if exists registrations_status_check;

alter table public.registrations
  add constraint registrations_status_check
  check (status in ('Pending', 'Approved', 'Rejected', 'Suspended', 'Deactivated'));

-- Add suspension_reason column if missing
alter table public.registrations
  add column if not exists suspension_reason text;
