-- Owner email OTP (6-digit) for Cyber Ledger and Usta.
-- Used by Edge Function ledger-otp (body.app = "ledger" | "usta").
-- Run once in Supabase → SQL Editor.

create table if not exists public.ledger_otp (
  email text primary key,
  code_hash text not null,
  token_hash text,
  expires_at timestamptz not null,
  attempts int not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.ledger_otp enable row level security;

-- No direct client access; only service role / Edge Function.
revoke all on public.ledger_otp from anon, authenticated;
grant all on public.ledger_otp to service_role;
