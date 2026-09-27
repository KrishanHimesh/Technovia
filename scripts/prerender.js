// scripts/prerender.js
//
// Vite/React Router builds a single dist/index.html and Vercel's SPA
// rewrite (vercel.json) serves that same file for every route. That means
// every URL had an identical <title>/<meta description>/<canonical>/<JSON-LD>
// until client-side JS ran (see usePageMeta in src/index.js) — search
// engines and social scrapers that don't execute JS (or execute it late)
// saw the homepage's tags on every page, which suppresses indexing of the
// inner pages and duplicates the homepage's signals across the site.
//
// This script runs after `vite build` and writes a real, static
// dist/<route>/index.html for every route with the correct <title>,
// meta description, canonical, Open Graph/Twitter tags, and page-specific
// JSON-LD already baked in — plus a <noscript> fallback with the page's
// real heading/copy so even a no-JS crawler sees actual content. Vercel
// serves a matching static file before falling back to the SPA rewrite,
// so this doesn't change how the app works for real users; React Router
// still takes over and re-renders the same route client-side.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = join(__dirname, '..', 'dist')
const SITE = 'https://www.technovia.com.au'

const routes = [
  {
    path: '/',
    title: 'Technovia | IT Support, Drone Repair & CNC Services — Cheltenham, VIC',
    description:
      "Technovia is Cheltenham's trusted tech specialist — IT support, drone repair, CNC programming, plus TechnoPOS, ChairTime, InvoiceGen & WFH Tracker. Same-day service, honest pricing.",
    h1: 'IT Support, Drone Repair & CNC Services in Cheltenham, VIC',
    intro:
      "Technovia is Cheltenham's trusted tech specialist, built for individuals, small businesses, and creative professionals.",
  },
  {
    path: '/services',
    title: 'IT Support, Drone Repair & CNC Services – Technovia Cheltenham VIC',
    description:
      'Full list of Technovia services: computer repair, drone motor & battery repair, WiFi setup, CNC design and programming. Cheltenham, VIC. Call 0476 593 934.',
    h1: 'Our Services',
    intro:
      "At Technovia, we're passionate about providing top-notch, reliable, and budget-friendly tech services for individuals, small businesses, and creative professionals. Our expertise covers everything from IT support to drone repair and CNC designing and programming.",
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, item: { '@type': 'Service', name: 'IT Support & Repairs', provider: { '@type': 'LocalBusiness', name: 'Technovia' }, areaServed: 'Cheltenham, VIC' } },
        { '@type': 'ListItem', position: 2, item: { '@type': 'Service', name: 'Drone Repair & Services', provider: { '@type': 'LocalBusiness', name: 'Technovia' }, areaServed: 'Cheltenham, VIC' } },
        { '@type': 'ListItem', position: 3, item: { '@type': 'Service', name: 'CNC Programming & Designing', provider: { '@type': 'LocalBusiness', name: 'Technovia' }, areaServed: 'Cheltenham, VIC' } },
      ],
    },
  },
  {
    path: '/apps',
    title: 'Technovia Apps — TechnoPOS, ChairTime, InvoiceGen & WFH Tracker',
    description:
      'Access TechnoPOS, ChairTime, InvoiceGen, and WFH Tracker — the Technovia suite of business apps for POS, booking, invoicing, and remote work tracking.',
    h1: 'Technovia Apps',
    intro:
      'Everything you need, in one place. TechnoPOS, ChairTime, InvoiceGen, and WFH Tracker — four tools built to run your business, securely online, anytime, from any device.',
  },
  {
    path: '/work',
    title: 'Our Work | Technovia — Cheltenham, VIC',
    description:
      'Case studies of real projects built by Technovia, including Unity Products — an e-commerce platform fully integrated with TechnoPOS.',
    h1: 'Our Work',
    intro:
      'Real projects, built end-to-end — from custom software to fully connected e-commerce platforms powered by our own tools.',
  },
  {
    path: '/gallery',
    title: 'Repair Gallery | Technovia — Cheltenham, VIC',
    description:
      'Real drone repair, battery service, and frame-fix photos from Technovia in Cheltenham, VIC — see the quality of our work before you book.',
    h1: 'Our Work Gallery',
    intro:
      'Real repairs. Real results. Browse photos from our drone repair and battery service jobs — so you know exactly what to expect when you bring your gear to us.',
  },
  {
    path: '/about',
    title: 'About Technovia – Local Tech Experts in Cheltenham, VIC',
    description:
      "Learn about Technovia — Cheltenham's trusted IT support, drone repair, and CNC specialists. Fast, honest, local. Call 0476 593 934.",
    h1: 'About Technovia',
    intro:
      "At Technovia, we're passionate about providing top-notch, reliable, and budget-friendly tech services for individuals, small businesses, and creative professionals.",
  },
  {
    path: '/contact',
    title: 'Contact Technovia | IT, Drone & CNC Support — Cheltenham, VIC',
    description:
      'Get in touch with Technovia for IT support, drone repair, or CNC services in Cheltenham, VIC. Call 0476 593 934 or send an enquiry online.',
    h1: 'Contact Us',
    intro: 'Reach out — we typically respond the same day and are always happy to help.',
  },
]

