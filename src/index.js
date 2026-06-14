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
  { label: 'Gallery',      path: '/gallery'  },
  { label: 'Apps',         path: '/apps'     },
  { label: 'Contact',      path: '/contact'  },
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
  { icon: '✉',  text: 'technoviaservices@gmail.com' },
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
export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title
    let desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', description)
  }, [title, description])
}
