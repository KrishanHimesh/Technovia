// Mini "screenshot" mockups for each Technovia product — a realistic photo
// backdrop (via product.image) with illustrative UI chrome layered on top.
// The photo grounds the mock in something tangible; the overlay chips/rows
// are illustrative sample data, not a real captured screenshot.

function PhotoLayer({ image, label }) {
  if (!image) return null
  return (
    <>
      <img src={image} alt={label || ''} className="mockui-photo" loading="lazy" />
      <div className="mockui-photo-scrim" />
    </>
  )
}

function TechnoPOSMock({ image }) {
  return (
    <div className="mockui-photo-wrap">
      <PhotoLayer image={image} label="TechnoPOS retail dashboard" />
      <div className="mockui mockui-pos">
        <div className="mockui-chips">
          <div className="mockui-chip"><span className="mockui-chip-label">Sales</span><span className="mockui-chip-value">$2,480</span></div>
          <div className="mockui-chip"><span className="mockui-chip-label">Orders</span><span className="mockui-chip-value">34</span></div>
          <div className="mockui-chip"><span className="mockui-chip-label">Stock</span><span className="mockui-chip-value">128</span></div>
        </div>
        <div className="mockui-rows">
          <div className="mockui-row"><span className="mockui-dot" /><span>Wireless Mouse</span><span className="mockui-row-val">$24.00</span></div>
          <div className="mockui-row"><span className="mockui-dot" /><span>USB-C Cable</span><span className="mockui-row-val">$12.50</span></div>
        </div>
      </div>
    </div>
  )
}

function ChairTimeMock({ image }) {
  return (
    <div className="mockui-photo-wrap">
      <PhotoLayer image={image} label="ChairTime booking calendar" />
      <div className="mockui mockui-booking">
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
    </div>
  )
}

function InvoiceGenMock({ image }) {
  return (
    <div className="mockui-photo-wrap">
      <PhotoLayer image={image} label="InvoiceGen invoice screen" />
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
    </div>
  )
}

function WFHTrackerMock({ image }) {
  return (
    <div className="mockui-photo-wrap">
      <PhotoLayer image={image} label="WFH Tracker" />
      <div className="mockui mockui-wfh">
        <div className="mockui-timer">02:14:08</div>
        <div className="mockui-rows">
          <div className="mockui-row"><span className="mockui-dot" /><span>Internet</span><span className="mockui-row-val">$45.00</span></div>
        </div>
      </div>
    </div>
  )
}

const MOCKS = {
  app: TechnoPOSMock,
  booking: ChairTimeMock,
  invoice: InvoiceGenMock,
  wfh: WFHTrackerMock,
}

export default function AppMockScreen({ id, image }) {
  const Mock = MOCKS[id]
  if (!Mock) return null
  return <Mock image={image} />
}
