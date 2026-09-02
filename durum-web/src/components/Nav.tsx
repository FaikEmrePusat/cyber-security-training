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
  const { canUndo, canRedo, undo, redo, currentUser, cloudSyncStatus, loginWithGoogle, logout } = useDurum();
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
      <div className="site-nav__auth">
        {currentUser ? (
          <div className="site-nav__user-badge">
            <span
              className={`cloud-indicator cloud-indicator--${cloudSyncStatus}`}
              title={
                cloudSyncStatus === "synced"
                  ? "Cloud synced"
                  : cloudSyncStatus === "saving"
                  ? "Saving to cloud..."
                  : cloudSyncStatus === "error"
                  ? "Sync error"
                  : "Connected"
              }
            />
            <span className="user-email" title={currentUser.email ?? ""}>
              {currentUser.displayName?.split(" ")[0] || currentUser.email?.split("@")[0]}
            </span>
            <button type="button" className="auth-btn auth-btn--logout" onClick={logout} title="Sign out">
              Sign out
            </button>
          </div>
        ) : (
          <button type="button" className="auth-btn auth-btn--login" onClick={loginWithGoogle}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 4 }}>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
        )}
      </div>
    </nav>
  );
}
