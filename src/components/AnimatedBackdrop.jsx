import { useEffect, useRef } from 'react'

// Cinematic accent trios per variant — used to color the circuit traces
// and their travelling signal pulses.
const PALETTES = {
  purple: ['139,92,246', '34,211,238', '52,211,153'],
  cyan:   ['34,211,238', '139,92,246', '52,211,153'],
}

// ── geometry helpers ────────────────────────────────────────────────────────
function dist(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y)
}
function lerpTowards(from, to, amt) {
  const dx = to.x - from.x, dy = to.y - from.y
  const len = Math.hypot(dx, dy) || 1
  const t = Math.min(amt, len) / len
  return { x: from.x + dx * t, y: from.y + dy * t }
}
// Cuts each interior corner of a right-angle polyline to a 45° chamfer,
// giving the trace the look of real PCB routing instead of blocky right angles.
function chamfer(pts, size) {
  if (pts.length < 3) return pts.slice()
  const out = [pts[0]]
  for (let i = 1; i < pts.length - 1; i++) {
    const prev = pts[i - 1], cur = pts[i], next = pts[i + 1]
    const c1 = Math.min(size, dist(prev, cur) * 0.5)
    const c2 = Math.min(size, dist(cur, next) * 0.5)
    out.push(lerpTowards(cur, prev, c1), lerpTowards(cur, next, c2))
  }
  out.push(pts[pts.length - 1])
  return out
}
function arcLengths(poly) {
  const cum = [0]
  for (let i = 1; i < poly.length; i++) cum.push(cum[i - 1] + dist(poly[i - 1], poly[i]))
  return cum
}
function pointAt(poly, cum, d) {
  const total = cum[cum.length - 1]
  if (d <= 0) return poly[0]
  if (d >= total) return poly[poly.length - 1]
  for (let i = 1; i < cum.length; i++) {
    if (cum[i] >= d) {
      const segLen = cum[i] - cum[i - 1]
      const t = segLen === 0 ? 0 : (d - cum[i - 1]) / segLen
      const a = poly[i - 1], b = poly[i]
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
    }
  }
  return poly[poly.length - 1]
}
// Random-walks a right-angle trace across a grid: a handful of straight
// runs of 1-3 cells, turning ±90° each time (never doubling back).
function buildPath(cellSize, colRange, rowRange) {
  const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]]
  let col = colRange[0] + Math.floor(Math.random() * (colRange[1] - colRange[0]))
  let row = rowRange[0] + Math.floor(Math.random() * (rowRange[1] - rowRange[0]))
  let dir = Math.floor(Math.random() * 4)
  const grid = [[col, row]]
  const turns = 5 + Math.floor(Math.random() * 4)
  for (let i = 0; i < turns; i++) {
    const stepLen = 1 + Math.floor(Math.random() * 3)
    col += DIRS[dir][0] * stepLen
    row += DIRS[dir][1] * stepLen
    grid.push([col, row])
    dir = (dir + (Math.random() < 0.5 ? 1 : 3)) % 4
  }
  const rawPts = grid.map(([c, r]) => ({ x: c * cellSize, y: r * cellSize }))
  const poly = chamfer(rawPts, Math.min(cellSize * 0.4, 18))
  const cum = arcLengths(poly)
  return { rawPts, poly, cum, total: cum[cum.length - 1] }
}

// A quiet, premium circuit-board backdrop: thin traces with 45° corners and
// via pads, each carrying a glowing signal pulse that loops along its length.
// Renders once as a static frame when prefers-reduced-motion is set.
export default function AnimatedBackdrop({ variant = 'purple', density = 1 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const colors = PALETTES[variant] || PALETTES.purple

    let width, height, dpr
    let paths = []
    let raf
    let parentEl = canvas.parentElement
    const startTime = performance.now()

    const resize = () => {
      const rect = parentEl.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const isMobile = width < 700
      const cellSize = Math.max(46, Math.min(76, width / 16))
      const cols = Math.ceil(width / cellSize)
      const rows = Math.ceil(height / cellSize)
      const count = Math.max(3, Math.round((isMobile ? 5 : 8) * density))

      paths = Array.from({ length: count }, (_, i) => {
        const p = buildPath(cellSize, [-2, cols + 2], [-2, rows + 2])
        return {
          ...p,
          colorRGB: colors[i % colors.length],
          speed: 0.045 + Math.random() * 0.05,
          phase: Math.random() * 4000,
          gap: p.total * (0.5 + Math.random() * 0.4),
        }
      })
    }

    const drawStatic = (p) => {
      ctx.strokeStyle = `rgba(${p.colorRGB},0.16)`
      ctx.lineWidth = 1.3
      ctx.beginPath()
      p.poly.forEach((pt, i) => (i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)))
      ctx.stroke()

      p.rawPts.forEach((pt, i) => {
        const isEnd = i === 0 || i === p.rawPts.length - 1
        ctx.beginPath()
        ctx.fillStyle = `rgba(${p.colorRGB},${isEnd ? 0.5 : 0.32})`
        ctx.arc(pt.x, pt.y, isEnd ? 3.2 : 2, 0, Math.PI * 2)
        ctx.fill()
        if (isEnd) {
          ctx.beginPath()
          ctx.strokeStyle = `rgba(${p.colorRGB},0.35)`
          ctx.lineWidth = 1
          ctx.arc(pt.x, pt.y, 6.5, 0, Math.PI * 2)
          ctx.stroke()
        }
      })
    }

    const drawPulse = (p, elapsed) => {
      const cycle = p.total + p.gap
      const t = (elapsed * p.speed + p.phase) % cycle
      if (t > p.total) return

      const trailLen = 90, steps = 10
      for (let i = 0; i < steps; i++) {
        const d0 = t - (i / steps) * trailLen
        const d1 = t - ((i + 1) / steps) * trailLen
        if (d1 < 0 && d0 < 0) break
        const a = pointAt(p.poly, p.cum, Math.max(d0, 0))
        const b = pointAt(p.poly, p.cum, Math.max(d1, 0))
        const alpha = 0.5 * (1 - i / steps)
        ctx.strokeStyle = `rgba(${p.colorRGB},${alpha})`
        ctx.lineWidth = 2.4 * (1 - (i / steps) * 0.6)
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
      }

      const head = pointAt(p.poly, p.cum, t)
      const grad = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 11)
      grad.addColorStop(0, `rgba(${p.colorRGB},0.95)`)
      grad.addColorStop(1, `rgba(${p.colorRGB},0)`)
      ctx.fillStyle = grad
      ctx.beginPath(); ctx.arc(head.x, head.y, 11, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.fillStyle = 'rgba(255,255,255,0.95)'
      ctx.arc(head.x, head.y, 1.6, 0, Math.PI * 2); ctx.fill()
    }

    const paint = (elapsed) => {
      ctx.clearRect(0, 0, width, height)
      paths.forEach((p) => { drawStatic(p); drawPulse(p, elapsed) })
    }

    const tick = (now) => {
      paint(now - startTime)
      raf = requestAnimationFrame(tick)
    }

    resize()
    if (reduceMotion) {
      paint(0)
    } else {
      raf = requestAnimationFrame(tick)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(parentEl)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [variant, density])

  return <canvas ref={canvasRef} className="animated-backdrop" aria-hidden="true" />
}
