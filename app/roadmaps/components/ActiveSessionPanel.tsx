import React from 'react'

export default function ActiveSessionPanel({ task }: { task?: any }) {
  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <h4 className="font-semibold">Active Session</h4>
      {task ? (
        <div className="mt-3">
          <div className="text-sm text-slate-200">{task.title}</div>
          <div className="text-2xl font-mono mt-2">25:00</div>
          <div className="mt-3 flex gap-2">
            <button className="px-2 py-1 bg-emerald-600 rounded">Pause</button>
            <button className="px-2 py-1 bg-red-600 rounded">Stop</button>
          </div>
        </div>
      ) : (
        <div className="text-slate-400 mt-2">No active session</div>
      )}
    </div>
  )
}
