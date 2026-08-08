import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { useInView, useCountUp, SERVICES, STATS, WHY_FEATURES, WORK_PROJECTS, TESTIMONIALS } from '../index.js'
//prod
// ── Animated Circuit Pulse Hero ────────────────────────────────────────────────
// Procedurally generated PCB-style circuit traces (orthogonal paths) with glowing
// data packets travelling along them, brightening near the cursor.
function buildTrace(startGx, startGy, cols, rows) {
  let dir = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }][Math.floor(Math.random() * 4)]
  let gx = startGx, gy = startGy
  const pts = [{ x: gx, y: gy }]
  const segments = 5 + Math.floor(Math.random() * 6)

  for (let s = 0; s < segments; s++) {
    const stepLen = 1 + Math.floor(Math.random() * 4)
    gx += dir.x * stepLen
    gy += dir.y * stepLen

    let bounced = false
    if (gx < 1) { gx = 1; bounced = true }
    if (gx > cols - 1) { gx = cols - 1; bounced = true }
    if (gy < 1) { gy = 1; bounced = true }
    if (gy > rows - 1) { gy = rows - 1; bounced = true }

    pts.push({ x: gx, y: gy })

    if (bounced || Math.random() < 0.65) {
      dir = dir.x !== 0
        ? { x: 0, y: Math.random() < 0.5 ? 1 : -1 }
        : { x: Math.random() < 0.5 ? 1 : -1, y: 0 }
    }
  }
  return pts
}

function makeTraces(width, height) {
  const grid = Math.max(22, Math.min(width, height) / 13)
  const cols = Math.max(4, Math.floor(width / grid))
  const rows = Math.max(4, Math.floor(height / grid))
  const count = Math.min(26, Math.max(12, Math.floor((cols * rows) / 22)))

  return Array.from({ length: count }, (_, i) => {
    const startGx = 1 + Math.floor(Math.random() * (cols - 2))
    const startGy = 1 + Math.floor(Math.random() * (rows - 2))
    const gridPts = buildTrace(startGx, startGy, cols, rows)
    const points = gridPts.map((p) => ({ x: p.x * grid, y: p.y * grid }))

    let total = 0
    const cum = [0]
    for (let j = 1; j < points.length; j++) {
      const dx = points[j].x - points[j - 1].x
      const dy = points[j].y - points[j - 1].y
      total += Math.sqrt(dx * dx + dy * dy)
      cum.push(total)
    }

    return {
      points, cum, total,
      cyan: i % 2 === 0,
      speed: total / (4 + Math.random() * 6) / 60, // px per frame
      phase: Math.random() * (total || 1),
    }
  })
}

function pointAt(trace, dist) {
  const { points, cum, total } = trace
  if (total === 0) return points[0]
  const d = ((dist % total) + total) % total
  let seg = 1
  while (seg < cum.length && cum[seg] < d) seg++
  seg = Math.min(seg, points.length - 1)
  const segStart = cum[seg - 1], segEnd = cum[seg]
  const t = segEnd > segStart ? (d - segStart) / (segEnd - segStart) : 0
  const a = points[seg - 1], b = points[seg]
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
}

function TechCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId, traces

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      traces = makeTraces(canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    let mouse = { x: canvas.width / 2, y: canvas.height / 2, active: false }
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true }
    }
    const onLeave = () => { mouse.active = false }
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onLeave)

    let t = 0
    const PURPLE = '124,58,237'
    const CYAN   = '6,182,212'
    const MOUSE_GLOW = 170

    const draw = () => {
      t += 1
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      traces.forEach((trace) => {
        const color = trace.cyan ? CYAN : PURPLE

        // Proximity glow: closest vertex to the cursor
        let boost = 0
        if (mouse.active) {
          let minD = Infinity
          for (const p of trace.points) {
            const dx = p.x - mouse.x, dy = p.y - mouse.y
            const d = Math.sqrt(dx * dx + dy * dy)
            if (d < minD) minD = d
          }
          boost = Math.max(0, 1 - minD / MOUSE_GLOW)
        }

        // Trace line
        ctx.beginPath()
        trace.points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
        ctx.strokeStyle = `rgba(${color},${0.13 + boost * 0.55})`
        ctx.lineWidth = 1 + boost * 1.2
        ctx.lineJoin = 'round'
        ctx.stroke()

        // Via pads at vertices
        trace.points.forEach((p) => {
          ctx.beginPath()
          ctx.arc(p.x, p.y, 1.6 + boost * 1.2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${color},${0.25 + boost * 0.5})`
          ctx.fill()
        })

        // Travelling packet with comet trail
        const head = trace.phase + t * trace.speed
        for (let k = 0; k < 5; k++) {
          const pos = pointAt(trace, head - k * 9)
          const alpha = (1 - k / 5) * (0.75 + boost * 0.25)
          const r = k === 0 ? 3 : 1.6
          if (k === 0) {
            const grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 10)
            grad.addColorStop(0, `rgba(${color},${0.55 + boost * 0.3})`)
            grad.addColorStop(1, 'transparent')
            ctx.beginPath()
            ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2)
            ctx.fillStyle = grad
            ctx.fill()
          }
          ctx.beginPath()
          ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${trace.cyan ? '165,243,252' : '216,180,254'},${alpha})`
          ctx.fill()
        }
      })

      // Soft cursor glow
      if (mouse.active) {
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, MOUSE_GLOW)
        grad.addColorStop(0, 'rgba(6,182,212,0.05)')
        grad.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, MOUSE_GLOW, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div className="tech-canvas-wrap">
      <canvas ref={canvasRef} className="tech-canvas" />
      {/* Corner decorations */}
      <div className="canvas-corner canvas-corner-tl" />
      <div className="canvas-corner canvas-corner-tr" />
      <div className="canvas-corner canvas-corner-bl" />
      <div className="canvas-corner canvas-corner-br" />
      {/* Floating badges */}
      <div className="canvas-badge canvas-badge-1">
        <span className="canvas-badge-dot" />
        <span>Circuits Live</span>
      </div>
      <div className="canvas-badge canvas-badge-2">
        <span className="canvas-badge-dot cyan" />
        <span>Data Flowing</span>
      </div>
    </div>
  )
}

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


function ServiceCard({ service, index }) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      className={`service-card ${service.colorClass}${inView ? ' in-view' : ''}`}
      style={{ transitionDelay: `${index * 0.15}s` }}
    >
      <div className="card-image-wrap">
        <img src={service.image} alt={service.title} loading="lazy" />
        <div className="card-image-overlay" />
        <div className="card-icon-badge">{service.icon}</div>
      </div>
      <div className="card-body">
        <h3 className="card-title">{service.title}</h3>
        <ul className="card-list">
          {service.items.map((item) => (
            <li key={item}><span className="card-list-dot">◆</span>{item}</li>
          ))}
        </ul>
        <div className="card-actions">
          <Link to="/contact" className="card-btn-ghost" style={{ textAlign: 'center' }}>Contact Us</Link>
          <Link to="/services" className="card-btn-primary" style={{ textAlign: 'center' }}>More Info →</Link>
        </div>
      </div>
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


function ServicesSection() {
  const [ref, inView] = useInView()
  return (
    <section className="services-section">
      <div className="section-header" ref={ref}>
        <div className={`section-tag${inView ? ' in-view' : ''}`}>What We Offer</div>
        <h2 className={`section-title${inView ? ' in-view' : ''}`}>
          Our <span className="gradient-text">Premium</span> Services
        </h2>
        <p className={`section-desc${inView ? ' in-view' : ''}`}>
          Expert solutions for IT, drones, and CNC — delivered with precision and care.
        </p>
      </div>
      <div className="services-grid">
        {SERVICES.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
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

        {/* CSS animated tech canvas replaces the hero image */}
        <div className="hero-image-wrap" style={{ marginTop: 56 }}>
          <TechCanvas />
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
  return (
    <div className="page-wrapper">
      <Navbar />
      <HeroSection />
      <CapabilitiesTicker />
      <StatsSection />
      <ServicesSection />
      <WorkTeaser />
      <GalleryTeaser />
      <WhyUsSection />
      <TestimonialsSection />
      <TaglineMarquee />
      <CTASection />
      <Footer />
    </div>
  )
}
