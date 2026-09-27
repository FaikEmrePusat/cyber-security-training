# How to use Usta (plain language)

Usta is a **coach screen**, not a hobby dashboard. It names **one** job. You do it, press **Done — next**, and get the next job.

Open the app → start on **Now**. Prefer the in-app **How to use** page (`/guide`) while learning.

---

## Pages

| Page | When you open it | What you do |
|------|------------------|-------------|
| **Now** | Almost every time | Read the command → work → **Done — next** |
| **How to use** | First days / when confused | Read the steps; jump to other pages from the cards |
| **Weekend** | Friday/Saturday plan, Sunday close | Project day, content factory, life checklist, Sunday close |
| **Month** | Start of the month (5 min) | One theme, up to 3 goals, weekend project ideas |
| **Review** | Sunday | Check how many days kept the five domains |
| **Settings** | Setup / each morning for Ledger | Day start/end, Refresh from Ledger, faith cues, location, block length |
| **Sign in** | Once per device | Magic link so phone and PC share progress |

---

## Weekday (Istanbul)

1. **10:00–14:00** — Oak only. Usta will say so.  
2. Short transition after Oak.  
3. Then the queue, one block at a time (~45–50 min max each):  
   Cyber (Ledger) → German → Qur’an page → Cevşen bab → other faith page → ~10 book pages → music piece → share a prepared post if any.

Chips under the tip on **Now** show what is done (green) and what is current (brass).

---

## Weekend

**Now** still gives one command at a time. The **Weekend** page is where you plan what those commands say. It has four cards; each card has its own Save button (the life checklist saves as soon as you tick).

### 1. Project day (10:00–14:00)

- **Project title**: what you are building.
- **When the weekend ends, what will be true?**: one outcome sentence, e.g. “Sigma rules fire on the lab VM and the README explains how.”
- **Block plan**: chips such as `50 min` `50 min`. Add blocks with **+ 25 min** / **+ 50 min**, remove one with **×**. The line below shows the total against the 4-hour window.
- **Saturday / Sunday / Both**: which day(s) the 10:00–14:00 window is a project window. On a non-project weekend day that window runs the normal weekend queue (content batch first).

On Now the command reads like *“Weekend project (10:00–14:00): AI SIEM lab — 2 × 50 min.”* and the reason line shows your outcome sentence.

### 2. Content factory

A list of next week’s posts. Add a row, then set each post to **Draft**, **Ready**, or **Published**.

- Weekend **content batch** on Now names the first Draft: *“Content batch: finish ‘Log triage story’ (+1 more draft).”*
- Weekday **Share** on Now names the first Ready post: *“Content: publish ‘SIEM notes’ (Ready).”* Pressing **Done — next** marks that post **Published** automatically. Undoing that Share (Undo last Done, Today’s Dones → Clear, or Reset today) puts the same post back to **Ready**.
- **Clear N published** tidies the list; press **Save posts** afterwards.

### 3. Weekend life checklist

Faith, Books, and Music for Saturday and Sunday. These use the **same Done marks as Now**: ticking Faith marks Qur’an, Cevşen, and Faith+ Done for that day, and clearing one of those on Now unticks it here. A later day stays locked until it arrives. While a row is open, the project and batch commands mention it lightly (*“Later today, lightly: faith, music.”*). Weekday queues are unaffected.

### 4. Sunday close (5 min)

On Sunday evening, after the project window:

- **What went well?**: one or two lines.
- **Next weekend project title**: on save, this **replaces the project title** in card 1 and clears the old outcome, so next weekend starts with the right name. Leave it empty to keep the current project.

Until you save the close, Sunday’s rest message on Now reminds you that it is waiting.

---

## Month (light layer)

At the start of a month, open **Month** and write one **theme** (e.g. “Detection engineering”), up to three **goals** (what is true at month end), and a few **weekend project ideas**. **Next month** lets you plan ahead.

- The Weekend page shows the month line at the top, with a **Use as project** button per idea (it copies the idea into the project title and clears the old outcome).
- On Now, the weekend project and content batch commands add a short “Month focus: …” to their reason line.
- The month never changes *which* command Now gives. Weekdays run the normal queue.

