'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'none'
  duration?: number
  className?: string
  distance?: number
}

const getHidden = (direction: string, distance: number): React.CSSProperties => {
  switch (direction) {
    case 'up':    return { opacity: 0, transform: `translateY(${distance}px)` }
    case 'down':  return { opacity: 0, transform: `translateY(-${distance}px)` }
    case 'left':  return { opacity: 0, transform: `translateX(${distance}px)` }
    case 'right': return { opacity: 0, transform: `translateX(-${distance}px)` }
    case 'scale': return { opacity: 0, transform: 'scale(0.88)' }
    default:      return { opacity: 0 }
  }
}

const VISIBLE: React.CSSProperties = { opacity: 1, transform: 'translate(0,0) scale(1)' }

export default function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  duration = 700,
  className = '',
  distance = 40,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  // Start as null — server renders no style at all
  const [state, setState] = useState<'server' | 'hidden' | 'visible'>('server')

  // After first paint: set to hidden (now client-owned), then watch intersection
  useEffect(() => {
    setState('hidden')
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('visible')
          observer.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Server render: no style — React can hydrate cleanly
  if (state === 'server') {
    return <div ref={ref} className={className}>{children}</div>
  }

  const hiddenStyle = getHidden(direction, distance)
  const currentStyle = state === 'visible' ? VISIBLE : hiddenStyle
  const transition = `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, filter ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...currentStyle,
        transition,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}