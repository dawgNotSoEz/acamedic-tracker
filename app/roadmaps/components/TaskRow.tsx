import React from 'react'

export default function TaskRow({ task }: { task: any }) {
  const status = task.status ?? 'TODO'
  const color = status === 'IN_PROGRESS' ? 'bg-amber-400' : status === 'DONE' || status === 'COMPLETED' ? 'bg-emerald-400' : 'bg-slate-600'

  return (
    <div className="flex items-center justify-between bg-slate-800 p-2 rounded">
      <div className="flex items-center gap-3">
        <span className={`w-2 h-2 rounded-full ${color}`} />
        <div className="text-sm">{task.title}</div>
      </div>
      <div className="text-xs text-slate-400">{status}</div>
    </div>
  )
}
