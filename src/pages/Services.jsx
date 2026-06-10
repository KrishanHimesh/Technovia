import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { useInView, usePageMeta } from '../index.js'

/* ─── All service data from the skeleton ─────────────────────────────────── */
const IT_SUBSECTIONS = [
  {
    icon: '🍎',
    title: 'Apple/Android Software Support',
    colorClass: 'color-purple',
    items: [
      'OS updates and installation',
      'Device setup and configuration',
      'Malware/Virus removal',
      'Data backup and recovery',
      'Network & connectivity issues (Wi-Fi, Bluetooth)',
      'iCloud/Google account support',
    ],
  },
  {
    icon: '🖥',
    title: 'Computers/Laptops Repair & Services',
    colorClass: 'color-purple',
    items: [
      'Operating system installation and troubleshooting',
      'Data recovery',
      'Battery and charging port repair',
      'Hard drive/SSD upgrade',
      'Virus and malware removal',
      'System speed optimisation',
    ],
  },
  {
    icon: '📶',
    title: 'WiFi & Networking Services',
    colorClass: 'color-purple',
    items: [
      'New Wi-Fi router setup and configuration',
      'Fixing slow or unreliable internet connections',
      'Setting up wired networks (Ethernet)',
      'Small office/home office (SOHO) network setup',
      'VPN setup and configuration',
      'Firewall and parental control setup',
      'Printer and file sharing across the network',
    ],
  },
  {
    icon: '✉',
    title: 'Email Setup & Management Services',
    colorClass: 'color-purple',
    items: [
      'Email Account Setup',
      'Device & Client Configuration',
      'Email Migration',
      'Security & Spam Protection',
      'Mailbox Management',
      'Ongoing support & troubleshooting',
    ],
  },
  {
    icon: '⚙',
    title: 'Software Installation & Support',
    colorClass: 'color-purple',
    items: [
      'Custom Website Design',
      'Website Development',
      'Domain and hosting setup',
      'SEO Basics & Optimisation',
      'Ongoing Maintenance & Support',
      'UX & UI Enhancements',
    ],
  },
  {
    icon: '🗄',
    title: 'Data Backup & Recovery',
    colorClass: 'color-purple',
    items: [
      'Cloud storage and set up',
      'Cloud Computing Backup: AWS Backup, Azure Backup, or Google Cloud Storage',
      'Local Backup Strategies',
    ],
  },
]

const DRONE_SUBSECTIONS = [
  {
    icon: '🔧',
    title: 'Drone Repair Services',
    colorClass: 'color-cyan',
    items: [
      'Hardware diagnostics and troubleshooting',
      'Motor replacement or repair',
      'Propeller replacement',
      'Camera and gimbal repair or replacement',
      'Frame/crash damage repair',
    ],
  },
  {
    icon: '🔋',
    title: 'Drone Battery Repair & Services',
    colorClass: 'color-cyan',
    items: [
      'Battery diagnostics and health analysis',
      'Cell balancing and replacement',
      'Battery management system (BMS) repair',
      'Battery swelling or overheating issue checks',
      'Battery reconditioning (where possible)',
      'Safe battery disposal and replacement guidance',
    ],
  },
  {
    icon: '💡',
    title: 'Maintenance Services',
    colorClass: 'color-cyan',
    items: [
      'Routine drone inspections and health checks',
      'Firmware updates and software testing',
      'Battery health checks and reconditioning',
      'Propeller balancing and alignment',
      'Sensor calibration (IMU, compass, etc.)',
    ],
  },
]

const CNC_SUBSECTIONS = [
  {
    icon: '✏',
    title: 'CNC Designing Services',
    colorClass: 'color-green',
    items: [
      'Custom Signage Design (Business logos, plaques, wall art)',
      '2D & 3D Artwork Matching',
      'High quality STL, DXF, and ArtCAM file creation',
      'Conversion of sketches or ideas into detailed CNC-ready designs',
    ],
  },
  {
    icon: '⚙',
    title: 'CNC Programming Services',
    colorClass: 'color-green',
    items: [
      'CNC Toolpath Creation: Roughing, Finishing, V-Carving',
      'Optimised, clean, and machine-ready G-code output',
      'Toolpath setup tailored to your CNC machine specs',
      'File formats compatible with various CNC routers',
    ],
  },
]

/* ─── Sub-service card ──────────────────────────────────────────────────── */
function SubCard({ sub, index }) {
  const [ref, inView] = useInView(0.1)
  return (
    <div
      ref={ref}
      className={`sub-card ${sub.colorClass}${inView ? ' in-view' : ''}`}
      style={{ transitionDelay: `${index * 0.08}s` }}
    >
      <div className="sub-card-icon">{sub.icon}</div>
      <h4 className="sub-card-title">{sub.title}</h4>
      <ul className="sub-card-list">
        {sub.items.map(item => (
          <li key={item}><span className="card-list-dot">◆</span>{item}</li>
        ))}
      </ul>
    </div>
  )
}

