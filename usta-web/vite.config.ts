import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// GitHub Pages serves Usta under the Ledger site: USTA_BASE=/cyber-security-training/usta/
// Local dev, Capacitor, and Tauri use the default root.
const base = process.env.USTA_BASE || '/'

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      'usta-core': path.resolve(__dirname, '../usta-core/src/index.ts'),
    },
  },
  server: {
    port: 5174,
  },
})
