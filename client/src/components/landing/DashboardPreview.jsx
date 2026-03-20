import { useScrollReveal } from '../../hooks/useScrollReveal'

const NAV_ITEMS = [
  { label: 'Dashboard', active: true,  badge: null, icon: <svg className="dash-nav-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg> },
  { label: 'My Jobs',   active: false, badge: null, icon: <svg className="dash-nav-icon" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { label: 'Find Techs',active: false, badge: null, icon: <svg className="dash-nav-icon" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { label: 'Assets',    active: false, badge: null, icon: <svg className="dash-nav-icon" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> },
  { label: 'Reminders', active: false, badge: '3',  icon: <svg className="dash-nav-icon" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
  { label: 'Payments',  active: false, badge: null, icon: <svg className="dash-nav-icon" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
]

const STATS = [
  { label: 'Active Jobs',    val: '4',       change: '+2 this week', changeColor: 'var(--green)' },
  { label: 'Total Spent',    val: 'Rs. 12,400', change: '3 completed',  changeColor: 'var(--text-3)' },
  { label: 'Due Reminders',  val: '3',       change: 'Action needed', changeColor: 'var(--accent)', valColor: 'var(--accent)' },
]

const JOBS = [
  { title: 'AC Unit Not Cooling',      sub: 'Amit Sharma · 2.3 km · Today 3 PM',          dot: 'var(--accent)', badge: 'badge-accent',   status: 'In Progress', price: 'Rs. 1,800' },
  { title: 'Electrical Wiring Fault',  sub: 'Ravi Kumar · 1.1 km · Tomorrow 10 AM',        dot: 'var(--teal)',   badge: 'badge-teal',    status: 'Assigned',    price: 'Rs. 3,200' },
  { title: 'Plumbing Leak — Kitchen',  sub: '3 technicians matched · Awaiting selection',  dot: 'var(--border)', badge: 'badge-neutral', status: 'Open',        price: 'Rs. 900'   },
  { title: 'Geyser Installation',      sub: 'Deepak Yadav · Rated 5 stars',                dot: 'var(--green)',  badge: 'badge-green',   status: 'Completed',   price: 'Rs. 2,400' },
]

export default function DashboardPreview() {
  const headerRef  = useScrollReveal()
  const previewRef = useScrollReveal()

  return (
    <section id="features">
      <div className="container">

        <div className="section-header" ref={headerRef} data-reveal>
          <span className="label">Platform</span>
          <h2>Everything in one place</h2>
          <p>A full dashboard to manage jobs, technicians, assets, and payments.</p>
        </div>

        <div className="dash-preview" ref={previewRef} data-reveal="delay-1">

          {/* Top bar */}
          <div className="dash-bar">
            <div className="dash-bar-dots">
              <div className="dash-bar-dot" /><div className="dash-bar-dot" /><div className="dash-bar-dot" />
            </div>
            <div className="dash-bar-tabs">
              {['Dashboard','My Jobs','Technicians','Assets','Payments'].map((t,i) => (
                <div key={t} className={`dash-bar-tab${i===0?' active':''}`}>{t}</div>
              ))}
            </div>
          </div>

          <div className="dash-layout">

            {/* Sidebar */}
            <div className="dash-sidebar">
              <div className="dash-user">
                <div className="dash-user-av">RS</div>
                <div>
                  <div className="dash-user-name">Rajan Shah</div>
                  <div className="dash-user-role">Homeowner · Kathmandu</div>
                </div>
              </div>
              {NAV_ITEMS.map(n => (
                <div key={n.label} className={`dash-nav-link${n.active?' active':''}`}>
                  {n.icon}
                  {n.label}
                  {n.badge && <div className="dash-notif-badge">{n.badge}</div>}
                </div>
              ))}
            </div>

            {/* Main */}
            <div className="dash-main">
              <div className="dash-stats">
                {STATS.map(s => (
                  <div key={s.label} className="dash-stat">
                    <div className="dash-stat-label">{s.label}</div>
                    <div className="dash-stat-val" style={s.valColor ? { color: s.valColor } : {}}>{s.val}</div>
                    <div className="dash-stat-change" style={{ color: s.changeColor }}>{s.change}</div>
                  </div>
                ))}
              </div>

              <div className="dash-section-title">Recent Jobs</div>
              <div className="dash-job-list">
                {JOBS.map(j => (
                  <div key={j.title} className="dash-job">
                    <div className="dash-job-dot" style={{ background: j.dot }} />
                    <div className="dash-job-info">
                      <div className="dash-job-title">{j.title}</div>
                      <div className="dash-job-sub">{j.sub}</div>
                    </div>
                    <div className="dash-job-right">
                      <span className={`badge ${j.badge}`}>{j.status}</span>
                      <span className="dash-job-price">{j.price}</span>
                    </div>
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
