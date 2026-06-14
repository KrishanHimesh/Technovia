import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { useInView, usePageMeta } from '../index.js'

const APPS = [
  {
    id: 'VendrPro',
    label: 'Technovia Inventory Management System',
    appName: 'VendrPro',
    icon: '🖥️',
    url: 'https://app.technovia.com.au',
    colorClass: 'color-purple',
    desc: 'Access the Technovia client portal — manage your service requests, track repairs, and stay up to date with your jobs.',
    features: [
      'View & track service requests',
      'Receive status updates in real time',
      'Access your service history',
      'Communicate with our technicians',
    ],
  },
  {
    id: 'invoice',
    label: 'Technovia Free Invoice Generator ',
    appName: 'InvoiceGen',
    icon: '🧾',
    url: 'https://invoice.technovia.com.au',
    colorClass: 'color-cyan',
    desc: 'View, download and pay your Technovia invoices securely online — fast and hassle-free.',
    features: [
      'View outstanding & paid invoices',
      'Download PDF copies',
      'Secure online payments',
      'Invoice history at a glance',
    ],
  },
]

function AppCard({ app, index }) {
  const [ref, inView] = useInView(0.1)
  return (
    <div
      ref={ref}
      className={`service-card ${app.colorClass}${inView ? ' in-view' : ''}`}
      style={{ transitionDelay: `${index * 0.15}s`, maxWidth: 480, width: '100%' }}
    >
      <div className="card-body" style={{ padding: '2.5rem 2rem' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>{app.icon}</div>
        <h3 className="card-title" style={{ fontSize: '1.5rem', marginBottom: 12 }}>{app.label}</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.7 }}>{app.desc}</p>
        <ul className="card-list" style={{ marginBottom: 28 }}>
          {app.features.map((f) => (
            <li key={f}><span className="card-list-dot">◆</span>{f}</li>
          ))}
        </ul>
        <a
          href={app.url}
          target="_blank"
          rel="noopener noreferrer"
          className="card-btn-primary"
          style={{ display: 'inline-block', textAlign: 'center', width: '100%' }}
        >
          Open {app.appName} →
        </a>
      </div>
    </div>
  )
}

export default function Apps() {
  usePageMeta(
    'Apps | Technovia — Cheltenham, VIC',
    'Access the Technovia client app portal and invoice portal. Manage your service requests and invoices online.'
  )

  const [headerRef, headerInView] = useInView()

  return (
    <div className="page-wrapper">
      <Navbar />

      {/* Hero */}
      <section className="hero" style={{ minHeight: '40vh', paddingTop: 140, paddingBottom: 80 }}>
        <div className="hero-grid-bg" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-content" style={{ maxWidth: 720, textAlign: 'center' }}>
          <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>
            Technovia <span className="highlight">Apps</span>
          </h1>
          <p className="hero-subtitle">
            Everything you need, in one place. Access your client portal and invoices
            securely online — anytime, from any device.
          </p>
        </div>
      </section>

      {/* App Cards */}
      <section className="services-section">
        <div className="section-header" ref={headerRef}>
          <div className={`section-tag${headerInView ? ' in-view' : ''}`}>Our Online Portals</div>
          <h2 className={`section-title${headerInView ? ' in-view' : ''}`}>
            Your <span className="gradient-text">Digital Hub</span>
          </h2>
          <p className={`section-desc${headerInView ? ' in-view' : ''}`}>
            Two dedicated portals built to make your experience with Technovia smooth and transparent.
          </p>
        </div>

        <div
          className="services-grid"
          style={{ justifyContent: 'center', gap: '2rem' }}
        >
          {APPS.map((app, i) => (
            <AppCard key={app.id} app={app} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className={`cta-box`} style={{ opacity: 1, transform: 'none' }}>
          <div className="cta-orb-tr" /><div className="cta-orb-bl" />
          <p className="cta-tag">Need a hand?</p>
          <h2 className="cta-title">Can't find what you're looking for? <span className="gradient-text">We're here.</span></h2>
          <p className="cta-desc">Our team is happy to walk you through the portals or help with anything else.</p>
          <div className="cta-buttons">
            <a href="tel:0476593934" className="btn-primary">📞 0476 593 934</a>
            <a href="mailto:technoviaservices@gmail.com" className="cta-btn-email">✉ Email Us</a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
