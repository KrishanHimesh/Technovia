import { useMemo } from 'react'
import Navbar from '../components/Navbar.jsx'
import AnimatedBackdrop from '../components/AnimatedBackdrop.jsx'
import Footer from '../components/Footer.jsx'
import { useInView, usePageMeta, useJsonLd, PRODUCTS } from '../index.js'

const APPS = PRODUCTS

function AppCard({ app, index }) {
  const [ref, inView] = useInView(0.1)
  return (
    <div
      ref={ref}
      className={`service-card ${app.colorClass}${inView ? ' in-view' : ''}`}
      style={{
        transitionDelay: `${index * 0.15}s`,
        maxWidth: 480,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      data-cursor="OPEN"
    >
      <div className={`app-card-mock ${app.colorClass}`}>
        <div className="app-card-mock-chrome">
          <span /><span /><span />
        </div>
        <div className="app-card-mock-glow" />
        <div className="app-card-mock-icon">{app.icon}</div>
      </div>
      <div
        className="card-body"
        style={{
          padding: '2rem 2rem 2.25rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <h3 className="card-title" style={{ fontSize: '1.6rem', marginBottom: 4 }}>{app.label}</h3>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, marginBottom: 18, textAlign: 'center' }}>{app.tagline}</p>
        <ul className="card-list" style={{ marginBottom: 24, flex: 1 }}>
          {app.features.map((f) => (
            <li key={f}><span className="card-list-dot">◆</span>{f}</li>
          ))}
        </ul>
        <a
          href={app.url}
          target="_blank"
          rel="noopener noreferrer"
          className="app-card-cta"
        >
          Open {app.label} <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  )
}

export default function Apps() {
  usePageMeta(
    'Technovia Apps — TechnoPOS, ChairTime, InvoiceGen & WFHly',
    'Access TechnoPOS, ChairTime, InvoiceGen, and WFHly — the Technovia suite of business apps for POS, booking, invoicing, and remote work tracking.',
    '/apps'
  )

  useJsonLd(useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: PRODUCTS.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: p.label,
        description: p.desc,
        url: p.url,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        publisher: { '@type': 'Organization', name: 'Technovia' },
      },
    })),
  }), []))

  const [headerRef, headerInView] = useInView()

  return (
    <div className="page-wrapper">
      <Navbar />

      {/* Hero */}
      <section className="hero" style={{ minHeight: '40vh', paddingTop: 10, paddingBottom: 1 }}>
        <AnimatedBackdrop variant="purple" />
        <div className="hero-grid-bg" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-content" style={{ maxWidth: 720, textAlign: 'center' }}>
          <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>
            Technovia <span className="highlight">Apps</span>
          </h1>
          <p className="hero-subtitle">
            Everything you need, in one place. TechnoPOS, ChairTime, InvoiceGen, and WFHly —
            four tools built to run your business, securely online, anytime, from any device.
          </p>
        </div>
      </section>

      {/* App Cards */}
      <section className="services-section">
        <div
          className="services-grid-apps"
          style={{ justifyContent: 'center', gap: '2rem', alignItems: 'stretch' }}
        >
          {APPS.map((app, i) => (
            <AppCard key={app.id} app={app} index={i} />
          ))}
        </div>
        <br/><br/>
      

        <div className="section-header" ref={headerRef}>
          <div className={`section-tag${headerInView ? ' in-view' : ''}`}>Our Online Portals</div>
          <h2 className={`section-title${headerInView ? ' in-view' : ''}`}>
            Your <span className="gradient-text">Digital Hub</span>
          </h2>
          <p className={`section-desc${headerInView ? ' in-view' : ''}`}>
            Three dedicated portals built to make your experience with Technovia smooth and transparent.
          </p>
        </div>        
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-box" style={{ opacity: 1, transform: 'none' }}>
          <div className="cta-orb-tr" /><div className="cta-orb-bl" />
          <p className="cta-tag">Need a hand?</p>
          <h2 className="cta-title">Can't find what you're looking for? <span className="gradient-text">We're here.</span></h2>
          <p className="cta-desc">Our team is happy to walk you through the portals or help with anything else.</p>
          <div className="cta-buttons">
            <a href="tel:0476593934" className="btn-primary">📞 0476 593 934</a>
            <a href="mailto:info@technovia.com.au" className="cta-btn-email">✉ Email Us</a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
