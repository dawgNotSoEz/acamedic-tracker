import React from 'react'
import TaskRow from './TaskRow'
import { Card, CardContent } from '@/components/ui/card'

export default function DayColumn({ day }: { day: any }) {
  return (
    <Card className="bg-slate-900">
      <CardContent>
        <div className="text-sm text-slate-400 mb-2">{day.date ?? `Day ${day.dayNumber}`}</div>
        <div className="space-y-2">
          {(day.tasks ?? []).map((t: any) => (
            <TaskRow key={t.id} task={t} />
          ))}
          {!(day.tasks ?? []).length && <div className="text-slate-500 text-sm">No tasks</div>}
        </div>
      </CardContent>
    </Card>
  )
}
