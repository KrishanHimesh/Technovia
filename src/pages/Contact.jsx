import { useState } from 'react'
import emailjs from '@emailjs/browser'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { useInView } from '../index.js'

// Remember to update these with your actual EmailJS dashboard credentials!
const EMAILJS_SERVICE_ID  = 'service_ffwavkv'        // ✅ your Gmail service
const EMAILJS_TEMPLATE_ID = 'template_9mvxd6v'        // ⬅ replace this
const EMAILJS_PUBLIC_KEY  = 'APi_ENA19Ymke5qUI'

const SERVICE_OPTIONS = [
  'IT Support & Services',
  'Drone Repair & Services',
  'CNC Programming & Designing',
  'General Enquiry',
]

function ContactForm() {
  const [ref, inView] = useInView()
  const [submitted, setSubmitted] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSending(true)

    try {
      // 1. Admin Notification Email
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          phone: form.phone || 'Not provided',
          service: form.service || 'General Enquiry',
          message: form.message,
          to_email: 'krishanhimesh@gmail.com',
        },
        EMAILJS_PUBLIC_KEY
      )

      // 2. Auto-Reply Email to Customer
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        'template_ayyxvp9', 
        {
          to_name: form.name,
          to_email: form.email,
          service: form.service || 'General Enquiry',
          message: form.message,
        },
        EMAILJS_PUBLIC_KEY
      )

      setSubmitted(true)
      setForm({ name: '', email: '', phone: '', service: '', message: '' })
    } catch (err) {
      console.error('EmailJS error:', err)
      alert('Oops! Something went wrong while sending your message. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div
      ref={ref}
      className={`contact-form-card${inView ? ' in-view' : ''}`}
      style={{ transitionDelay: '0.1s' }}
    >
      <div className="contact-form-title">Send Us a Message</div>

      {submitted ? (
        <div className="form-success show">
          <div className="form-success-icon">✅</div>
          <p style={{ fontFamily: "'DM Sans',sans-serif", color: 'rgba(255,255,255,0.7)', marginTop: 8 }}>
            Thanks! We'll be in touch shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                id="name" name="name" type="text"
                placeholder="Jane Smith"
                value={form.name} onChange={handleChange} required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                id="email" name="email" type="email"
                placeholder="jane@example.com"
                value={form.email} onChange={handleChange} required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone" name="phone" type="tel"
                placeholder="04xx xxx xxx"
                value={form.phone} onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="service">Service Required</label>
              <select id="service" name="service" value={form.service} onChange={handleChange}>
                <option value="">Select a service…</option>
                {SERVICE_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message" name="message"
              placeholder="Tell us what's going on and how we can help…"
              value={form.message} onChange={handleChange} required
            />
          </div>

          <button type="submit" className="btn-primary form-submit" disabled={isSending}>
            {isSending ? 'Sending...' : 'Send Message →'}
          </button>
        </form>
      )}
    </div>
  )
}

function ContactInfo() {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} className={`contact-info-card${inView ? ' in-view' : ''}`}>
      <div className="contact-info-title">Get In Touch</div>

      <div className="contact-item">
        <div className="contact-item-icon">📍</div>
        <div>
          <div className="contact-item-label">Location</div>
          <div className="contact-item-value">Cheltenham, VIC, Australia</div>
        </div>
      </div>

      <div className="contact-item">
        <div className="contact-item-icon">📱</div>
        <div>
          <div className="contact-item-label">Mobile</div>
          <div className="contact-item-value">
            <a href="tel:0476593934">0476 593 934</a>
          </div>
        </div>
      </div>

      <div className="contact-item">
        <div className="contact-item-icon">✉</div>
        <div>
          <div className="contact-item-label">Email</div>
          <div className="contact-item-value">
            <a href="mailto:technoviaservices@gmail.com">technoviaservices@gmail.com</a>
          </div>
        </div>
      </div>

      <div className="contact-item">
        <div className="contact-item-icon">🕐</div>
        <div>
          <div className="contact-item-label">Response Time</div>
          <div className="contact-item-value">Usually within a few hours</div>
        </div>
      </div>

      <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <a href="tel:0476593934" className="btn-primary" style={{ textAlign: 'center', padding: '12px 0' }}>
          📞 Call Now
        </a>
        <a href="mailto:technoviaservices@gmail.com" className="cta-btn-email" style={{ display: 'block', textAlign: 'center', padding: '12px 0' }}>
          ✉ Send Email
        </a>
      </div>
    </div>
  )
}

export default function Contact() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-hero">
        <div className="page-hero-grid" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1>Contact <span className="gradient-text">Us</span></h1>
          <p>Reach out — we typically respond the same day and are always happy to help.</p>
        </div>
      </div>

      <section className="contact-section">
        <div className="contact-grid">
          <ContactInfo />
          <ContactForm />
        </div>
      </section>

      <Footer />
    </div>
  )
}