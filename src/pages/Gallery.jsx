import Navbar from '../components/Navbar.jsx'
import AnimatedBackdrop from '../components/AnimatedBackdrop.jsx'
import Footer from '../components/Footer.jsx'
import { useInView, usePageMeta } from '../index.js'

// ── Real work photo data ──────────────────────────────────────────────────────
// Replace src values with your own photos (drop them in /public/gallery/)
const GALLERY_ITEMS = [
  {
    id: 1,
    category: 'drone',
    label: 'Drone Repair',
    caption: 'Diagnosing a DJI Mavic Pro with motor failure — full inspection before repair.',
    src: '/gallery/drone-repair-1.jpeg',
    alt: 'Drone motor repair Cheltenham Technovia',
    fallbackBg: '#0e1a2e',
    fallbackIcon: '🔧',
  },
  {
    id: 2,
    category: 'battery',
    label: 'Battery Service',
    caption: 'Cell balancing and BMS check on a swollen LiPo pack.',
    src: '/gallery/battery-service-2.jpeg',
    alt: 'Drone battery repair cell balancing Cheltenham',
    fallbackBg: '#0e1a1e',
    fallbackIcon: '🔋',
  },
  {
    id: 3,
    category: 'drone',
    label: 'Frame Repair',
    caption: 'Post-crash frame and arm replacement — ready to fly again.',
    src: '/gallery/drone-frame-1.jpeg',
    alt: 'Drone frame repair after crash Cheltenham Technovia',
    fallbackBg: '#0e1a2e',
    fallbackIcon: '✈️',
  },
  {
    id: 4,
    category: 'battery',
    label: 'Battery Diagnostics',
    caption: 'Capacity test and discharge cycle analysis before reconditioning.',
    src: '/gallery/battery-diag-1.jpeg',
    alt: 'Drone battery diagnostics capacity test',
    fallbackBg: '#0e1a1e',
    fallbackIcon: '📊',
  },
  {
    id: 5,
    category: 'drone',
    label: 'Camera & Gimbal',
    caption: 'Gimbal ribbon cable replacement on a Mavic Air 2.',
    src: '/gallery/drone-camera-1.jpeg',
    alt: 'Drone gimbal camera repair Cheltenham Technovia',
    fallbackBg: '#0e1a2e',
    fallbackIcon: '📷',
  },
  {
    id: 6,
    category: 'battery',
    label: 'Bulk Fixing',
    caption: 'Fixing a bulk lot of customer batteries — we can handle any volume.',
    src: '/gallery/battery-buk-fix-1.jpeg',
    alt: 'Fixing Bulk Drone Batteries Cheltenham Technovia',
    fallbackBg: '#0e1a1e',
    fallbackIcon: '♻️',
  },

]

const TABS = [
  { id: 'all',     label: 'All Work' },
  { id: 'drone',   label: 'Drone Repairs' },
  { id: 'battery', label: 'Battery Services' },
  { id: 'CNC',     label: 'CNC Jobs' },

]

function GalleryCard({ item, index }) {
  const [ref, inView] = useInView(0.08)
  const [imgError, setImgError] = React.useState(false)

  return (
    <div
      ref={ref}
      className={`gallery-card${inView ? ' in-view' : ''}`}
      style={{ transitionDelay: `${index * 0.07}s` }}
    >
      <div className="gallery-card-img-wrap">
        {!imgError ? (
          <img
            src={item.src}
            alt={item.alt}
            loading="lazy"
            onError={() => setImgError(true)}
            className="gallery-card-img"
          />
        ) : (
          <div
            className="gallery-card-fallback"
            style={{ background: item.fallbackBg }}
          >
            <span className="gallery-card-fallback-icon">{item.fallbackIcon}</span>
            <span className="gallery-card-fallback-label">Photo coming soon</span>
          </div>
        )}
        <div className="gallery-card-badge">{item.label}</div>
      </div>
      <div className="gallery-card-caption">{item.caption}</div>
    </div>
  )
}

import React, { useState } from 'react'

export default function Gallery() {
  usePageMeta(
    'Repair Gallery | Technovia — Cheltenham, VIC',
    'Real drone repair, battery service, and frame-fix photos from Technovia in Cheltenham, VIC — see the quality of our work before you book.',
    '/gallery'
  )
  const [activeTab, setActiveTab] = useState('all')
  const filtered = activeTab === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(i => i.category === activeTab)

  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="page-hero">
        <AnimatedBackdrop variant="cyan" />
        <div className="page-hero-grid" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1>Our <span className="gradient-text">Work Gallery</span></h1>
          <p>
            Real repairs. Real results. Browse photos from our drone repair and battery
            service jobs — so you know exactly what to expect when you bring your gear to us.
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="gallery-tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`gallery-tab-btn${activeTab === t.id ? ' active' : ''}`}
            onClick={() => setActiveTab(t.id)}
            aria-pressed={activeTab === t.id}
          >
            {t.label}
          </button>
        ))}
      </div>

 
      {/* Grid */}
      <section className="gallery-grid-section">
        <div className="gallery-grid">
          {filtered.map((item, i) => (
            <GalleryCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-box in-view">
          <div className="cta-orb-tr" /><div className="cta-orb-bl" />
          <p className="cta-tag">Seen enough?</p>
          <h2 className="cta-title">Ready to book a <span className="gradient-text">repair?</span></h2>
          <p className="cta-desc">Call us or drop in — we'll assess your drone or battery for free.</p>
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
