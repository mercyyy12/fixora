import { useToast } from '../../context/landing/ToastContext'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const TECHS = [
  { init: 'AS', name: 'Amit Sharma',  sub: 'AC Specialist · 5 yrs',        pct: 96, rating: '4.9', dist: '1.2 km', top: true  },
  { init: 'RK', name: 'Ravi Kumar',   sub: 'HVAC Expert · 8 yrs',          pct: 88, rating: '4.7', dist: '2.8 km', top: false },
  { init: 'DP', name: 'Deepak Patel', sub: 'HVAC & Electrical · 4 yrs',    pct: 81, rating: '4.6', dist: '3.5 km', top: false },
  { init: 'MR', name: 'Mohan Rai',    sub: 'AC & Refrigeration · 6 yrs',   pct: 75, rating: '4.5', dist: '4.1 km', top: false },
]

export default function MatchingEngine() {
  const { showToast } = useToast()
  const infoRef  = useScrollReveal()
  const panelRef = useScrollReveal()

  return (
    <section id="matching">
      <div className="container">
        <div className="grid-2" style={{ gap: '72px' }}>

          {/* Info */}
          <div ref={infoRef} data-reveal>
            <span className="label">Go Microservice</span>
            <h2 style={{ marginTop: '12px', marginBottom: '16px' }}>
              Concurrent technician matching
            </h2>
            <p className="lead" style={{ marginBottom: '28px' }}>
              A dedicated Golang service handles all matching logic — evaluating
              every available technician simultaneously via goroutines and
              returning a ranked shortlist in milliseconds.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h4>Distance calculation</h4>
                <p style={{ fontSize: '0.88rem', marginTop: '4px' }}>
                  Haversine formula computes real-world distance between job
                  location and each technician's registered coordinates.
                </p>
              </div>
              <div>
                <h4>Conflict prevention</h4>
                <p style={{ fontSize: '0.88rem', marginTop: '4px' }}>
                  The{' '}
                  <code style={{
                    fontSize: '0.8rem', background: 'var(--surface-2)',
                    padding: '2px 6px', borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                  }}>
                    /schedule-optimize
                  </code>{' '}
                  endpoint prevents double-bookings in real time.
                </p>
              </div>
              <div>
                <h4>Trust-weighted ranking</h4>
                <p style={{ fontSize: '0.88rem', marginTop: '4px' }}>
                  Scores combine distance, rating, availability, and job
                  completion rate into a single sortable value.
                </p>
              </div>
            </div>

            <div style={{ marginTop: '32px' }}>
              <button className="btn btn-primary"
                onClick={() => showToast('Matching engine: 4 technicians found in 38ms.')}>
                See it in action
              </button>
            </div>
          </div>

          {/* Panel */}
          <div ref={panelRef} data-reveal="delay-2">
            <div className="match-panel">
              <div className="match-panel-head">
                <span className="match-panel-title">Top matches — AC Repair, Kathmandu</span>
                <div className="live-indicator">
                  <div className="live-dot" /> Live
                </div>
              </div>

              <div className="tech-list">
                {TECHS.map(t => (
                  <div key={t.init} className={`tech-row${t.top ? ' top-match' : ''}`}>
                    <div className="tech-avatar">{t.init}</div>
                    <div className="tech-info">
                      <div className="tech-name">{t.name}</div>
                      <div className="tech-sub">{t.sub}</div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${t.pct}%` }} />
                      </div>
                    </div>
                    <div className="tech-meta">
                      <div className="tech-score">{t.rating} &#9733;</div>
                      <div className="tech-dist">{t.dist}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="match-footer">
                4 technicians ranked &middot; 4 goroutines &middot; 38ms
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