---

## Buttons on Now

| Button | Meaning |
|--------|---------|
| **Done — next** | This block is finished; show the next command |
| **Undo last Done** | Quick undo of the most recent Done (if available) |
| **Today’s Dones → Clear** | Remove **any** Done you choose (Batch, Cyber, …) |
| **Reset today** | Wipe every Done mark for today and restart the queue |
| **Snooze 15m** | Pause (max 2/day; not during Oak) |
| **Energy low** | Today only cyber + German are required |
| **Open Ledger** | Opens Cyber Ledger (cyber/German blocks) |

---

## Cyber Ledger

Ledger remains the cyber + German craft bench. Usta does not put music, books, or faith texts into Ledger’s Map.

### Ledger Today in Usta (automatic when possible)

Usta reads Ledger’s Today list through Ledger’s `/#/usta-bridge` page. Nothing from Usta is written into Ledger.

**Automatic (no popup):** when Usta and Ledger run on the **same host**, Usta pulls silently in a hidden frame when it opens, when you come back to the tab, and every 20 minutes. The two setups that qualify:

- Both local on the PC: Ledger `http://localhost:5173/`, Usta `http://localhost:5174/`.
- Both online: Ledger `https://faikemrepusat.github.io/cyber-security-training/`, Usta `…/cyber-security-training/usta/`. Only useful in the browser where you actually use Ledger, since Ledger data is per browser.

Settings shows whether auto-refresh is active for the current Ledger URL; there is a checkbox to turn it off. Usta only writes when the task list actually changed.

**Manual (popup):** in any other setup (for example Usta online and Ledger on localhost), press **Settings → Refresh from Ledger**. A small popup sends Today’s tasks and closes. Allow popups for Usta if the browser blocks it.

**Phone safety:** a Ledger with no logged sessions (for example the Pages Ledger in the phone browser) never overwrites the task list automatically. Pull on the PC; Supabase sync carries the titles to the phone.

On **Now**, the Cyber and German commands show the real Ledger titles, for example “Cyber (from Ledger): Windows event logs (+2 more in Ledger)”. A pull is valid for **that calendar day only**. Open Ledger itself only for Map, Record, or deep study.

---

## Day start / day end

- **Day start** — the earliest time the queue may begin (Fajr is used instead when prayer times are available).
- **Day end** — after this time Now shows “Rest or light living” and stops giving blocks. Default **23:00**. A day end after midnight (e.g. 01:00) keeps the evening open until then.

---

## Settings help

**Latitude / longitude** — your map position, used only to calculate prayer times offline. Istanbul defaults: **41.0082** (north) / **28.9784** (east). Decimals are normal; comma or dot both work. Change them only if you move to another city; empty = Istanbul.

**Faith cues (three boxes)** — short reminders you write yourself; Usta never ships scripture. The matching box appears under the Qur’an, Cevşen, or “other source” command on Now. Examples:

- Qur’an: “Mushaf on desk — next page after bookmark, then the meal on the facing page.”
- Cevşen: “Next bab from the red ribbon; read the Turkish meaning after each bab.”
- Other: “Risale-i Nur, Sözler — one page from the pencil mark.”

---

## Sync and phone

Top-right pill: **Synced** means cloud is connected. Sign in on each device once. Without sign-in, Usta still works on that browser alone. Weekend plans (project, posts, Sunday close) sync as one unit: the most recent save wins.

Phone today = **the online Usta in the phone browser**: [faikemrepusat.github.io/cyber-security-training/usta/](https://faikemrepusat.github.io/cyber-security-training/usta/), signed in with the same account (Supabase keeps phone and PC in sync). Add it to the home screen from the browser menu for an app-like icon. The Android app (Capacitor) and the Windows tray app (Tauri) are scaffolded; see [Native-Apps.md](./Native-Apps.md). Ledger Today titles are pulled on the PC and reach the phone through sync.

**Notifications:** Settings → Notifications → **Notify me** (per device). In a browser tab or the Windows app, Usta notifies when the next action changes while it is in the background (e.g. Oak ends). The Android app schedules a weekday Oak-end reminder.
