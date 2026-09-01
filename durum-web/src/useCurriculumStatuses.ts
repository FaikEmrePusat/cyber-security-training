import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CURRICULUM_STORAGE_KEY,
  OAK_BY_ID,
  OAK_CURRICULUM,
  type CurriculumStatus,
} from "./data/oakCurriculum";

type CurriculumStore = {
  /** Topic id → status. Upcoming is always sonra. */
  statuses: Record<string, CurriculumStatus>;
};

function loadStore(): CurriculumStore {
  try {
    const raw = localStorage.getItem(CURRICULUM_STORAGE_KEY);
    if (!raw) return { statuses: {} };
    const parsed = JSON.parse(raw) as CurriculumStore;
    return { statuses: parsed.statuses ?? {} };
  } catch {
    return { statuses: {} };
  }
}

function saveStore(s: CurriculumStore) {
  localStorage.setItem(CURRICULUM_STORAGE_KEY, JSON.stringify(s));
}

/** Effective status: unset upcoming → sonra; inQueue → kuyrukta; stored override allowed. */
export function resolveStatus(
  id: string,
  stored: CurriculumStatus | undefined,
  inQueue: boolean,
): CurriculumStatus {
  const topic = OAK_BY_ID[id];
  if (inQueue) return "kuyrukta";
  if (stored) {
    if (stored === "kuyrukta") return "ogreniyorum";
    return stored;
  }
  if (topic?.upcoming) return "sonra";
  return "ogreniyorum";
}

export function useCurriculumStatuses(queueTopicKeys: Set<string>) {
  const [store, setStore] = useState<CurriculumStore>(loadStore);

  useEffect(() => {
    saveStore(store);
  }, [store]);

  const getStatus = useCallback(
    (id: string): CurriculumStatus => {
      const topic = OAK_BY_ID[id];
      const inQueue = topic ? queueTopicKeys.has(topic.konu.trim().toLowerCase()) : false;
      return resolveStatus(id, store.statuses[id], inQueue);
    },
    [store.statuses, queueTopicKeys],
  );

  const setStatus = useCallback((id: string, status: CurriculumStatus) => {
    setStore((s) => ({
      statuses: { ...s.statuses, [id]: status },
    }));
  }, []);

  const setStatuses = useCallback((patch: Record<string, CurriculumStatus>) => {
    setStore((s) => ({
      statuses: { ...s.statuses, ...patch },
    }));
  }, []);

  const counts = useMemo(() => {
    const c: Record<CurriculumStatus, number> = {
      ogrenilmedi: 0,
      ogreniyorum: 0,
      kuyrukta: 0,
      pekiştirildi: 0,
      sonra: 0,
    };
    for (const t of OAK_CURRICULUM) {
      c[getStatus(t.id)]++;
    }
    return c;
  }, [getStatus]);

  return { getStatus, setStatus, setStatuses, counts, store };
}
