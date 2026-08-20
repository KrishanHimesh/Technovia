import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SERVICES } from '../index.js'

const COLOR_HEX = { 'color-purple': '#7c3aed', 'color-cyan': '#06b6d4', 'color-green': '#10b981' }

export default function ServicesInteractive() {
  const [active, setActive] = useState(0)
  const [openMobile, setOpenMobile] = useState(null)
  const activeService = SERVICES[active]

  return (
    <section className="services-interactive">
      <div className="section-header">
        <div className="section-tag in-view">What We Offer</div>
        <h2 className="section-title in-view">
          Our <span className="gradient-text">Services</span>
        </h2>
      </div>

      {/* Desktop: hover-driven row list with a background preview */}
      <div className="svci-desktop">
        <div className="svci-list" onMouseLeave={() => setActive(active)}>
          {SERVICES.map((s, i) => (
            <button
              key={s.id}
              className={`svci-row${active === i ? ' active' : ''}`}
              onMouseEnter={() => setActive(i)}
              data-cursor="VIEW"
            >
              <span className="svci-num">0{i + 1}</span>
              <span className="svci-title">{s.title}</span>
              <span className="svci-arrow" aria-hidden="true">→</span>
            </button>
          ))}
        </div>
        <div
          className="svci-preview"
          style={{ backgroundImage: `url(${activeService.image})` }}
        >
          <div className="svci-preview-overlay" style={{ '--accent': COLOR_HEX[activeService.colorClass] }} />
          <div className="svci-preview-body">
            <ul className="svci-preview-list">
              {activeService.items.slice(0, 4).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link to="/services" className="svci-preview-link">Explore Services →</Link>
          </div>
        </div>
      </div>

      {/* Mobile: touch-friendly expandable rows */}
      <div className="svci-mobile">
        {SERVICES.map((s, i) => {
          const open = openMobile === i
          return (
            <div key={s.id} className={`svci-mrow${open ? ' open' : ''}`}>
              <button className="svci-mrow-head" onClick={() => setOpenMobile(open ? null : i)}>
                <span className="svci-num">0{i + 1}</span>
                <span className="svci-title">{s.title}</span>
                <span className="svci-mrow-toggle" aria-hidden="true">{open ? '−' : '+'}</span>
              </button>
              {open && (
                <div className="svci-mrow-body">
                  <ul className="svci-preview-list">
                    {s.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <Link to="/services" className="svci-preview-link">Explore Services →</Link>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
