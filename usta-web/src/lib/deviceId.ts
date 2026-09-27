const KEY = 'usta-device-id'

export function getDeviceId(): string {
  try {
    const existing = localStorage.getItem(KEY)
    if (existing) return existing
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `dev-${Date.now()}`
    localStorage.setItem(KEY, id)
    return id
  } catch {
    return `dev-${Date.now()}`
  }
}
