# -*- coding: utf-8 -*-
"""Simulated ~1 week Durum user test (Turkish persona). Leaves localStorage restored."""
from __future__ import annotations

import json
import re
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

BASE = "http://localhost:5173"
OUT = Path(__file__).parent / "haftalik-shots"
OUT.mkdir(exist_ok=True)
NOTES: list[dict] = []
CONSOLE: list[dict] = []
PAGE_ERRORS: list[dict] = []


def note(day: str, severity: str, title: str, detail: str, shot: str | None = None):
    NOTES.append(
        {
            "day": day,
            "severity": severity,  # ok | info | P0 | P1 | P2
            "title": title,
            "detail": detail,
            "shot": shot,
        }
    )
    print(f"[{day}/{severity}] {title}: {detail[:120]}")


def shot(page, name: str) -> str:
    path = OUT / f"{name}.png"
    page.screenshot(path=str(path), full_page=True)
    return str(path.name)


def text_snip(page, sel: str = ".page", n: int = 500) -> str:
    try:
        return page.locator(sel).first.inner_text(timeout=3000)[:n]
    except Exception:
        return page.locator("body").inner_text()[:n]


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 900})
        page = context.new_page()

        page.on(
            "console",
            lambda m: CONSOLE.append({"type": m.type, "text": m.text, "url": page.url})
            if m.type in ("error", "warning")
            else None,
        )
        page.on(
            "pageerror",
            lambda e: PAGE_ERRORS.append({"message": str(e), "url": page.url}),
        )

        # Capture original storage after first load, restore at end
        page.goto(BASE + "/", wait_until="networkidle")
        page.wait_for_timeout(400)
        original = page.evaluate(
            """() => ({
              durum: localStorage.getItem('durum-v22'),
              curriculum: localStorage.getItem('durum-curriculum-v1'),
              keys: Object.keys(localStorage)
            })"""
        )

        # Fresh seed for clean week simulation
        page.evaluate(
            """() => {
              localStorage.removeItem('durum-v22');
              localStorage.removeItem('durum-curriculum-v1');
            }"""
        )
        page.reload(wait_until="networkidle")
        page.wait_for_timeout(500)

        # ========== DAY 0 ==========
        tek = page.locator(".gorev-card__title").first.inner_text()
        meta = page.locator(".gorev-card__meta").first.inner_text(timeout=2000) if page.locator(".gorev-card__meta").count() else ""
        primary = page.locator(".site-nav__links > a").all_inner_texts()
        more_btn = page.get_by_role("button", name="Daha fazla")
        more_visible = more_btn.is_visible()
        more_btn.click()
        page.wait_for_timeout(200)
        more_links = page.locator(".site-nav__more-menu a").all_inner_texts()
        page.keyboard.press("Escape")
        s0 = shot(page, "day0-bugun")
        # Persona friction: EDR-stage student expects lab/SOC task; artifact ROI may confuse
        persona_mismatch = any(
            x in tek.lower() for x in ("write-up", "artefakt", "public url", "sahiplik", "kanıt")
        ) and "edr" not in tek.lower() and "lab" not in tek.lower()
        note(
            "D0",
            "P1" if persona_mismatch else ("ok" if len(tek) < 120 else "P2"),
            "Bugün tek görev netliği",
            f"başlık='{tek}' meta='{meta}' uzunluk={len(tek)} persona_mismatch={persona_mismatch} · primary={primary} · daha_fazla={more_links}",
            s0,
        )
        if not more_visible:
            note("D0", "P1", "Daha fazla menü görünür değil", "Overflow nav butonu bulunamadı")

        # Harita
        page.goto(BASE + "/harita", wait_until="networkidle")
        page.wait_for_timeout(500)
        circles = page.locator("svg circle").count()
        # Graph in viewport without scroll?
        graph_box = page.locator(".harita-graph, .graph-wrap, svg").first.bounding_box()
        viewport_h = page.viewport_size["height"]
        graph_visible = False
        if graph_box:
            graph_visible = graph_box["y"] + min(graph_box["height"], 80) < viewport_h
        s_harita = shot(page, "day0-harita")
        note(
            "D0",
            "ok" if circles > 3 and graph_visible else "P1",
            "Harita grafik görünürlüğü",
            f"circles={circles} graph_in_viewport={graph_visible} box={graph_box}",
            s_harita,
        )

        # alan filter
        page.select_option("#harita-alan", "linux")
        page.wait_for_timeout(400)
        circles_linux = page.locator("svg circle").count()
        note("D0", "ok", "Alan filtresi", f"linux sonrası circle={circles_linux}")

        # Select a node via liste for reliability
        page.get_by_role("tab", name="Liste").click() if page.get_by_role("tab", name="Liste").count() else page.get_by_role("button", name="Liste").click()
        page.wait_for_timeout(300)
        # Prefer Ağaç for bulk later; for nodes use Liste add buttons
        add_btns = page.locator("button:has-text('Kuyruğa'), button:has-text('+ Kuyruk'), button:has-text('Ekle')")
        # Looking at TopicRow / liste buttons
        liste_adds = page.locator("table.data tbody tr button.cta:not(.cta--ghost)")
        if liste_adds.count() == 0:
            liste_adds = page.locator("table.data tbody tr button").filter(has_text=re.compile(r"Ekle|Kuyruk|\+"))
        before_q = page.evaluate(
            """() => {
              const raw = localStorage.getItem('durum-v22');
              if (!raw) return 0;
              return JSON.parse(raw).retrieval?.length ?? 0;
            }"""
        )
        added = 0
        for i in range(min(5, liste_adds.count())):
            btn = liste_adds.nth(i)
            label = btn.inner_text().strip()
            if "çıkar" in label.lower() or "sil" in label.lower():
                continue
            try:
                btn.click(timeout=2000)
                page.wait_for_timeout(250)
                added += 1
            except Exception:
                pass
            if added >= 3:
                break
        after_q = page.evaluate(
            """() => {
              const raw = localStorage.getItem('durum-v22');
              return JSON.parse(raw).retrieval?.length ?? 0;
            }"""
        )
        delta = after_q - before_q
        note(
            "D0",
            "ok" if 1 <= delta <= 5 else "P1",
            "Kuyruğa 2–3 konu ekleme",
            f"before={before_q} after={after_q} delta={delta} (hedef ~2–3, 141 değil)",
            shot(page, "day0-queue-add"),
        )

        # Yaklaşan locked
        page.locator("#yaklasan").scroll_into_view_if_needed()
        page.wait_for_timeout(300)
        yak_text = page.locator("#yaklasan").inner_text()
        locked = "kilitli" in yak_text.lower() or "override" in yak_text.lower() or "Ghost" in yak_text
        # Count Nmap/GRC style upcoming without being in retrieval
        retrieval_topics = page.evaluate(
            """() => {
              const raw = localStorage.getItem('durum-v22');
              return (JSON.parse(raw).retrieval || []).map(r => r.topic);
            }"""
        )
        upcoming_dumped = [t for t in retrieval_topics if any(x in t.lower() for x in ("nmap", "grc", "siem tool", "splunk"))]
        note(
            "D0",
            "ok" if locked and not upcoming_dumped else "P0",
            "Yaklaşan kilit / FSRS dump yok",
            f"yaklaşan_snippet={yak_text[:200]!r} dumped_suspicious={upcoming_dumped}",
            shot(page, "day0-yaklasan"),
        )

        # ========== DAY 1 Lab ==========
        page.goto(BASE + "/", wait_until="networkidle")
        page.wait_for_timeout(300)
        tek1 = page.locator(".gorev-card__title").first.inner_text()
        note("D1", "info", "Lab günü Bugün görevi", f"tek={tek1}")

        # Beceriler via Daha fazla
        page.get_by_role("button", name="Daha fazla").click()
        page.wait_for_timeout(150)
        page.get_by_role("menuitem", name="Beceriler").click()
        page.wait_for_timeout(400)
        # Try raise first skill without ref
        first_row = page.locator("table.data tbody tr").first
        claimed_sel = first_row.locator("select").nth(0)
        current = claimed_sel.input_value()
        try_val = str(min(10, int(current) + 1))
        claimed_sel.select_option(try_val)
        page.wait_for_timeout(400)
        toast_msg = ""
        if page.locator(".toast-fixed, .toast, .page >> text=Yükseltmek").count():
            toast_msg = page.locator("body").inner_text()
        still = claimed_sel.input_value()
        blocked = still == current
        note(
            "D1",
            "ok" if blocked else "P0",
            "Kanıtsız yükseltme engeli",
            f"claimed {current}->{try_val} sonrası hâlâ={still} blocked={blocked}",
            shot(page, "day1-raise-block"),
        )

        # With ref
        ref_input = first_row.locator("input").first
        ref_input.fill("D:/labs/oak-edr-notes.md")
        ref_input.blur()
        page.wait_for_timeout(200)
        claimed_sel.select_option(try_val)
        page.wait_for_timeout(400)
        after_raise = claimed_sel.input_value()
        note(
            "D1",
            "ok" if after_raise == try_val else "P1",
            "Ref ile yükseltme",
            f"claimed artık={after_raise} hedef={try_val}",
            shot(page, "day1-raise-ok"),
        )

        # Log session — labels often lack htmlFor (a11y friction)
        page.goto(BASE + "/log", wait_until="networkidle")
        page.wait_for_timeout(300)
        label_for_ok = page.evaluate(
            """() => {
              const labs = [...document.querySelectorAll('.page label')];
              return labs.map(l => ({
                text: (l.textContent||'').trim(),
                hasFor: !!l.getAttribute('for'),
                wrapsControl: !!(l.querySelector('input,select,textarea'))
              }));
            }"""
        )
        orphan_labels = [x for x in label_for_ok if not x["hasFor"] and not x["wrapsControl"]]
        if orphan_labels:
            note(
                "D1",
                "P2",
                "Log form label htmlFor eksik",
                f"orphan_labels={[x['text'] for x in orphan_labels[:8]]} — getByLabel çalışmaz",
            )
        # Alan select first field-row select
        alan = page.locator(".field-row select").first
        try:
            alan.select_option("def")
        except Exception:
            pass
        page.locator(".field-row .field").nth(1).locator("input").fill("60")
        # Kanıt optional
        kanit_fields = page.locator(".field").filter(has_text="Kanıt")
        if kanit_fields.count():
            kanit_fields.first.locator("input").fill("EDR lab — Oak")
        page.get_by_role("button", name="Oturumu kaydet").click()
        page.wait_for_timeout(400)
        body = page.locator("body").inner_text()
        note(
            "D1",
            "ok" if "kaydedildi" in body.lower() or "oturum" in body.lower() else "P1",
            "Oturum kaydı (~60s)",
            f"toast/body has feedback: {'kaydedildi' in body.lower()}",
            shot(page, "day1-log"),
        )

        # Tekrar mark
        page.goto(BASE + "/tekrar", wait_until="networkidle")
        page.wait_for_timeout(400)
        rows = page.locator("table.data tbody tr")
        if rows.count() < 1:
            note("D1", "P1", "Tekrar kuyruğu boş", "Seed/ekleme sonrası satır yok — işaretleme atlandı")
        else:
            # mark first başarılı
            r0_topic = rows.nth(0).locator("td").first.inner_text()
            rows.nth(0).get_by_role("button", name="Başarılı").click()
            page.wait_for_timeout(300)
            # mark second zorlandım if exists
            if rows.count() >= 2:
                rows.nth(1).get_by_role("button", name="Zorlandım").click()
                page.wait_for_timeout(300)
            note("D1", "ok", "Tekrar işaretleme", f"başarılı+zorlandım denendi; ilk konu={r0_topic[:60]}")

            # Undo
            undo = page.get_by_role("button", name="Geri al")
            can_undo = undo.is_enabled()
            before_undo = page.evaluate(
                """() => JSON.parse(localStorage.getItem('durum-v22')).retrieval.map(r=>({t:r.topic,n:r.n,s:r.stability}))"""
            )
            if can_undo:
                undo.click()
                page.wait_for_timeout(400)
                after_undo = page.evaluate(
                    """() => JSON.parse(localStorage.getItem('durum-v22')).retrieval.map(r=>({t:r.topic,n:r.n,s:r.stability}))"""
                )
                restored = before_undo != after_undo
                note(
                    "D1",
                    "ok" if restored else "P1",
                    "Geri al (undo)",
                    f"enabled={can_undo} state_changed={restored}",
                    shot(page, "day1-undo"),
                )
            else:
                note("D1", "P1", "Geri al disabled", "İşaretlemeden sonra undo pasif", shot(page, "day1-undo-disabled"))

        # ========== DAY 2 Retrieval ==========
        page.goto(BASE + "/tekrar", wait_until="networkidle")
        page.wait_for_timeout(300)
        vade_badges = page.locator("text=vade").count()
        due_rows = page.locator("table.data tbody tr").count()
        note(
            "D2",
            "ok" if vade_badges > 0 or due_rows > 0 else "P2",
            "Vadesi geçmiş görsel netlik",
            f"vade_badge≈{vade_badges} rows={due_rows}",
            shot(page, "day2-tekrar"),
        )
        # complete 2 retrievals
        completed = 0
        for i in range(min(2, page.locator("table.data tbody tr").count())):
            btn = page.locator("table.data tbody tr").nth(i).get_by_role("button", name="Başarılı")
            if btn.count():
                btn.click()
                page.wait_for_timeout(250)
                completed += 1
        note("D2", "ok" if completed == 2 else "info", "2 retrieval tamamlandı", f"completed={completed}")

        # Force overdue for Bugün shift: age lastIso on remaining items
        page.evaluate(
            """() => {
              const k='durum-v22';
              const s=JSON.parse(localStorage.getItem(k));
              const old=new Date(Date.now()-20*86400000).toISOString();
              s.retrieval = (s.retrieval||[]).map((r,i)=>({...r, lastIso: old, n: r.n||0, stability: Math.min(r.stability||1, 2)}));
              localStorage.setItem(k, JSON.stringify(s));
            }"""
        )
        page.goto(BASE + "/", wait_until="networkidle")
        page.wait_for_timeout(400)
        tek2 = page.locator(".gorev-card__title").first.inner_text()
        retrieval_shift = "tekrar" in tek2.lower() or "vadesi" in tek2.lower() or "geri dönüş" in tek2.lower()
        note(
            "D2",
            "ok" if retrieval_shift else "P1",
            "Bugün görevi overdue tekrar'a kayıyor mu",
            f"tek='{tek2}'",
            shot(page, "day2-bugun-shift"),
        )
        # restore lastIso to near-now for remaining week sanity (keep some due)
        # leave a couple due intentionally for realism

        # ========== DAY 3 Mistake recovery ==========
        page.goto(BASE + "/almanya", wait_until="networkidle")
        page.wait_for_timeout(300)
        gate0 = page.locator("select").first
        before_g = gate0.input_value()
        # pick a different option
        opts = gate0.locator("option").all()
        for o in opts:
            v = o.get_attribute("value")
            if v and v != before_g:
                gate0.select_option(v)
                break
        page.wait_for_timeout(200)
        mid_g = gate0.input_value()
        page.get_by_role("button", name="Geri al").click()
        page.wait_for_timeout(350)
        after_undo_g = gate0.input_value()
        undo_ok = after_undo_g == before_g and mid_g != before_g
        note(
            "D3",
            "ok" if undo_ok else "P0",
            "Almanya yanlışlık + Geri al",
            f"before={before_g} mid={mid_g} after_undo={after_undo_g}",
            shot(page, "day3-undo"),
        )
        # Redo
        redo = page.get_by_role("button", name="Yinele")
        if redo.is_enabled():
            redo.click()
            page.wait_for_timeout(350)
            after_redo = gate0.input_value()
            note(
                "D3",
                "ok" if after_redo == mid_g else "P1",
                "Yinele (redo)",
                f"after_redo={after_redo} expected={mid_g}",
                shot(page, "day3-redo"),
            )
            # undo again to leave sane
            page.get_by_role("button", name="Geri al").click()
            page.wait_for_timeout(200)
        else:
            note("D3", "P1", "Yinele disabled", "Undo sonrası redo pasif kaldı")

        # Also poke a career field on Beceriler if present
        page.goto(BASE + "/beceriler", wait_until="networkidle")
        page.wait_for_timeout(300)
        career_selects = page.locator("section").filter(has_text="Kariyer").locator("select")
        if career_selects.count() == 0:
            # scroll for kariyer section
            if page.get_by_text("Kariyer", exact=False).count():
                page.get_by_text("Kariyer", exact=False).first.scroll_into_view_if_needed()
        # Find career claimed selects near bottom
        all_selects = page.locator("select")
        note("D3", "info", "Beceriler kariyer alanları mevcut", f"select_count={all_selects.count()}")

        # ========== DAY 4 Weekly ritual ==========
        page.goto(BASE + "/log", wait_until="networkidle")
        page.wait_for_timeout(300)
        page.get_by_role("button", name="Haftalık snapshot").click()
        page.wait_for_timeout(400)
        body4 = page.locator("body").inner_text()
        note(
            "D4",
            "ok" if "snapshot" in body4.lower() else "P1",
            "Haftalık snapshot",
            f"feedback={'snapshot' in body4.lower()}",
            shot(page, "day4-snapshot"),
        )

        page.goto(BASE + "/hiz", wait_until="networkidle")
        page.wait_for_timeout(400)
        hiz_text = text_snip(page, n=900)
        # Charts: should show snap trend if >=2 snapshots (seed has 1 + we added 1)
        has_olculen_r = page.get_by_text("Ölçülen R").count() > 0
        has_delta = page.get_by_text("Haftalık ΔR").count() > 0  # needs >=3
        fake_empty = False  # check for empty svg with fake data hard; note presence
        note(
            "D4",
            "ok",
            "Hız sayfası 1–2 snapshot",
            f"Ölçülen R görünür={has_olculen_r} (beklenen ≥2 snap) · ΔR={has_delta} (yalnız ≥3) · snippet={hiz_text[:180]!r}",
            shot(page, "day4-hiz"),
        )

        page.goto(BASE + "/log", wait_until="networkidle")
        page.wait_for_timeout(300)
        # Export / copy JSONL
        copy_btn = page.get_by_role("button", name=re.compile(r"JSONL|Kopyala|Panoya", re.I))
        dl_btn = page.get_by_role("button", name=re.compile(r"indir", re.I))
        pending_len = page.evaluate(
            """() => {
              const s=JSON.parse(localStorage.getItem('durum-v22'));
              return (s.pending||[]).length;
            }"""
        )
        if copy_btn.count():
            copy_btn.first.click()
            page.wait_for_timeout(400)
            note("D4", "ok", "JSONL kopyala tıklandı", f"pending={pending_len} (clipboard headless’te boş olabilir)")
        if dl_btn.count():
            try:
                with page.expect_download(timeout=8000) as dl_info:
                    dl_btn.first.click()
                d = dl_info.value
                note("D4", "ok", "JSONL indir", f"filename={d.suggested_filename} pending={pending_len}")
            except Exception as e:
                note("D4", "P2", "JSONL indir belirsiz", str(e)[:200])
        else:
            note("D4", "P2", "JSONL indir butonu yok", f"pending={pending_len}")
        note(
            "D4",
            "ok" if pending_len > 0 else "P2",
            "Bekleyen JSONL satırları",
            f"pending_len={pending_len}",
            shot(page, "day4-export"),
        )

        # ========== DAY 5 Overwhelm ==========
        page.goto(BASE + "/harita", wait_until="networkidle")
        page.wait_for_timeout(400)
        q_before = page.evaluate("() => JSON.parse(localStorage.getItem('durum-v22')).retrieval.length")
        # Switch to Ağaç for +N bulk
        if page.get_by_role("button", name="Ağaç").count():
            page.get_by_role("button", name="Ağaç").click()
        elif page.get_by_role("tab", name="Ağaç").count():
            page.get_by_role("tab", name="Ağaç").click()
        page.wait_for_timeout(300)
        # Set bulkN if input exists
        bulk_input = page.locator("input").filter(has=page.locator("xpath=..")).locator("xpath=ancestor::*[.//text()[contains(.,'En fazla') or contains(.,'toplu')]]//input")
        # Simpler: look for number input near +3
        if page.locator("text=En fazla").count():
            note("D5", "ok", "En fazla N UI metni var", page.locator("text=En fazla").first.inner_text())
        else:
            note("D5", "P2", "En fazla 3 ekle metni yok", "Buton muhtemelen +3; label 'En fazla' görünmüyor — IA")
        plus_btns = page.locator("button").filter(has_text=re.compile(r"^\+\d+$"))
        if plus_btns.count() == 0:
            plus_btns = page.locator("button.cta--ghost").filter(has_text=re.compile(r"\+\d"))
        if plus_btns.count():
            plus_btns.first.click()
            page.wait_for_timeout(400)
        q_after = page.evaluate("() => JSON.parse(localStorage.getItem('durum-v22')).retrieval.length")
        added5 = q_after - q_before
        note(
            "D5",
            "ok" if 0 <= added5 <= 3 else ("P0" if added5 > 20 else "P1"),
            "Toplu ekle kuyruk patlaması yok",
            f"before={q_before} after={q_after} added={added5} (≤3 beklenir)",
            shot(page, "day5-bulk"),
        )

        # SIEM callout → Yaklaşan
        page.goto(BASE + "/", wait_until="networkidle")
        page.wait_for_timeout(300)
        siem = page.locator(".siem-gap")
        if siem.count():
            siem_text = siem.inner_text()
            page.locator(".siem-gap__link").click()
            page.wait_for_timeout(600)
            url = page.url
            yak_visible = page.locator("#yaklasan").is_visible()
            note(
                "D5",
                "ok" if "#yaklasan" in url or yak_visible else "P1",
                "SIEM callout → Yaklaşan",
                f"callout={siem_text[:120]!r} url={url} yak_visible={yak_visible}",
                shot(page, "day5-siem"),
            )
        else:
            note("D5", "info", "SIEM callout yok", "siem claimed ≥ need olabilir")

        # ========== DAY 6 Return path (code + light verify) ==========
        # Read logic via evaluate of derived fields without permanent corruption:
        # temporarily set last session old, check tekGorev, then restore state snapshot
        snap_state = page.evaluate("() => localStorage.getItem('durum-v22')")
        page.evaluate(
            """() => {
              const k='durum-v22';
              const s=JSON.parse(localStorage.getItem(k));
              const old=new Date(Date.now()-16*86400000).toISOString();
              // mutate last session timestamp if any
              let found=false;
              for (let i=s.history.length-1;i>=0;i--) {
                if (s.history[i].type==='session') { s.history[i]={...s.history[i], t:old}; found=true; break; }
              }
              if (!found) s.history.push({t:old, type:'session', alan:'def', mod:'lab', dur_min:60, kalite:0.85});
              localStorage.setItem(k, JSON.stringify(s));
            }"""
        )
        page.goto(BASE + "/", wait_until="networkidle")
        page.wait_for_timeout(400)
        tek_return = page.locator(".gorev-card").first.inner_text()
        return_mode = "geri dönüş" in tek_return.lower()
        note(
            "D6",
            "ok" if return_mode else "P1",
            "Geri dönüş modu (≥14g oturum boşluğu)",
            f"tek='{tek_return}' (boslukGun=14 kodda)",
            shot(page, "day6-return"),
        )
        # restore exact snap
        page.evaluate("(s) => localStorage.setItem('durum-v22', s)", snap_state)
        page.reload(wait_until="networkidle")

        page.goto(BASE + "/kapilar", wait_until="networkidle")
        page.wait_for_timeout(400)
        kap = text_snip(page, n=600)
        has_pipeline = page.locator(".kapilar-pipeline, .gate").count() > 0 or "Gate" in kap
        siem_on_kap = page.locator(".siem-gap").count() > 0
        note(
            "D6",
            "ok" if has_pipeline else "P1",
            "Kapılar pipeline okunabilirliği",
            f"pipeline={has_pipeline} siem_callout={siem_on_kap} text={kap[:200]!r}",
            shot(page, "day6-kapilar"),
        )

        # ========== DAY 7 Full tour ==========
        routes = [
            ("/", "Bugün"),
            ("/harita", "Harita"),
            ("/tekrar", "Tekrar"),
            ("/log", "Log"),
            ("/almanya", "Almanya"),
            ("/durum", "Durum"),
            ("/beceriler", "Beceriler"),
            ("/kapilar", "Kapılar"),
            ("/hiz", "Hız"),
            ("/formuller", "Formüller"),
            ("/this-should-404", "404→home"),
        ]
        for path, label in routes:
            cons_before = len(PAGE_ERRORS)
            page.goto(BASE + path, wait_until="networkidle")
            page.wait_for_timeout(350)
            blank = len(page.locator("body").inner_text().strip()) < 40
            h1 = page.locator("h1").first.inner_text() if page.locator("h1").count() else ""
            new_errs = PAGE_ERRORS[cons_before:]
            sev = "P0" if blank or new_errs else "ok"
            if path == "/this-should-404":
                sev = "ok" if page.url.rstrip("/").endswith("5173") or page.url.endswith("/") else "P1"
            note(
                "D7",
                sev,
                f"Nav smoke: {label}",
                f"url={page.url} h1={h1!r} blank={blank} pageErrors={new_errs}",
            )
            shot(page, f"day7-{label.replace('→','-').replace('/','_')}")

        # Open Daha fazla each link once (already covered) — primary already
        # Final restore original storage
        page.evaluate(
            """(orig) => {
              if (orig.durum === null) localStorage.removeItem('durum-v22');
              else localStorage.setItem('durum-v22', orig.durum);
              if (orig.curriculum === null) localStorage.removeItem('durum-curriculum-v1');
              else localStorage.setItem('durum-curriculum-v1', orig.curriculum);
            }""",
            original,
        )
        page.goto(BASE + "/", wait_until="networkidle")
        note("END", "ok", "localStorage restore", f"restored keys durum/curriculum from session start")

        report = {
            "notes": NOTES,
            "console": CONSOLE,
            "pageErrors": PAGE_ERRORS,
            "originalHadState": bool(original.get("durum")),
        }
        (OUT / "findings.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
        print("WROTE", OUT / "findings.json")
        browser.close()


if __name__ == "__main__":
    main()
