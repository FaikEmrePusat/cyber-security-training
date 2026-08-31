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
      { key: "T", ad: "Teknik", v: live.T, hedef: hedefV.T },
      { key: "P", ad: "Üretim", v: live.P, hedef: hedefV.P },
      { key: "L", ad: "Dil", v: live.L, hedef: hedefV.L },
      { key: "C", ad: "Kariyer", v: live.C, hedef: hedefV.C },
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

    /** Daily ritual budget (~45–90 dk max). Longer ROI → slice or “Diğer seçenekler”. */
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
      saat <= 1 ? `~${Math.max(5, Math.round(saat * 60))} dk` : `~${round1(saat)} sa`;

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

    /** Bugün kartı: düz Türkçe; jargon ayrı alanda. */
    const tekGorev = (() => {
      if (geriDonusModu) {
        return {
          baslik: `Kısa bir dönüş: ${kuyruk.length || 1} tekrar veya 15 dk hafif pratik`,
          neden: "Birkaç gündür ara var veya yorgunluk yüksek — önce hafif başla.",
          sure: "~15 dk",
          jargon: `${Math.round(daysSinceSession)} gündür oturum yok · TSB = CTL − ATL · ETA gizli`,
          roiId: null as string | null,
        };
      }
      if (pmc.tsb < -20) {
        return {
          baslik: "Bugün dinlen veya sadece 15 dk hafif tekrar yap",
          neden: "Son günlerin yükü çok yüksek; zorlamak formu bozar.",
          sure: "~15 dk",
          jargon: `TSB ${pmc.tsb} (< −20) · load = (h_s×0.8 + h_d×0.2)×kalite×10`,
          roiId: null as string | null,
        };
      }
      if (overdue.length >= 1) {
        return {
          baslik: `Vadesi geçmiş ${overdue.length} konuyu tekrarla (bugün en fazla ${kuyruk.length})`,
          neden: "Unutulan bilgi hazırlık skorunu sessizce düşürür; tekrar en ucuz kazanç.",
          sure: `~${kuyruk.length * 8} dk`,
          jargon: `Çürüme −${round1(curumeKaybi)} · R(t,S) < 0.85 ⇒ vadesi geldi`,
          roiId: null as string | null,
        };
      }
      if (dailyRoiPick) {
        const { action, sliced } = dailyRoiPick;
        const neden =
          action.gate
            ? "Bu adım sıradaki kariyer kapısını açmaya yardımcı olur."
            : "Hazırlık skorunu en verimli şekilde yükselten kısa hamle.";
        const jargon = [action.baslik !== action.detay ? action.detay : "", `ROI = ΔR/saat = ${round2(action.deltaR)}/${action.saat} = ${round2(action.roi)}`]
          .filter(Boolean)
          .join(" · ");
        if (sliced) {
          return {
            baslik: action.baslik,
            neden: `Tam iş daha uzun (~${formatSure(action.saat)}); bugün sadece ~${DILIM_DK} dk'lık bir dilim.`,
            sure: `~${DILIM_DK} dk`,
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
        baslik: "Skorları güncelle — model net bir sonraki adım bulamıyor",
        neden: "Beceri veya log girdileri eksik olabilir.",
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
