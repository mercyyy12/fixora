import { ThemeProvider } from '../context/landing/ThemeContext'
import { ModalProvider } from '../context/landing/ModalContext'
import { ToastProvider } from '../context/landing/ToastContext'

import Navbar           from '../components/landing/Navbar'
import Hero             from '../components/landing/Hero'
import HowItWorks       from '../components/landing/HowItWorks'
import DashboardPreview from '../components/landing/DashboardPreview'
import Features         from '../components/landing/Features'
import MatchingEngine   from '../components/landing/MatchingEngine'
import Reminders        from '../components/landing/Reminders'
import MapSection       from '../components/landing/MapSection'
import TechStack        from '../components/landing/TechStack'
import Reviews          from '../components/landing/Reviews'
import Pricing          from '../components/landing/Pricing'
import CTA              from '../components/landing/CTA'
import Footer           from '../components/landing/Footer'
import Toast            from '../components/landing/Toast'

import '../css/theme.css'
import '../css/base.css'
import '../css/components.css'
import '../css/utils.css'

export default function LandingPage() {
  return (
    <ThemeProvider>
      <ModalProvider>
        <ToastProvider>
          <Navbar />

          <main>
            <Hero />
            <hr />
            <HowItWorks />
            <hr />
            <DashboardPreview />
            <hr />
            <Features />
            <hr />
            <MatchingEngine />
            <hr />
            <Reminders />
            <hr />
            <MapSection />
            <hr />
            <TechStack />
            <hr />
            <Reviews />
            <hr />
            <Pricing />
            <hr />
            <CTA />
          </main>

          <Footer />
          <Toast />
        </ToastProvider>
      </ModalProvider>
    </ThemeProvider>
  )
}
