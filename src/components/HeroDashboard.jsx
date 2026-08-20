import { useEffect, useRef, useState } from 'react'

const PANELS = [
  {
    id: 'it',
    label: 'IT Support',
    color: '124,58,237',
    metrics: [
      { value: '24/7', label: 'Support Coverage' },
      { value: '100%', label: 'Data Backed Up' },
      { value: '0', label: 'Open Tickets' },
    ],
    log: [
      'Initializing diagnostics',
      'Scanning network — 12 devices found',
      'Checking firewall rules — OK',
      'System health: Optimal',
    ],
    spark: '0,42 14,38 28,44 42,30 56,34 70,18 84,22 100,10',
  },
  {
    id: 'drone',
    label: 'Drone Repair',
    color: '6,182,212',
    metrics: [
      { value: '4', label: 'Rotors Tested' },
      { value: '98%', label: 'Battery Health' },
      { value: 'Ready', label: 'Flight Status' },
    ],
    log: [
      'Running motor test',
      'Calibrating ESCs',
      'Battery cell voltage — balanced',
      'Flight controller: Ready',
    ],
    spark: '0,30 14,34 28,20 42,26 56,14 70,20 84,8 100,16',
  },
  {
    id: 'cnc',
    label: 'CNC Machining',
    color: '16,185,129',
    metrics: [
      { value: '±0.02mm', label: 'Tolerance' },
      { value: '100%', label: 'Path Accuracy' },
      { value: 'Ready', label: 'Machine Status' },
    ],
    log: [
      'Loading G-code',
      'Simulating toolpath',
      'Checking tolerances — within spec',
      'Ready to cut',
    ],
    spark: '0,20 14,24 28,16 42,22 56,12 70,16 84,6 100,14',
  },
]

function Sparkline({ points, color }) {
  const pathRef = useRef(null)
  useEffect(() => {
    const path = pathRef.current
    if (!path) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const len = path.getTotalLength()
    path.style.strokeDasharray = len
    path.style.strokeDashoffset = reduceMotion ? 0 : len
    if (!reduceMotion) {
      requestAnimationFrame(() => {
        path.style.transition = 'stroke-dashoffset 1.1s cubic-bezier(0.16,1,0.3,1)'
        path.style.strokeDashoffset = 0
      })
    }
  }, [points])

  return (
    <svg viewBox="0 0 100 48" preserveAspectRatio="none" className="spark-svg">
      <polyline
        points={points}
        fill="none"
        stroke={`rgba(${color},0.15)`}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        ref={pathRef}
        points={points}
        fill="none"
        stroke={`rgb(${color})`}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function HeroDashboard() {
  const [active, setActive] = useState(0)
  const panel = PANELS[active]

  return (
    <div className="hd-wrap">
      <div className="hd-tabs">
        {PANELS.map((p, i) => (
          <button
            key={p.id}
            className={`hd-tab${i === active ? ' active' : ''}`}
            onClick={() => setActive(i)}
            style={{ '--tab-color': p.color }}
            data-cursor="VIEW"
          >
            {p.label}
            <span className="hd-tab-underline" />
          </button>
        ))}
      </div>

      <div className="hd-panel">
        <div className="hd-panel-main">
          <div className="hd-status-row">
            <span className="hd-status-dot" style={{ background: `rgb(${panel.color})`, boxShadow: `0 0 8px rgb(${panel.color})` }} />
            <span className="hd-status-text">Live status</span>
          </div>

          <div className="hd-metrics">
            {panel.metrics.map((m) => (
              <div key={m.label} className="hd-metric">
                <div className="hd-metric-value">{m.value}</div>
                <div className="hd-metric-label">{m.label}</div>
              </div>
            ))}
          </div>

          <div className="hd-spark-wrap" key={panel.id}>
            <Sparkline points={panel.spark} color={panel.color} />
          </div>
        </div>

        <div className="hd-log" key={panel.id}>
          {panel.log.map((line, i) => (
            <div key={line} className="hd-log-line" style={{ animationDelay: `${i * 0.28}s` }}>
              <span className="hd-log-index">{String(i + 1).padStart(2, '0')}</span>
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
