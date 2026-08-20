import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { NAV_LINKS } from '../index.js'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Reset the mobile menu on navigation. This is a deliberate UI-reset-on-route-change
  // effect (not derived state), so the set-state-in-effect rule is intentionally relaxed here.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <NavLink to="/" className="nav-brand">
          <div className="nav-logo-icon">
            <img src="/favicon.svg" alt="Technovia logo" className="nav-logo-img" />
          </div>
          <span className="nav-brand-name">Technovia</span>
        </NavLink>

        {/* Desktop links */}
        <div className="nav-links">
          {NAV_LINKS.map(({ label, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {label}
            </NavLink>
          ))}
        </div>

        <NavLink to="/contact" className="nav-cta">
          Start a Project <span aria-hidden="true">↗</span>
        </NavLink>

        {/* Hamburger — visible on mobile */}
        <button
          className={`hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Backdrop */}
      <div
        className={`mobile-overlay${menuOpen ? ' visible' : ''}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Slide-in drawer */}
      <div className={`mobile-drawer${menuOpen ? ' open' : ''}`}>
        <div className="mobile-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="nav-logo-icon" style={{ width: 32, height: 32 }}>
              <img src="/favicon.svg" alt="Technovia logo" className="nav-logo-img" />
            </div>
            <span className="nav-brand-name" style={{ fontSize: 18 }}>Technovia</span>
          </div>
          <button className="mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close">✕</button>
        </div>

        <div className="mobile-nav-links">
          {NAV_LINKS.map(({ label, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="mobile-drawer-footer">
          <a href="tel:0476593934" className="btn-primary" style={{ display: 'block', textAlign: 'center', marginBottom: 12 }}>
            📞 0476 593 934
          </a>
          <a href="mailto:info@technovia.com.au" className="cta-btn-email" style={{ display: 'block', textAlign: 'center' }}>
            ✉ Email Us
          </a>
        </div>
      </div>
    </>
  )
}
