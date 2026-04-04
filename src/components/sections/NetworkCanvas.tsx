'use client'

import { useEffect, useRef, useCallback } from 'react'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  pulse: number
  pulseSpeed: number
}

interface Connection {
  from: number
  to: number
  opacity: number
  flow: number
  flowSpeed: number
}

export default function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number>()
  const nodesRef = useRef<Node[]>([])
  const connectionsRef = useRef<Connection[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })

  const initNodes = useCallback((width: number, height: number) => {
    const count = Math.floor((width * height) / 18000) + 8
    const nodes: Node[] = []
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2.5 + 1.5,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.02,
      })
    }

    // Generate connections between nearby nodes
    const connections: Connection[] = []
    const maxDist = Math.min(width, height) * 0.25
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x
        const dy = nodes[i].y - nodes[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < maxDist && Math.random() > 0.4) {
          connections.push({
            from: i,
            to: j,
            opacity: 0.1 + Math.random() * 0.3,
            flow: Math.random(),
            flowSpeed: 0.005 + Math.random() * 0.01,
          })
        }
      }
    }

    nodesRef.current = nodes
    connectionsRef.current = connections
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      initNodes(canvas.width, canvas.height)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })
    canvas.addEventListener('mousemove', handleMouseMove, { passive: true })

    const primaryColor = '20, 184, 170'
    const accentColor = '94, 234, 218'

    const animate = () => {
      const w = canvas.width
      const h = canvas.height
      const nodes = nodesRef.current
      const connections = connectionsRef.current

      ctx.clearRect(0, 0, w, h)

      // Update and draw connections
      connections.forEach((conn) => {
        conn.flow = (conn.flow + conn.flowSpeed) % 1
        const fromNode = nodes[conn.from]
        const toNode = nodes[conn.to]

        const dx = toNode.x - fromNode.x
        const dy = toNode.y - fromNode.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const maxDist = Math.min(w, h) * 0.25

        if (dist > maxDist) return

        const alpha = conn.opacity * (1 - dist / maxDist)

        // Draw connection line
        ctx.beginPath()
        ctx.moveTo(fromNode.x, fromNode.y)
        ctx.lineTo(toNode.x, toNode.y)
        ctx.strokeStyle = `rgba(${primaryColor}, ${alpha})`
        ctx.lineWidth = 0.8
        ctx.stroke()

        // Draw data flow particle
        const px = fromNode.x + dx * conn.flow
        const py = fromNode.y + dy * conn.flow
        ctx.beginPath()
        ctx.arc(px, py, 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${accentColor}, ${alpha * 2})`
        ctx.fill()
      })

      // Mouse interaction - draw nearby connections
      const mouseX = mouseRef.current.x
      const mouseY = mouseRef.current.y
      const mouseRadius = 150

      nodes.forEach((node) => {
        const dx = mouseX - node.x
        const dy = mouseY - node.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < mouseRadius) {
          ctx.beginPath()
          ctx.moveTo(mouseX, mouseY)
          ctx.lineTo(node.x, node.y)
          const alpha = (1 - dist / mouseRadius) * 0.4
          ctx.strokeStyle = `rgba(${accentColor}, ${alpha})`
          ctx.lineWidth = 0.8
          ctx.stroke()
        }
      })

      // Update and draw nodes
      nodes.forEach((node) => {
        node.x += node.vx
        node.y += node.vy
        node.pulse += node.pulseSpeed

        if (node.x < 0 || node.x > w) node.vx *= -1
        if (node.y < 0 || node.y > h) node.vy *= -1

        const pulseScale = 1 + Math.sin(node.pulse) * 0.3

        // Outer glow ring
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius * pulseScale * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${primaryColor}, 0.05)`
        ctx.fill()

        // Inner node
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius * pulseScale, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${accentColor}, 0.8)`
        ctx.fill()
      })

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [initNodes])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
