import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import AnimatedBackdrop from '../components/AnimatedBackdrop.jsx'
import Footer from '../components/Footer.jsx'
import { useInView, ABOUT_VALUES, STATS, usePageMeta } from '../index.js'

function ValuesSection() {
  const [ref, inView] = useInView()
  return (
    <section className="about-section">
      <div className="section-header" ref={ref}>
        <div className={`section-tag${inView ? ' in-view' : ''}`}>Who We Are</div>
        <h2 className={`section-title${inView ? ' in-view' : ''}`}>
          Built on <span className="gradient-text">Trust &amp; Expertise</span>
        </h2>
        <p className={`section-desc${inView ? ' in-view' : ''}`}>
          We're a passionate team based in Cheltenham dedicated to keeping your technology working for you.
        </p>
      </div>
      <div className="about-values-grid">
        {ABOUT_VALUES.map((v, i) => (
          <div
            key={v.title}
            className={`value-card${inView ? ' in-view' : ''}`}
            style={{ transitionDelay: `${i * 0.15}s` }}
          >
            <div className="value-icon">{v.icon}</div>
            <div className="value-title">{v.title}</div>
            <p className="value-desc">{v.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function StatsStrip() {
  const [ref, inView] = useInView()
  return (
    <section className="stats-section">
      <div className="stats-grid" ref={ref}>
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`stat-item${inView ? ' in-view' : ''}`}
            style={{ transitionDelay: `${i * 0.1}s` }}
          >
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── What makes us different ── */
function DifferenceSection() {
  const [ref, inView] = useInView()
  const points = [
    { icon: '🛠', title: 'Hands-On Expertise', desc: 'Every job is handled by a specialist — not a call centre. We roll up our sleeves and get it done.' },
    { icon: '💬', title: 'Plain-Language Advice', desc: 'No tech jargon. We explain everything clearly so you can make informed decisions with confidence.' },
    { icon: '📍', title: 'Local & Accountable', desc: 'We\'re based right here in Cheltenham. You know exactly who you\'re dealing with — and how to find us.' },
    { icon: '✅', title: 'Satisfaction Guarantee', desc: 'We don\'t consider a job done until you\'re happy. If something isn\'t right, we come back and fix it.' },
    { icon: '💰', title: 'Transparent Pricing', desc: 'You get a clear quote before we start. No surprise charges, no hidden fees, ever.' },
    { icon: '🚀', title: 'Fast Turnaround', desc: 'We respect your time. Most repairs and jobs are completed same-day or next-day.' },
  ]
  return (
    <section style={{ padding: '80px 5%', background: 'linear-gradient(180deg,var(--bg) 0%,rgba(12,8,30,1) 100%)', position: 'relative', overflow: 'hidden' }}>
      <div className="whyus-glow" />
      <div className="section-header" ref={ref} style={{ position: 'relative', zIndex: 1 }}>
        <div className={`section-tag${inView ? ' in-view' : ''}`}>The Technovia Way</div>
        <h2 className={`section-title${inView ? ' in-view' : ''}`}>
          What Makes Us <span className="gradient-text">Different</span>
        </h2>
      </div>
      <div className="about-diff-grid" style={{ position: 'relative', zIndex: 1 }}>
        {points.map((p, i) => (
          <div
            key={p.title}
            className={`diff-card${inView ? ' in-view' : ''}`}
            style={{ transitionDelay: `${i * 0.1}s` }}
          >
            <div className="diff-icon">{p.icon}</div>
            <div className="diff-title">{p.title}</div>
            <p className="diff-desc">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function CTAStrip() {
  const [ref, inView] = useInView()
  return (
    <section className="cta-section">
      <div ref={ref} className={`cta-box${inView ? ' in-view' : ''}`}>
        <div className="cta-orb-tr" /><div className="cta-orb-bl" />
        <p className="cta-tag">Work With Us</p>
        <h2 className="cta-title">Ready to Experience the <span className="gradient-text">Technovia Difference?</span></h2>
        <p className="cta-desc">Get in touch today — no obligation, no jargon, just honest help.</p>
        <div className="cta-buttons">
          <Link to="/contact" className="btn-primary">Contact Us Today</Link>
          <Link to="/services" className="btn-ghost">View Our Services</Link>
        </div>
      </div>
    </section>
  )
}

export default function About() {
  usePageMeta(
    'About Technovia – Local Tech Experts in Cheltenham, VIC',
    'Learn about Technovia — Cheltenham\'s trusted IT support, drone repair, and CNC specialists. Fast, honest, local. Call 0476 593 934.',
    '/about'
  )
  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-hero">
        <AnimatedBackdrop variant="purple" />
        <div className="page-hero-grid" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1>About <span className="gradient-text">Technovia</span></h1>
          <p>At Technovia, we're passionate about providing top-notch, reliable, and budget-friendly tech services for individuals, small businesses, and creative professionals.</p>
        </div>
      </div>
      <ValuesSection />
      <StatsStrip />
      <DifferenceSection />
      <CTAStrip />
      <Footer />
    </div>
  )
}
