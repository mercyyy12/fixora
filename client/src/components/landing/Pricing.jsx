import { useState } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { Link } from 'react-router-dom'

const PLANS = [
  {
    name: 'Starter',
    amount: '0',
    period: 'Free forever',
    featured: false,
    features: [
      { text: '3 job posts / month',    included: true  },
      { text: 'Basic geo matching',     included: true  },
      { text: 'In-app notifications',   included: true  },
      { text: '3 home assets',          included: true  },
      { text: 'Analytics dashboard',    included: false },
      { text: 'In-app notifications',   included: false },
    ],
    cta: 'Get started free',
    highlight: false,
  },
  {
    name: 'Pro',
    amount: '499',
    period: 'per month',
    featured: true,
    badge: 'Most popular',
    features: [
      { text: 'Unlimited job posts',        included: true },
      { text: 'Priority matching (top 5)',  included: true },
      { text: 'Real-time tracking',         included: true },
      { text: 'Analytics dashboard',        included: true },
      { text: 'In-app notifications',       included: true },
      { text: 'Photo documentation',        included: true },
    ],
    cta: 'Start Pro plan',
    highlight: true,
  },
  {
    name: 'Technician',
    amount: '299',
    period: 'per month',
    featured: false,
    features: [
      { text: 'Profile + verification',  included: true },
      { text: 'Smart job matching',      included: true },
      { text: 'Trust score dashboard',   included: true },
      { text: 'Earnings tracker',        included: true },
      { text: 'Schedule optimizer',      included: true },
      { text: 'Priority listing',        included: true },
    ],
    cta: 'Join as technician',
    highlight: false,
  },
]

export default function Pricing() {
  const headerRef = useScrollReveal()
  const gridRef   = useScrollReveal()
  const [annual, setAnnual] = useState(false)

  return (
    <section id="pricing" className="alt">
      <div className="container">

        <div className="section-header centered" ref={headerRef} data-reveal>
          <span className="label">Pricing</span>
          <h2>Simple, transparent plans</h2>
          <p>No hidden fees. Start free, upgrade when you need more.</p>
        </div>

        <div className="flex justify-center items-center gap-4 mb-12" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <span className={!annual ? 'font-semibold' : ''} style={{ color: !annual ? 'var(--text)' : 'var(--text-3)', transition: '0.3s' }}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            style={{
              position: 'relative', width: '56px', height: '32px', borderRadius: '999px',
              background: annual ? 'var(--accent)' : 'var(--border)', border: 'none', cursor: 'pointer',
              transition: 'background 0.3s'
            }}
          >
            <div style={{
              position: 'absolute', top: '4px', left: '4px', width: '24px', height: '24px',
              borderRadius: '50%', background: '#fff', transition: 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
              transform: annual ? 'translateX(24px)' : 'translateX(0)'
            }} />
          </button>
          <span className={annual ? 'font-semibold' : ''} style={{ color: annual ? 'var(--text)' : 'var(--text-3)', transition: '0.3s' }}>
            Annually <span style={{ marginLeft: '4px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--green)', background: 'var(--bg-alt)', padding: '2px 6px', borderRadius: '4px' }}>-20%</span>
          </span>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-3)', fontSize: '0.85rem', marginBottom: '32px' }}>
          No contracts. Cancel anytime. Prices are in Nepali Rupees.
        </p>

        <div className="pricing-grid" ref={gridRef} data-reveal="delay-1">
          {PLANS.map(plan => (
            <div key={plan.name} className={`price-card${plan.featured ? ' featured' : ''}`}>
              {plan.badge && <div className="price-badge">{plan.badge}</div>}

              <div className="price-name">{plan.name}</div>
              <div className="price-amount">
                <sup style={{ fontSize: '0.5em', marginRight: '4px', verticallyAlign: 'super' }}>Rs.</sup>
                {plan.amount === '0' ? '0' : annual ? Math.floor(parseInt(plan.amount) * 12 * 0.8) : plan.amount}
              </div>
              <div className="price-period">{annual && plan.amount !== '0' ? 'per year (billed annually)' : plan.period}</div>

              <ul className="price-features">
                {plan.features.map(f => (
                  <li key={f.text} className={`price-feat${f.included ? '' : ' off'}`}>
                    <span className={f.included ? 'feat-check' : 'feat-x'}>
                      {f.included ? '✓' : '✗'}
                    </span>
                    {f.text}
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`btn ${plan.highlight ? 'btn-primary' : 'btn-outline'}`}
                style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
