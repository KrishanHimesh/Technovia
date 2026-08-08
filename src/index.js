// ─────────────────────────────────────────────────────────────────────────────
//  index.js  —  shared hooks, data constants, and utilities
//  Import from this file anywhere in the project:
//    import { useInView, SERVICES, NAV_LINKS } from '../index.js'
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useState, useEffect } from 'react'

// ── Hook ─────────────────────────────────────────────────────────────────────
/**
 * useInView(threshold?)
 * Returns [ref, inView].  inView flips true once the element enters the
 * viewport and stays true (good for one-shot entrance animations).
 */
export function useInView(threshold = 0.15) {
  const ref     = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    const el = ref.current
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, inView]
}

// ── Navigation ────────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: 'Home',         path: '/'         },
  { label: 'About',        path: '/about'    },
  { label: 'Our Services', path: '/services' },
  { label: 'Our Work',     path: '/work'     },
  { label: 'Gallery',      path: '/gallery'  },
  { label: 'Apps',         path: '/apps'     },
  { label: 'Contact',      path: '/contact'  },
]

// ── Work / Portfolio ──────────────────────────────────────────────────────────
export const WORK_PROJECTS = [
  {
    id: 'unityproducts',
    tag: 'E-Commerce · POS Integration',
    title: 'Unity Products',
    client: 'unityproducts.lk',
    url: 'https://unityproducts.lk',
    colorClass: 'color-purple',
    summary:
      "A full online storefront for Unity Products, built and connected directly to TechnoPOS so stock, pricing, and orders stay in sync between the website and the in-store till in real time.",
    highlights: [
      'Custom online store design & build',
      'Live two-way sync with TechnoPOS inventory',
      'Orders placed online flow straight into POS',
      'Real-time stock levels — no more overselling',
      'Centralised product & pricing management',
      'Secure checkout & order tracking for customers',
    ],
    stack: ['Online Store', 'TechnoPOS API', 'Inventory Sync', 'Order Management'],
  },
]

// ── Services ──────────────────────────────────────────────────────────────────
export const SERVICES = [
  {
    id: 1,
    title:      'IT Support & Services',
    icon:       '',
    image:      'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&q=80',
    colorClass: 'color-purple',
    items: [
      'Computers/Laptops repair & services',
      'Website development & digital marketing',
      'Email setup and management',
      'Software installation & support',
      'WiFi & networking services',
      'Data back up & recovery',
    ],
  },
  {
    id: 2,
    title:      'Drone Repair & Services',
    icon:       '',
    image:      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&q=80',
    colorClass: 'color-cyan',
    items: [
      'Drone repair services',
      'Drone battery repair & services',
      'Drone maintenance services',
    ],
  },
  {
    id: 3,
    title:      'CNC Programming & Designing',
    icon:       '',
    image:      'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=600&q=80',
    colorClass: 'color-green',
    items: [
      'CNC designing & services',
      'CNC programming & services',
    ],
  },
]

// ── Stats ─────────────────────────────────────────────────────────────────────
export const STATS = [
  { label: 'Happy Clients',    value: '60+',  icon: '😊' },
  { label: 'Projects Done',    value: '250+', icon: '✅' },
  { label: 'Years Experience', value: '5+',    icon: '🏆' },
  { label: 'Support Hours',    value: '24/7',  icon: '🕐' },
]

// ── Why Us features ───────────────────────────────────────────────────────────
export const WHY_FEATURES = [
  { icon: '⚡', title: 'Fast Response',    desc: 'Same-day support for critical issues — your downtime is our priority.' },
  { icon: '🔒', title: 'Secure & Reliable', desc: 'Enterprise-grade security practices for businesses of all sizes.' },
  { icon: '🌐', title: 'Remote & On-Site', desc: 'We come to you or fix it remotely — your choice, your convenience.' },
  { icon: '💡', title: 'Expert Team',      desc: 'Certified technicians with years of hands-on industry experience.' },
]

// ── Footer data ───────────────────────────────────────────────────────────────
export const FOOTER_SERVICES = [
  'IT Support & Services',
  'Drone Repair & Services',
  'CNC Programming & Design',
]

export const FOOTER_CONTACTS = [
  { icon: '📍', text: 'Cheltenham, VIC' },
  { icon: '📱', text: '0476 593 934' },
  { icon: '✉',  text: 'info@technovia.com.au' },
]

// ── About page ────────────────────────────────────────────────────────────────
export const ABOUT_VALUES = [
  { icon: '🎯', title: 'Our Mission',  desc: 'To make technology accessible, reliable, and stress-free for every home and business in our community.' },
  { icon: '👁', title: 'Our Vision',   desc: 'To be the most trusted technology partner in Cheltenham — known for speed, honesty, and results.' },
  { icon: '🤝', title: 'Our Promise',  desc: 'Transparent pricing, no jargon, and work we stand behind. If it\'s not right, we fix it.' },
]

export const TEAM = [
  { name: 'Krishan Himesh.',  role: 'Lead IT Technician',    initials: 'AM', color: '#7c3aed' },
  /*{ name: 'Jordan T.', role: 'Drone Specialist',     initials: 'JT', color: '#06b6d4' },
  { name: 'Sam K.',   role: 'CNC Engineer',           initials: 'SK', color: '#10b981' },*/
]

// ── SEO helpers ────────────────────────────────────────────────────────────────
/**
 * usePageMeta(title, description)
 * Sets document <title> and meta description for each page client-side.
 */
// ── Animated count-up (for stats) ─────────────────────────────────────────────
export function useCountUp(value, active, duration = 1400) {
  const match = String(value).match(/^(\d+)(.*)$/)
  const target = match ? parseInt(match[1], 10) : null
  const suffix = match ? match[2] : ''
  const [display, setDisplay] = useState(match ? '0' + suffix : value)
  const started = useRef(false)

  useEffect(() => {
    if (!active || started.current || target === null) return
    started.current = true
    const start = performance.now()
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * target) + suffix)
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [active, target, suffix, duration])

  return display
}

export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title
    let desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', description)
  }, [title, description])
}

// ── Testimonials ──────────────────────────────────────────────────────────────
export const TESTIMONIALS = [
  {
    quote: "Our laptop wouldn't boot the morning of a big deadline — Technovia had it back up and running the same day. Genuinely fast, honest service.",
    name: 'Sarah M.',
    role: 'Small Business Owner, Cheltenham',
  },
  {
    quote: "We switched our shop over to TechnoPOS and it's made stock and sales so much easier to manage. No more spreadsheets.",
    name: 'David R.',
    role: 'Retail Store Owner',
  },
  {
    quote: 'Sent in a drone with a cracked frame and dead battery expecting the worst — came back flying like new, for a fraction of what a replacement would\'ve cost.',
    name: 'James P.',
    role: 'Drone Hobbyist',
  },
]
