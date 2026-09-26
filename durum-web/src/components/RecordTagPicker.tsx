import { tagsByGroup } from "../data/recordTags";

type Props = {
  selected: string[];
  onToggle: (id: string) => void;
  /** When true, chips are non-interactive (e.g. Day log reference list). */
  readOnly?: boolean;
  idPrefix?: string;
};

/** Grouped tag chips for Record / return-work / day-log forms. */
export function RecordTagPicker({ selected, onToggle, readOnly = false, idPrefix = "rt" }: Props) {
  const groups = tagsByGroup();

  return (
    <div className="record-tags" role={readOnly ? "list" : "group"} aria-label="Session tags">
      {groups.map(({ group, tags }) => (
        <div key={group.id} className="record-tags__group" role={readOnly ? "listitem" : undefined}>
          <p className="record-tags__group-label" id={`${idPrefix}-${group.id}`}>
            {group.label}
          </p>
          <div
            className="day-log__chips"
            role={readOnly ? undefined : "group"}
            aria-labelledby={`${idPrefix}-${group.id}`}
          >
            {tags.map((t) =>
              readOnly ? (
                <span key={t.id} className="day-log__chip">
                  {t.label}
                </span>
              ) : (
                <button
                  key={t.id}
                  type="button"
                  className={`day-log__chip${selected.includes(t.id) ? " is-on" : ""}`}
                  aria-pressed={selected.includes(t.id)}
                  onClick={() => onToggle(t.id)}
                >
                  {t.label}
                </button>
              ),
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
