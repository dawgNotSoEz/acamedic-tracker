export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/prisma";
import ActiveSessionComponent from '../study-sessions/components/ActiveSession'

// shadcn/ui card imports - adjust path if your project uses a different location
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

function startOfDay(d: Date) {
  const t = new Date(d)
  t.setHours(0, 0, 0, 0)
  return t
}

function addDays(d: Date, days: number) {
  const t = new Date(d)
  t.setDate(t.getDate() + days)
  return t
}

export default async function Page() {
  const today = startOfDay(new Date())
  const tomorrow = addDays(today, 1)

  // Today's Tasks: tasks assigned to a Day with date = today
  const todaysTasks = await prisma.task.findMany({ where: { day: { date: { gte: today, lt: tomorrow } } }, orderBy: { createdAt: 'asc' } })

  // Hours Today: sum durationMins for sessions that ended today + active session elapsed
  const stoppedToday = await prisma.studySession.findMany({ where: { status: 'STOPPED', endAt: { gte: today, lt: tomorrow } }, select: { durationMins: true } })
  const stoppedSum = stoppedToday.reduce((s, r) => s + (r.durationMins ?? 0), 0)

  // include active sessions elapsed
  const active = await prisma.studySession.findFirst({ where: { status: 'ACTIVE' } })
  let activeMins = 0
  if (active && active.currentIntervalStart) {
    const now = new Date()
    activeMins = Math.floor((now.getTime() - new Date(active.currentIntervalStart).getTime()) / 60000) + active.accumulatedMins
  }

  const hoursToday = (stoppedSum + activeMins) / 60

  // Current streak: consecutive days up to today with >=30 minutes
  const lookbackDays = 30
  const startLookback = addDays(today, -lookbackDays + 1)
  const sessions = await prisma.studySession.findMany({ where: { OR: [{ status: 'STOPPED', endAt: { gte: startLookback } }, { status: 'ACTIVE', startAt: { gte: startLookback } }, { status: 'PAUSED', startAt: { gte: startLookback } }] }, select: { startAt: true, endAt: true, accumulatedMins: true, durationMins: true, currentIntervalStart: true, status: true } })

  const minsByDate = new Map<string, number>()
  const toDateKey = (d: Date) => d.toISOString().slice(0, 10)

  for (const s of sessions) {
    if (s.status === 'STOPPED' && s.endAt) {
      const key = toDateKey(s.endAt)
      minsByDate.set(key, (minsByDate.get(key) ?? 0) + (s.durationMins ?? s.accumulatedMins ?? 0))
    } else if (s.status === 'ACTIVE' && s.currentIntervalStart) {
      const key = toDateKey(new Date())
      const elapsed = Math.floor((new Date().getTime() - new Date(s.currentIntervalStart).getTime()) / 60000) + s.accumulatedMins
      minsByDate.set(key, (minsByDate.get(key) ?? 0) + elapsed)
    } else if (s.status === 'PAUSED') {
      // attribute accumulatedMins to the day of startAt
      const key = toDateKey(s.startAt)
      minsByDate.set(key, (minsByDate.get(key) ?? 0) + (s.accumulatedMins ?? 0))
    }
  }

  let streak = 0
  const threshold = 30
  for (let i = 0; i < lookbackDays; i++) {
    const d = addDays(today, -i)
    const key = toDateKey(d)
    const mins = minsByDate.get(key) ?? 0
    if (mins >= threshold) streak++
    else break
  }

  // Weekly progress: percent of tasks completed this week (Mon-Sun), using createdAt
  const now = new Date()
  const dayOfWeek = (now.getDay() + 6) % 7 // Monday=0
  const weekStart = addDays(startOfDay(now), -dayOfWeek)
  const weekEnd = addDays(weekStart, 7)
  const weekTasks = await prisma.task.findMany({ where: { createdAt: { gte: weekStart, lt: weekEnd } }, select: { status: true } })
  const totalWeek = weekTasks.length
  const doneWeek = weekTasks.filter((t) => t.status === 'DONE').length
  const weeklyProgress = totalWeek === 0 ? 0 : Math.round((doneWeek / totalWeek) * 100)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Today's Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {todaysTasks.slice(0, 6).map((t) => (
                <li key={t.id} className="text-sm">{t.title}</li>
              ))}
            </ul>
            {todaysTasks.length === 0 && <div className="text-sm text-gray-500">No tasks for today</div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hours Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{hoursToday.toFixed(2)}</div>
            <div className="text-sm text-gray-500">including active session</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{streak} days</div>
            <div className="text-sm text-gray-500">{threshold}+ mins/day</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{weeklyProgress}%</div>
            <div className="text-sm text-gray-500">{doneWeek}/{totalWeek} tasks completed</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Active Session</h2>
        {/* @ts-expect-error server -> client */}
        <ActiveSessionComponent session={active ?? null} />
      </div>
    </div>
  )
}
