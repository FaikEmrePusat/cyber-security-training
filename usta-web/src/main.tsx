import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// GitHub Pages deep links arrive via 404.html as ?redirect=/week etc.
const redirect = new URLSearchParams(window.location.search).get('redirect')
if (redirect && redirect.startsWith('/')) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  window.history.replaceState(null, '', `${base}${redirect}${window.location.hash}`)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
