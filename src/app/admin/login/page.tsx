'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Lock, Eye, EyeOff, Shield } from 'lucide-react'
import { COMPANY, COLORS } from '@/lib/brand'

const RED = COLORS.red
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || ''
const FLAG = 'intelet-admin'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (password === ADMIN_PASSWORD && ADMIN_PASSWORD.length > 0) {
      localStorage.setItem(FLAG, '1')
      router.push('/admin')
    } else {
      toast.error('Invalid access key')
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: COLORS.ash }}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] rounded-full blur-3xl"
        style={{ background: `${RED}14` }}
      />

      <div className="relative w-full max-w-md mx-4">
        <div
          className="p-8 relative rounded-2xl"
          style={{
            background: COLORS.white,
            border: `1px solid ${COLORS.ashLine}`,
            boxShadow: '0 12px 40px rgba(0,0,0,0.06)',
          }}
        >
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: COLORS.redSoft, border: `1px solid ${RED}33` }}
            >
              <Shield className="w-8 h-8" style={{ color: RED }} />
            </div>
            <h1 className="font-black text-2xl tracking-tight" style={{ color: COLORS.ink }}>
              Admin Access
            </h1>
            <p
              className="text-xs mt-1 font-mono tracking-widest uppercase"
              style={{ color: COLORS.inkMuted }}
            >
              {COMPANY.name} Management
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                className="block font-mono text-xs tracking-wider mb-1.5 uppercase font-bold"
                style={{ color: RED }}
              >
                Access Key
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-10 rounded-lg text-sm outline-none transition-colors"
                  style={{
                    background: COLORS.ash,
                    border: `1px solid ${COLORS.ashLine}`,
                    color: COLORS.ink,
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = RED)}
                  onBlur={e => (e.currentTarget.style.borderColor = COLORS.ashLine)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: COLORS.inkMuted }}
                  onMouseEnter={e => (e.currentTarget.style.color = RED)}
                  onMouseLeave={e => (e.currentTarget.style.color = COLORS.inkMuted)}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-sm font-black tracking-widest uppercase flex items-center justify-center gap-2 rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(135deg, ${RED}, ${COLORS.redDeep})`,
                color: COLORS.white,
                border: 'none',
                boxShadow: `0 6px 18px ${RED}40`,
              }}
            >
              <Lock className="w-4 h-4" />
              {loading ? 'Unlocking…' : 'Unlock'}
            </button>
          </form>
        </div>

        <p
          className="text-center mt-6 text-[11px] font-mono tracking-widest uppercase"
          style={{ color: COLORS.inkMuted }}
        >
          {COMPANY.tagline}
        </p>
      </div>
    </div>
  )
}
