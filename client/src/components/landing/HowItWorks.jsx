import { useScrollReveal } from '../../hooks/useScrollReveal'

const STEPS = [
  {
    num: '01',
    title: 'Post a job',
    body: 'Describe the issue, set your budget, pin your location on the map, and upload photos. Everything is stored securely via MongoDB Atlas.',
  },
  {
    num: '02',
    title: 'Get matched',
    body: 'Browse verified technicians filtered by skill, distance, and rating. The Go microservice serves the sorted list at high speed.',
  },
  {
    num: '03',
    title: 'Track in real time',
    body: 'Technicians accept jobs and update the status — from Assigned to In Progress to Completed — while you watch live via Socket.io.',
  },
  {
    num: '04',
    title: 'Rate & review',
    body: 'Once the job is done, leave a rating for your technician. Ratings feed directly into their trust score visible to future homeowners.',
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
