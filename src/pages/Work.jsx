import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { useInView, usePageMeta, WORK_PROJECTS } from '../index.js'

function ProjectCard({ project, index }) {
  const [ref, inView] = useInView(0.1)
  return (
    <div
      ref={ref}
      className={`work-card ${project.colorClass}${inView ? ' in-view' : ''}`}
      style={{ transitionDelay: `${index * 0.15}s` }}
    >
      <div className="work-card-top">
        <span className="work-tag">{project.tag}</span>
        <h3 className="work-title">{project.title}</h3>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="work-url"
        >
          {project.client} ↗
        </a>
      </div>

      <p className="work-summary">{project.summary}</p>

      <div className="work-stack">
        {project.stack.map((s) => (
          <span key={s} className="work-stack-pill">{s}</span>
        ))}
      </div>

      <ul className="card-list work-highlights">
        {project.highlights.map((h) => (
          <li key={h}><span className="card-list-dot">◆</span>{h}</li>
        ))}
      </ul>

      <div className="card-actions">
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="card-btn-primary"
          style={{ textAlign: 'center' }}
        >
          Visit {project.client} →
        </a>
        <a href="/apps" className="card-btn-ghost" style={{ textAlign: 'center' }}>
          See TechnoPOS →
        </a>
      </div>
    </div>
  )
}

export default function Work() {
  usePageMeta(
    'Our Work | Technovia — Cheltenham, VIC',
    'Case studies of real projects built by Technovia, including Unity Products — an e-commerce platform fully integrated with TechnoPOS.'
  )

  const [headerRef, headerInView] = useInView()

  return (
    <div className="page-wrapper">
      <Navbar />

      {/* Hero */}
      <section className="hero" style={{ minHeight: '40vh', paddingTop: 10, paddingBottom: 1 }}>
        <div className="hero-grid-bg" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-content" style={{ maxWidth: 760, textAlign: 'center' }}>
          <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>
            Our <span className="highlight">Work</span>
          </h1>
          <p className="hero-subtitle">
            Real projects, built end-to-end — from custom software to fully connected
            e-commerce platforms powered by our own tools.
          </p>
        </div>
      </section>

      {/* Projects */}
      <section className="services-section">
        <div className="section-header" ref={headerRef}>
          <div className={`section-tag${headerInView ? ' in-view' : ''}`}>Case Study</div>
          <h2 className={`section-title${headerInView ? ' in-view' : ''}`}>
            Built On Our Own <span className="gradient-text">Tech Stack</span>
          </h2>
          <p className={`section-desc${headerInView ? ' in-view' : ''}`}>
            We don't just build websites — we connect them to the systems that run the business.
          </p>
        </div>

        <div className="work-grid">
          {WORK_PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-box" style={{ opacity: 1, transform: 'none' }}>
          <div className="cta-orb-tr" /><div className="cta-orb-bl" />
          <p className="cta-tag">Have a project in mind?</p>
          <h2 className="cta-title">Let's Build Your <span className="gradient-text">Next Platform</span></h2>
          <p className="cta-desc">
            Whether it's a website, an online store, or a system integration like TechnoPOS —
            we'd love to help.
          </p>
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
