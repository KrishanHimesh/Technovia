import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home        from './pages/Home.jsx'
import About       from './pages/About.jsx'
import Services    from './pages/Services.jsx'
import Contact     from './pages/Contact.jsx'
import Gallery     from './pages/Gallery.jsx'
import Apps        from './pages/Apps.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/about"     element={<About />} />
        <Route path="/services"  element={<Services />} />
        <Route path="/contact"   element={<Contact />} />
        <Route path="/gallery"   element={<Gallery />} />
        <Route path="/apps"      element={<Apps />} />
      </Routes>
    </BrowserRouter>
  )
}
