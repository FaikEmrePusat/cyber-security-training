/** Europe/Istanbul clock helpers (no extra deps). */

const ISTANBUL = 'Europe/Istanbul'

export function getTimeZone(configTz?: string): string {
  return configTz || ISTANBUL
}

/** Parts of `date` as wall clock in the given IANA zone. */
export function zonedParts(
  date: Date,
  timeZone: string,
): {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
  weekday: number
} {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    weekday: 'short',
  })
  const map: Record<string, string> = {}
  for (const p of fmt.formatToParts(date)) {
    if (p.type !== 'literal') map[p.type] = p.value
  }
  const weekdayName = map.weekday
  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  }
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
    second: Number(map.second),
    weekday: weekdayMap[weekdayName] ?? 0,
  }
}

/** YYYY-MM-DD in zone. */
export function calendarDateKey(date: Date, timeZone: string): string {
  const p = zonedParts(date, timeZone)
  return `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`
}

export function minutesSinceMidnight(date: Date, timeZone: string): number {
  const p = zonedParts(date, timeZone)
  return p.hour * 60 + p.minute
}

export function isWeekday(date: Date, timeZone: string): boolean {
  const d = zonedParts(date, timeZone).weekday
  return d >= 1 && d <= 5
}

export function hmToMinutes(hour: number, minute: number): number {
  return hour * 60 + minute
}

/**
 * Build a Date that represents local wall time in `timeZone` on the same
 * calendar day as `ref` (approximate via iterative offset — good enough for prayer windows).
 */
export function zonedWallTimeOnDay(
  ref: Date,
  timeZone: string,
  hour: number,
  minute: number,
): Date {
  const p = zonedParts(ref, timeZone)
  // Start from UTC guess
  let guess = new Date(Date.UTC(p.year, p.month - 1, p.day, hour, minute, 0))
  for (let i = 0; i < 3; i++) {
    const got = zonedParts(guess, timeZone)
    const wantMin = hour * 60 + minute
    const gotMin = got.hour * 60 + got.minute
    const dayDrift =
      (p.year - got.year) * 525600 +
      (p.month - got.month) * 43800 +
      (p.day - got.day) * 1440
    guess = new Date(guess.getTime() + (wantMin - gotMin + dayDrift) * 60_000)
  }
  return guess
}
