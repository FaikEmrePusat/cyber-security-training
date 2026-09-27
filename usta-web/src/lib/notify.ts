import type { UstaConfig } from 'usta-core'
import { currentPlatform } from './platform'

/** Device-local preference (not synced): each device opts in separately. */
const PREF_KEY = 'usta-notify'
/** Android ids 1401–1405 = Oak-end reminder Monday–Friday. */
const OAK_END_IDS = [1401, 1402, 1403, 1404, 1405]

export function notificationsEnabled(): boolean {
  return localStorage.getItem(PREF_KEY) === '1'
}

async function requestPermission(): Promise<boolean> {
  const platform = currentPlatform()
  if (platform === 'android') {
    const { LocalNotifications } = await import('@capacitor/local-notifications')
    const p = await LocalNotifications.requestPermissions()
    return p.display === 'granted'
  }
  if (platform === 'tauri') {
    const n = await import('@tauri-apps/plugin-notification')
    if (await n.isPermissionGranted()) return true
    return (await n.requestPermission()) === 'granted'
  }
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  return (await Notification.requestPermission()) === 'granted'
}

export async function setNotificationsEnabled(on: boolean, config: UstaConfig): Promise<boolean> {
  if (on && !(await requestPermission())) {
    localStorage.removeItem(PREF_KEY)
    return false
  }
  if (on) localStorage.setItem(PREF_KEY, '1')
  else localStorage.removeItem(PREF_KEY)
  await syncScheduledReminders(config)
  return on
}

/** Immediate notification (desktop / web). Android relies on scheduled reminders instead. */
export async function notifyNow(title: string, body: string): Promise<void> {
  if (!notificationsEnabled()) return
  const platform = currentPlatform()
  try {
    if (platform === 'tauri') {
      const n = await import('@tauri-apps/plugin-notification')
      n.sendNotification({ title, body })
    } else if (platform === 'web' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, tag: 'usta-next' })
    }
  } catch {
    /* notifications are best-effort */
  }
}

/** Must match TRAY_ID in src-tauri/src/lib.rs. */
const TRAY_ID = 'usta-tray'

/** Windows tray tooltip shows the current next action (tooltips cap at ~127 chars). */
export async function updateTrayTooltip(title: string): Promise<void> {
  if (currentPlatform() !== 'tauri') return
  try {
    const { TrayIcon } = await import('@tauri-apps/api/tray')
    const tray = await TrayIcon.getById(TRAY_ID)
    await tray?.setTooltip(`Usta — ${title}`.slice(0, 120))
  } catch {
    /* tray is optional */
  }
}

/**
 * Android: JS does not run while the app is closed, so the Oak-end cue is a native
 * weekly schedule (device clock; assumes the phone is set to Istanbul time).
 */
export async function syncScheduledReminders(config: UstaConfig): Promise<void> {
  if (currentPlatform() !== 'android') return
  const { LocalNotifications, Weekday } = await import('@capacitor/local-notifications')
  await LocalNotifications.cancel({ notifications: OAK_END_IDS.map((id) => ({ id })) })
  if (!notificationsEnabled()) return
  const weekdays = [Weekday.Monday, Weekday.Tuesday, Weekday.Wednesday, Weekday.Thursday, Weekday.Friday]
  await LocalNotifications.schedule({
    notifications: weekdays.map((weekday, i) => ({
      id: OAK_END_IDS[i]!,
      title: 'Oak is over',
      body: 'Open Usta for your next action.',
      schedule: {
        on: { weekday, hour: config.oakEndHour, minute: config.oakEndMinute },
        allowWhileIdle: true,
      },
    })),
  })
}
