import { useEffect, useRef, useState } from 'react'

const PANELS = [
  {
    id: 'it',
    label: 'IT Support',
    icon: '💻',
    color: '124,58,237',
    log: [
      '> Initializing diagnostics…',
      '> Scanning network… 12 devices found',
      '> Checking firewall rules… OK',
      '> System health: Optimal',
    ],
  },
  {
    id: 'drone',
    label: 'Drone Repair',
    icon: '🛸',
    color: '6,182,212',
    log: [
      '> Running motor test…',
      '> Calibrating ESCs…',
      '> Battery cell voltage: balanced',
      '> Flight controller: Ready',
    ],
  },
  {
    id: 'cnc',
    label: 'CNC Machining',
    icon: '⚙️',
    color: '16,185,129',
    log: [
      '> Loading G-code…',
      '> Simulating toolpath…',
      '> Checking tolerances… within spec',
      '> Ready to cut',
    ],
  },
]

// ── Canvas visualizations, one per panel ────────────────────────────────────
function drawNetwork(ctx, w, h, t, color) {
  const nodes = {
    device: { x: w * 0.14, y: h * 0.5 },
    router: { x: w * 0.5, y: h * 0.5 },
    cloud:  { x: w * 0.86, y: h * 0.32 },
  }
  ctx.clearRect(0, 0, w, h)

  ctx.strokeStyle = `rgba(${color},0.35)`
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(nodes.device.x, nodes.device.y)
  ctx.lineTo(nodes.router.x, nodes.router.y)
  ctx.lineTo(nodes.cloud.x, nodes.cloud.y)
  ctx.stroke()

  // travelling pulse along the path
  const path = [nodes.device, nodes.router, nodes.cloud]
  const total = 2
  const progress = (t % 140) / 140
  const segF = progress * total
  const seg = Math.min(Math.floor(segF), 1)
  const localT = segF - seg
  const a = path[seg], b = path[seg + 1]
  const px = a.x + (b.x - a.x) * localT
  const py = a.y + (b.y - a.y) * localT

  const grad = ctx.createRadialGradient(px, py, 0, px, py, 14)
  grad.addColorStop(0, `rgba(${color},0.9)`)
  grad.addColorStop(1, 'transparent')
  ctx.beginPath(); ctx.arc(px, py, 14, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill()
  ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill()

  // node markers
  Object.values(nodes).forEach((n) => {
    ctx.beginPath()
    ctx.arc(n.x, n.y, 6, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${color},0.9)`
    ctx.fill()
    ctx.beginPath()
    ctx.arc(n.x, n.y, 11, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(${color},0.35)`
    ctx.stroke()
  })
}

function drawDrone(ctx, w, h, t, color) {
  ctx.clearRect(0, 0, w, h)
  const cx = w / 2, cy = h * 0.42
  const armLen = Math.min(w, h) * 0.22
  const rotorR = armLen * 0.32
  const angle = t * 0.25

  const arms = [
    { dx: -1, dy: -1 }, { dx: 1, dy: -1 }, { dx: -1, dy: 1 }, { dx: 1, dy: 1 },
  ]

  ctx.strokeStyle = `rgba(${color},0.5)`
  ctx.lineWidth = 2.5
  arms.forEach(({ dx, dy }) => {
    const rx = cx + dx * armLen, ry = cy + dy * armLen * 0.6
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(rx, ry); ctx.stroke()

    // spinning rotor blades
    ctx.save()
    ctx.translate(rx, ry)
    ctx.rotate(angle * (dx * dy))
    ctx.strokeStyle = `rgba(${color},0.85)`
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(-rotorR, 0); ctx.lineTo(rotorR, 0); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0, -rotorR); ctx.lineTo(0, rotorR); ctx.stroke()
    ctx.restore()

    ctx.beginPath(); ctx.arc(rx, ry, rotorR + 4, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(${color},0.25)`; ctx.lineWidth = 1; ctx.stroke()
  })

  // body
  ctx.fillStyle = `rgba(${color},0.9)`
  ctx.beginPath()
  if (ctx.roundRect) {
    ctx.roundRect(cx - 16, cy - 9, 32, 18, 5)
  } else {
    ctx.rect(cx - 16, cy - 9, 32, 18)
  }
  ctx.fill()

  // battery bar
  const barW = w * 0.4, barX = cx - barW / 2, barY = h * 0.82
  const fill = 0.55 + Math.sin(t * 0.03) * 0.35
  ctx.strokeStyle = 'rgba(255,255,255,0.25)'
  ctx.lineWidth = 1.5
  ctx.strokeRect(barX, barY, barW, 12)
  ctx.fillStyle = `rgba(${color},0.75)`
  ctx.fillRect(barX + 2, barY + 2, (barW - 4) * fill, 8)
}

function drawCNC(ctx, w, h, t, color) {
  ctx.clearRect(0, 0, w, h)
  const gridSize = 22
  ctx.strokeStyle = 'rgba(255,255,255,0.05)'
  ctx.lineWidth = 1
  for (let x = 0; x < w; x += gridSize) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke() }
  for (let y = 0; y < h; y += gridSize) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }

  const pad = Math.min(w, h) * 0.18
  const path = [
    { x: pad, y: pad },
    { x: w - pad, y: pad },
    { x: w - pad, y: h - pad },
    { x: pad, y: h - pad },
    { x: pad, y: pad },
  ]
  const total = path.length - 1
  const cycle = 220
  const progress = (t % cycle) / cycle * total
  const seg = Math.min(Math.floor(progress), total - 1)
  const localT = progress - seg

  // trail so far
  ctx.strokeStyle = `rgba(${color},0.6)`
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(path[0].x, path[0].y)
  for (let i = 1; i <= seg; i++) ctx.lineTo(path[i].x, path[i].y)
  const a = path[seg], b = path[seg + 1]
  const hx = a.x + (b.x - a.x) * localT, hy = a.y + (b.y - a.y) * localT
  ctx.lineTo(hx, hy)
  ctx.stroke()

  // toolhead
  ctx.fillStyle = `rgba(${color},0.95)`
  ctx.fillRect(hx - 4, hy - 4, 8, 8)
  const grad = ctx.createRadialGradient(hx, hy, 0, hx, hy, 16)
  grad.addColorStop(0, `rgba(${color},0.5)`)
  grad.addColorStop(1, 'transparent')
  ctx.beginPath(); ctx.arc(hx, hy, 16, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill()
}

const DRAWERS = { it: drawNetwork, drone: drawDrone, cnc: drawCNC }

function ConsoleCanvas({ panelId, color }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf, w, h, t = 0

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect()
      w = canvas.width = rect.width
      h = canvas.height = rect.height
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = DRAWERS[panelId]
    const loop = () => {
      t += reduceMotion ? 0 : 1
      draw(ctx, w, h, t, color)
      if (!reduceMotion) raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [panelId, color])

  return <canvas ref={canvasRef} className="ic-canvas" />
}

export default function InteractiveConsole() {
  const [active, setActive] = useState(0)
  const panel = PANELS[active]

  return (
    <div className="ic-wrap">
      <div className="ic-tabs">
        {PANELS.map((p, i) => (
          <button
            key={p.id}
            className={`ic-tab${i === active ? ' active' : ''}`}
            onClick={() => setActive(i)}
            style={{ '--tab-color': p.color }}
            data-cursor="VIEW"
          >
            <span className="ic-tab-icon">{p.icon}</span>
            {p.label}
          </button>
        ))}
      </div>

      <div className="ic-panel">
        <div className="ic-canvas-wrap">
          <ConsoleCanvas key={panel.id} panelId={panel.id} color={panel.color} />
          <div className="canvas-corner canvas-corner-tl" />
          <div className="canvas-corner canvas-corner-tr" />
          <div className="canvas-corner canvas-corner-bl" />
          <div className="canvas-corner canvas-corner-br" />
        </div>
        <div className="ic-log" key={panel.id}>
          {panel.log.map((line, i) => (
            <div key={line} className="ic-log-line" style={{ animationDelay: `${i * 0.35}s` }}>
              {line}
            </div>
          ))}
          <div className="ic-log-line ic-log-cursor" style={{ animationDelay: `${panel.log.length * 0.35}s` }}>
            <span className="ic-caret" />
          </div>
        </div>
      </div>
    </div>
  )
}
