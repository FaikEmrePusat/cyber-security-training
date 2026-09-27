import { Link, NavLink, Outlet } from 'react-router-dom'
import { useUsta } from '../state/UstaProvider'
import './layout.css'

export function AppLayout() {
  const { cloudReady, session } = useUsta()
  const syncLabel = !cloudReady
    ? 'Local only'
    : session
      ? 'Synced'
      : 'Sign in to sync'

  return (
    <div className="shell">
      <a className="skip-link" href="#main">
        Skip to command
      </a>
      <header className="top">
        <div className="brand-row">
          <Link to="/" className="brand" translate="no">
            Usta<span>.</span>
          </Link>
          <span
            className={`sync-pill${session ? ' ok' : ''}`}
            title={
              cloudReady
                ? session
                  ? 'Phone and PC share the same queue when online'
                  : 'Cloud is ready — open Account and sign in'
                : 'Works on this browser without cloud'
            }
          >
            {syncLabel}
          </span>
        </div>
        <p className="tag">Your coach shows one next action. Do it, press Done, get the next.</p>
        <nav className="nav" aria-label="Main">
          <NavLink to="/" end>
            Now
          </NavLink>
          <NavLink to="/week">Weekend</NavLink>
          <NavLink to="/review">Review</NavLink>
          <NavLink to="/guide">How to use</NavLink>
          <NavLink to="/settings">Settings</NavLink>
          <NavLink to="/login">{session ? 'Account' : 'Sign in'}</NavLink>
        </nav>
      </header>
      <main id="main" className="main">
        <Outlet />
      </main>
    </div>
  )
}
