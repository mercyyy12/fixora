import { useScrollReveal } from '../../hooks/useScrollReveal'
import { Link } from 'react-router-dom'

export default function CTA() {
  const ref = useScrollReveal()

  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-inner">

          <div>
            <h2>Ready to get started?</h2>
            <p className="lead" style={{ marginTop: '12px' }}>
              Post your first job free. Find a verified technician in minutes.
            </p>
          </div>

          <div className="cta-btns">
            <Link to="/register" className="btn-cta-white">
              Create free account
            </Link>
            <a
              href="https://github.com/mercyyy12/fixora"
              target="_blank"
              rel="noreferrer"
              className="btn-cta-outline"
            >
              View on GitHub
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}
