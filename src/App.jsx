import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home        from './pages/Home.jsx'
import About       from './pages/About.jsx'
import Services    from './pages/Services.jsx'
import Contact     from './pages/Contact.jsx'
import Gallery     from './pages/Gallery.jsx'
import Apps        from './pages/Apps.jsx'
import Work        from './pages/Work.jsx'
import CustomCursor from './components/CustomCursor.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <CustomCursor />
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/about"     element={<About />} />
        <Route path="/services"  element={<Services />} />
        <Route path="/contact"   element={<Contact />} />
        <Route path="/gallery"   element={<Gallery />} />
        <Route path="/apps"      element={<Apps />} />
        <Route path="/work"      element={<Work />} />
      </Routes>
    </BrowserRouter>
  )
}
