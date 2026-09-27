import { Capacitor } from '@capacitor/core'

export type Platform = 'android' | 'tauri' | 'web'

export function currentPlatform(): Platform {
  if (Capacitor.isNativePlatform()) return 'android'
  if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) return 'tauri'
  return 'web'
}
