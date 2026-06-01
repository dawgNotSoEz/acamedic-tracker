"use client"
import { useEffect, useState, useRef } from 'react'

type Props = { initialTask: { id: string; title: string } }

export default function ActiveTimer({ initialTask }: Props) {
  const [running, setRunning] = useState(true)
  const [seconds, setSeconds] = useState(5 * 60) // synthetic 5 minutes elapsed
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    }
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [running])

  function pause() {
    setRunning(false)
  }
  function resume() {
    setRunning(true)
  }
  function stop() {
    setRunning(false)
    if (intervalRef.current) window.clearInterval(intervalRef.current)
  }

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-sm text-slate-300">Active task</div>
        <div className="font-medium">{initialTask.title}</div>
        <div className="text-xs text-slate-400">Elapsed: {mins}:{secs.toString().padStart(2, '0')}</div>
      </div>

      <div className="flex gap-2">
        {running ? (
          <button onClick={pause} className="px-3 py-1 bg-yellow-600 rounded">Pause</button>
        ) : (
          <button onClick={resume} className="px-3 py-1 bg-green-600 rounded">Resume</button>
        )}
        <button onClick={stop} className="px-3 py-1 bg-red-600 rounded">Stop</button>
      </div>
    </div>
  )
}
