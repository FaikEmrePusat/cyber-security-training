import { useEffect, useId, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useDurum } from "../store";

import { APP_NAME } from "../model/brand";

const PRIMARY = [
  { to: "/", label: "Today", end: true },
  { to: "/harita", label: "Map" },
  { to: "/record", label: "Record" },
  { to: "/beceriler", label: "Skills" },
  { to: "/tekrar", label: "Review" },
  { to: "/almanya", label: "Germany" },
];

const MORE = [
  { to: "/durum", label: "Status" },
  { to: "/kapilar", label: "Gates" },
  { to: "/hiz", label: "Pace" },
  { to: "/formuller", label: "Formulas" },
  { to: "/data", label: "Data" },
];

export function Nav() {
  const { canUndo, canRedo, undo, redo } = useDurum();
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const moreActive = MORE.some((l) => location.pathname === l.to);

  useEffect(() => {
    setMoreOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!moreOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  return (
    <nav className="site-nav" aria-label="Main menu">
      <NavLink to="/" className="site-nav__brand" end>
        {APP_NAME}
      </NavLink>
      <div className="site-nav__links">
        <div className="site-nav__primary">
          {PRIMARY.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? "active" : "")}>
              {l.label}
            </NavLink>
          ))}
        </div>
        <div className="site-nav__more" ref={moreRef}>
          <button
            type="button"
            className={`site-nav__more-btn${moreActive || moreOpen ? " is-active" : ""}`}
            aria-expanded={moreOpen}
            aria-haspopup="menu"
            aria-controls={menuId}
            onClick={() => setMoreOpen((o) => !o)}
          >
            More
          </button>
          {moreOpen && (
            <div id={menuId} className="site-nav__more-menu" role="menu">
              {MORE.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  role="menuitem"
                  className={({ isActive }) => (isActive ? "active" : "")}
                  onClick={() => setMoreOpen(false)}
                >
                  {l.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="site-nav__history" role="group" aria-label="Undo">
        <button
          type="button"
          className="history-btn"
          disabled={!canUndo}
          onClick={undo}
          title="Undo (Ctrl+Z)"
        >
          Undo
        </button>
        <button
          type="button"
          className="history-btn"
          disabled={!canRedo}
          onClick={redo}
          title="Redo (Ctrl+Y)"
        >
          Redo
        </button>
      </div>
    </nav>
  );
}
