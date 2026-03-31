import { useScrollReveal } from '../../hooks/useScrollReveal'
import { HiStar, HiHome, HiWrench } from 'react-icons/hi'

const REVIEWS = [
  {
    stars: 5,
    text: '"Three matched technicians appeared within two minutes of posting. The real-time tracking was exactly what I needed — I knew when the tech was on his way."',
    initials: 'PR',
    name: 'Priya Regmi',
    role: 'AC Repair · Kathmandu',
  },
  {
    stars: 5,
    text: '"As a technician, Fixora has meaningfully increased my monthly jobs. The smart matching sends me relevant work based on my skills and location."',
    initials: 'AS',
    name: 'Amit Shrestha',
    role: 'Electrician · 4.9 rating',
  },
  {
    stars: 4,
    text: '"The maintenance reminders changed how I manage my home. I used to forget the geyser service every year — now Fixora handles it automatically."',
    initials: 'SM',
    name: 'Suresh Malla',
    role: 'Homeowner · Lalitpur',
  },
]

export default function Reviews() {
  const headerRef = useScrollReveal()
  const gridRef   = useScrollReveal()

  return (
    <section>
      <div className="container">

        <div className="section-header centered" ref={headerRef} data-reveal>
          <span className="label">Testimonials</span>
          <h2>What users say</h2>
          <p>Homeowners and technicians across Kathmandu.</p>
        </div>

        <div className="grid-3" ref={gridRef} data-reveal="delay-1">
          {REVIEWS.map(r => (
            <div key={r.name} className="review-card">
              <div className="review-stars">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < r.stars ? 'text-amber-400 fill-current' : 'text-border'}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p className="review-text">{r.text}</p>
              <div className="review-author">
                <div className="review-avatar">{r.initials}</div>
                <div>
                  <div className="review-name">{r.name}</div>
                  <div className="review-role" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {r.role.includes('Homeowner') ? <HiHome className="w-3.5 h-3.5" /> : <HiWrench className="w-3.5 h-3.5" />}
                    {r.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
