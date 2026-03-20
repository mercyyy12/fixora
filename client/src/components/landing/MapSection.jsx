import { useToast } from '../../context/landing/ToastContext'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const JOB_PINS  = [
  { top: 110, left: 130, label: 'AC Repair',  color: 'var(--accent)' },
  { top: 195, left: 280, label: 'Electrical', color: 'var(--accent)' },
  { top: 270, left: 200, label: 'Plumbing',   color: 'var(--accent)' },
]
const TECH_PINS = [
  { top: 150, left: 230, label: 'Amit S.',  color: 'var(--teal)' },
  { top:  75, left: 310, label: 'Ravi K.',  color: 'var(--teal)' },
  { top: 310, left: 370, label: 'Deepak P.',color: 'var(--teal)' },
]
const PROGRESS_PINS = [
  { top: 230, left: 330, label: 'In progress', color: 'var(--green)' },
]

function Pin({ top, left, label, color }) {
  return (
    <div className="map-pin" style={{ top, left }}>
      <div className="map-pin-label">{label}</div>
      <div className="map-pin-dot" style={{ background: color }} />
    </div>
  )
}

export default function MapSection() {
  const { showToast } = useToast()
  const infoRef = useScrollReveal()
  const mapRef  = useScrollReveal()

  return (
    <section>
      <div className="container">
        <div className="grid-2" style={{ gap: '72px', alignItems: 'start' }}>

          {/* Info */}
          <div ref={infoRef} data-reveal>
            <span className="label">Live Map</span>
            <h2 style={{ marginTop: '12px', marginBottom: '16px' }}>
              Find technicians near you
            </h2>
            <p className="lead" style={{ marginBottom: '28px' }}>
              Jobs and technicians plotted on a Leaflet.js map with OpenStreetMap
              tiles. Real-time pin updates driven by Socket.io as assignments change.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
              {[
                { color: 'var(--accent)', text: 'Open jobs in your area'           },
                { color: 'var(--teal)',   text: 'Available verified technicians'    },
                { color: 'var(--green)',  text: 'Jobs currently in progress'        },
              ].map(l => (
                <div key={l.text} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-2)' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: l.color, flexShrink: 0 }} />
                  {l.text}
                </div>
              ))}
            </div>

            <button className="btn btn-primary"
              onClick={() => showToast('Opening map view...')}>
              Open map
            </button>
          </div>

          {/* Map mock */}
          <div ref={mapRef} data-reveal="delay-2">
            <div className="map-mock">
              <div className="map-grid-bg" />
              <div className="map-road-h" style={{ top: '33%' }} />
              <div className="map-road-h" style={{ top: '66%' }} />
              <div className="map-road-v" style={{ left: '30%' }} />
              <div className="map-road-v" style={{ left: '65%' }} />

              {JOB_PINS.map(p     => <Pin key={p.label} {...p} />)}
              {TECH_PINS.map(p    => <Pin key={p.label} {...p} />)}
              {PROGRESS_PINS.map(p=> <Pin key={p.label} {...p} />)}

              {/* You */}
              <div className="map-pin" style={{ top:'50%', left:'50%', transform:'translate(-50%,-50%)' }}>
                <div style={{
                  width:14, height:14, borderRadius:'50%',
                  background:'var(--bg)', border:'3px solid var(--accent)',
                  boxShadow:'0 0 0 4px var(--accent-bg)',
                }}/>
              </div>

              <div className="map-legend">
                {[
                  { color: 'var(--accent)', text: 'Open jobs (3)'   },
                  { color: 'var(--teal)',   text: 'Technicians (6)' },
                  { color: 'var(--green)',  text: 'In progress (1)' },
                ].map(l => (
                  <div key={l.text} className="legend-row">
                    <div className="legend-dot" style={{ background: l.color }} />
                    {l.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
