import { useScrollReveal } from '../../hooks/useScrollReveal'

const FEATURES = [
  {
    title: 'Geo-based matching',
    body: 'Leaflet.js maps with OpenStreetMap. Jobs and technicians shown as live pins. Distance calculated via the Haversine formula in the Go service.',
    tags: ['Leaflet.js', 'Go Haversine'],
    icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  },
  {
    title: 'Real-time updates',
    body: 'Socket.io keeps homeowners and technicians in sync — job status changes, chat messages, and assignment notifications arrive instantly.',
    tags: ['Socket.io', 'WebSockets'],
    icon: <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  },
  {
    title: 'Auth & verification',
    body: 'JWT authentication with role-based access for homeowners, technicians, and admins. Technician documents stored via Cloudinary.',
    tags: ['JWT', 'bcrypt', 'Cloudinary'],
    icon: <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  },
  {
    title: 'Secure payments',
    body: 'Razorpay and Stripe sandbox integration. Every transaction is tracked and linked to job status. Payment confirmation auto-updates job state.',
    tags: ['Razorpay', 'Stripe'],
    icon: <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  },
  {
    title: 'Maintenance reminders',
    body: 'Add home appliances once. A Go cron job checks service intervals daily and sends notifications when something is due.',
    tags: ['Go Cron', 'SMTP'],
    icon: <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  },
  {
    title: 'Trust scoring',
    body: 'The Go service calculates a trust score for every technician based on completed jobs, response time, ratings, and availability.',
    tags: ['Go Service', 'Algorithm'],
    icon: <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  },
]

export default function Features() {
  const headerRef  = useScrollReveal()
  const gridRef    = useScrollReveal()

  return (
    <section className="alt">
      <div className="container">

        <div className="section-header" ref={headerRef} data-reveal>
          <span className="label">Features</span>
          <h2>Built for the real world</h2>
          <p>Every feature is designed around how homeowners and technicians actually work.</p>
        </div>

        <div className="feature-grid" ref={gridRef} data-reveal="delay-1">
          {FEATURES.map(f => (
            <div key={f.title} className="feature-item">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
              <div className="feature-tags">
                {f.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
