// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { PRODUCTS } from '../index.js'
import AppMockScreen from './AppMockScreens.jsx'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

function ProductMock({ product }) {
  return (
    <motion.div
      className={`product-mock ${product.colorClass}`}
      data-cursor="OPEN"
      initial={{ opacity: 0, y: 50, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
    >
      <div className="product-mock-chrome">
        <span /><span /><span />
        <div className="product-mock-url">{product.url.replace('https://', '')}</div>
      </div>
      <div className="product-mock-screen">
        <AppMockScreen id={product.id} />
      </div>
      <div className="product-mock-body">
        <div className="product-mock-name">{product.label}</div>
        <ul className="product-mock-list">
          {product.features.slice(0, 3).map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

function ProductRow({ product, index }) {
  const reversed = index % 2 === 1
  return (
    <div className={`product-row${reversed ? ' reversed' : ''}`}>
      <motion.div
        className="product-copy"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
      >
        <div className="product-index">0{index + 1}</div>
        <h3 className="product-title">{product.label}</h3>
        <p className="product-tagline">{product.tagline}</p>
        <p className="product-desc">{product.desc}</p>
        <div className="product-tags">
          {product.tags.map((t) => (
            <span key={t} className="product-tag">{t}</span>
          ))}
        </div>
        <a href={product.url} target="_blank" rel="noopener noreferrer" className="product-link">
          Explore {product.label} →
        </a>
      </motion.div>
      <ProductMock product={product} />
    </div>
  )
}

export default function ProductsShowcase() {
  return (
    <section className="products-section">
      <div className="section-header">
        <div className="section-tag in-view">Products by Technovia</div>
        <h2 className="section-title in-view">
          Software We <span className="gradient-text">Built &amp; Run</span>
        </h2>
        <p className="section-desc in-view">
          Beyond repairs and support — real, working platforms our customers use every day.
        </p>
      </div>
      <div className="products-list">
        {PRODUCTS.map((p, i) => (
          <ProductRow key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  )
}
