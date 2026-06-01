"use client"

import React from 'react'
import { addDayAction, assignTaskToDayAction } from '../actions'

type TaskOption = { id: string; title: string }

type Props = { weekId: string; tasks: TaskOption[] }

export function DayCreateForm({ weekId }: { weekId: string }) {
  return (
    <form action={addDayAction} className="space-y-3">
      <input type="hidden" name="weekId" value={weekId} />

      <div>
        <label className="block text-sm font-medium">Day Number</label>
        <input name="dayNumber" type="number" required className="mt-1 block w-full" />
      </div>

      <div>
        <label className="block text-sm font-medium">Date (optional)</label>
        <input name="date" type="date" className="mt-1 block w-full" />
      </div>

      <div>
        <label className="block text-sm font-medium">Title (optional)</label>
        <input name="title" className="mt-1 block w-full" />
      </div>

      <div>
        <button className="px-3 py-1 bg-blue-600 text-white rounded">Add Day</button>
      </div>
    </form>
  )
}

export function AssignTaskForm({ weekId, tasks }: Props) {
  return (
    <form action={assignTaskToDayAction} className="space-y-2">
      <div>
        <label className="block text-sm font-medium">Select Day</label>
        <select name="dayId" className="mt-1 block w-full">
          {/* days select should be rendered server-side and passed down when used */}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Select Task</label>
        <select name="taskId" className="mt-1 block w-full">
          <option value="">-- choose task --</option>
          {tasks.map((t) => (
            <option key={t.id} value={t.id}>{t.title}</option>
          ))}
        </select>
      </div>

      <div>
        <button className="px-3 py-1 bg-green-600 text-white rounded">Assign Task</button>
      </div>
    </form>
  )
}

export default function DayForm({ weekId, tasks }: Props) {
  return (
    <div className="space-y-4">
      <DayCreateForm weekId={weekId} />
      <AssignTaskForm weekId={weekId} tasks={tasks} />
    </div>
  )
}
