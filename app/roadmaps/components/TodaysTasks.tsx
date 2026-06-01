import React from 'react'

export default function TodaysTasks({ tasks }: { tasks?: any[] }) {
  return (
    <ul className="space-y-2">
      {(tasks ?? []).map((t) => (
        <li key={t.id} className="flex items-center justify-between bg-slate-900 p-2 rounded">
          <div className="flex items-center gap-3">
            <input type="checkbox" className="accent-emerald-500" />
            <div className="text-sm">{t.title}</div>
          </div>
          <div className="text-xs text-slate-400">{t.status ?? 'TODO'}</div>
        </li>
      ))}
    </ul>
  )
}
