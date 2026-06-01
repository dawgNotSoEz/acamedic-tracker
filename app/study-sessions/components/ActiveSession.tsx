"use client"

import React, { useEffect, useState } from 'react'
import { pauseSessionAction, resumeSessionAction, stopSessionAction, startSessionAction } from '../actions'

type Session = {
  id: string
  startAt: string
  currentIntervalStart?: string | null
  accumulatedMins: number
  status: string
  taskId?: string | null
  resourceId?: string | null
  notes?: string | null
}

function computeElapsed(session: Session) {
  const now = new Date()
  let total = session.accumulatedMins * 60000
  if (session.currentIntervalStart) {
    total += now.getTime() - new Date(session.currentIntervalStart).getTime()
  }
  return Math.floor(total / 60000)
}

export default function ActiveSession({ session }: { session: Session | null }) {
  const [elapsedMins, setElapsedMins] = useState(session ? computeElapsed(session) : 0)

  useEffect(() => {
    if (!session) return
    setElapsedMins(computeElapsed(session))
    const id = setInterval(() => setElapsedMins(computeElapsed(session)), 1000)
    return () => clearInterval(id)
  }, [session])

  if (!session) {
    return (
      <div className="p-4 border rounded">
        <h3 className="font-medium">No active session</h3>
        <form action={startSessionAction} className="mt-3 space-y-2">
          <div>
            <label className="block text-sm">Task ID (optional)</label>
            <input name="taskId" className="mt-1 block w-full" />
          </div>
          <div>
            <label className="block text-sm">Resource ID (optional)</label>
            <input name="resourceId" className="mt-1 block w-full" />
          </div>
          <div>
            <button className="px-3 py-1 bg-green-600 text-white rounded">Start Session</button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="p-4 border rounded">
      <h3 className="font-medium">Active Session</h3>
      <div className="text-sm text-gray-600">Elapsed: {elapsedMins} minutes</div>
      <div className="mt-3 flex gap-2">
        <form action={pauseSessionAction}>
          <input type="hidden" name="id" value={session.id} />
          <button className="px-3 py-1 bg-yellow-600 text-white rounded">Pause</button>
        </form>

        <form action={stopSessionAction}>
          <input type="hidden" name="id" value={session.id} />
          <button className="px-3 py-1 bg-red-600 text-white rounded">Stop</button>
        </form>
      </div>
    </div>
  )
}