/* ─── Service category block ────────────────────────────────────────────── */
function ServiceCategory({ id, title, colorClass, heroImg, heroAlt, intro, subsections, accent }) {
  const [ref, inView] = useInView(0.1)
  return (
    <section id={id} className={`service-cat-section`}>
      {/* Category hero banner */}
      <div className={`service-cat-banner ${colorClass}`} ref={ref}>
        <div className="service-cat-banner-bg" style={{ backgroundImage: `url(${heroImg})` }} />
        <div className="service-cat-banner-overlay" />
        <div className={`service-cat-banner-content${inView ? ' in-view' : ''}`}>
          <h2 className="service-cat-title" style={{ color: accent }}>{title}</h2>
          <p className="service-cat-intro">{intro}</p>
          <Link to="/contact" className="btn-primary" style={{ marginTop: 20, display: 'inline-block' }}>
            Get a Quote →
          </Link>
        </div>
      </div>
      {/* Sub-service cards grid */}
      <div className="sub-cards-grid">
        {subsections.map((sub, i) => <SubCard key={sub.title} sub={sub} index={i} />)}
      </div>
    </section>
  )
}

/* ─── CTA strip ─────────────────────────────────────────────────────────── */
function CTAStrip() {
  const [ref, inView] = useInView()
  return (
    <section className="cta-section">
      <div ref={ref} className={`cta-box${inView ? ' in-view' : ''}`}>
        <div className="cta-orb-tr" /><div className="cta-orb-bl" />
        <p className="cta-tag">Let's Get Started</p>
        <h2 className="cta-title">Not Sure Which Service You Need? <span className="gradient-text">Just Ask.</span></h2>
        <p className="cta-desc">We'll assess your situation for free and point you in the right direction — no pressure, no hidden fees.</p>
        <div className="cta-buttons">
          <Link to="/contact" className="btn-primary">Contact Us Today</Link>
          <a href="tel:0476593934" className="cta-btn-email">📞 0476 593 934</a>
        </div>
      </div>
    </section>
  )
}

/* ─── Quick-jump tabs ───────────────────────────────────────────────────── */
const TABS = [
  { label: 'IT Support',  id: 'it-support',  color: '#7c3aed' },
  { label: 'Drone',       id: 'drone',        color: '#06b6d4' },
  { label: 'CNC',         id: 'cnc',          color: '#10b981' },
]

function ServiceTabs() {
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return (
    <div className="service-tabs-bar">
      {TABS.map(t => (
        <button
          key={t.id}
          className="service-tab-btn"
          style={{ '--tab-color': t.color }}
          onClick={() => scrollTo(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default function Services() {
  usePageMeta(
    'IT Support, Drone Repair & CNC Services – Technovia Cheltenham VIC',
    'Full list of Technovia services: computer repair, drone motor & battery repair, WiFi setup, CNC design and programming. Cheltenham, VIC. Call 0476 593 934.'
  )
  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="page-hero">
        <div className="page-hero-grid" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1>Our <span className="gradient-text">Services</span></h1>
          <p>
            At Technovia, we're passionate about providing top-notch, reliable, and budget-friendly
            tech services for individuals, small businesses, and creative professionals. Our expertise
            covers everything from IT support to drone repair and CNC designing and programming.
          </p>
        </div>
      </div>

      <ServiceTabs />

      <ServiceCategory
        id="it-support"
        title="IT Support &amp; Services"
        colorClass="color-purple"
        accent="#a78bfa"
        heroImg="https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=1200&q=80"
        heroAlt="IT support technician"
        intro="Comprehensive IT solutions for homes and businesses — from device repair to full network setup and software support."
        subsections={IT_SUBSECTIONS}
      />

      <ServiceCategory
        id="drone"
        title="Drone Repair &amp; Services"
        colorClass="color-cyan"
        accent="#38bdf8"
        heroImg="https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1200&q=80"
        heroAlt="Drone repair and battery service Cheltenham Technovia"
        intro="Professional drone diagnostics, repair, battery servicing, and maintenance for all major brands — hobby to commercial."
        subsections={DRONE_SUBSECTIONS}
      />

      <ServiceCategory
        id="cnc"
        title="CNC Designing &amp; Programming"
        colorClass="color-green"
        accent="#34d399"
        heroImg="https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=1200&q=80"
        heroAlt="CNC machine"
        intro="Precision CNC design and programming services — from custom signage and artwork to full machine-ready G-code toolpaths."
        subsections={CNC_SUBSECTIONS}
      />

      <CTAStrip />
      <Footer />
    </div>
  )
}
