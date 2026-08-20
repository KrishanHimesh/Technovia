// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { PROCESS_STEPS } from '../index.js'

export default function ProcessSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.75', 'end 0.4'],
  })
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 })

  return (
    <section ref={ref} className="process-section">
      <div className="section-header">
        <div className="section-tag in-view">How We Work</div>
        <h2 className="section-title in-view">
          Our <span className="gradient-text">Process</span>
        </h2>
      </div>

      <div className="process-track">
        <div className="process-line-bg" />
        <motion.div className="process-line-fill" style={{ scaleY }} />

        {PROCESS_STEPS.map((step, i) => (
          <motion.div
            key={step.n}
            className="process-step"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="process-dot" />
            <div className="process-num">{step.n}</div>
            <div>
              <div className="process-title">{step.title}</div>
              <div className="process-desc">{step.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
