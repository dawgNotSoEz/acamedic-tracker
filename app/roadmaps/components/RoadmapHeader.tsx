import React from 'react'

type Task = { id: string; title: string; status?: string }
type Day = { id: string; dayNumber?: number; date?: string; tasks?: Task[] }
type Week = { id: string; number?: number; title?: string; days?: Day[] }

export default function RoadmapHeader({ roadmap }: { roadmap: { id: string; title?: string; progress?: number; weeks?: Week[] } }) {
  const weeks = roadmap?.weeks ?? []
  const weeksCount = weeks.length
  const daysCount = weeks.reduce((acc, w) => acc + (w.days?.length ?? 0), 0)
  const tasksFlatten = weeks.flatMap((w) => w.days?.flatMap((d) => d.tasks ?? []) ?? [])
  const tasksCount = tasksFlatten.length
  const completedCount = tasksFlatten.filter((t) => t.status === 'DONE' || t.status === 'COMPLETED').length

  const progress = Math.max(0, Math.min(100, roadmap?.progress ?? 0))

  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{roadmap.title}</h2>
          <p className="text-sm text-slate-400">{weeksCount} weeks • {daysCount} days • {tasksCount} tasks</p>
        </div>

        <div className="w-40">
          <div className="text-sm text-slate-300 mb-1">Progress</div>
          <div className="w-full h-3 bg-slate-700 rounded overflow-hidden">
            <div className="h-3 bg-emerald-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-xs text-slate-400 mt-1">{progress}% complete • {completedCount} done</div>
        </div>
      </div>
    </div>
  )
}
