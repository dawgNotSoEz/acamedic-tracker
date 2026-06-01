import { prisma } from '../../lib/prisma'

function toDateKey(d: Date) {
  return d.toISOString().slice(0, 10)
}

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

export async function getAnalytics() {
  const today = startOfDay(new Date())
  const last30 = addDays(today, -29)
  const last7 = addDays(today, -6)

  // Fetch sessions in last 30 days (including active/paused)
  const sessions = await prisma.studySession.findMany({
    where: {
      OR: [
        { status: 'STOPPED', endAt: { gte: last30 } },
        { status: 'PAUSED', startAt: { gte: last30 } },
        { status: 'ACTIVE', startAt: { gte: last30 } },
      ],
    },
    select: { startAt: true, endAt: true, accumulatedMins: true, durationMins: true, currentIntervalStart: true, status: true, category: true },
  })

  // Total study minutes (all time): sum durationMins of stopped + accumulated for paused + active elapsed
  const allStopped = await prisma.studySession.findMany({ where: { status: 'STOPPED' }, select: { durationMins: true } })
  const totalMins = allStopped.reduce((s, r) => s + (r.durationMins ?? 0), 0)

  // include active elapsed
  const active = await prisma.studySession.findFirst({ where: { status: 'ACTIVE' } })
  let activeMins = 0
  if (active) {
    if (active.currentIntervalStart) {
      activeMins = Math.floor((Date.now() - new Date(active.currentIntervalStart).getTime()) / 60000) + active.accumulatedMins
    } else {
      activeMins = active.accumulatedMins
    }
  }

  const totalStudyHours = (totalMins + activeMins) / 60

  // Weekly (last 7 days) and Monthly (last 30 days) breakdowns
  const minsByDay = new Map<string, number>()
  for (let i = 0; i < 30; i++) minsByDay.set(toDateKey(addDays(last30, i)), 0)

  for (const s of sessions) {
    if (s.status === 'STOPPED' && s.endAt) {
      const key = toDateKey(s.endAt)
      minsByDay.set(key, (minsByDay.get(key) ?? 0) + (s.durationMins ?? s.accumulatedMins ?? 0))
    } else if (s.status === 'ACTIVE' && s.currentIntervalStart) {
      const key = toDateKey(new Date())
      const elapsed = Math.floor((Date.now() - new Date(s.currentIntervalStart).getTime()) / 60000) + s.accumulatedMins
      minsByDay.set(key, (minsByDay.get(key) ?? 0) + elapsed)
    } else if (s.status === 'PAUSED') {
      // attribute accumulatedMins to startAt day
      const key = toDateKey(s.startAt)
      minsByDay.set(key, (minsByDay.get(key) ?? 0) + (s.accumulatedMins ?? 0))
    }
  }

  const monthly = Array.from({ length: 30 }).map((_, idx) => {
    const d = addDays(last30, idx)
    const key = toDateKey(d)
    return { date: key, minutes: minsByDay.get(key) ?? 0 }
  })

  const weekly = monthly.slice(30 - 7)

  // Hours by category
  const categoryMap = new Map<string, number>()
  for (const [k, v] of minsByDay.entries()) {
    // we'll use sessions to get categories properly
  }
  for (const s of sessions) {
    const minutes = (s.status === 'STOPPED' && s.durationMins != null)
      ? s.durationMins
      : s.status === 'ACTIVE' && s.currentIntervalStart
      ? Math.floor((Date.now() - new Date(s.currentIntervalStart).getTime()) / 60000) + (s.accumulatedMins ?? 0)
      : s.accumulatedMins ?? 0
    const cat = s.category ?? 'Uncategorized'
    categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + (minutes ?? 0))
  }

  const hoursByCategory = Array.from(categoryMap.entries()).map(([category, minutes]) => ({ category, hours: minutes / 60 }))

  // Task completion percentage (all tasks)
  const totalTasks = await prisma.task.count()
  const doneTasks = await prisma.task.count({ where: { status: 'DONE' } })
  const taskCompletion = { total: totalTasks, done: doneTasks, percent: totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100) }

  // Current streak (>=30 mins/day), reuse logic
  const lookbackDays = 30
  let streak = 0
  const threshold = 30
  for (let i = 0; i < lookbackDays; i++) {
    const d = addDays(today, -i)
    const key = toDateKey(d)
    const mins = minsByDay.get(key) ?? 0
    if (mins >= threshold) streak++
    else break
  }

  return {
    totalStudyHours,
    weekly: weekly.map((w) => ({ date: w.date, hours: Math.round((w.minutes ?? 0) / 60 * 100) / 100 })),
    monthly: monthly.map((m) => ({ date: m.date, hours: Math.round((m.minutes ?? 0) / 60 * 100) / 100 })),
    hoursByCategory,
    taskCompletion,
    currentStreak: streak,
  }
}
