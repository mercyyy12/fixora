import { useEffect, useRef } from 'react'

/**
 * useScrollReveal
 * Attaches an IntersectionObserver to the returned ref.
 * When the element enters the viewport it gets the class "revealed",
 * which triggers the CSS transition defined in utils.css ([data-reveal].revealed).
 *
 * Usage:
 *   const ref = useScrollReveal()
 *   <div ref={ref} data-reveal>...</div>
 *   <div ref={ref} data-reveal="delay-1">...</div>
 */
export function useScrollReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}
