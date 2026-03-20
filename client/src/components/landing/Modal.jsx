import { useEffect, useState } from 'react'
import { useModal } from '../../context/landing/ModalContext'
import { useToast } from '../../context/landing/ToastContext'

/* ── Tab bar for login roles ── */
function ModalTabs({ active, onChange }) {
  return (
    <div className="modal-tabs">
      {['Homeowner', 'Technician', 'Admin'].map(t => (
        <div
          key={t}
          className={`modal-tab${active === t ? ' active' : ''}`}
          onClick={() => onChange(t)}
        >
          {t}
        </div>
      ))}
    </div>
  )
}

/* ── Role picker for register ── */
function RolePicker({ selected, onChange }) {
  return (
    <div className="role-picker">
      {['Homeowner', 'Technician'].map(r => (
        <div
          key={r}
          className={`role-option${selected === r ? ' selected' : ''}`}
          onClick={() => onChange(r)}
        >
          <div className="role-option-name">{r}</div>
        </div>
      ))}
    </div>
  )
}

/* ── Login form ── */
function LoginForm({ onSubmit }) {
  const [tab,      setTab]      = useState('Homeowner')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')

  return (
    <>
      <h2>Sign In</h2>
      <p className="modal-sub">Access your Fixora account</p>

      <ModalTabs active={tab} onChange={setTab} />

      <div className="form-group">
        <label className="form-label">Email</label>
        <input type="email" className="form-input" placeholder="you@example.com"
          value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">Password</label>
        <input type="password" className="form-input" placeholder="••••••••"
          value={password} onChange={e => setPassword(e.target.value)} />
      </div>

      <button
        className="btn btn-primary"
        style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
        onClick={onSubmit}
      >
        Sign In
      </button>

      <p style={{ textAlign:'center', fontSize:'0.8rem', color:'var(--text-3)', marginTop:'14px' }}>
        No account?{' '}
        <a href="#" style={{ color:'var(--accent)' }} onClick={e => { e.preventDefault(); onSubmit('switch-register') }}>
          Register
        </a>
      </p>
    </>
  )
}

/* ── Register form ── */
function RegisterForm({ onSubmit }) {
  const [role,      setRole]      = useState('Homeowner')
  const [firstName, setFirstName] = useState('')
  const [lastName,  setLastName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [phone,     setPhone]     = useState('')
  const [password,  setPassword]  = useState('')

  return (
    <>
      <h2>Create Account</h2>
      <p className="modal-sub">Join Fixora — free to get started</p>

      <RolePicker selected={role} onChange={setRole} />

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">First Name</label>
          <input type="text" className="form-input" placeholder="Rajan"
            value={firstName} onChange={e => setFirstName(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Last Name</label>
          <input type="text" className="form-input" placeholder="Shah"
            value={lastName} onChange={e => setLastName(e.target.value)} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Email</label>
        <input type="email" className="form-input" placeholder="you@example.com"
          value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">Phone</label>
        <input type="tel" className="form-input" placeholder="+977 98XXXXXXXX"
          value={phone} onChange={e => setPhone(e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">Password</label>
        <input type="password" className="form-input" placeholder="Min 8 characters"
          value={password} onChange={e => setPassword(e.target.value)} />
      </div>

      <button
        className="btn btn-primary"
        style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
        onClick={onSubmit}
      >
        Create Account
      </button>

      <p style={{ textAlign:'center', fontSize:'0.76rem', color:'var(--text-3)', marginTop:'12px' }}>
        By registering you agree to our{' '}
        <a href="#" style={{ color:'var(--accent)' }}>Terms</a> &amp;{' '}
        <a href="#" style={{ color:'var(--accent)' }}>Privacy Policy</a>
      </p>
    </>
  )
}

/* ── Main Modal wrapper ── */
export default function Modal() {
  const { modalType, openModal, closeModal } = useModal()
  const { showToast } = useToast()

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = modalType ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [modalType])

  // Close on Escape
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') closeModal() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [closeModal])

  if (!modalType) return null

  const handleLoginSubmit = (action) => {
    if (action === 'switch-register') { openModal('register'); return }
    closeModal()
    showToast('Signed in successfully.')
  }

  const handleRegisterSubmit = () => {
    closeModal()
    showToast('Account created. Welcome to Fixora.')
  }

  return (
    <div
      className="modal-overlay open"
      id="modal-overlay"
      onClick={e => { if (e.target.id === 'modal-overlay') closeModal() }}
    >
      <div className="modal">
        <button className="modal-close" onClick={closeModal}>&#10005;</button>
        <div id="modal-content">
          {modalType === 'login'
            ? <LoginForm    onSubmit={handleLoginSubmit}    />
            : <RegisterForm onSubmit={handleRegisterSubmit} />
          }
        </div>
      </div>
    </div>
  )
}
