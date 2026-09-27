import { Link } from 'react-router-dom'

export function GuidePage() {
  return (
    <section>
      <div className="page-head">
        <h1>How to use Usta</h1>
        <p>
          Usta is not a dashboard of hobbies. It is a coach that names one job at a time so you do not
          redesign your day every hour.
        </p>
      </div>

      <ol className="guide-steps">
        <li>
          <strong>Start on Now</strong>
          Every visit begins here. Read the big command, do that work only, press{' '}
          <em>Done — next</em>. The chips above the command show what you already finished today.
        </li>
        <li>
          <strong>Weekday rhythm</strong>
          10:00–14:00 Istanbul = Oak class (no other domain). After the short transition, the queue
          is: Cyber → German → Qur’an page → Cevşen bab → other faith page → ~10 book pages → music
          piece → share a prepared post if any.
        </li>
        <li>
          <strong>Weekend rhythm</strong>
          10:00–14:00 = personal software / cyber project. After that: finish Draft posts for next
          week, then the same life domains. Plan it on <Link to="/week">Weekend</Link> — Sunday
          evening close sets next weekend’s project; weekday Share publishes your Ready posts.
        </li>
        <li>
          <strong>Buttons on Now</strong>
          <em>Done — next</em> marks the current block finished. <em>Snooze 15m</em> pauses (max
          2/day; blocked during Oak). <em>Energy low</em> shrinks today’s duty to cyber + German
          only. <em>Open Ledger</em> appears for cyber/German blocks.
        </li>
        <li>
          <strong>Settings once</strong>
          Paste your own faith cues, set Ledger URL (local or GitHub Pages), lat/lon for prayer
          timing, block cap (~50 min). Save. See <Link to="/settings">Settings</Link>.
        </li>
        <li>
          <strong>Sign in to sync</strong>
          Phone and PC stay aligned when you sign in with your Gmail magic link. Local-only still
          works without cloud. See <Link to="/login">Sign in</Link>.
        </li>
        <li>
          <strong>Review on Sunday</strong>
          Check how many days the five core domains got real blocks — not how many apps you opened.
          See <Link to="/review">Review</Link>.
        </li>
      </ol>

      <h2
        style={{
          fontFamily: 'var(--font-voice)',
          fontSize: '1.2rem',
          margin: '0 0 0.75rem',
        }}
      >
        Where to click
      </h2>
      <div className="page-grid">
        <Link className="page-card" to="/">
          <h3>Now</h3>
          <p>The only screen you need most days. One command + Done.</p>
        </Link>
        <Link className="page-card" to="/week">
          <h3>Weekend</h3>
          <p>Project plan, post list (Draft / Ready / Published), life checklist, Sunday close.</p>
        </Link>
        <Link className="page-card" to="/review">
          <h3>Review</h3>
          <p>See fidelity: which days kept the queue.</p>
        </Link>
        <Link className="page-card" to="/settings">
          <h3>Settings</h3>
          <p>Templates, Ledger link, prayer location, sync.</p>
        </Link>
        <Link className="page-card" to="/login">
          <h3>Sign in</h3>
          <p>Connect phone and PC through Supabase.</p>
        </Link>
      </div>

      <p className="footer-note">
        Full rule book: <code>docs/usta/Master-Plan.md</code> in the project folder. Cyber Ledger
        stays the cyber + German craft bench — Usta only sends you there.
      </p>
    </section>
  )
}
