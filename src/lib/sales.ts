'use client'

import { useEffect, useState } from 'react'

const FLAG = 'intelet-admin'

export type Role = 'boss' | 'admin' | 'cashier' | null

/** Legacy API — now reads the password-gate flag from localStorage. */
export async function fetchRole(): Promise<Role> {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(FLAG) === '1' ? 'boss' : null
}

/** React hook — exposes {role, userId, loading, isBoss}. */
export function useRole() {
  const [role, setRole] = useState<Role>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unlocked = typeof window !== 'undefined' && localStorage.getItem(FLAG) === '1'
    setRole(unlocked ? 'boss' : null)
    setLoading(false)

    const onStorage = (e: StorageEvent) => {
      if (e.key === FLAG) setRole(e.newValue === '1' ? 'boss' : null)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return { role, userId: null as string | null, loading, isBoss: role === 'boss' }
}

/** Session idle-timeout: clears the admin flag after N minutes of no interaction. */
export function useIdleSignOut(minutes = 30) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    let timer: ReturnType<typeof setTimeout>
    const reset = () => {
      clearTimeout(timer)
      timer = setTimeout(() => { localStorage.removeItem(FLAG); location.href = '/admin/login' }, minutes * 60_000)
    }
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'] as const
    events.forEach(e => window.addEventListener(e, reset, { passive: true }))
    reset()
    return () => {
      clearTimeout(timer)
      events.forEach(e => window.removeEventListener(e, reset))
    }
  }, [minutes])
}

export const GHS = (n: number) =>
  `GH₵ ${Number(n || 0).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
