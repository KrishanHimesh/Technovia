import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { useInView, SERVICES, STATS, WHY_FEATURES } from '../index.js'
//prod
// ── Animated Tech Canvas ──────────────────────────────────────────────────────
function TechCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Nodes
    const NODE_COUNT = 60
    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 1,
      pulse: Math.random() * Math.PI * 2,
    }))

    // Mouse position
    let mouse = { x: canvas.width / 2, y: canvas.height / 2 }
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    canvas.addEventListener('mousemove', onMove)

    let t = 0
    const LINK_DIST = 140
    const MOUSE_DIST = 180

    const draw = () => {
      t += 0.012
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Move nodes
      nodes.forEach(n => {
        n.x += n.vx
        n.y += n.vy
        n.pulse += 0.03
        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1
      })

      // Draw edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < LINK_DIST) {
            const alpha = (1 - d / LINK_DIST) * 0.35
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(124,58,237,${alpha})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
        // Mouse connections
        const mdx = nodes[i].x - mouse.x
        const mdy = nodes[i].y - mouse.y
        const md  = Math.sqrt(mdx * mdx + mdy * mdy)
        if (md < MOUSE_DIST) {
          const alpha = (1 - md / MOUSE_DIST) * 0.7
          ctx.beginPath()
          ctx.moveTo(nodes[i].x, nodes[i].y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.strokeStyle = `rgba(56,189,248,${alpha})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      // Draw nodes
      nodes.forEach(n => {
        const pulse = 0.5 + 0.5 * Math.sin(n.pulse)
        // Outer glow
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4)
        grad.addColorStop(0, `rgba(124,58,237,${0.4 * pulse})`)
        grad.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
        // Core dot
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(167,139,250,${0.6 + 0.4 * pulse})`
        ctx.fill()
      })

      // Scan line
      const scanY = (Math.sin(t * 0.4) * 0.5 + 0.5) * canvas.height
      const scanGrad = ctx.createLinearGradient(0, scanY - 60, 0, scanY + 60)
      scanGrad.addColorStop(0, 'transparent')
      scanGrad.addColorStop(0.5, 'rgba(6,182,212,0.04)')
      scanGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = scanGrad
      ctx.fillRect(0, scanY - 60, canvas.width, 120)

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMove)
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
        <span>Network Active</span>
      </div>
      <div className="canvas-badge canvas-badge-2">
        <span className="canvas-badge-dot cyan" />
        <span>Systems Online</span>
      </div>
    </div>
  )
}

// ── Service Card ──────────────────────────────────────────────────────────────
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

function StatsSection() {
  const [ref, inView] = useInView()
  return (
    <section className="stats-section">
      <div className="stats-grid" ref={ref}>
        {STATS.map((s, i) => (
          <div key={s.label} className={`stat-item${inView ? ' in-view' : ''}`} style={{ transitionDelay: `${i * 0.1}s` }}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
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
          <a href="mailto:technoviaservices@gmail.com" className="cta-btn-email">✉ Email Us</a>
        </div>
      </div>
    </section>
  )
}

function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  useEffect(() => {
    const onMove = (e) => setMousePos({
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100,
    })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <section className="hero" style={{ background: `radial-gradient(ellipse at ${mousePos.x}% ${mousePos.y}%, rgba(124,58,237,0.22) 0%, rgba(6,182,212,0.1) 40%, #080814 70%)` }}>
      <div className="hero-grid-bg" />
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />

      <div className="hero-content">
        <h1 className="hero-title">
          Robust IT Solutions to <span className="highlight">Fortify</span> Your Home &amp; Business
        </h1>
        <p className="hero-subtitle">
          Welcome to Technovia — your trusted partner in IT solutions, dedicated to keeping
          your business and home technology running smoothly.
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
      <StatsSection />
      <ServicesSection />
      <WhyUsSection />
      <CTASection />
      <Footer />
    </div>
  )
}
