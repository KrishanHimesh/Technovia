// Hand-built mini "screenshot" mockups for each Technovia product — CSS/HTML only,
// no external images. Illustrative UI chrome, not real captured data.

function TechnoPOSMock() {
  return (
    <div className="mockui mockui-pos">
      <div className="mockui-chips">
        <div className="mockui-chip"><span className="mockui-chip-label">Sales</span><span className="mockui-chip-value">$2,480</span></div>
        <div className="mockui-chip"><span className="mockui-chip-label">Orders</span><span className="mockui-chip-value">34</span></div>
        <div className="mockui-chip"><span className="mockui-chip-label">Stock</span><span className="mockui-chip-value">128</span></div>
      </div>
      <div className="mockui-bars">
        {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8].map((h, i) => (
          <span key={i} style={{ height: `${h * 100}%` }} />
        ))}
      </div>
      <div className="mockui-rows">
        <div className="mockui-row"><span className="mockui-dot" /><span>Wireless Mouse</span><span className="mockui-row-val">$24.00</span></div>
        <div className="mockui-row"><span className="mockui-dot" /><span>USB-C Cable</span><span className="mockui-row-val">$12.50</span></div>
      </div>
    </div>
  )
}

function ChairTimeMock() {
  const days = Array.from({ length: 21 })
  return (
    <div className="mockui mockui-booking">
      <div className="mockui-cal">
        {days.map((_, i) => (
          <span key={i} className={i === 10 ? 'mockui-cal-today' : ''} />
        ))}
      </div>
      <div className="mockui-rows">
        <div className="mockui-row">
          <span className="mockui-avatar" />
          <span>10:00 — Sarah K.</span>
          <span className="mockui-tag">Confirmed</span>
        </div>
        <div className="mockui-row">
          <span className="mockui-avatar" />
          <span>11:30 — James T.</span>
          <span className="mockui-tag">Confirmed</span>
        </div>
      </div>
    </div>
  )
}

function InvoiceGenMock() {
  return (
    <div className="mockui mockui-invoice">
      <div className="mockui-invoice-head">
        <span>INVOICE #1042</span>
        <span className="mockui-badge">PAID</span>
      </div>
      <div className="mockui-invoice-lines">
        <div className="mockui-invoice-line"><span>Website maintenance</span><span>$180.00</span></div>
        <div className="mockui-invoice-line"><span>Drone battery service</span><span>$65.00</span></div>
        <div className="mockui-invoice-line"><span>CNC panel cut</span><span>$120.00</span></div>
      </div>
      <div className="mockui-invoice-total"><span>Total</span><span>$365.00</span></div>
    </div>
  )
}

function WFHlyMock() {
  return (
    <div className="mockui mockui-wfh">
      <div className="mockui-timer">02:14:08</div>
      <div className="mockui-bars mockui-bars-week">
        {[0.3, 0.5, 0.7, 0.4, 0.9, 0.2, 0.1].map((h, i) => (
          <span key={i} style={{ height: `${h * 100}%` }} />
        ))}
      </div>
      <div className="mockui-rows">
        <div className="mockui-row"><span className="mockui-dot" /><span>Internet</span><span className="mockui-row-val">$45.00</span></div>
      </div>
    </div>
  )
}

const MOCKS = {
  app: TechnoPOSMock,
  booking: ChairTimeMock,
  invoice: InvoiceGenMock,
  wfh: WFHlyMock,
}

export default function AppMockScreen({ id }) {
  const Mock = MOCKS[id]
  if (!Mock) return null
  return <Mock />
}
