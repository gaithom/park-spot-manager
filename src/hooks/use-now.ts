import { useEffect, useState } from "react"

/** A clock that re-renders the caller on an interval. Defaults to once a second. */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])

  return now
}
