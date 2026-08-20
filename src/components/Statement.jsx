// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

// Word-by-word reveal, driven by scroll progress through the section.
function RevealWords({ text, progress, className }) {
  const words = text.split(' ')
  return (
    <span className={className}>
      {words.map((w, i) => {
        const start = i / words.length
        const end = start + 1 / words.length
        return <Word key={i} word={w} progress={progress} start={start} end={end} />
      })}
    </span>
  )
}

function Word({ word, progress, start, end }) {
  const opacity = useTransform(progress, [start, end], [0.15, 1])
  return (
    <motion.span style={{ opacity, display: 'inline-block', marginRight: '0.28em' }}>
      {word}
    </motion.span>
  )
}

export default function Statement() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.4'],
  })

  return (
    <section ref={ref} className="statement-section">
      <div className="statement-inner">
        <RevealWords
          text="We don't just build websites."
          progress={scrollYProgress}
          className="statement-line statement-line-muted"
        />
        <RevealWords
          text="We build systems that help businesses run, sell and grow."
          progress={scrollYProgress}
          className="statement-line statement-line-main"
        />
      </div>
    </section>
  )
}
