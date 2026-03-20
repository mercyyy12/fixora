import { useToast } from '../../context/landing/ToastContext'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const ASSETS = [
  { name: 'Samsung AC Unit',   due: 'Last serviced 5 months ago', badgeClass: 'badge-accent',  label: 'Due now'  },
  { name: 'Geyser — Bathroom', due: 'Last serviced 2 months ago', style: { background:'rgba(181,134,10,0.1)', color:'var(--yellow)' }, label: 'Due soon' },
  { name: 'LG Refrigerator',   due: 'Last serviced 1 month ago',  badgeClass: 'badge-green',   label: 'OK'       },
  { name: 'Washing Machine',   due: 'Last serviced 3 weeks ago',  badgeClass: 'badge-green',   label: 'OK'       },
  { name: 'Water Purifier',    due: 'Last serviced 4 months ago', badgeClass: 'badge-accent',  label: 'Due now'  },
]

export default function Reminders() {
  const { showToast } = useToast()
  const panelRef = useScrollReveal()
  const infoRef  = useScrollReveal()

  return (
    <section className="alt">
      <div className="container">
        <div className="grid-2" style={{ gap: '72px' }}>

          {/* Assets panel */}
          <div ref={panelRef} data-reveal>
            <div className="assets-panel">
              <div className="assets-head">
                <span className="assets-head-title">Home Assets</span>
                <button className="btn btn-sm btn-outline"
                  onClick={() => showToast('Add asset — coming in Phase 5.')}>
                  + Add
                </button>
              </div>
              <div className="asset-list">
                {ASSETS.map(a => (
                  <div key={a.name} className="asset-row">
                    <div className="asset-label">
                      <div className="asset-name">{a.name}</div>
                      <div className="asset-due">{a.due}</div>
                    </div>
                    <span
                      className={`badge${a.badgeClass ? ' ' + a.badgeClass : ''}`}
                      style={a.style}>
                      {a.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Info */}
          <div ref={infoRef} data-reveal="delay-2">
            <span className="label">Go Cron Service</span>
            <h2 style={{ marginTop: '12px', marginBottom: '16px' }}>
              Never miss a service date
            </h2>
            <p className="lead" style={{ marginBottom: '28px' }}>
              Add your home appliances once — the Go microservice runs a
              background cron job every night, calculates next service dates,
              and pushes reminders automatically.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                {
                  title: 'Daily cron job',
                  body: 'Go worker runs nightly, scanning all registered assets for upcoming service windows.',
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" stroke="var(--accent)" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                },
                {
                  title: 'Multi-channel notifications',
                  body: 'In-app notification center plus optional email alerts via SMTP — both triggered from the Go service.',
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" stroke="var(--accent)" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
                },
              ].map(item => (
                <div key={item.title} style={{
                  display: 'flex', gap: '16px', alignItems: 'flex-start',
                  padding: '16px', background: 'var(--surface)',
                  border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                }}>
                  <div style={{ paddingTop: '2px' }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>{item.title}</div>
                    <div style={{ fontSize: '0.8rem',  color: 'var(--text-3)', marginTop: '3px' }}>{item.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
