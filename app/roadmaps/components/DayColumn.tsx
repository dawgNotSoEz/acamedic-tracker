import React from 'react'
import TaskRow from './TaskRow'

export default function DayColumn({ day }: { day: any }) {
  return (
    <div className="bg-slate-900 rounded p-3">
      <div className="text-sm text-slate-400 mb-2">{day.date ?? `Day ${day.dayNumber}`}</div>
      <div className="space-y-2">
        {(day.tasks ?? []).map((t: any) => (
          <TaskRow key={t.id} task={t} />
        ))}
        {!(day.tasks ?? []).length && <div className="text-slate-500 text-sm">No tasks</div>}
      </div>
    </div>
  )
}
