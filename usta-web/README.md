# Usta web MVP

```bash
cd usta-web
npm install
npm run dev
```

Open http://localhost:5174 — works offline without Supabase.

Cloud: copy `.env.example` → `.env.local`, follow `docs/usta/Supabase-Setup.md`.

Core tests:

```bash
cd ../usta-core && npm install && npm test
```
