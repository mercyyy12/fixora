import { useScrollReveal } from '../../hooks/useScrollReveal'

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
    initials: 'SK',
    name: 'Sanjay Karki',
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
                {'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}
              </div>
              <p className="review-text">{r.text}</p>
              <div className="review-author">
                <div className="review-avatar">{r.initials}</div>
                <div>
                  <div className="review-name">{r.name}</div>
                  <div className="review-role">{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
