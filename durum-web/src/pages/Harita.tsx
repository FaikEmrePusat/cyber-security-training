import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ALAN_COLOR,
  ALAN_LABEL,
  ALAN_ORDER,
  OAK_BY_ID,
  OAK_COVERED,
  OAK_CURRICULUM,
  OAK_UPCOMING,
  STATUS_LABEL,
  alanCounts,
  curriculumEdges,
  topicKey,
  type CurriculumStatus,
  type CurriculumTopic,
} from "../data/oakCurriculum";
import { MODEL, type Difficulty, type RetrievalItem } from "../model";
import { ModelsForTags } from "../components/ConceptModels";
import { Section } from "../components/Section";
import { StatusLegend, StatusMark } from "../components/StatusLegend";
import { useCurriculumStatuses } from "../useCurriculumStatuses";
import { useDurum } from "../store";

type ViewMode = "harita" | "agac" | "liste";

const DIFFS: Difficulty[] = ["kolay", "orta", "zor"];
const STATUSES: CurriculumStatus[] = [
  "ogreniyorum",
  "ogrenilmedi",
  "kuyrukta",
  "pekiştirildi",
  "sonra",
];

const DIFF_R: Record<Difficulty, number> = { kolay: 5, orta: 7.5, zor: 10.5 };

function newId(): string {
  return `r-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function makeItem(t: CurriculumTopic): RetrievalItem {
  return {
    id: newId(),
    topic: t.konu,
    alan: t.alan,
    difficulty: t.zorluk,
    n: 0,
    stability: MODEL.tekrar.s0,
    ef: MODEL.tekrar.ef0,
    lastIso: new Date().toISOString(),
  };
}

function statusBadgeClass(st: CurriculumStatus): string {
  if (st === "kuyrukta") return "badge badge--warn";
  if (st === "pekiştirildi") return "badge badge--ok";
  if (st === "sonra" || st === "ogrenilmedi") return "badge badge--closed";
  return "badge";
}

export function HaritaPage() {
  const { state, setRetrieval } = useDurum();

  const queueKeys = useMemo(
    () => new Set(state.retrieval.map((r) => topicKey(r.topic))),
    [state.retrieval],
  );
  const { getStatus, setStatus, setStatuses } = useCurriculumStatuses(queueKeys);

  const [view, setView] = useState<ViewMode>("harita");
  const [alanFilter, setAlanFilter] = useState<string>("net");
  const [zorlukFilter, setZorlukFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [bulkN, setBulkN] = useState(3);
  const [toast, setToast] = useState<string | null>(null);
  const [allowSonraOverride, setAllowSonraOverride] = useState(false);
  const [todayOnly, setTodayOnly] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#yaklasan") {
      document.getElementById("yaklasan")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  const flash = (t: string) => {
    setToast(t);
    setTimeout(() => setToast(null), 2400);
  };

  const bottleneckAlan = useMemo(() => {
    const skills = [...state.skills].filter((s) => s.id !== "port");
    if (!skills.length) return "net";
    let worst = skills[0];
    for (const s of skills) {
      if (s.claimed / Math.max(1, s.weight) < worst.claimed / Math.max(1, worst.weight)) worst = s;
    }
    return worst.id;
  }, [state.skills]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return OAK_CURRICULUM.filter((t) => {
      if (alanFilter !== "all" && t.alan !== alanFilter) return false;
      if (zorlukFilter !== "all" && t.zorluk !== zorlukFilter) return false;
      const st = getStatus(t.id);
      if (statusFilter !== "all" && st !== statusFilter) return false;
      if (needle && !t.konu.toLowerCase().includes(needle)) return false;
      if (todayOnly) {
        if (t.upcoming) return false;
        if (queueKeys.has(topicKey(t.konu))) return false;
        if (st !== "ogreniyorum" && t.alan !== bottleneckAlan) return false;
      }
      return true;
    });
  }, [alanFilter, zorlukFilter, statusFilter, q, getStatus, todayOnly, queueKeys, bottleneckAlan]);

  const coveredInQueue = useMemo(
    () => OAK_COVERED.filter((t) => queueKeys.has(topicKey(t.konu))).length,
    [queueKeys],
  );

  const selected = selectedId ? OAK_BY_ID[selectedId] : null;

  const addToQueue = (topics: CurriculumTopic[], opts?: { forceSonra?: boolean }) => {
    const force = opts?.forceSonra ?? allowSonraOverride;
    const seen = new Set(queueKeys);
    const items: RetrievalItem[] = [];
    const patch: Record<string, CurriculumStatus> = {};
    let skippedSonra = 0;
    for (const t of topics) {
      if (t.upcoming && !force) {
        skippedSonra++;
        continue;
      }
      const key = topicKey(t.konu);
      if (seen.has(key)) continue;
      seen.add(key);
      items.push(makeItem(t));
      if (!t.upcoming) patch[t.id] = "kuyrukta";
    }
    if (!items.length) {
      flash(skippedSonra ? "Yaklaşan kilitli — override" : "Hepsi kuyrukta");
      return;
    }
    setRetrieval((all) => all.concat(items));
    setStatuses(patch);
    flash(`${items.length} eklendi` + (skippedSonra ? ` · ${skippedSonra} atlandı` : "") + " (Ctrl+Z)");
  };

  const removeFromQueue = (t: CurriculumTopic) => {
    const key = topicKey(t.konu);
    setRetrieval((all) => all.filter((r) => topicKey(r.topic) !== key));
    if (!t.upcoming) setStatus(t.id, "ogreniyorum");
    flash("Çıkarıldı (Ctrl+Z)");
  };

  const addBulkFromAlan = (alan: string) => {
    const n = Math.max(1, Math.min(10, bulkN));
    const candidates = OAK_COVERED.filter(
      (t) => t.alan === alan && !queueKeys.has(topicKey(t.konu)) && getStatus(t.id) !== "pekiştirildi",
    ).slice(0, n);
    addToQueue(candidates);
  };

  const skillName = (id: string) => state.skills.find((s) => s.id === id)?.kisa ?? ALAN_LABEL[id] ?? id;
  const countsByAlan = alanCounts({ includeUpcoming: false });

  const graphTopics = useMemo(
    () => filtered.filter((t) => !t.upcoming),
    [filtered],
  );

  return (
    <div className="page page--wide page--harita">
      <header className="harita-top">
        <div className="harita-top__title">
          <h1 className="harita-top__h">Harita</h1>
          <p className="harita-top__meta">
            {OAK_COVERED.length} konu · kuyruk {coveredInQueue}/{OAK_COVERED.length} · sonra {OAK_UPCOMING.length}
          </p>
        </div>
        <div className="harita-top__actions">
          <button
            type="button"
            className={todayOnly ? "cta" : "cta cta--ghost"}
            aria-pressed={todayOnly}
            onClick={() => {
              setTodayOnly(true);
              setView("harita");
            }}
          >
            Bugün
          </button>
          <button
            type="button"
            className={!todayOnly && alanFilter === "all" ? "cta" : "cta cta--ghost"}
            onClick={() => {
              setAlanFilter("all");
              setTodayOnly(false);
              setView("harita");
            }}
          >
            Hub
          </button>
          <Link className="cta cta--ghost" to="/tekrar">
            Kuyruk
          </Link>
        </div>
      </header>

      {toast && <p className="toast-fixed">{toast}</p>}

      <div className="harita-sticky">
        <div className="filters-compact filters-compact--sticky">
          <div className="field">
            <label htmlFor="harita-alan">Alan</label>
            <select id="harita-alan" value={alanFilter} onChange={(e) => setAlanFilter(e.target.value)}>
              <option value="all">Tüm alanlar</option>
              {countsByAlan.map(({ alan, count }) => (
                <option key={alan} value={alan}>
                  {skillName(alan)} ({count})
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="harita-zorluk">Zorluk</label>
            <select id="harita-zorluk" value={zorlukFilter} onChange={(e) => setZorlukFilter(e.target.value)}>
              <option value="all">Hepsi</option>
              {DIFFS.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="harita-status">Durum</label>
            <select id="harita-status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Hepsi</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </div>
          <div className="field field--grow">
            <label htmlFor="harita-q">Ara</label>
            <input id="harita-q" value={q} placeholder="DNS, GPO…" onChange={(e) => setQ(e.target.value)} />
          </div>
          <label className="harita-sticky__check">
            <input type="checkbox" checked={todayOnly} onChange={(e) => setTodayOnly(e.target.checked)} />
            Bugün ({skillName(bottleneckAlan)})
          </label>
        </div>
        <div className="view-tabs view-tabs--inline" role="tablist" aria-label="Görünüm">
          {(
            [
              ["harita", "Graf"],
              ["agac", "Ağaç"],
              ["liste", "Liste"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={view === id}
              className={`view-tabs__btn${view === id ? " is-active" : ""}`}
              onClick={() => setView(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <StatusLegend />
      </div>

      {view === "harita" && (
        <section
          className="harita-graph-first"
          aria-label={alanFilter === "all" ? "Tüm alanlar haritası" : skillName(alanFilter)}
        >
          <CurriculumGraph
            topics={graphTopics}
            allAlan={alanFilter === "all"}
            selectedId={selectedId}
            queueKeys={queueKeys}
            getStatus={getStatus}
            onSelectAlan={(a) => {
              setAlanFilter(a);
              setSelectedId(null);
            }}
            onSelectTopic={(id) => setSelectedId(id)}
            skillName={skillName}
          />
          {!selected && alanFilter !== "all" && (
            <ModelsForTags
              tags={[
                alanFilter,
                ALAN_LABEL[alanFilter] ?? "",
                ...(alanFilter === "net" ? ["osi", "tcp"] : []),
                ...(alanFilter === "secfund" ? ["cia"] : []),
                ...(alanFilter === "off" || alanFilter === "def" ? ["kill chain", "mitre"] : []),
              ]}
            />
          )}
          {selected && (
            <div
              className="topic-panel"
              style={{ borderLeftColor: ALAN_COLOR[selected.alan] ?? "var(--accent)" }}
            >
              <h3 className="topic-panel__title">{selected.konu}</h3>
              <div className="topic-panel__badges">
                <span className="alan-chip">
                  <span
                    className="alan-chip__swatch"
                    style={{ background: ALAN_COLOR[selected.alan] }}
                    aria-hidden
                  />
                  {skillName(selected.alan)}
                </span>
                <span className={`diff-mark diff-mark--${selected.zorluk}`} title={selected.zorluk} aria-label={selected.zorluk} />
                <StatusMark status={getStatus(selected.id)} />
                <span className={statusBadgeClass(getStatus(selected.id))}>
                  {STATUS_LABEL[getStatus(selected.id)]}
                </span>
                {selected.upcoming && <span className="badge badge--closed">kilitli</span>}
              </div>
              {!selected.upcoming &&
                (queueKeys.has(topicKey(selected.konu)) ? (
                  <button type="button" className="cta cta--ghost" onClick={() => removeFromQueue(selected)}>
                    Çıkar
                  </button>
                ) : (
                  <button type="button" className="cta" onClick={() => addToQueue([selected])}>
                    Kuyruğa
                  </button>
                ))}
              <ModelsForTags tags={[...selected.tags, selected.konu, selected.alan]} />
            </div>
          )}
        </section>
      )}

      {view === "agac" && (
        <Section title="Ağaç" lead="Gruplara katla · toplu ekle">
          <div className="field-row" style={{ marginBottom: "1rem" }}>
            <div className="field">
              <label htmlFor="bulk-n">En fazla</label>
              <input
                id="bulk-n"
                type="number"
                min={1}
                max={10}
                value={bulkN}
                onChange={(e) => setBulkN(Number(e.target.value) || 3)}
              />
            </div>
          </div>
          {ALAN_ORDER.filter((a) => filtered.some((t) => t.alan === a && !t.upcoming)).map((alan) => {
            const group = filtered.filter((t) => t.alan === alan && !t.upcoming);
            if (!group.length) return null;
            const isCollapsed = !!collapsed[alan];
            return (
              <div key={alan} className="tree-group">
                <div className="tree-group__head">
                  <button
                    type="button"
                    className="tree-group__toggle"
                    onClick={() => setCollapsed((c) => ({ ...c, [alan]: !c[alan] }))}
                  >
                    <span className="tree-group__chev">{isCollapsed ? "▸" : "▾"}</span>
                    <span
                      className="tree-group__dot"
                      style={{ background: ALAN_COLOR[alan] ?? "var(--accent)" }}
                    />
                    <strong>{skillName(alan)}</strong>
                    <span className="note" style={{ margin: 0 }}>
                      {group.length}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="cta cta--ghost"
                    style={{ minHeight: 36, padding: "0.35rem 0.7rem" }}
                    onClick={() => addBulkFromAlan(alan)}
                  >
                    +{bulkN}
                  </button>
                </div>
                {!isCollapsed && (
                  <ul className="tree-group__list">
                    {group.map((t) => (
                      <TopicRow
                        key={t.id}
                        topic={t}
                        status={getStatus(t.id)}
                        inQueue={queueKeys.has(topicKey(t.konu))}
                        selected={selectedId === t.id}
                        onSelect={() => setSelectedId(t.id)}
                        onAdd={() => addToQueue([t])}
                        onRemove={() => removeFromQueue(t)}
                        onStatus={(st) => setStatus(t.id, st)}
                      />
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </Section>
      )}

      {view === "liste" && (
        <Section title="Liste" lead={`${filtered.length} satır`}>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Konu</th>
                  <th>Alan</th>
                  <th>Z</th>
                  <th>Durum</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => {
                  const st = getStatus(t.id);
                  const inQ = queueKeys.has(topicKey(t.konu));
                  return (
                    <tr key={t.id} style={{ background: selectedId === t.id ? "rgba(26,107,92,0.06)" : undefined }}>
                      <td>
                        <button type="button" className="linkish" onClick={() => setSelectedId(t.id)}>
                          {t.konu}
                        </button>
                        {t.upcoming && (
                          <span className="badge badge--closed" style={{ marginLeft: 6 }}>
                            sonra
                          </span>
                        )}
                      </td>
                      <td>
                        <span className="alan-chip">
                          <span className="alan-chip__swatch" style={{ background: ALAN_COLOR[t.alan] }} />
                          {skillName(t.alan)}
                        </span>
                      </td>
                      <td>
                        <span className={`diff-mark diff-mark--${t.zorluk}`} title={t.zorluk} />
                      </td>
                      <td>
                        <StatusMark status={st} />{" "}
                        <span className={statusBadgeClass(st)}>{STATUS_LABEL[st]}</span>
                      </td>
                      <td>
                        {t.upcoming ? (
                          <span className="note" style={{ margin: 0 }}>
                            kilitli
                          </span>
                        ) : inQ ? (
                          <button
                            type="button"
                            className="cta cta--ghost"
                            style={{ minHeight: 36, padding: "0.3rem 0.6rem" }}
                            onClick={() => removeFromQueue(t)}
                          >
                            Çıkar
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="cta"
                            style={{ minHeight: 36, padding: "0.3rem 0.6rem" }}
                            onClick={() => addToQueue([t])}
                          >
                            Ekle
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      <Section
        id="yaklasan"
        title="Yaklaşan"
        lead="Henüz müfredatta yok — kuyruğa kilitli (override gerekir)"
      >
        <div className="upcoming-shelf">
          <p className="upcoming-shelf__title">Kilitli gelecek · SIEM / EDR sonrası</p>
          <label className="note" style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={allowSonraOverride}
              onChange={(e) => setAllowSonraOverride(e.target.checked)}
            />
            Override ile ekle
          </label>
          <ul className="upcoming-list">
            {OAK_UPCOMING.map((t) => (
              <li key={t.id}>
                <StatusMark status="sonra" />
                <span
                  className="tree-group__dot"
                  style={{ background: ALAN_COLOR[t.alan] ?? "var(--ink-mute)", display: "inline-block", opacity: 0.5 }}
                />
                <strong style={{ fontWeight: 500, color: "var(--ink-mute)" }}>{t.konu}</strong>
                <span className={`diff-mark diff-mark--${t.zorluk}`} />
                {allowSonraOverride && !queueKeys.has(topicKey(t.konu)) && (
                  <button
                    type="button"
                    className="cta cta--ghost"
                    style={{ minHeight: 32, padding: "0.25rem 0.55rem" }}
                    onClick={() => addToQueue([t], { forceSonra: true })}
                  >
                    Yine de
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </div>
  );
}

function TopicRow({
  topic,
  status,
  inQueue,
  selected,
  onSelect,
  onAdd,
  onRemove,
  onStatus,
}: {
  topic: CurriculumTopic;
  status: CurriculumStatus;
  inQueue: boolean;
  selected: boolean;
  onSelect: () => void;
  onAdd: () => void;
  onRemove: () => void;
  onStatus: (s: CurriculumStatus) => void;
}) {
  return (
    <li className={`tree-row${selected ? " is-selected" : ""}`}>
      <button type="button" className="tree-row__main" onClick={onSelect}>
        <StatusMark status={status} />
        <span className="tree-row__title">{topic.konu}</span>
        <span className={`diff-mark diff-mark--${topic.zorluk}`} title={topic.zorluk} />
      </button>
      <div className="tree-row__actions">
        <select
          aria-label="Durum"
          value={status === "kuyrukta" ? "ogreniyorum" : status}
          disabled={inQueue}
          onChange={(e) => onStatus(e.target.value as CurriculumStatus)}
        >
          <option value="ogrenilmedi">Öğrenilmedi</option>
          <option value="ogreniyorum">Öğreniyorum</option>
          <option value="pekiştirildi">Pekiştirildi</option>
        </select>
        {inQueue ? (
          <button type="button" className="cta cta--ghost" style={{ minHeight: 36, padding: "0.3rem 0.55rem" }} onClick={onRemove}>
            Çıkar
          </button>
        ) : (
          <button type="button" className="cta" style={{ minHeight: 36, padding: "0.3rem 0.55rem" }} onClick={onAdd}>
            Kuyruğa
          </button>
        )}
      </div>
    </li>
  );
}

function nodeFill(st: CurriculumStatus, alan: string): string {
  if (st === "kuyrukta") return "var(--st-kuyrukta)";
  if (st === "pekiştirildi") return "var(--st-pekistirildi)";
  if (st === "sonra" || st === "ogrenilmedi") return "var(--st-ogrenilmedi)";
  return ALAN_COLOR[alan] ?? "#1a6b5c";
}

type GraphPos = { x: number; y: number };

function forceDirectedLayout(
  topics: CurriculumTopic[],
  edges: { a: string; b: string }[],
  width: number,
  height: number,
): Map<string, GraphPos> {
  const byAlan = new Map<string, CurriculumTopic[]>();
  for (const t of topics) {
    const g = byAlan.get(t.alan) ?? [];
    g.push(t);
    byAlan.set(t.alan, g);
  }
  const alans = ALAN_ORDER.filter((a) => byAlan.has(a));

  type SimNode = GraphPos & { vx: number; vy: number };
  const nodes = new Map<string, SimNode>();
  const cx = width / 2;
  const cy = height / 2;
  const baseR = Math.min(width, height) * 0.38;

  topics.forEach((t) => {
    const alanIdx = Math.max(0, alans.findIndex((a) => a === t.alan));
    const group = byAlan.get(t.alan)!;
    const idxInGroup = group.indexOf(t);
    const sector = (Math.PI * 2) / Math.max(1, alans.length);
    const sectorStart = alanIdx * sector - Math.PI / 2;
    const ang = sectorStart + ((idxInGroup + 0.5) / group.length) * sector * 0.85;
    const r = baseR * (0.72 + (idxInGroup % 5) * 0.06);
    nodes.set(t.id, {
      x: cx + Math.cos(ang) * r,
      y: cy + Math.sin(ang) * r,
      vx: 0,
      vy: 0,
    });
  });

  const edgeList = edges.filter((e) => nodes.has(e.a) && nodes.has(e.b));
  const ids = [...nodes.keys()];
  const iterations = 140;
  const repulsion = 920;
  const attraction = 0.012;
  const idealLen = 52;
  const damp = 0.82;

  for (let iter = 0; iter < iterations; iter++) {
    const cool = 1 - iter / iterations;
    const forces = new Map<string, { fx: number; fy: number }>();
    for (const id of ids) forces.set(id, { fx: 0, fy: 0 });

    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const pa = nodes.get(ids[i])!;
        const pb = nodes.get(ids[j])!;
        let dx = pa.x - pb.x;
        let dy = pa.y - pb.y;
        const dist = Math.hypot(dx, dy) || 1;
        const force = (repulsion * cool) / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        forces.get(ids[i])!.fx += fx;
        forces.get(ids[i])!.fy += fy;
        forces.get(ids[j])!.fx -= fx;
        forces.get(ids[j])!.fy -= fy;
      }
    }

    for (const e of edgeList) {
      const pa = nodes.get(e.a)!;
      const pb = nodes.get(e.b)!;
      const dx = pb.x - pa.x;
      const dy = pb.y - pa.y;
      const dist = Math.hypot(dx, dy) || 1;
      const force = (dist - idealLen) * attraction * cool;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      forces.get(e.a)!.fx += fx;
      forces.get(e.a)!.fy += fy;
      forces.get(e.b)!.fx -= fx;
      forces.get(e.b)!.fy -= fy;
    }

    for (const id of ids) {
      const p = nodes.get(id)!;
      const f = forces.get(id)!;
      f.fx += (cx - p.x) * 0.006 * cool;
      f.fy += (cy - p.y) * 0.006 * cool;
      p.vx = (p.vx + f.fx) * damp;
      p.vy = (p.vy + f.fy) * damp;
      p.x += p.vx * cool;
      p.y += p.vy * cool;
    }
  }

  const pad = 36;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of nodes.values()) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }
  const spanX = Math.max(maxX - minX, 1);
  const spanY = Math.max(maxY - minY, 1);
  const scale = Math.min((width - pad * 2) / spanX, (height - pad * 2) / spanY);
  const offX = (width - spanX * scale) / 2 - minX * scale;
  const offY = (height - spanY * scale) / 2 - minY * scale;

  const out = new Map<string, GraphPos>();
  for (const [id, p] of nodes) {
    out.set(id, { x: p.x * scale + offX, y: p.y * scale + offY });
  }
  return out;
}

const MIN_ZOOM = 0.35;
const MAX_ZOOM = 3.5;
const ZOOM_STEP = 1.15;
/** Show non-focused node labels when zoom scale reaches this (unified ~141-node graph). */
const LABEL_ZOOM_THRESHOLD = 1.5;
/** Lower threshold for single-alan graphs with fewer nodes. */
const LABEL_ZOOM_THRESHOLD_SMALL = 1.2;

function truncateNodeLabel(name: string, zoomScale: number): string {
  const maxLen = zoomScale >= 2.5 ? 36 : zoomScale >= 1.8 ? 28 : 20;
  return name.length > maxLen ? `${name.slice(0, maxLen - 1)}…` : name;
}

function nodeLabelVisible(
  zoomScale: number,
  selected: boolean,
  hovered: boolean,
  threshold: number,
  alwaysShow = false,
): boolean {
  if (selected || hovered) return true;
  if (alwaysShow) return true;
  return zoomScale >= threshold;
}

type ViewTransform = { x: number; y: number; k: number };

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function svgClientToView(svg: SVGSVGElement, clientX: number, clientY: number): GraphPos {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const m = svg.getScreenCTM();
  if (!m) return { x: 0, y: 0 };
  const p = pt.matrixTransform(m.inverse());
  return { x: p.x, y: p.y };
}

function zoomAtTransform(t: ViewTransform, px: number, py: number, factor: number): ViewTransform {
  const k = clamp(t.k * factor, MIN_ZOOM, MAX_ZOOM);
  const ratio = k / t.k;
  return { k, x: px - ratio * (px - t.x), y: py - ratio * (py - t.y) };
}

function viewToContent(vx: number, vy: number, t: ViewTransform): GraphPos {
  return { x: (vx - t.x) / t.k, y: (vy - t.y) / t.k };
}

function connectedIds(focusId: string | null, edges: { a: string; b: string }[]): Set<string> {
  if (!focusId) return new Set();
  const out = new Set<string>([focusId]);
  for (const e of edges) {
    if (e.a === focusId) out.add(e.b);
    if (e.b === focusId) out.add(e.a);
  }
  return out;
}

function InteractiveGraphCanvas({
  width,
  height,
  layoutKey,
  edges,
  basePositions,
  selectedId,
  ariaLabel,
  className,
  header,
  hub,
  renderNodes,
}: {
  width: number;
  height: number;
  layoutKey: string;
  edges: { a: string; b: string }[];
  basePositions: Map<string, GraphPos>;
  selectedId: string | null;
  ariaLabel: string;
  className?: string;
  header?: ReactNode;
  hub?: ReactNode;
  renderNodes: (ctx: {
    positions: Map<string, GraphPos>;
    hoveredId: string | null;
    highlightIds: Set<string>;
    zoomScale: number;
    onHover: (id: string | null, label?: string, clientX?: number, clientY?: number) => void;
    onNodePointerDown: (id: string, e: PointerEvent) => void;
    selectNode: (run: () => void) => void;
  }) => ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [transform, setTransform] = useState<ViewTransform>({ x: 0, y: 0, k: 1 });
  const [dragPos, setDragPos] = useState<Map<string, GraphPos>>(() => new Map());
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ label: string; x: number; y: number } | null>(null);
  const [isPanning, setIsPanning] = useState(false);

  const panRef = useRef<{ px: number; py: number; tx: number; ty: number; moved: boolean } | null>(null);
  const dragRef = useRef<{ id: string; ox: number; oy: number; moved: boolean } | null>(null);
  const suppressClickRef = useRef(false);
  const pinchRef = useRef<{ dist: number; k: number; midX: number; midY: number; tx: number; ty: number } | null>(
    null,
  );
  const pointersRef = useRef<Map<number, GraphPos>>(new Map());

  useEffect(() => {
    setTransform({ x: 0, y: 0, k: 1 });
    setDragPos(new Map());
    setHoveredId(null);
    setTooltip(null);
  }, [layoutKey]);

  const positions = useMemo(() => {
    const merged = new Map(basePositions);
    for (const [id, p] of dragPos) merged.set(id, p);
    return merged;
  }, [basePositions, dragPos]);

  const focusId = hoveredId ?? selectedId;
  const highlightIds = useMemo(() => connectedIds(focusId, edges), [focusId, edges]);
  const dimGraph = focusId != null;

  const resetView = useCallback(() => {
    setTransform({ x: 0, y: 0, k: 1 });
    setDragPos(new Map());
  }, []);

  const zoomBy = useCallback((factor: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const pt = svgClientToView(svg, rect.left + rect.width / 2, rect.top + rect.height / 2);
    setTransform((t) => zoomAtTransform(t, pt.x, pt.y, factor));
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const pt = svgClientToView(svg, e.clientX, e.clientY);
      const factor = e.deltaY > 0 ? 1 / ZOOM_STEP : ZOOM_STEP;
      setTransform((t) => zoomAtTransform(t, pt.x, pt.y, factor));
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [layoutKey]);

  const onHover = useCallback((id: string | null, label?: string, clientX?: number, clientY?: number) => {
    setHoveredId(id);
    if (id && label && clientX != null && clientY != null && wrapRef.current) {
      const rect = wrapRef.current.getBoundingClientRect();
      setTooltip({ label, x: clientX - rect.left, y: clientY - rect.top });
    } else {
      setTooltip(null);
    }
  }, []);

  const onNodePointerDown = useCallback(
    (id: string, e: PointerEvent) => {
      e.stopPropagation();
      const svg = svgRef.current;
      if (!svg) return;
      svg.setPointerCapture(e.pointerId);
      suppressClickRef.current = false;
      const view = svgClientToView(svg, e.clientX, e.clientY);
      const content = viewToContent(view.x, view.y, transform);
      const base = positions.get(id) ?? { x: 0, y: 0 };
      dragRef.current = {
        id,
        ox: content.x - base.x,
        oy: content.y - base.y,
        moved: false,
      };
    },
    [transform, positions],
  );

  const selectNode = useCallback((run: () => void) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    run();
  }, []);

  const onSvgPointerDown = useCallback(
    (e: PointerEvent<SVGSVGElement>) => {
      if (e.button !== 0 && e.pointerType !== "touch") return;
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointersRef.current.size === 2) {
        const pts = [...pointersRef.current.values()];
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        const svg = svgRef.current;
        if (!svg || dist < 1) return;
        const midX = (pts[0].x + pts[1].x) / 2;
        const midY = (pts[0].y + pts[1].y) / 2;
        const mid = svgClientToView(svg, midX, midY);
        pinchRef.current = { dist, k: transform.k, midX: mid.x, midY: mid.y, tx: transform.x, ty: transform.y };
        panRef.current = null;
        return;
      }

      if (pointersRef.current.size === 1 && !dragRef.current) {
        panRef.current = { px: e.clientX, py: e.clientY, tx: transform.x, ty: transform.y, moved: false };
        setIsPanning(true);
        svgRef.current?.setPointerCapture(e.pointerId);
      }
    },
    [transform],
  );

  const onSvgPointerMove = useCallback(
    (e: PointerEvent<SVGSVGElement>) => {
      if (pointersRef.current.has(e.pointerId)) {
        pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      }

      if (pointersRef.current.size === 2 && pinchRef.current) {
        const pts = [...pointersRef.current.values()];
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        const pinch = pinchRef.current;
        const factor = dist / pinch.dist;
        const k = clamp(pinch.k * factor, MIN_ZOOM, MAX_ZOOM);
        const ratio = k / pinch.k;
        setTransform({
          k,
          x: pinch.midX - ratio * (pinch.midX - pinch.tx),
          y: pinch.midY - ratio * (pinch.midY - pinch.ty),
        });
        return;
      }

      if (dragRef.current) {
        const svg = svgRef.current;
        if (!svg) return;
        const view = svgClientToView(svg, e.clientX, e.clientY);
        const content = viewToContent(view.x, view.y, transform);
        const d = dragRef.current;
        if (!d.moved && Math.hypot(e.movementX, e.movementY) > 3) d.moved = true;
        setDragPos((prev) => {
          const next = new Map(prev);
          next.set(d.id, { x: content.x - d.ox, y: content.y - d.oy });
          return next;
        });
        return;
      }

      if (panRef.current) {
        const p = panRef.current;
        if (Math.hypot(e.clientX - p.px, e.clientY - p.py) > 3) p.moved = true;
        setTransform((t) => ({
          ...t,
          x: p.tx + (e.clientX - p.px),
          y: p.ty + (e.clientY - p.py),
        }));
      }
    },
    [transform],
  );

  const onSvgPointerUp = useCallback((e: PointerEvent<SVGSVGElement>) => {
    if (dragRef.current?.moved || panRef.current?.moved) suppressClickRef.current = true;
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) pinchRef.current = null;
    if (pointersRef.current.size === 0) {
      panRef.current = null;
      setIsPanning(false);
    }
    dragRef.current = null;
    try {
      svgRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  }, []);

  return (
    <div className="curriculum-graph-wrap" ref={wrapRef}>
      {header}
      <div className={`curriculum-graph-viewport${isPanning ? " is-panning" : ""}`}>
        <div className="curriculum-graph__toolbar" aria-label="Graf kontrolleri">
          <button type="button" className="curriculum-graph__tool" onClick={() => zoomBy(ZOOM_STEP)} title="Yakınlaştır" aria-label="Yakınlaştır">
            +
          </button>
          <button type="button" className="curriculum-graph__tool" onClick={() => zoomBy(1 / ZOOM_STEP)} title="Uzaklaştır" aria-label="Uzaklaştır">
            −
          </button>
          <button type="button" className="curriculum-graph__tool curriculum-graph__tool--reset" onClick={resetView} title="Görünümü sıfırla" aria-label="Görünümü sıfırla">
            ⟲
          </button>
        </div>
        {tooltip && (
          <div className="curriculum-graph__tooltip" style={{ left: tooltip.x, top: tooltip.y }} role="tooltip">
            {tooltip.label}
          </div>
        )}
        <svg
          ref={svgRef}
          className={className ?? "curriculum-graph"}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={ariaLabel}
          onPointerDown={onSvgPointerDown}
          onPointerMove={onSvgPointerMove}
          onPointerUp={onSvgPointerUp}
          onPointerCancel={onSvgPointerUp}
          onPointerLeave={onSvgPointerUp}
        >
          <rect className="curriculum-graph__bg" width={width} height={height} />
          <g transform={`translate(${transform.x} ${transform.y}) scale(${transform.k})`}>
            {edges.map((e) => {
              const a = positions.get(e.a);
              const b = positions.get(e.b);
              if (!a || !b) return null;
              const linked = focusId != null && (e.a === focusId || e.b === focusId);
              const dimmed = dimGraph && !linked;
              return (
                <line
                  key={`${e.a}-${e.b}`}
                  className={`curriculum-graph__edge${linked ? " is-highlight" : ""}${dimmed ? " is-dim" : ""}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                />
              );
            })}
            {hub}
            {renderNodes({
              positions,
              hoveredId,
              highlightIds,
              zoomScale: transform.k,
              onHover,
              onNodePointerDown,
              selectNode,
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}

function CurriculumGraph({
  topics,
  allAlan,
  selectedId,
  queueKeys,
  getStatus,
  onSelectAlan,
  onSelectTopic,
  skillName,
}: {
  topics: CurriculumTopic[];
  allAlan: boolean;
  selectedId: string | null;
  queueKeys: Set<string>;
  getStatus: (id: string) => CurriculumStatus;
  onSelectAlan: (alan: string) => void;
  onSelectTopic: (id: string) => void;
  skillName: (id: string) => string;
}) {
  if (!topics.length) {
    return <p className="note">Bu filtrede düğüm yok — alan seç.</p>;
  }

  if (allAlan) {
    return (
      <AllAlanGraph
        topics={topics}
        selectedId={selectedId}
        queueKeys={queueKeys}
        getStatus={getStatus}
        onSelectAlan={onSelectAlan}
        onSelectTopic={onSelectTopic}
        skillName={skillName}
      />
    );
  }

  return (
    <SingleAlanGraph
      topics={topics}
      selectedId={selectedId}
      queueKeys={queueKeys}
      getStatus={getStatus}
      onSelectTopic={onSelectTopic}
      skillName={skillName}
    />
  );
}

function SingleAlanGraph({
  topics,
  selectedId,
  queueKeys,
  getStatus,
  onSelectTopic,
  skillName,
}: {
  topics: CurriculumTopic[];
  selectedId: string | null;
  queueKeys: Set<string>;
  getStatus: (id: string) => CurriculumStatus;
  onSelectTopic: (id: string) => void;
  skillName: (id: string) => string;
}) {
  const W = 720;
  const H = 360;
  const cx = W / 2;
  const cy = H / 2;
  const n = topics.length;
  const ids = useMemo(() => new Set(topics.map((t) => t.id)), [topics]);
  const edges = useMemo(() => curriculumEdges(ids), [ids]);
  const hubR = Math.min(W, H) * 0.08;
  const satR = Math.min(W, H) * 0.36;
  const basePositions = useMemo(() => {
    const positions = new Map<string, GraphPos>();
    topics.forEach((t, i) => {
      const ang = (i / n) * Math.PI * 2 - Math.PI / 2;
      positions.set(t.id, {
        x: cx + Math.cos(ang) * satR,
        y: cy + Math.sin(ang) * satR,
      });
    });
    return positions;
  }, [topics, n, cx, cy, satR]);
  const alan = topics[0]?.alan ?? "net";
  const layoutKey = `${alan}-${topics.map((t) => t.id).join(",")}`;

  return (
    <InteractiveGraphCanvas
      width={W}
      height={H}
      layoutKey={layoutKey}
      edges={edges}
      basePositions={basePositions}
      selectedId={selectedId}
      ariaLabel="Konu haritası"
      className="curriculum-graph curriculum-graph--full"
      hub={
        <>
          <circle cx={cx} cy={cy} r={hubR} fill={ALAN_COLOR[alan] ?? "#1a6b5c"} />
          <text x={cx} y={cy + 4} textAnchor="middle" fill="#f4faf8" fontSize={12} fontWeight={700}>
            {skillName(alan)}
          </text>
        </>
      }
      renderNodes={({ positions, hoveredId, highlightIds, zoomScale, onHover, onNodePointerDown, selectNode }) =>
        topics.map((t) => {
          const p = positions.get(t.id)!;
          const dimmed = hoveredId != null && !highlightIds.has(t.id) && selectedId !== t.id;
          const hovered = hoveredId === t.id;
          const selected = selectedId === t.id;
          return (
            <TopicNode
              key={t.id}
              topic={t}
              x={p.x}
              y={p.y}
              hubX={cx}
              hubY={cy}
              alan={alan}
              selected={selected}
              inQueue={queueKeys.has(topicKey(t.konu))}
              status={getStatus(t.id)}
              showLabel={nodeLabelVisible(zoomScale, selected, hovered, LABEL_ZOOM_THRESHOLD_SMALL, n <= 16)}
              zoomScale={zoomScale}
              dimmed={dimmed}
              hubDimmed={dimmed}
              onSelect={() => selectNode(() => onSelectTopic(t.id))}
              onHover={(label, hx, hy) => onHover(t.id, label, hx, hy)}
              onHoverEnd={() => onHover(null)}
              onDragStart={(e) => onNodePointerDown(t.id, e)}
            />
          );
        })
      }
    />
  );
}

function AllAlanGraph({
  topics,
  selectedId,
  queueKeys,
  getStatus,
  onSelectAlan,
  onSelectTopic,
  skillName,
}: {
  topics: CurriculumTopic[];
  selectedId: string | null;
  queueKeys: Set<string>;
  getStatus: (id: string) => CurriculumStatus;
  onSelectAlan: (alan: string) => void;
  onSelectTopic: (id: string) => void;
  skillName: (id: string) => string;
}) {
  const alans = useMemo(() => {
    const seen = new Set<string>();
    for (const t of topics) seen.add(t.alan);
    return ALAN_ORDER.filter((a) => seen.has(a));
  }, [topics]);

  const ids = useMemo(() => new Set(topics.map((t) => t.id)), [topics]);
  const edges = useMemo(() => curriculumEdges(ids), [ids]);

  const { positions, W, H } = useMemo(() => {
    const width = 1100;
    const height = 820;
    const pos = forceDirectedLayout(topics, edges, width, height);
    return { positions: pos, W: width, H: height };
  }, [topics, edges]);

  const layoutKey = useMemo(() => topics.map((t) => t.id).join(","), [topics]);

  return (
    <InteractiveGraphCanvas
      width={W}
      height={H}
      layoutKey={layoutKey}
      edges={edges}
      basePositions={positions}
      selectedId={selectedId}
      ariaLabel={`Tüm alanlar — ${topics.length} konu, birleşik graf`}
      className="curriculum-graph curriculum-graph--full curriculum-graph--unified"
      header={
        <div className="curriculum-graph__meta">
          <span>
            {topics.length} düğüm · {alans.length} alan
          </span>
          <div className="curriculum-graph__legend" aria-label="Alan renkleri">
            {alans.map((alan) => (
              <button
                key={alan}
                type="button"
                className="curriculum-graph__legend-item"
                onClick={() => onSelectAlan(alan)}
                title={`${skillName(alan)} — filtrele`}
              >
                <span className="curriculum-graph__legend-swatch" style={{ background: ALAN_COLOR[alan] }} />
                {skillName(alan)}
              </button>
            ))}
          </div>
        </div>
      }
      renderNodes={({ positions: pos, hoveredId, highlightIds, zoomScale, onHover, onNodePointerDown, selectNode }) =>
        topics.map((t) => {
          const p = pos.get(t.id)!;
          const dimmed = hoveredId != null && !highlightIds.has(t.id) && selectedId !== t.id;
          const hovered = hoveredId === t.id;
          const selected = selectedId === t.id;
          return (
            <TopicNode
              key={t.id}
              topic={t}
              x={p.x}
              y={p.y}
              alan={t.alan}
              selected={selected}
              inQueue={queueKeys.has(topicKey(t.konu))}
              status={getStatus(t.id)}
              showLabel={nodeLabelVisible(zoomScale, selected, hovered, LABEL_ZOOM_THRESHOLD)}
              zoomScale={zoomScale}
              showHubLine={false}
              dimmed={dimmed}
              onSelect={() => selectNode(() => onSelectTopic(t.id))}
              onHover={(label, hx, hy) => onHover(t.id, label, hx, hy)}
              onHoverEnd={() => onHover(null)}
              onDragStart={(e) => onNodePointerDown(t.id, e)}
            />
          );
        })
      }
    />
  );
}

function TopicNode({
  topic,
  x,
  y,
  hubX,
  hubY,
  alan,
  selected,
  inQueue,
  status,
  showLabel,
  zoomScale = 1,
  showHubLine = true,
  dimmed = false,
  hubDimmed = false,
  onSelect,
  onHover,
  onHoverEnd,
  onDragStart,
}: {
  topic: CurriculumTopic;
  x: number;
  y: number;
  hubX?: number;
  hubY?: number;
  alan: string;
  selected: boolean;
  inQueue: boolean;
  status: CurriculumStatus;
  showLabel: boolean;
  zoomScale?: number;
  showHubLine?: boolean;
  dimmed?: boolean;
  hubDimmed?: boolean;
  onSelect: () => void;
  onHover?: (label: string, clientX: number, clientY: number) => void;
  onHoverEnd?: () => void;
  onDragStart?: (e: PointerEvent) => void;
}) {
  const baseR = DIFF_R[topic.zorluk] ?? 7;
  const r = selected ? baseR + 2.5 : baseR;
  const fill = nodeFill(status, alan);
  const labelY = y + r + 10;
  const invScale = 1 / zoomScale;

  return (
    <g
      className={`topic-node${dimmed ? " is-dim" : ""}${selected ? " is-selected" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerDown={(e) => onDragStart?.(e)}
      onPointerEnter={(e) => onHover?.(topic.konu, e.clientX, e.clientY)}
      onPointerMove={(e) => {
        if (e.buttons === 0) onHover?.(topic.konu, e.clientX, e.clientY);
      }}
      onPointerLeave={onHoverEnd}
    >
      <title>{topic.konu}</title>
      {showHubLine && hubX != null && hubY != null && (
        <line
          className={`curriculum-graph__hub-line${hubDimmed ? " is-dim" : ""}`}
          x1={hubX}
          y1={hubY}
          x2={x}
          y2={y}
        />
      )}
      {inQueue && (
        <circle
          className="node-glow"
          cx={x}
          cy={y}
          r={r + 5}
          fill="none"
          stroke="var(--st-kuyrukta)"
          strokeWidth={2}
          opacity={0.5}
        />
      )}
      <circle
        className="topic-node__dot"
        cx={x}
        cy={y}
        r={r}
        fill={fill}
        stroke={selected ? "var(--ink)" : inQueue ? "var(--warn)" : "none"}
        strokeWidth={selected ? 2.5 : inQueue ? 1.5 : 0}
      />
      {showLabel && (
        <g className="topic-node__label-wrap" transform={`translate(${x} ${labelY}) scale(${invScale})`}>
          <text
            className={`topic-node__label${selected ? " is-selected" : ""}`}
            x={0}
            y={0}
            textAnchor="middle"
            dominantBaseline="hanging"
          >
            {truncateNodeLabel(topic.konu, zoomScale)}
          </text>
        </g>
      )}
    </g>
  );
}
