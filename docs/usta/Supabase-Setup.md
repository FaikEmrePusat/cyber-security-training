# Usta — Supabase setup (once)

Faik has **no Supabase account yet**. Create a free project, then paste URL + anon key into a **local** env file (never commit secrets).

Free tier is enough for one user. Security for MVP = **sign-in required + RLS**, not “the anon key is secret.” The anon key is meant for browsers; RLS enforces that only your user can touch your row.

---

## 1. Create project

1. Open [https://supabase.com](https://supabase.com) and sign up (use **faikemrep@gmail.com** if you want one inbox for everything).
2. **New project** → pick org, name (e.g. `usta`), strong DB password (store in a password manager — Usta app does not need the DB password).
3. Wait until the project is healthy.

---

## 2. Enable Email magic link

1. **Authentication → Providers → Email**
2. Enable Email. Prefer **magic link** (OTP optional).
3. Confirm that sign-ups are allowed (solo project: fine to leave open, or restrict later).

Magic link means: Usta emails a login link to **faikemrep@gmail.com**. You open that Gmail, click the link, and you are signed in. You do **not** create a separate “magic link account” — it is just passwordless login for that address.

---

## 3. Redirect URLs (local web)

**Authentication → URL configuration**

| Setting | Example |
|---------|---------|
| Site URL | `http://localhost:5174` |
| Redirect URLs | `http://localhost:5174/**` |

Use the port your `usta-web` Vite app actually runs on (see `usta-web` README / Vite output).

Also add the **GitHub Pages** Usta (deployed, see README):

| Setting | Value |
|---------|-------|
| Redirect URLs | `https://faikemrepusat.github.io/cyber-security-training/usta/**` |

Without it, a magic link requested from the online Usta falls back to the Site URL (localhost). Keep Site URL on localhost or switch it to the Pages URL — both work once each is listed under Redirect URLs.

**6-digit code (Android / Windows apps):** Authentication → Email Templates → **Magic Link**: include `{{ .Token }}` in the body, e.g. `Your Usta code: {{ .Token }}`. The apps sign in with that code because the link would open a browser instead of the app.

---

## 4. Table + RLS

SQL Editor → run:

```sql
create table if not exists public.usta_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  doc jsonb not null default '{}'::jsonb,
  rev bigint not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.usta_state enable row level security;

create policy "usta_state_select_own"
  on public.usta_state for select
  using (auth.uid() = user_id);

create policy "usta_state_insert_own"
  on public.usta_state for insert
  with check (auth.uid() = user_id);

create policy "usta_state_update_own"
  on public.usta_state for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

Realtime (recommended, so other devices update without a refresh):

```sql
alter publication supabase_realtime add table public.usta_state;
```

Realtime respects RLS, so you only receive your own row. If you skip this step, sync still runs on every write, on tab focus, on reconnect, and when you press **Sync now**.

---

## 5. Env vars (local only)

In `usta-web/`, copy `.env.example` → `.env.local` (gitignored):

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_OR_PUBLISHABLE_KEY
```

Find both under **Project Settings → API**. Prefer the new **publishable** key (`sb_publishable_…`); the legacy **anon** JWT (`eyJ…`) also works. Either goes in `VITE_SUPABASE_ANON_KEY`.

Do **not** commit `.env.local`. Do **not** put the **service role** / **secret** key in any frontend app.

Without these vars, Usta runs **offline-local** (localStorage `usta-v1` only).

---

## 6. Smoke test

1. `npm run dev` in `usta-web`
2. Open Login → request magic link to `faikemrep@gmail.com`
3. Click link in Gmail → return to localhost → Settings shows **Sync: synced**
4. Open a second browser profile, sign in with the same email, and mark a floor item Done in one of them. The other updates within seconds via Realtime (or on focus / **Sync now**).
5. Go offline (DevTools → Network → Offline), mark Done, then go back online. Status moves from `pending` to `synced`.

---

## What this does *not* do

- No E2E encryption
- No public anonymous read of `usta_state`
- No Cyber Ledger data in this table
