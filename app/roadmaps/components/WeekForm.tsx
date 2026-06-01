"use client"

import React from 'react'
import { addWeekAction } from '../actions'

type Props = { roadmapId: string }

export default function WeekForm({ roadmapId }: Props) {
  return (
    <form action={addWeekAction} className="space-y-3">
      <input type="hidden" name="roadmapId" value={roadmapId} />

      <div>
        <label className="block text-sm font-medium">Week Number</label>
        <input name="number" type="number" required className="mt-1 block w-full" />
      </div>

      <div>
        <label className="block text-sm font-medium">Title (optional)</label>
        <input name="title" className="mt-1 block w-full" />
      </div>

      <div className="flex gap-2">
        <div>
          <label className="block text-sm font-medium">Start Date</label>
          <input name="startDate" type="date" className="mt-1 block" />
        </div>
        <div>
          <label className="block text-sm font-medium">End Date</label>
          <input name="endDate" type="date" className="mt-1 block" />
        </div>
      </div>

      <div>
        <button className="px-3 py-1 bg-blue-600 text-white rounded">Add Week</button>
      </div>
    </form>
  )
}
