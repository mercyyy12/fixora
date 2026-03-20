import { useScrollReveal } from '../../hooks/useScrollReveal'

const STEPS = [
  {
    num: '01',
    title: 'Post a job',
    body: 'Describe the issue, set urgency, pin your location, and upload photos. Stored securely via Node.js and MongoDB.',
  },
  {
    num: '02',
    title: 'Smart matching',
    body: 'Our Go microservice ranks the top technicians by distance, rating, and availability — using concurrent goroutines.',
  },
  {
    num: '03',
    title: 'Track in real time',
    body: 'Accept a technician, then follow the job live via Socket.io — status updates and in-app chat included.',
  },
  {
    num: '04',
    title: 'Pay & review',
    body: 'Pay through Razorpay or Stripe. Leave a rating — it feeds directly into the trust score algorithm.',
  },
]

export default function HowItWorks() {
  const headerRef = useScrollReveal()
  const stepsRef  = useScrollReveal()

  return (
    <section id="how-it-works" className="alt">
      <div className="container">

        <div className="section-header" ref={headerRef} data-reveal>
          <span className="label">Process</span>
          <h2>How Fixora works</h2>
          <p>From posting a job to completion — four straightforward steps.</p>
        </div>

        <div className="steps-list" ref={stepsRef} data-reveal="delay-1">
          {STEPS.map(s => (
            <div key={s.num} className="step">
              <div className="step-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
