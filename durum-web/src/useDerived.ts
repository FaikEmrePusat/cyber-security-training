import { useMemo } from "react";
import {
  MODEL,
  bandLabel,
  buildPmc,
  buildPractice,
  cefrFromScore,
  clamp,
  componentEtaHafta,
  computeAll,
  computeChancenkarte,
  computeRoiList,
  daysSince,
  evaluateGates,
  gateSummary,
  interviewsLast14,
  isRetrievalDue,
  measuredVelocity,
  overdueRatio,
  predictedVelocity,
  predictedVelocityFromCtl,
  rGiris,
  rHedef,
  round1,
  round2,
  runwayAy,
  safetyMarginGun,
  sessionsWithin,
  streakDays,
  type RoiAction,
} from "./model";
import { useDurum } from "./store";

export function useDerived() {
  const { state } = useDurum();
  const { skills, artifacts, lang, career, tempo, retrieval, history, chancenkarte } = state;

  const nowMs = Math.floor(Date.now() / 60000) * 60000;

  return useMemo(() => {
    const nowIso = new Date().toISOString();
    const practice = buildPractice(history, skills, nowMs);
    const opts = { kanitTavani: true, curume: true } as const;
    const live = computeAll(skills, artifacts, lang, career, practice, opts);
    const beyan = computeAll(skills, artifacts, lang, career, practice, {
      kanitTavani: false,
      curume: false,
    });
    const kanitsizTavan = computeAll(skills, artifacts, lang, career, practice, {
      kanitTavani: true,
      curume: false,
    });

    const kanitAcigi = beyan.R - kanitsizTavan.R;
    const curumeKaybi = kanitsizTavan.R - live.R;

    const sessions14 = sessionsWithin(history, nowMs, 14);
    const sessions7 = sessionsWithin(history, nowMs, 7);
    const gercekSaat7 = sessions7.reduce((a, r) => a + (r.dur_min ?? 0), 0) / 60;
    const olculenKalite =
      sessions14.length > 0
        ? sessions14.reduce((a, r) => a + (r.kalite ?? 0.85), 0) / sessions14.length
        : null;
    const kaliteKullanilan = olculenKalite ?? tempo.quality;
    const streak = streakDays(history, nowMs);
    const interviews14 = interviewsLast14(history, nowMs);

    const ck = computeChancenkarte(chancenkarte, live.deEff, live.enEff);
    const runway = runwayAy(chancenkarte);
    const gate0Ok = chancenkarte.gate0 !== "bilinmiyor" && chancenkarte.gate0 !== "denk_degil";
    const gateFOk = runway !== null && runway >= MODEL.kapi.F.runwayAy;
    const pmc = buildPmc(history, nowMs);

    const vTahmin = predictedVelocityFromCtl(pmc.ctl);
    const vTahminPlan = predictedVelocity(tempo.hoursCyber, tempo.hoursLang, kaliteKullanilan);
    const vOlculen = measuredVelocity(history);
    const kappa = vOlculen && Math.abs(vTahmin) > 1e-6 ? vOlculen.v / vTahmin : null;

    const gates = evaluateGates(
      live.sEff,
      live.R,
      artifacts,
      live.deEff,
      live.enEff,
      interviews14,
      gate0Ok,
      gateFOk,
    );
    const nextGate = gates.find((g) => !g.open) ?? null;
    const blocking = new Set<string>();
    if (nextGate) for (const p of nextGate.parts) if (!p.ok) blocking.add(p.key);

    const hedefV = MODEL.hedef.vektor;
    const boyutlar = [
      { key: "T", ad: "Technical", v: live.T, hedef: hedefV.T },
      { key: "P", ad: "Production", v: live.P, hedef: hedefV.P },
      { key: "L", ad: "Language", v: live.L, hedef: hedefV.L },
      { key: "C", ad: "Career", v: live.C, hedef: hedefV.C },
    ];
    let darbogaz = boyutlar[0];
    for (const b of boyutlar) if (b.v / b.hedef < darbogaz.v / darbogaz.hedef) darbogaz = b;

    const etaRotaA = componentEtaHafta({
      sEff: live.sEff,
      deEff: live.deEff,
      enEff: live.enEff,
      hoursCyber: tempo.hoursCyber,
      hoursLang: tempo.hoursLang,
      rotaA: true,
    });
    const etaRotaB7 = componentEtaHafta({
      sEff: live.sEff,
      deEff: live.deEff,
      enEff: live.enEff,
      hoursCyber: tempo.hoursCyber,
      hoursLang: tempo.hoursLang,
      rotaA: false,
    });
    const etaRotaB14 = componentEtaHafta({
      sEff: live.sEff,
      deEff: live.deEff,
      enEff: live.enEff,
      hoursCyber: tempo.hoursCyber,
      hoursLang: tempo.hoursLangAlt,
      rotaA: false,
    });

    const gmWin = safetyMarginGun(live.sEff, practice, MODEL.kapi.A.win);
    const gmMin = Math.min(gmWin, safetyMarginGun(live.sEff, practice, MODEL.kapi.A.linux));

    // Fresh install / no sessions yet is setup — not "return mode".
    // Return mode only after a real session gap (≥ boslukGun) or high TSB.
    const sessionRecords = history.filter((r) => r.type === "session");
    const lastSessionMs = sessionRecords.slice(-1)[0]?.t;
    const hasEverSession = sessionRecords.length > 0;
    const daysSinceSession = lastSessionMs ? daysSince(lastSessionMs, nowMs) : 0;
    const geriDonusModu =
      hasEverSession &&
      (daysSinceSession > MODEL.geriDonus.boslukGun || pmc.tsb > MODEL.geriDonus.tsbEsik);

    const roiList = computeRoiList({ skills, artifacts, lang, career, practice, blocking });
    const overdue = retrieval
      .filter((r) => isRetrievalDue(r, nowMs))
      .map((r) => ({ item: r, ratio: overdueRatio(r, nowMs) }))
      .sort((a, b) => b.ratio - a.ratio);
    const kuyruk = overdue.slice(0, MODEL.tekrar.kuyrukTavani);

    /** Daily ritual budget (~45–90 min max). Longer ROI → slice or "Other options". */
    const GUNLUK_SAAT_MAX = 0.75;
    const DILIM_DK = 25;

    const isMicroRoi = (a: RoiAction) => a.saat <= GUNLUK_SAAT_MAX;
    /** Prefer evidence / attach / short polish over multi-hour skill or lab builds. */
    const isShortishRoi = (a: RoiAction) =>
      a.saat <= 4 ||
      a.id.startsWith("ev-") ||
      a.id.startsWith("ap-") ||
      a.id.startsWith("cev-") ||
      a.id.startsWith("lev-");

    const formatSure = (saat: number) =>
      saat <= 1 ? `~${Math.max(5, Math.round(saat * 60))} min` : `~${round1(saat)} h`;

    const pickDailyRoi = (): { action: RoiAction; sliced: boolean } | null => {
      if (!roiList.length) return null;
      const micro = roiList.find(isMicroRoi);
      if (micro) return { action: micro, sliced: false };
      const shortish = roiList.find(isShortishRoi) ?? roiList[0];
      return {
        action: shortish,
        sliced: shortish.saat > GUNLUK_SAAT_MAX,
      };
    };

    const dailyRoiPick = pickDailyRoi();

    /** Today card: plain English; jargon in a separate field. */
    const tekGorev = (() => {
      if (geriDonusModu) {
        return {
          baslik: `Quick return: ${kuyruk.length || 1} reviews or 15 min light practice`,
          neden: "You have been away a few days or fatigue is high — start light first.",
          sure: "~15 min",
          jargon: `${Math.round(daysSinceSession)} days without session · TSB = CTL − ATL · ETA hidden`,
          roiId: null as string | null,
        };
      }
      if (pmc.tsb < -20) {
        return {
          baslik: "Rest today or do only 15 min of light review",
          neden: "Recent load is very high; pushing harder hurts form.",
          sure: "~15 min",
          jargon: `TSB ${pmc.tsb} (< −20) · load = (h_s×0.8 + h_d×0.2)×quality×10`,
          roiId: null as string | null,
        };
      }
      if (overdue.length >= 1) {
        return {
          baslik: `Review ${overdue.length} overdue topics (today max ${kuyruk.length})`,
          neden: "Forgotten knowledge silently lowers readiness; review is the cheapest gain.",
          sure: `~${kuyruk.length * 8} min`,
          jargon: `Decay −${round1(curumeKaybi)} · R(t,S) < 0.85 ⇒ due`,
          roiId: null as string | null,
        };
      }
      if (dailyRoiPick) {
        const { action, sliced } = dailyRoiPick;
        const neden =
          action.gate
            ? "This step helps open the next career gate."
            : "Short move that raises readiness most efficiently.";
        const jargon = [action.baslik !== action.detay ? action.detay : "", `ROI = ΔR/hour = ${round2(action.deltaR)}/${action.saat} = ${round2(action.roi)}`]
          .filter(Boolean)
          .join(" · ");
        if (sliced) {
          return {
            baslik: action.baslik,
            neden: `Full task is longer (~${formatSure(action.saat)}); today only a ~${DILIM_DK} min slice.`,
            sure: `~${DILIM_DK} min`,
            jargon,
            roiId: action.id,
          };
        }
        return {
          baslik: action.baslik,
          neden,
          sure: formatSure(action.saat),
          jargon,
          roiId: action.id,
        };
      }
      return {
        baslik: "Update scores — model cannot find a clear next step",
        neden: "Skill or log inputs may be missing.",
        sure: "",
        jargon: "",
        roiId: null as string | null,
      };
    })();

    const roiAlternatifler = roiList
      .filter((a) => a.id !== tekGorev.roiId)
      .slice(0, 5);

    const rTarget = rHedef();
    const rEntry = rGiris();
    const kalanR = rTarget - live.R;
    const eta = (() => {
      if (kalanR <= 0) return { tip: "ulasildi" as const };
      if (vOlculen) {
        if (vOlculen.v <= 0) return { tip: "durgun" as const, v: vOlculen.v };
        const mid = kalanR / vOlculen.v;
        const s = vOlculen.sigma;
        if (s && s > 0) {
          const lo = kalanR / (vOlculen.v + s);
          const hi = kalanR / Math.max(0.05, vOlculen.v - s);
          return { tip: "olculdu" as const, mid, lo, hi, n: vOlculen.n };
        }
        return { tip: "olculduDar" as const, mid, n: vOlculen.n };
      }
      if (vTahmin <= 0) return { tip: "durgunPlan" as const, v: vTahmin };
      const lo = kalanR / (vTahmin * (1 + MODEL.hiz.bant));
      const hi = kalanR / (vTahmin * (1 - MODEL.hiz.bant));
      return { tip: "plan" as const, lo, hi };
    })();

    const projWeeks = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];
    const planSeries = projWeeks.map((w) => round1(clamp(live.R + vTahmin * w, 0, 100)));
    const nullSeries = projWeeks.map((w) => {
      const bumped = { ...practice };
      for (const k of Object.keys(bumped)) {
        bumped[k] = { days: practice[k].days + w * 7, n: practice[k].n };
      }
      return round1(computeAll(skills, artifacts, lang, career, bumped, opts).R);
    });

    const snapshots = history
      .filter((r) => r.type === "snapshot" && r.hesap)
      .slice()
      .sort((a, b) => Date.parse(a.t) - Date.parse(b.t));

    const sumW = skills.filter((s) => !MODEL.tHaric.includes(s.id)).reduce((a, s) => a + s.weight, 0);

    return {
      nowMs,
      nowIso,
      practice,
      live,
      beyan,
      kanitsizTavan,
      kanitAcigi,
      curumeKaybi,
      sessions14,
      sessions7,
      gercekSaat7,
      kaliteKullanilan,
      streak,
      interviews14,
      ck,
      runway,
      gate0Ok,
      gateFOk,
      pmc,
      vTahmin,
      vTahminPlan,
      vOlculen,
      kappa,
      gates,
      nextGate,
      blocking,
      boyutlar,
      darbogaz,
      etaRotaA,
      etaRotaB7,
      etaRotaB14,
      gmMin,
      daysSinceSession,
      geriDonusModu,
      roiList,
      roiAlternatifler,
      overdue,
      kuyruk,
      tekGorev,
      rTarget,
      rEntry,
      eta,
      planSeries,
      nullSeries,
      projWeeks,
      snapshots,
      sumW,
      band: bandLabel(live.R),
      deCefr: cefrFromScore(live.deEff),
      enCefr: cefrFromScore(live.enEff),
      gateOzet: gateSummary(gates),
    };
  }, [skills, artifacts, lang, career, tempo, retrieval, history, chancenkarte, nowMs]);
}
