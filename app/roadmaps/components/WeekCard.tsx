import React from 'react'
import DayColumn from './DayColumn'

export default function WeekCard({ week }: { week: any }) {
  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold">Week {week.number}: {week.title}</h3>
          <div className="text-sm text-slate-400">{(week.days?.length ?? 0)} days</div>
        </div>
        <div className="text-sm text-slate-300">Progress: {week.progress ?? '-'}%</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {(week.days ?? []).map((d: any) => (
          <DayColumn key={d.id} day={d} />
        ))}
      </div>
    </div>
  )
}
