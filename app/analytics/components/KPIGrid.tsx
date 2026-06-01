import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

type Props = {
  totalStudyHours: number
  weeklyHours: number
  monthlyHours: number
  taskCompletion: { total: number; done: number; percent: number }
  currentStreak: number
}

export default function KPIGrid({ totalStudyHours, weeklyHours, monthlyHours, taskCompletion, currentStreak }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Study Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{totalStudyHours.toFixed(2)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{weeklyHours.toFixed(2)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{monthlyHours.toFixed(2)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{taskCompletion.percent}%</div>
          <div className="text-sm text-gray-500">{taskCompletion.done}/{taskCompletion.total} done</div>
          <div className="text-sm mt-2">Streak: {currentStreak} days</div>
        </CardContent>
      </Card>
    </div>
  )
}
