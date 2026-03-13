import { useEffect, useRef } from 'react'

export default function useTypewriter(strings) {
  const ref = useRef(null)

  useEffect(() => {
    let idx = 0, charIdx = 0, deleting = false, paused = false
    let timer
    let cancelled = false

    const tick = () => {
      if (cancelled || !ref.current) return
      const current = strings[idx]

      if (paused) {
        paused = false
        deleting = true
        timer = setTimeout(tick, 2200)
        return
      }

      if (!deleting) {
        charIdx++
        ref.current.textContent = current.slice(0, charIdx)
        if (charIdx === current.length) {
          paused = true
          timer = setTimeout(tick, 100)
          return
        }
      } else {
        charIdx--
        ref.current.textContent = current.slice(0, charIdx)
        if (charIdx === 0) {
          deleting = false
          idx = (idx + 1) % strings.length
        }
      }

      timer = setTimeout(tick, deleting ? 28 : 55)
    }

    timer = setTimeout(tick, 55)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [])

  return ref
}