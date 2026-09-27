import {
  CalculationMethod,
  Coordinates,
  PrayerTimes,
} from 'adhan'
import type { PrayerTimesOfDay, UstaConfig } from './types.js'
import { calendarDateKey, zonedParts } from './time.js'

function pickMethod(name?: string) {
  const methods = CalculationMethod as unknown as Record<
    string,
    () => ReturnType<typeof CalculationMethod.MuslimWorldLeague>
  >
  if (name && typeof methods[name] === 'function') return methods[name]()
  // Turkey method exists in adhan; fall back to MWL
  if (typeof methods.Turkey === 'function') return methods.Turkey()
  return CalculationMethod.MuslimWorldLeague()
}

/**
 * Offline-capable prayer times via `adhan`.
 * Returns null if lat/lon missing — caller may inject PrayerTimesOfDay instead.
 */
export function computePrayerTimes(
  now: Date,
  config: Pick<UstaConfig, 'latitude' | 'longitude' | 'prayerMethod' | 'timezone'>,
): PrayerTimesOfDay | null {
  if (config.latitude == null || config.longitude == null) return null
  const tz = config.timezone || 'Europe/Istanbul'
  const p = zonedParts(now, tz)
  const date = new Date(p.year, p.month - 1, p.day, 12, 0, 0)
  const coords = new Coordinates(config.latitude, config.longitude)
  const params = pickMethod(config.prayerMethod)
  const pt = new PrayerTimes(coords, date, params)
  return {
    fajr: pt.fajr,
    dhuhr: pt.dhuhr,
    asr: pt.asr,
    maghrib: pt.maghrib,
    isha: pt.isha,
  }
}

/** True if `now` is at or after this prayer's start time today. */
export function isAfterPrayer(
  now: Date,
  prayer: keyof PrayerTimesOfDay,
  times: PrayerTimesOfDay,
): boolean {
  const t = times[prayer]
  if (!t) return false
  return now.getTime() >= t.getTime()
}

export function prayerDateKey(
  now: Date,
  timeZone: string,
): string {
  return calendarDateKey(now, timeZone)
}
