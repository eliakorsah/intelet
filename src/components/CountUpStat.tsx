'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  value: string   // e.g. "20+", "1000+", "8", "24/7"
  label: string
  delay?: number
  color: string
}

function parseNumeric(val: string): { num: number; suffix: string } {
  const match = val.match(/^(\d+)(.*)$/)
  if (!match) return { num: 0, suffix: val }
  return { num: parseInt(match[1], 10), suffix: match[2] }
}

export default function CountUpStat({ value, label, delay = 0, color }: Props) {
  const ref      = useRef<HTMLDivElement>(null)
  const [count,  setCount]  = useState(0)
  const [visible, setVisible] = useState(false)
  const { num, suffix } = parseNumeric(value)
  const isStatic = num === 0 // "24/7" etc.

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible || isStatic) return
    const duration = 1200
    const steps    = 50
    const stepTime = duration / steps
    const increment = num / steps
    let current = 0
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        current += increment
        if (current >= num) { setCount(num); clearInterval(interval) }
        else setCount(Math.floor(current))
      }, stepTime)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timer)
  }, [visible, num, delay, isStatic])

  return (
    <div
      ref={ref}
      style={{
        animation: visible ? `statBounceIn 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms both` : 'none',
        opacity: visible ? undefined : 0,
      }}
    >
      <div
        className="font-heading font-black tracking-tighter leading-none mb-1.5"
        style={{ fontSize: '2.8rem', color }}
      >
        {isStatic ? value : `${count}${suffix}`}
      </div>
      <div className="text-[10px] font-mono tracking-[0.2em] uppercase" style={{ color: '#9ca3af' }}>
        {label}
      </div>
    </div>
  )
}
