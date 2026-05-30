import { Link } from 'react-router-dom'
import { FOOTER_SERVICES, FOOTER_CONTACTS, NAV_LINKS } from '../index.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">

          {/* Brand */}
          <div>
            <Link to="/" className="nav-brand" style={{ textDecoration: 'none' }}>
              <div className="nav-logo-icon" style={{ width: 32, height: 32, fontSize: 16 }}>⚡</div>
              <span className="nav-brand-name" style={{ fontSize: 18 }}>Technovia</span>
            </Link>
            <p className="footer-tagline">
              Your trusted partner in IT solutions, drone services, and CNC
              programming. Based in Cheltenham, VIC.
            </p>
          </div>

          {/* Services */}
          <div>
            <div className="footer-col-heading purple">Our Services</div>
            {FOOTER_SERVICES.map((s) => (
              <Link key={s} to="/services" className="footer-link">{s}</Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div className="footer-col-heading cyan">Contact Us</div>
            {FOOTER_CONTACTS.map((c) => (
              <div key={c.text} className="footer-contact-item">
                <span style={{ fontSize: 16 }}>{c.icon}</span>
                <span>{c.text}</span>
              </div>
            ))}
          </div>

        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Technovia. All rights reserved.</span>
          <span>Cheltenham, VIC, Australia</span>
        </div>
      </div>
    </footer>
  )
}
