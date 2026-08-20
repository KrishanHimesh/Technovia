import { useEffect, useRef } from 'react'

const PALETTES = {
  purple: ['124,58,237', '6,182,212'],
  cyan:   ['6,182,212', '124,58,237'],
}

// A quiet, premium network animation: drifting nodes connected by thin lines
// that brighten with proximity, plus a couple of slow-moving glow orbs.
// Renders once as a static frame when prefers-reduced-motion is set.
export default function AnimatedBackdrop({ variant = 'purple', density = 1 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const [c1, c2] = PALETTES[variant] || PALETTES.purple

    let width, height, dpr
    let nodes = []
    let raf
    let parentEl = canvas.parentElement

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
      const count = Math.round((isMobile ? 26 : 46) * density)
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.6 + 0.6,
      }))
    }

    const linkDist = 130

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = `rgba(${c1},0.5)`
      nodes.forEach((n) => {
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    const tick = () => {
      ctx.clearRect(0, 0, width, height)

      nodes.forEach((n) => {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > width) n.vx *= -1
        if (n.y < 0 || n.y > height) n.vy *= -1
      })

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < linkDist) {
            const alpha = (1 - dist / linkDist) * 0.35
            ctx.strokeStyle = `rgba(${c2},${alpha})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      ctx.fillStyle = `rgba(${c1},0.75)`
      nodes.forEach((n) => {
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fill()
      })

      raf = requestAnimationFrame(tick)
    }

    resize()
    if (reduceMotion) {
      drawStatic()
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
