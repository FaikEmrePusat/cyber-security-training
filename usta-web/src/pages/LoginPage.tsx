import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { supabase, supabaseConfigured } from '../lib/supabase'
import { useUsta } from '../state/UstaProvider'

const DEFAULT_EMAIL = 'faikemrep@gmail.com'

export function LoginPage() {
  const { session, cloudReady } = useUsta()
  const [email, setEmail] = useState(DEFAULT_EMAIL)
  const [msg, setMsg] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [code, setCode] = useState('')

  const sendLink = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase) {
      setMsg('Cloud is not configured on this install. Now still works offline.')
      return
    }
    setBusy(true)
    setMsg(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}${import.meta.env.BASE_URL}`,
      },
    })
    setBusy(false)
    if (error) {
      setMsg(error.message)
      return
    }
    setMsg(
      `Check ${email} for the login email. Open the link on this browser, or type the 6-digit code below (use the code in the Android / Windows app).`,
    )
  }

  const verifyCode = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    setBusy(true)
    setMsg(null)
    const { error } = await supabase.auth.verifyOtp({ email, token: code.trim(), type: 'email' })
    setBusy(false)
    setMsg(error ? error.message : 'Signed in.')
  }

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setMsg('Signed out. Data on this browser stays until you clear site data.')
  }

  if (!cloudReady || !supabaseConfigured) {
    return (
      <section>
        <div className="page-head">
          <h1>Sign in</h1>
          <p>Cloud sync is optional. You can use Now without an account.</p>
        </div>
        <p className="hint">
          To sync devices later, follow <code>docs/usta/Supabase-Setup.md</code>, then restart the
          app. Until then, open <Link to="/">Now</Link> and work locally.
        </p>
      </section>
    )
  }

  if (session) {
    return (
      <section>
        <div className="page-head">
          <h1>Account</h1>
          <p>You are signed in. Queue progress syncs when online.</p>
        </div>
        <p className="meta">Signed in as {session.user.email}</p>
        <div className="actions">
          <Link className="btn" to="/">
            Back to Now
          </Link>
          <button type="button" onClick={() => void signOut()}>
            Sign out
          </button>
        </div>
        {msg ? <p className="msg" role="status">{msg}</p> : null}
      </section>
    )
  }

  return (
    <section>
      <div className="page-head">
        <h1>Sign in</h1>
        <p>
          One email link connects this browser to the same Usta state as your other devices. No
          password to invent.
        </p>
      </div>
      <p className="hint">
        Use <strong>{DEFAULT_EMAIL}</strong>. Open the link from Gmail on this same browser.
      </p>
      <form onSubmit={(e) => void sendLink(e)}>
        <label className="field" htmlFor="email">
          Email
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            spellCheck={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="primary" disabled={busy}>
          {busy ? 'Sending…' : 'Send login link'}
        </button>
      </form>
      <form onSubmit={(e) => void verifyCode(e)}>
        <label className="field" htmlFor="otp-code">
          Or enter the 6-digit code from the email
          <input
            id="otp-code"
            name="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6,10}"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </label>
        <button type="submit" disabled={busy || code.trim().length < 6}>
          Sign in with code
        </button>
      </form>
      {msg ? (
        <p className={`msg${msg.toLowerCase().includes('error') ? ' err' : ' ok'}`} role="status">
          {msg}
        </p>
      ) : null}
    </section>
  )
}
