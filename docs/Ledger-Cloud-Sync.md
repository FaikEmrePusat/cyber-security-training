# Cyber Ledger — cloud sync (Supabase)

Private progress (Today, FSRS, Record, self-check notes) syncs through Supabase — **not** git push.

## 1. SQL (once)

SQL Editor → run:

```sql
create table if not exists public.ledger_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  doc jsonb not null default '{}'::jsonb,
  rev bigint not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.ledger_state enable row level security;

create policy "ledger_state_select_own"
  on public.ledger_state for select
  using (auth.uid() = user_id);

create policy "ledger_state_insert_own"
  on public.ledger_state for insert
  with check (auth.uid() = user_id);

create policy "ledger_state_update_own"
  on public.ledger_state for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter publication supabase_realtime add table public.ledger_state;
```

If realtime add fails because it is already published, ignore that error.

## 2. Redirect URLs

Authentication → URL configuration → Redirect URLs, add (exact):

- `https://faikemrepusat.github.io/cyber-security-training`
- `https://faikemrepusat.github.io/cyber-security-training/**`
- `http://localhost:5173`
- `http://localhost:5173/**`

Keep existing Usta entries (`http://localhost:5174/**`, `usta://auth/callback`, …).

Magic links use **PKCE** and return to the Ledger Pages URL above (not Usta). If the Redirect list is missing that URL, Supabase falls back to Site URL (often Usta on :5174).

## 3. Env

Local: `durum-web/.env.local` with the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as Usta.

GitHub Pages: repository secrets with those two names; `deploy.yml` passes them into the Ledger build.

### Owner site password (required for OTP)

Edge Function `ledger-otp` will **not** issue a code until the owner password matches.

```bash
# Choose a strong password you will type on Ledger + Usta (not your Gmail password).
npx supabase secrets set LEDGER_OWNER_PASSWORD="your-strong-site-password" --project-ref tjbebwdefmxqnbetmsve
npx supabase functions deploy ledger-otp --project-ref tjbebwdefmxqnbetmsve
```

Optional: store only a SHA-256 hex hash instead of plaintext:

```bash
# PowerShell example: hash then set LEDGER_OWNER_PASSWORD_HASH (and unset plaintext).
npx supabase secrets set LEDGER_OWNER_PASSWORD_HASH="<sha256-hex>" --project-ref tjbebwdefmxqnbetmsve
```

Also run the latest `supabase/sql/ledger_otp.sql` once (adds `ledger_auth_gate` for lockout).

## 4. Use

1. Open Ledger → **Data** → owner **email** + **site password** → **Send 6-digit code**, then **Sign in with code**.
2. Status becomes **Synced**. Repeat sign-in once on the phone (same password + OTP — no deep-link).
3. After that, edits sync automatically (and on tab focus / **Sync now**).
4. **Publish** (GitHub progress snapshot) is unlocked only while signed in. Sign out clears the saved publish token from that browser.

Magic-link login is disabled in the UI so the site password cannot be bypassed.

Wrong password is rate-limited (lockout after repeated failures).
