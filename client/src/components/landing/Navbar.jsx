import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/landing/ThemeContext'

const SunIcon = () => (
  <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1"    x2="12" y2="3"/>
    <line x1="12" y1="21"   x2="12" y2="23"/>
    <line x1="4.22" y1="4.22"   x2="5.64"  y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1"  y1="12"   x2="3"  y2="12"/>
    <line x1="21" y1="12"   x2="23" y2="12"/>
    <line x1="4.22" y1="19.78"  x2="5.64"  y2="18.36"/>
    <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"/>
  </svg>
)

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

const WrenchIcon = () => (
  <svg viewBox="0 0 24 24" stroke="#fff" fill="none" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0
      l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3
      l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
)

export default function Navbar() {
  const { theme, toggle } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  const closeMobile = () => {
    setMobileOpen(false)
    document.body.style.overflow = ''
  }

  const toggleMobile = () => {
    const next = !mobileOpen
    setMobileOpen(next)
    document.body.style.overflow = next ? 'hidden' : ''
  }

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">

          <a href="#" className="nav-logo">
            <div className="nav-logo-mark"><WrenchIcon /></div>
            Fixora
          </a>

          <ul className="nav-links">
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#matching">Matching</a></li>
            <li><a href="#tech-stack">Tech Stack</a></li>
            <li><a href="#pricing">Pricing</a></li>
          </ul>

          <div className="nav-right">
            <button className="theme-toggle" onClick={toggle} title="Toggle theme">
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
            <Link to="/login" className="btn btn-ghost">Sign in</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get started</Link>
            <div className="nav-hamburger" onClick={toggleMobile}>
              <span /><span /><span />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`mobile-nav${mobileOpen ? ' open' : ''}`} id="mobile-nav">
        <a href="#how-it-works" onClick={closeMobile}>How It Works</a>
        <a href="#features"     onClick={closeMobile}>Features</a>
        <a href="#matching"     onClick={closeMobile}>Matching</a>
        <a href="#tech-stack"   onClick={closeMobile}>Tech Stack</a>
        <a href="#pricing"      onClick={closeMobile}>Pricing</a>
        <div className="mobile-nav-btns">
          <Link to="/login" className="btn btn-outline" onClick={closeMobile}>Sign in</Link>
          <Link to="/register" className="btn btn-primary" onClick={closeMobile}>Get started</Link>
        </div>
      </div>
    </>
  )
}
