import { Link } from 'react-router-dom'
import { FOOTER_SERVICES, FOOTER_CONTACTS, NAV_LINKS } from '../index.js'

const FOOTER_APPS = [
  { label: '🖥️ App Portal',     url: 'https://app.technovia.com.au'     },
  { label: '🧾 Invoice Portal',  url: 'https://invoice.technovia.com.au' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">

          {/* Brand */}
          <div>
            <Link to="/" className="nav-brand" style={{ textDecoration: 'none' }}>
              <div className="nav-logo-icon" style={{ width: 32, height: 32 }}>
                <img src="/favicon.svg" alt="Technovia logo" className="nav-logo-img" />
              </div>
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

          {/* Apps */}
          <div>
            <div className="footer-col-heading purple">Our Apps</div>
            {FOOTER_APPS.map((a) => (
              <a
                key={a.url}
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                {a.label}
              </a>
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
