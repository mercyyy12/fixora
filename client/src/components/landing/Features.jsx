import { useScrollReveal } from '../../hooks/useScrollReveal'

const FEATURES = [
  {
    title: 'Geo-based context',
    body: 'Leaflet.js maps seamlessly embedded into jobs, showing visual locations and job constraints efficiently.',
    tags: ['Leaflet.js', 'OpenStreetMap'],
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
    title: 'Detailed reports',
    body: 'Homeowners can report issues or fraudulent technicians. Admins review and resolve complaints via a dedicated system.',
    tags: ['Admin System', 'Trust'],
    icon: <svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  },
  {
    title: 'Bidirectional ratings',
    body: 'Once a job is completed, both the homeowner and technician can rate each other to ensure high accountability and marketplace trust.',
    tags: ['Trust System', 'Accountability'],
    icon: <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  },
  {
    title: 'Live admin analytics',
    body: 'A dedicated Go microservice computes platform metrics in real-time, powering a stunning and professional administrative oversight dashboard.',
    tags: ['Golang', 'Microservice'],
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
