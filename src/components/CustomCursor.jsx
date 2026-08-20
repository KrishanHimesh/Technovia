import { useEffect, useRef, useState } from 'react'

// A soft glowing dot that follows the cursor with a light trailing lag,
// plus a tighter ring that snaps instantly and can carry a short text label
// (e.g. "VIEW") when hovering elements tagged with data-cursor="...".
// Desktop-only — bails out on touch devices and when the user prefers reduced motion.
export default function CustomCursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const [label, setLabel] = useState('')

  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isTouch || reduceMotion) return

    document.body.classList.add('has-custom-cursor')

    const dot  = dotRef.current
    const ring = ringRef.current
    let mx = window.innerWidth / 2, my = window.innerHeight / 2
    let rx = mx, ry = my
    let raf

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      ring.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`
    }
    const onDown = () => dot.classList.add('cursor-active')
    const onUp   = () => dot.classList.remove('cursor-active')
    const onOverInteractive = (e) => {
      const labeled = e.target.closest('[data-cursor]')
      const interactive = e.target.closest('a, button, .work-card, .service-card, .app-card, .testimonial-card, [data-cursor]')
      ring.classList.toggle('cursor-hover', !!interactive)
      ring.classList.toggle('cursor-labeled', !!labeled)
      setLabel(labeled ? labeled.getAttribute('data-cursor') : '')
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('mouseover', onOverInteractive)

    const tick = () => {
      rx += (mx - rx) * 0.18
      ry += (my - ry) * 0.18
      dot.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      document.body.classList.remove('has-custom-cursor')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('mouseover', onOverInteractive)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursor-ring">
        {label && <span className="cursor-label">{label}</span>}
      </div>
      <div ref={dotRef}  className="cursor-dot" />
    </>
  )
}
