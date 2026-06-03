"use client"

import React from 'react'
import { addDayAction, assignTaskToDayAction } from '../actions'

type DayOption = { id: string; label: string }
type TaskOption = { id: string; title: string }

type Props = {
  weekId: string
  tasks: TaskOption[]
  days: DayOption[]
}

export function DayCreateForm({ weekId }: { weekId: string }) {
  return (
    <form action={async (formData) => { await addDayAction(formData); }} className="space-y-3">
      <input type="hidden" name="weekId" value={weekId} />

      <div className="space-y-1">
        <label className="text-[10px] font-mono text-muted uppercase">Day Number</label>
        <input
          name="dayNumber"
          type="number"
          required
          placeholder="e.g. 1, 2, 3"
          className="w-full bg-background border border-border/80 rounded px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-mono text-muted uppercase">Date (optional)</label>
        <input
          name="date"
          type="date"
          className="w-full bg-background border border-border/80 rounded px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-accent"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-mono text-muted uppercase">Title (optional)</label>
        <input
          name="title"
          placeholder="e.g. Network Scanning Basics"
          className="w-full bg-background border border-border/80 rounded px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent"
        />
      </div>

      <div>
        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-surface-subtle border border-border hover:bg-border/60 hover:text-foreground text-muted text-xs font-medium rounded-md transition-all">
          + Add Day
        </button>
      </div>
    </form>
  )
}

export function AssignTaskForm({ tasks, days }: { tasks: TaskOption[]; days: DayOption[] }) {
  return (
    <form action={assignTaskToDayAction} className="space-y-3">
      <div className="space-y-1">
        <label className="text-[10px] font-mono text-muted uppercase">Select Day</label>
        {days.length === 0 ? (
          <div className="text-[11px] text-muted bg-background/30 border border-border/60 rounded px-2.5 py-1.5 font-mono">
            No days created yet. Add a day first.
          </div>
        ) : (
          <select
            name="dayId"
            required
            className="w-full bg-background border border-border/80 rounded px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-accent"
          >
            <option value="">-- select day --</option>
            {days.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-mono text-muted uppercase">Select Task</label>
        {tasks.length === 0 ? (
          <div className="text-[11px] text-muted bg-background/30 border border-border/60 rounded px-2.5 py-1.5 font-mono">
            No unassigned tasks found.
          </div>
        ) : (
          <select
            name="taskId"
            required
            className="w-full bg-background border border-border/80 rounded px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-accent"
          >
            <option value="">-- select task --</option>
            {tasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={days.length === 0 || tasks.length === 0}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-accent hover:bg-accent-light disabled:bg-accent/40 text-background text-xs font-semibold rounded-md transition-all shadow-sm shadow-accent/15"
        >
          Assign Task
        </button>
      </div>
    </form>
  )
}

export default function DayForm({ weekId, tasks, days }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <DayCreateForm weekId={weekId} />
      </div>
      <div className="border-t border-border/40 pt-4">
        <AssignTaskForm tasks={tasks} days={days} />
      </div>
    </div>
  )
}
