-- Private work samples and evidence-grounded assessments.
create table public.work_samples (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 title text not null check(length(title) between 1 and 160), content text not null check(length(content) between 40 and 20000),
 context text not null default '', source_url text, source_kind text not null default 'user_provided' check(source_kind in ('user_provided','source_linked')),
 content_hash text not null, consented_at timestamptz not null default now(), created_at timestamptz not null default now()
);
create table public.ability_assessments (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 sample_id uuid not null references public.work_samples(id) on delete cascade,
 findings jsonb not null, model text not null, prompt_version text not null, created_at timestamptz not null default now(),
 review_status text not null default 'pending' check(review_status in ('pending','approved','disputed','hidden')),
 review_note text not null default '', reviewed_at timestamptz
);
create table public.passport_shares (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 token uuid not null unique default gen_random_uuid(), assessment_ids uuid[] not null check(cardinality(assessment_ids) between 1 and 20),
 label text not null default '', expires_at timestamptz not null default (now()+interval '7 days'), revoked_at timestamptz,
 created_at timestamptz not null default now(), check(expires_at>created_at and expires_at<=created_at+interval '30 days')
);
create table public.talent_preferences (
 user_id uuid primary key references auth.users(id) on delete cascade,
 discoverable boolean not null default false, interests text not null default '', updated_at timestamptz not null default now()
);
create index work_samples_owner on public.work_samples(user_id);
create index ability_assessments_owner on public.ability_assessments(user_id);
create index ability_assessments_sample on public.ability_assessments(sample_id);
create index passport_shares_owner on public.passport_shares(user_id);
alter table public.work_samples enable row level security;
alter table public.ability_assessments enable row level security;
alter table public.passport_shares enable row level security;
alter table public.talent_preferences enable row level security;
create policy samples_select on public.work_samples for select to authenticated using((select auth.uid())=user_id);
create policy samples_insert on public.work_samples for insert to authenticated with check((select auth.uid())=user_id);
create policy samples_delete on public.work_samples for delete to authenticated using((select auth.uid())=user_id);
create policy assessments_select on public.ability_assessments for select to authenticated using((select auth.uid())=user_id);
create policy assessments_review on public.ability_assessments for update to authenticated using((select auth.uid())=user_id) with check((select auth.uid())=user_id);
create policy assessments_delete on public.ability_assessments for delete to authenticated using((select auth.uid())=user_id);
create policy shares_owner on public.passport_shares for all to authenticated using((select auth.uid())=user_id) with check((select auth.uid())=user_id);
create policy talent_owner on public.talent_preferences for all to authenticated using((select auth.uid())=user_id) with check((select auth.uid())=user_id);
-- AI output is server-owned: owners can only review, never rewrite findings/model/source.
revoke all on public.work_samples,public.ability_assessments,public.passport_shares,public.talent_preferences from authenticated;
grant select,insert,delete on public.work_samples to authenticated;
grant select,delete on public.ability_assessments to authenticated;
revoke update on public.ability_assessments from authenticated;
grant update(review_status,review_note,reviewed_at) on public.ability_assessments to authenticated;
grant select,insert,update,delete on public.passport_shares, public.talent_preferences to authenticated;
revoke all on public.work_samples,public.ability_assessments,public.passport_shares,public.talent_preferences from anon;
