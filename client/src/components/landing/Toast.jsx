import { useToast } from '../../context/landing/ToastContext'

export default function Toast() {
  const { toasts } = useToast()

  if (!toasts.length) return null

  return (
    <div
      id="toast-container"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {toasts.map(t => (
        <div
          key={t.id}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '12px 18px',
            fontSize: '0.84rem',
            color: 'var(--text)',
            boxShadow: 'var(--shadow)',
            maxWidth: '300px',
            fontFamily: 'var(--font-body)',
            animation: 'toastIn 0.2s ease',
          }}
        >
          {t.msg}
        </div>
      ))}

      {/* Keyframe injected once */}
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
