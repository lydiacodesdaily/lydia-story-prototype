import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

export function useGSAPTimeline() {
  const ctx = useRef(gsap.context(() => {}))

  useEffect(() => {
    const context = ctx.current
    return () => {
      context.revert()
    }
  }, [])

  return ctx
}
