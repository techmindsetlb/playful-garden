import { useState, useEffect, useRef } from 'react'

export default function PullCord({ theme, onToggle }) {
  const canvasRef = useRef(null)
  const ropeRef = useRef(null)
  const isPulling = useRef(false)
  const animationId = useRef(null)
  const points = useRef([])
  const mouseY = useRef(0)
  const mouseGlobalY = useRef(0)
  const [pulled, setPulled] = useState(false)
  const pullProgress = useRef(0)
  const knobAnimating = useRef(false)

  const SEGMENTS = 20
  const ROPE_LENGTH = 200
  const SEGMENT_LENGTH = ROPE_LENGTH / SEGMENTS
  const ANCHOR_X = 120
  const ANCHOR_Y = -20
  const KNOB_RADIUS = 14
  const THRESHOLD = 120

  useEffect(() => {
    // Initialize rope points
    const pts = []
    for (let i = 0; i <= SEGMENTS; i++) {
      const t = i / SEGMENTS
      pts.push({
        x: ANCHOR_X,
        y: ANCHOR_Y + t * ROPE_LENGTH,
        prevX: ANCHOR_X,
        prevY: ANCHOR_Y + t * ROPE_LENGTH,
        pinned: i === 0,
      })
    }
    points.current = pts
    ropeRef.current = pts

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)
    }
    resize()
    window.addEventListener('resize', resize)

    // Physics update
    const update = () => {
      const pts = ropeRef.current
      if (!pts) return

      const gravity = 0.15
      const damping = 0.99
      const stiffness = 0.5

      // Verlet integration
      for (let i = 1; i < pts.length; i++) {
        const p = pts[i]
        if (p.pinned) continue

        const vx = (p.x - p.prevX) * damping
        const vy = (p.y - p.prevY) * damping

        p.prevX = p.x
        p.prevY = p.y

        p.x += vx
        p.y += vy + gravity
      }

      // If pulling, constrain last point to mouse
      if (isPulling.current) {
        const last = pts[pts.length - 1]
        last.prevX = last.x
        last.prevY = last.y
        last.x = ANCHOR_X
        last.y = Math.max(ANCHOR_Y + 10, mouseGlobalY.current)

        // Check pull distance
        const pullDistance = last.y - (ANCHOR_Y + ROPE_LENGTH)
        if (pullDistance > 0) {
          if (pullDistance > THRESHOLD && !knobAnimating.current) {
            knobAnimating.current = true
            setPulled(prev => !prev)
            onToggle()
            setTimeout(() => { knobAnimating.current = false }, 500)
          }
        }
      }

      // Distance constraints (forward)
      for (let iter = 0; iter < 5; iter++) {
        for (let i = 0; i < pts.length - 1; i++) {
          const p1 = pts[i]
          const p2 = pts[i + 1]
          const dx = p2.x - p1.x
          const dy = p2.y - p1.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist === 0) continue
          const diff = (dist - SEGMENT_LENGTH) / dist * stiffness
          const ox = dx * diff * 0.5
          const oy = dy * diff * 0.5

          if (!p1.pinned) {
            p1.x += ox
            p1.y += oy
            p1.x = Math.max(10, Math.min(230, p1.x))
          }
          p2.x -= ox
          p2.y -= oy
          p2.x = Math.max(10, Math.min(230, p2.x))
        }
      }

      // Keep anchor at position
      pts[0].x = ANCHOR_X
      pts[0].y = ANCHOR_Y

      // Draw
      draw(ctx, pts)
      animationId.current = requestAnimationFrame(update)
    }

    animationId.current = requestAnimationFrame(update)
    return () => {
      cancelAnimationFrame(animationId.current)
      window.removeEventListener('resize', resize)
    }
  }, [onToggle])

  const draw = (ctx, pts) => {
    const w = 240
    const h = 280
    ctx.clearRect(0, 0, w, h)

    const isDark = theme === 'dark'

    // Draw rope
    ctx.beginPath()
    ctx.moveTo(pts[0].x, pts[0].y)
    for (let i = 1; i < pts.length - 1; i++) {
      const p = pts[i]
      ctx.lineTo(p.x, p.y)
    }
    ctx.strokeStyle = isDark ? '#8d6e63' : '#d7ccc8'
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw knob (pom-pom ball)
    const last = pts[pts.length - 1]
    // Glow
    const gradient = ctx.createRadialGradient(last.x, last.y, 2, last.x, last.y, KNOB_RADIUS + 8)
    gradient.addColorStop(0, isDark ? '#f06292' : '#f48fb1')
    gradient.addColorStop(1, 'transparent')
    ctx.beginPath()
    ctx.arc(last.x, last.y, KNOB_RADIUS + 8, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.fill()

    // Main knob
    ctx.beginPath()
    ctx.arc(last.x, last.y, KNOB_RADIUS, 0, Math.PI * 2)
    const knobGrad = ctx.createRadialGradient(last.x - 3, last.y - 3, 2, last.x, last.y, KNOB_RADIUS)
    knobGrad.addColorStop(0, isDark ? '#f06292' : '#f48fb1')
    knobGrad.addColorStop(1, isDark ? '#d81b60' : '#c2185b')
    ctx.fillStyle = knobGrad
    ctx.fill()
    ctx.strokeStyle = isDark ? '#ec407a' : '#d81b60'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Highlight on knob
    ctx.beginPath()
    ctx.arc(last.x - 4, last.y - 4, KNOB_RADIUS * 0.35, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.fill()

    // Ceiling mount
    ctx.beginPath()
    ctx.arc(pts[0].x, pts[0].y + 4, 8, 0, Math.PI * 2)
    ctx.fillStyle = isDark ? '#5d4037' : '#a1887f'
    ctx.fill()

    // Instruction text
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(62,39,35,0.4)'
    ctx.font = '10px Quicksand, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('pull me!', last.x, last.y + KNOB_RADIUS + 16)
  }

  const handlePointerDown = (e) => {
    isPulling.current = true
    const rect = canvasRef.current.getBoundingClientRect()
    const y = e.clientY - rect.top
    mouseGlobalY.current = y
  }

  const handlePointerMove = (e) => {
    if (!isPulling.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const y = e.clientY - rect.top
    mouseGlobalY.current = y
  }

  const handlePointerUp = () => {
    isPulling.current = false
  }

  return (
    <div className="pullcord-wrapper">
      <canvas
        ref={canvasRef}
        className="pullcord-canvas"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={(e) => {
          e.preventDefault()
          const touch = e.touches[0]
          const rect = canvasRef.current.getBoundingClientRect()
          mouseGlobalY.current = touch.clientY - rect.top
          isPulling.current = true
        }}
        onTouchMove={(e) => {
          e.preventDefault()
          const touch = e.touches[0]
          const rect = canvasRef.current.getBoundingClientRect()
          mouseGlobalY.current = touch.clientY - rect.top
        }}
        onTouchEnd={(e) => {
          e.preventDefault()
          isPulling.current = false
        }}
      />
      <div className="pullcord-info">
        <span className="pullcord-label">Pull the cord to switch themes</span>
        <span className="pullcord-theme">{theme === 'dark' ? '🌙' : '☀️'} {theme === 'dark' ? 'Dark' : 'Light'}</span>
      </div>
    </div>
  )
}
