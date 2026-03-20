const WrenchIcon = () => (
  <svg viewBox="0 0 24 24" stroke="#fff" fill="none" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0
      l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3
      l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
)

const COLS = [
  {
    heading: 'Platform',
    links: [
      { label: 'How It Works',  href: '#how-it-works' },
      { label: 'Features',      href: '#features'     },
      { label: 'Matching',      href: '#matching'     },
      { label: 'Pricing',       href: '#pricing'      },
    ],
  },
  {
    heading: 'Use cases',
    links: [
      { label: 'Post a Job',         href: '#' },
      { label: 'Join as Technician', href: '#' },
      { label: 'Asset Reminders',    href: '#' },
      { label: 'Admin Portal',       href: '#' },
    ],
  },
  {
    heading: 'Project',
    links: [
      { label: 'GitHub Repo',  href: 'https://github.com/mercyyy12/fixora', external: true },
      { label: 'Architecture', href: '#' },
      { label: 'Tech Stack',   href: '#tech-stack' },
      { label: 'README',       href: '#' },
    ],
  },
]

export default function Footer() {
  return (
    <footer>
      <div className="container">

        <div className="footer-grid">
          {/* Brand */}
          <div>
            <a href="#" className="nav-logo" style={{ marginBottom: '12px', display: 'inline-flex' }}>
              <div className="nav-logo-mark"><WrenchIcon /></div>
              Fixora
            </a>
            <p className="footer-brand-desc">
              Home repair platform connecting homeowners with verified local
              technicians. Built with MERN&nbsp;+&nbsp;Go.
            </p>
          </div>

          {/* Link columns */}
          {COLS.map(col => (
            <div key={col.heading} className="footer-col">
              <h4>{col.heading}</h4>
              <ul className="footer-links">
                {col.links.map(l => (
                  <li key={l.label}>
                    <a href={l.href} target={l.external ? '_blank' : undefined} rel={l.external ? 'noreferrer' : undefined}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <span>Fixora &copy; {new Date().getFullYear()} &mdash; A college project. Built with MERN + Go.</span>
          <div className="footer-bottom-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="https://github.com/mercyyy12/fixora" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </div>

      </div>
    </footer>
  )
}
