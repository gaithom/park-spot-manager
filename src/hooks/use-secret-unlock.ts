import { useCallback, useEffect, useRef, useState } from "react"

interface Options {
  /** Clicks needed to trigger. */
  threshold?: number
  /** Counter resets this long after the last click. */
  resetAfterMs?: number
}

/*
  The hidden admin entrance: tap the logo N times. This used to live in three
  components with three slightly different counters, one of which both navigated
  away and opened a dialog. One hook, one behaviour.
*/
export function useSecretUnlock(onUnlock: () => void, options: Options = {}) {
  const { threshold = 4, resetAfterMs = 3000 } = options
  const [count, setCount] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => () => clearTimeout(timer.current), [])

  const register = useCallback(() => {
    clearTimeout(timer.current)

    setCount((previous) => {
      const next = previous + 1
      if (next >= threshold) {
        onUnlock()
        return 0
      }
      timer.current = setTimeout(() => setCount(0), resetAfterMs)
      return next
    })
  }, [onUnlock, resetAfterMs, threshold])

  return { count, remaining: Math.max(threshold - count, 0), register }
}
