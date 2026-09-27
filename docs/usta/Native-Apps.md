# Usta — Android and Windows apps

Both native shells wrap the **same `usta-web` build**. NowEngine, sync, and the Weekend / Month pages behave exactly as in the browser. Sign in once per device with the same email and Supabase keeps them in step.

Status: **scaffolded, not yet built on this PC** (no Java / Android SDK / Rust installed here). The steps below are what you run once the tools are installed.

---

## Android (Capacitor) — Redmi Note 10 Pro first

| Item | Value |
|------|-------|
| Project | `usta-web/android/` (Capacitor 7, committed) |
| App id | `io.github.faikemrepusat.usta` |
| Web build | `usta-web/dist` with base `/` (not the Pages `/usta/` base) |
| Notifications | `@capacitor/local-notifications`: weekday Oak-end reminder |

### One-time setup

1. Install **Android Studio** (it bundles a JDK 21 and the Android SDK). During setup accept the SDK licences.
2. `usta-web/.env.local` must hold your Supabase URL + publishable key (same as for the web). The values are baked into the app at build time; the file stays uncommitted.
3. Supabase → **Authentication → Email Templates → Magic Link**: make sure the body contains `{{ .Token }}` (the 6-digit code). The app signs in with that code, because a magic link opens the phone browser, not the app.

### Build and run a debug APK

```bash
cd usta-web
npm install
npm run android:sync      # vite build + cap sync android
npm run android:open      # opens Android Studio → press Run with the phone connected
```

Or without opening the IDE (needs `JAVA_HOME` pointing to Android Studio’s `jbr` folder):

```bash
npm run android:apk
```

The APK lands in `usta-web/android/app/build/outputs/apk/debug/app-debug.apk`. Copy it to the phone and install (allow “Install unknown apps” for the file manager once).

**Redmi / MIUI (HyperOS) notes**

- Phone: Settings → About phone → tap *OS version* 7× → Developer options → enable **USB debugging** and **Install via USB** (MIUI asks for a Mi account for the latter).
- For reliable reminders: App info → Usta → **Autostart on**, Battery saver → **No restrictions**, Notifications → allowed.

### In the app

1. **Sign in** → Send login link → type the 6-digit code from Gmail → **Sign in with code**.
2. **Settings → Notifications → Notify me**: Android asks for permission, then schedules “Oak is over” for Mon–Fri at the Oak end time (phone clock; keep the phone on Istanbul time).
3. **Ledger Today**: refresh it on the PC (see How-to-Use); sync brings the titles to the phone. The app cannot read Ledger’s browser storage.

### If `cap sync` fails with EPERM / ENOTEMPTY on Windows

Another process holds a handle on `android/app/src/main/assets/public` (often an editor file watcher or a running `npm run dev`). Stop the dev server, close the folder in the editor or reboot, then rerun `npm run android:sync`. The folder is generated and gitignored.

---

## Windows (Tauri 2) — tray + notifications

| Item | Value |
|------|-------|
| Project | `usta-web/src-tauri/` |
| Window | 480 × 860; closing it **hides to the tray** (Quit from the tray menu) |
| Tray | Left-click = show Usta; menu = Show / Quit; tooltip = current next action |
| Notifications | When NowEngine’s next action changes while Usta is hidden or unfocused (e.g. Oak → transition at 14:00), a Windows toast shows the new command |

### One-time setup

1. Install **Rust** (`rustup`, stable MSVC) from [rustup.rs](https://rustup.rs).
2. Install **Visual Studio Build Tools** with the *Desktop development with C++* workload. WebView2 ships with Windows 10/11.
3. `usta-web/.env.local` as for the web.

### Run / build

```bash
cd usta-web
npm install
npm run desktop:dev       # dev window with hot reload (starts Vite on :5174)
npm run desktop:build     # NSIS installer in src-tauri/target/release/bundle/nsis/
```

First Rust build downloads crates and takes several minutes.

### In the app

- **Settings → Notifications → Notify me** once (Windows may ask to allow notifications).
- Sign in with the 6-digit code (a magic link would open your default browser instead).
- Ledger auto-refresh does not apply inside the desktop app (different host). Use **Refresh from Ledger** (popup) or keep refreshing in the browser Usta; sync carries it over.

Icons come from `src-tauri/icon-source.svg`. To change them: edit the SVG, then `npx tauri icon src-tauri/icon-source.svg -o src-tauri/icons` (delete the generated `android/` and `ios/` subfolders, or copy their `mipmap-*` PNGs into `android/app/src/main/res/` to update the Android launcher icon too).

---

## Not done yet (honest)

- No APK or installer has been built or run on a device yet.
- Android has no background “next action” push, only the scheduled Oak-end reminder (JS does not run while the app is closed).
- No auto-start at Windows login (add `tauri-plugin-autostart` if wanted).
- Native deep links for magic links are not wired; the 6-digit code is the sign-in path in both apps.