const NAV_LINKS = routes
  .map((r) => `<a href="${r.path === '/' ? '/' : r.path}">${r.h1}</a>`)
  .join('\n      ')

function setTagByAttr(html, tagRegex, attrValue) {
  return html.replace(tagRegex, attrValue)
}

function buildHead(template, route) {
  let html = template

  // <title>
  html = html.replace(/<title>.*?<\/title>/s, `<title>${route.title}</title>`)

  // meta description
  html = html.replace(
    /<meta name="description" content=".*?"\s*\/>/s,
    `<meta name="description" content="${route.description}" />`
  )

  // canonical
  const url = `${SITE}${route.path}`
  html = html.replace(
    /<link rel="canonical" href=".*?"\s*\/>/s,
    `<link rel="canonical" href="${url}" />`
  )

  // Open Graph
  html = html.replace(/<meta property="og:title" content=".*?"\s*\/>/s, `<meta property="og:title" content="${route.title}" />`)
  html = html.replace(/<meta property="og:description" content=".*?"\s*\/>/s, `<meta property="og:description" content="${route.description}" />`)
  html = html.replace(/<meta property="og:url" content=".*?"\s*\/>/s, `<meta property="og:url" content="${url}" />`)

  // Twitter
  html = html.replace(/<meta name="twitter:title" content=".*?"\s*\/>/s, `<meta name="twitter:title" content="${route.title}" />`)
  html = html.replace(/<meta name="twitter:description" content=".*?"\s*\/>/s, `<meta name="twitter:description" content="${route.description}" />`)

  // fix the malformed favicon link (type="image/svg+xml" pointed at the PNG)
  html = html.replace(
    /<link rel="icon" type="image\/svg\+xml" href="\/technovia\.png"\s*\/>/,
    `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />\n    <link rel="icon" type="image/png" href="/technovia.png" />\n    <link rel="apple-touch-icon" href="/technovia.png" />`
  )

  // explicit robots directive (harmless, makes indexability unambiguous)
  if (!/<meta name="robots"/.test(html)) {
    html = html.replace('<meta charset="UTF-8" />', '<meta charset="UTF-8" />\n    <meta name="robots" content="index, follow" />')
  }

  // BreadcrumbList JSON-LD (helps eligibility for breadcrumb rich results)
  const breadcrumbItems = [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` }]
  if (route.path !== '/') {
    breadcrumbItems.push({ '@type': 'ListItem', position: 2, name: route.h1, item: url })
  }
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  }
  const extraJsonLd = route.jsonLd ? [route.jsonLd, breadcrumbLd] : [breadcrumbLd]
  const scripts = extraJsonLd
    .map((schema) => `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`)
    .join('\n  ')
  html = html.replace('</head>', `${scripts}\n  </head>`)

  return html
}

function buildNoscript(route) {
  return `<noscript>
      <main>
        <h1>${route.h1}</h1>
        <p>${route.intro}</p>
        <p>Technovia — IT support, drone repair, and CNC programming in Cheltenham, VIC.<br />
        Phone: <a href="tel:+61476593934">0476 593 934</a> · Email: <a href="mailto:info@technovia.com.au">info@technovia.com.au</a></p>
        <nav>
          ${NAV_LINKS}
        </nav>
      </main>
    </noscript>`
}

function run() {
  const templatePath = join(DIST, 'index.html')
  if (!existsSync(templatePath)) {
    console.error('dist/index.html not found — run `vite build` first.')
    process.exit(1)
  }
  const template = readFileSync(templatePath, 'utf8')

  for (const route of routes) {
    const head = buildHead(template, route)
    const noscript = buildNoscript(route)
    const finalHtml = head.replace('<div id="root"></div>', `<div id="root"></div>\n    ${noscript}`)

    const outDir = route.path === '/' ? DIST : join(DIST, route.path.slice(1))
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })
    const outFile = join(outDir, 'index.html')
    writeFileSync(outFile, finalHtml, 'utf8')
    console.log(`wrote ${outFile.replace(DIST, 'dist')}`)
  }
}

run()
