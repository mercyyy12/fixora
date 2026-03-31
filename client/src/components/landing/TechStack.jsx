import { useScrollReveal } from '../../hooks/useScrollReveal'

const LAYERS = [
  {
    dot:   'var(--accent)',
    title: 'Frontend · React',
    items: [
      { name: 'React 18',        role: 'UI'        },
      { name: 'Tailwind CSS',    role: 'Styling'   },
      { name: 'Leaflet.js',      role: 'Maps'      },
      { name: 'Socket.io Client',role: 'Real-time' },
      { name: 'Axios',           role: 'HTTP'      },
      { name: 'Vercel',          role: 'Deploy'    },
    ],
  },
  {
    dot:   'var(--teal)',
    title: 'Backend · Node.js',
    items: [
      { name: 'Node.js + Express', role: 'API'      },
      { name: 'MongoDB Atlas',     role: 'Database' },
      { name: 'JWT + bcrypt',      role: 'Auth'     },
      { name: 'Cloudinary',        role: 'Media'    },
      { name: 'Socket.io',         role: 'Real-time'},
      { name: 'Render / Railway',  role: 'Deploy'   },
    ],
  },
  {
    dot:   '#7c6f5a',
    title: 'Microservice · Go',
    items: [
      { name: 'Go + net/http',      role: 'HTTP'         },
      { name: 'Goroutines',         role: 'Concurrency'  },
      { name: '/api/admin/stats',   role: 'Analytics'    },
      { name: '/api/technicians',   role: 'Listing'      },
      { name: 'mongo-driver/go',    role: 'DB Access'    },
      { name: 'rs/cors',            role: 'CORS'         },
    ],
  },
]

const ARCH_NODES = [
  { name: 'React App',   desc: 'Vercel CDN',        color: 'var(--accent)' },
  { arrow: '→' },
  { name: 'Node.js API', desc: 'REST + Socket.io',  color: 'var(--teal)'  },
  { arrow: '⇄' },
  { name: 'Go Service',  desc: 'HTTP / JSON',        color: null           },
  { arrow: '↓' },
  { name: 'MongoDB',     desc: 'Atlas Cloud',        color: 'var(--green)' },
  { arrow: '↔' },
  { name: 'Cloudinary',  desc: 'Media CDN',          color: 'var(--yellow)'},
]

export default function TechStack() {
  const headerRef = useScrollReveal()
  const gridRef   = useScrollReveal()
  const archRef   = useScrollReveal()

  return (
    <section id="tech-stack" className="alt">
      <div className="container">

        <div className="section-header" ref={headerRef} data-reveal>
          <span className="label">Architecture</span>
          <h2>Tech stack</h2>
          <p>A MERN stack with a dedicated Go microservice for analytics and technician listing — sharing the same MongoDB Atlas cluster.</p>
        </div>

        <div className="stack-grid" ref={gridRef} data-reveal="delay-1">
          {LAYERS.map(layer => (
            <div key={layer.title} className="stack-card">
              <div className="stack-card-head">
                <div className="stack-dot" style={{ background: layer.dot }} />
                <span className="stack-head-title">{layer.title}</span>
              </div>
              <div className="stack-items">
                {layer.items.map(item => (
                  <div key={item.name} className="stack-item">
                    <span className="stack-item-name">{item.name}</span>
                    <span className="stack-item-role">{item.role}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="arch-flow" ref={archRef} data-reveal="delay-2">
          <div className="arch-label">Communication flow</div>
          <div className="arch-nodes">
            {ARCH_NODES.map((n, i) =>
              n.arrow ? (
                <div key={i} className="arch-arrow">
                  {n.arrow === '→' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>}
                  {n.arrow === '⇄' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/><polyline points="17 14 12 9 7 14"/><line x1="12" y1="9" x2="12" y2="21"/></svg>}
                  {n.arrow === '↓' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>}
                  {n.arrow === '↔' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="7 8 2 12 7 16"/><polyline points="17 16 22 12 17 8"/><line x1="2" y1="12" x2="22" y2="12"/></svg>}
                </div>
              ) : (
                <div key={n.name} className="arch-node">
                  <div className="arch-node-name" style={n.color ? { color: n.color } : {}}>
                    {n.name}
                  </div>
                  <div className="arch-node-desc">{n.desc}</div>
                </div>
              )
            )}
          </div>
        </div>

      </div>
    </section>
  )
}
