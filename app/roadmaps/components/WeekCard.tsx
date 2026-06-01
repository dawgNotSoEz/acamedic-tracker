import React from 'react'
import DayColumn from './DayColumn'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'


export default function WeekCard({ week }: { week: any }) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between mb-3">
          <div>
            <CardTitle>Week {week.number}: {week.title}</CardTitle>
            <div className="text-sm text-slate-400">{(week.days?.length ?? 0)} days</div>
          </div>
          <div className="text-sm text-slate-300">Progress: {week.progress ?? '-' }%</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(week.days ?? []).map((d: any) => (
            <DayColumn key={d.id} day={d} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
