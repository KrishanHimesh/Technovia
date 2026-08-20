import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import AnimatedBackdrop from '../components/AnimatedBackdrop.jsx'
import Footer from '../components/Footer.jsx'
import Statement from '../components/Statement.jsx'
import ProductsShowcase from '../components/ProductsShowcase.jsx'
import ProcessSection from '../components/ProcessSection.jsx'
import ServicesInteractive from '../components/ServicesInteractive.jsx'
import HeroDashboard from '../components/HeroDashboard.jsx'
import { useInView, useCountUp, STATS, WHY_FEATURES, WORK_PROJECTS, TESTIMONIALS, usePageMeta } from '../index.js'
//prod
// ── Gallery Teaser ────────────────────────────────────────────────────────────
const TEASER_PHOTOS = [
  { src: '/gallery/drone-repair-1.jpeg',   alt: 'Drone repair Cheltenham',          icon: '🔧', label: 'Drone Repair'      },
  { src: '/gallery/battery-buk-fix-1.jpeg', alt: 'Drone battery service Cheltenham', icon: '🔋', label: 'Battery Service'   },
  { src: '/gallery/drone-frame-1.jpeg',    alt: 'Drone frame fix Cheltenham',        icon: '✈️', label: 'Frame Repair'      },
]

function GalleryTeaser() {
  const [ref, inView] = useInView()
  return (
    <section className="gallery-teaser-section">
      <div className="section-header" ref={ref}>
        <div className={`section-tag${inView ? ' in-view' : ''}`}>Real Work, Real Results</div>
        <h2 className={`section-title${inView ? ' in-view' : ''}`}>
          See Our <span className="gradient-text">Drone Repairs</span> Up Close
        </h2>
        <p className={`section-desc${inView ? ' in-view' : ''}`}>
          Photos from actual jobs — drone motor replacements, battery reconditioning, frame repairs, and more.
        </p>
      </div>
      <div className="gallery-teaser-grid">
        {TEASER_PHOTOS.map((p, i) => (
          <GalleryTeaserCard key={p.label} photo={p} index={i} />
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <Link to="/gallery" className="btn-primary">View Full Gallery →</Link>
      </div>
    </section>
  )
}

function GalleryTeaserCard({ photo, index }) {
  const [ref, inView] = useInView(0.1)
  const [err, setErr] = useState(false)
  return (
    <div
      ref={ref}
      className={`gallery-teaser-card${inView ? ' in-view' : ''}`}
      style={{ transitionDelay: `${index * 0.12}s` }}
    >
      {!err ? (
        <img src={photo.src} alt={photo.alt} loading="lazy" onError={() => setErr(true)} />
      ) : (
        <div className="gallery-teaser-placeholder">
          <span>{photo.icon}</span>
          <span>Photo coming soon</span>
        </div>
      )}
      <div className="gallery-teaser-label">{photo.label}</div>
    </div>
  )
}


function WorkTeaser() {
  const [ref, inView] = useInView()
  const project = WORK_PROJECTS[0]
  return (
    <section className="services-section" style={{ paddingTop: 20 }}>
      <div className="section-header" ref={ref}>
        <div className={`section-tag${inView ? ' in-view' : ''}`}>Our Work</div>
        <h2 className={`section-title${inView ? ' in-view' : ''}`}>
          Real Businesses, <span className="gradient-text">Real Systems</span>
        </h2>
        <p className={`section-desc${inView ? ' in-view' : ''}`}>
          See how we built a live e-commerce platform fully connected to our own TechnoPOS system.
        </p>
      </div>
      <div
        className={`work-card ${project.colorClass}${inView ? ' in-view' : ''}`}
      data-cursor="VIEW"
        style={{ maxWidth: 900, margin: '0 auto' }}
      >
        <div className="work-card-top">
          <span className="work-tag">{project.tag}</span>
          <h3 className="work-title">{project.title}</h3>
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="work-url">
            {project.client} ↗
          </a>
        </div>
        <p className="work-summary">{project.summary}</p>
        <div className="work-stack">
          {project.stack.map((s) => <span key={s} className="work-stack-pill">{s}</span>)}
        </div>
        <div className="card-actions">
          <Link to="/work" className="card-btn-primary" style={{ textAlign: 'center' }}>View Case Study →</Link>
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="card-btn-ghost" style={{ textAlign: 'center' }}>
            Visit Site →
          </a>
        </div>
      </div>
    </section>
  )
}

function StatItem({ s, i, inView }) {
  const display = useCountUp(s.value, inView)
  return (
    <div className={`stat-item${inView ? ' in-view' : ''}`} style={{ transitionDelay: `${i * 0.1}s` }}>
      <div className="stat-icon">{s.icon}</div>
      <div className="stat-value">{display}</div>
      <div className="stat-label">{s.label}</div>
    </div>
  )
}

function StatsSection() {
  const [ref, inView] = useInView()
  return (
    <section className="stats-section">
      <div className="stats-grid" ref={ref}>
        {STATS.map((s, i) => <StatItem key={s.label} s={s} i={i} inView={inView} />)}
      </div>
    </section>
  )
}

// ── Capabilities ticker (infinite marquee) ────────────────────────────────────
const TICKER_ITEMS = [
  'IT & Computer Repair', 'Drone Servicing', 'CNC Design', 'TechnoPOS',
  'InvoiceGen', 'ChairTime Booking', 'WiFi Setup', 'E-Commerce Integration',
]
function CapabilitiesTicker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div className="marquee-section">
      <div className="marquee-track">
        {items.map((item, i) => (
          <span key={i} className="marquee-item">
            {item} <span className="dot">●</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Closing kinetic tagline marquee ───────────────────────────────────────────
function TaglineMarquee() {
  const line = 'Real Solutions, Real Fast.  ✦  Technovia Cheltenham.  ✦  '
  const items = Array(4).fill(line)
  return (
    <section className="tagline-marquee-section">
      <div className="tagline-marquee-track">
        {items.map((t, i) => <span key={i} className="tagline-marquee-item">{t}</span>)}
      </div>
    </section>
  )
}


function WhyUsSection() {
  const [ref, inView] = useInView()
  return (
    <section className="whyus-section" ref={ref}>
      <div className="whyus-glow" />
      <div className="whyus-inner">
        <div>
          <div className={`section-tag left${inView ? ' in-view' : ''}`}>Why Choose Us</div>
          <h2 className={`whyus-title${inView ? ' in-view' : ''}`}>
            Technology You Can<br />
            <span className="gradient-text">Trust &amp; Rely On</span>
          </h2>
          <p className={`whyus-body${inView ? ' in-view' : ''}`}>
            From laptops to drones to CNC machines — we bring deep expertise and genuine
            care to every job. Based in Cheltenham, we serve homes and businesses across the region.
          </p>
          <Link to="/contact" className={`whyus-btn${inView ? ' in-view' : ''}`}>
            Get In Touch Today
          </Link>
        </div>
        <div className="features-grid">
          {WHY_FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`feature-card${inView ? ' in-view' : ''}`}
              style={{ transitionDelay: `${0.15 + i * 0.1}s` }}
            >
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ t, index }) {
  const [ref, inView] = useInView(0.1)
  const initials = t.name.split(' ').map((w) => w[0]).join('')
  return (
    <div
      ref={ref}
      className={`testimonial-card${inView ? ' in-view' : ''}`}
      style={{ transitionDelay: `${index * 0.12}s` }}
    >
      <div className="testimonial-quote-mark">"</div>
      <p className="testimonial-quote">{t.quote}</p>
      <div className="testimonial-author">
        <div className="testimonial-avatar">{initials}</div>
        <div>
          <div className="testimonial-name">{t.name}</div>
          <div className="testimonial-role">{t.role}</div>
        </div>
      </div>
    </div>
  )
}

function TestimonialsSection() {
  const [ref, inView] = useInView()
  return (
    <section className="testimonials-section">
      <div className="section-header" ref={ref}>
        <div className={`section-tag${inView ? ' in-view' : ''}`}>What Our Clients Say</div>
        <h2 className={`section-title${inView ? ' in-view' : ''}`}>
          Trusted By <span className="gradient-text">Real People</span>
        </h2>
        <p className={`section-desc${inView ? ' in-view' : ''}`}>
          Don't just take our word for it — here's what our customers have to say.
        </p>
      </div>
      <div className="testimonials-grid">
        {TESTIMONIALS.map((t, i) => (
          <TestimonialCard key={t.name} t={t} index={i} />
        ))}
      </div>
    </section>
  )
}

function CTASection() {
  const [ref, inView] = useInView()
  return (
    <section className="cta-section">
      <div ref={ref} className={`cta-box${inView ? ' in-view' : ''}`}>
        <div className="cta-orb-tr" /><div className="cta-orb-bl" />
        <p className="cta-tag">Ready to Get Started?</p>
        <h2 className="cta-title">Let's Solve Your Tech Problems <span className="gradient-text">Today</span></h2>
        <p className="cta-desc">Call us, email us, or drop in. We're here to help with all your IT, drone, and CNC needs.</p>
        <div className="cta-buttons">
          <a href="tel:0476593934" className="btn-primary">📞 0476 593 934</a>
          <a href="mailto:info@technovia.com.au" className="cta-btn-email">✉ Email Us</a>
        </div>
      </div>
    </section>
  )
}

const ROTATING_WORDS = ['Laptops.', 'Drones.', 'CNC Jobs.', 'POS Systems.', 'Everything Tech.']

function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [wordIndex, setWordIndex] = useState(0)
  useEffect(() => {
    const onMove = (e) => setMousePos({
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100,
    })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])
  useEffect(() => {
    const id = setInterval(() => setWordIndex((i) => (i + 1) % ROTATING_WORDS.length), 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="hero" style={{ background: `radial-gradient(ellipse at ${mousePos.x}% ${mousePos.y}%, rgba(124,58,237,0.22) 0%, rgba(6,182,212,0.1) 40%, #080814 70%)` }}>
      <AnimatedBackdrop variant="purple" density={1.2} />
      <div className="hero-grid-bg" />
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />

      <div className="hero-content">
        <h1 className="hero-title">
          IT Support, Drone Repair &amp; CNC Services in <span className="highlight">Cheltenham, VIC</span>
        </h1>
        <p className="hero-subtitle">
          Technovia is Cheltenham's trusted tech specialist, built for{' '}
          <span className="rotating-word-wrap">
            <span key={wordIndex} className="rotating-word">{ROTATING_WORDS[wordIndex]}</span>
          </span>
          {' '}Same-day service, honest pricing, no jargon.
        </p>
        <div className="hero-buttons">
          <Link to="/services" className="btn-primary">Explore Services</Link>
          <Link to="/contact"  className="btn-ghost">Contact Us →</Link>
        </div>

        {/* Premium live-status dashboard — click between services */}
        <div className="hero-image-wrap" style={{ marginTop: 56 }}>
          <HeroDashboard />
        </div>
      </div>

      <div className="hero-scroll">
        <span>scroll</span>
        <div className="hero-scroll-line" />
      </div>
    </section>
  )
}

export default function Home() {
  usePageMeta(
    'Technovia | IT Support, Drone Repair & CNC Services — Cheltenham, VIC',
    'Technovia is Cheltenham\'s trusted tech specialist — IT support, drone repair, CNC programming, plus TechnoPOS, ChairTime, InvoiceGen & WFHly. Same-day service, honest pricing.',
    '/'
  )
  return (
    <div className="page-wrapper">
      <Navbar />
      <HeroSection />
      <CapabilitiesTicker />
      <StatsSection />
      <Statement />
      <ServicesInteractive />
      <ProductsShowcase />
      <WorkTeaser />
      <GalleryTeaser />
      <WhyUsSection />
      <ProcessSection />
      <TestimonialsSection />
      <TaglineMarquee />
      <CTASection />
      <Footer />
    </div>
  )
}
