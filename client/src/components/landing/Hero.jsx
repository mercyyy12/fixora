import React from 'react'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function Hero() {
  const ref = useScrollReveal()

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-inner">

          {/* ── Left ── */}
          <div>
            <div className="hero-eyebrow">
              <div className="hero-eyebrow-dot" />
              <span>Verified technicians &middot; Kathmandu &amp; beyond</span>
            </div>

            <h1>Your home,<br /><em>always in order.</em></h1>

            <p className="lead">
              Fixora connects homeowners with verified local technicians through
              smart geo-matching, real-time job tracking, and automated
              maintenance reminders.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary">
                Post a job
              </Link>
              <a href="#how-it-works" className="btn btn-outline">
                See how it works
              </a>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-val">4.8</div>
                <div className="hero-stat-label">Avg rating</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-val">2,400+</div>
                <div className="hero-stat-label">Technicians</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-val">&lt;15 min</div>
                <div className="hero-stat-label">Avg response</div>
              </div>
            </div>
          </div>

          {/* ── Right: mini dashboard panel ── */}
          <div className="hero-panel" ref={ref} data-reveal>
            <div className="hero-panel-bar">
              <div className="panel-dots">
                <div className="panel-dot" />
                <div className="panel-dot" />
                <div className="panel-dot" />
              </div>
              <span className="panel-title">fixora — dashboard</span>
            </div>
            <div className="hero-panel-body">

              {/* Mini stats */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px', marginBottom:'20px' }}>
                {[
                  { label: 'Active', val: '4',     color: 'var(--text)' },
                  { label: 'Spent',  val: 'Rs. 12.4k', color: 'var(--text)' },
                  { label: 'Due',    val: '3',     color: 'var(--accent)' },
                ].map(s => (
                  <div key={s.label} style={{
                    background: 'var(--bg)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)', padding: '12px',
                  }}>
                    <div style={{ fontSize:'0.68rem', color:'var(--text-3)', marginBottom:'4px', textTransform:'uppercase', letterSpacing:'0.08em' }}>
                      {s.label}
                    </div>
                    <div style={{ fontFamily:'var(--font-serif)', fontSize:'1.4rem', fontWeight:700, color: s.color }}>
                      {s.val}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent jobs */}
              <div style={{ fontSize:'0.68rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--text-3)', marginBottom:'8px' }}>
                Recent jobs
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'5px' }}>
                {[
                  { title: 'AC Unit Repair',      dot: '#b5451b', badge: 'bg-brand/10 text-brand', status: 'In progress' },
                  { title: 'Electrical Wiring',   dot: 'var(--teal)', badge: 'bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300', status: 'Assigned' },
                  { title: 'Geyser Install',      dot: 'var(--green)', badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', status: 'Done' },
                ].map(j => (
                  <div key={j.title} style={{
                    display:'flex', alignItems:'center', gap:'10px',
                    padding:'9px 12px', background:'var(--bg)',
                    border:'1px solid var(--border)', borderRadius:'var(--radius-sm)',
                  }}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background: j.dot, flexShrink:0 }} />
                    <div style={{ flex:1, fontSize:'0.8rem', fontWeight:500, color:'var(--text)' }}>{j.title}</div>
                    <span className={`badge ${j.badge}`}>{j.status}</span>
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
