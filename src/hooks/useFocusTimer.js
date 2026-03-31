import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Focus timer hook using Date.now()-based calculation (not interval drift).
 * @param {number} durationSeconds - Total duration in seconds
 * @param {() => void} onComplete - Called when timer reaches 0
 */
export function useFocusTimer(durationSeconds, onComplete) {
  const [remaining, setRemaining] = useState(durationSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const [startTimestamp, setStartTimestamp] = useState(null)
  const [elapsedAtPause, setElapsedAtPause] = useState(0)
  const intervalRef = useRef(null)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  })

  // Reset when durationSeconds changes
  useEffect(() => {
    setRemaining(durationSeconds)
    setIsRunning(false)
    setStartTimestamp(null)
    setElapsedAtPause(0)
  }, [durationSeconds])

  useEffect(() => {
    if (!isRunning) {
      clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = setInterval(() => {
      const now = Date.now()
      const elapsed = elapsedAtPause + (now - startTimestamp) / 1000
      const rem = Math.max(0, durationSeconds - elapsed)
      setRemaining(rem)

      if (rem <= 0) {
        clearInterval(intervalRef.current)
        setIsRunning(false)
        onCompleteRef.current?.()
      }
    }, 250) // 250ms tick for accuracy

    return () => clearInterval(intervalRef.current)
  }, [isRunning, startTimestamp, elapsedAtPause, durationSeconds])

  const start = useCallback(() => {
    setStartTimestamp(Date.now())
    setIsRunning(true)
  }, [])

  const pause = useCallback(() => {
    if (!isRunning) return
    const elapsed = elapsedAtPause + (Date.now() - startTimestamp) / 1000
    setElapsedAtPause(elapsed)
    setIsRunning(false)
  }, [isRunning, startTimestamp, elapsedAtPause])

  const reset = useCallback(() => {
    clearInterval(intervalRef.current)
    setIsRunning(false)
    setStartTimestamp(null)
    setElapsedAtPause(0)
    setRemaining(durationSeconds)
  }, [durationSeconds])

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  return {
    remaining,
    isRunning,
    start,
    pause,
    reset,
    formattedTime: formatTime(remaining),
    progress: ((durationSeconds - remaining) / durationSeconds) * 100,
    startTime: startTimestamp,
  }
}
