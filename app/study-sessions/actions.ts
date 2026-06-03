"use server"

import { prisma } from '../../lib/prisma'
import { revalidatePath } from 'next/cache'
import { parseStartSessionForm, parseSessionIdForm } from '../../lib/validators/studySession'

function minutesBetween(start: Date, end: Date) {
  return Math.floor((end.getTime() - start.getTime()) / 60000)
}

export async function startSessionAction(formData: FormData) {
  'use server'
  const data = parseStartSessionForm(formData)

  // Auto-stop any existing active session to enforce single active session
  const existing = await prisma.studySession.findFirst({ where: { status: 'ACTIVE' } })
  if (existing) {
    // compute elapsed and stop
    const now = new Date()
    if (existing.currentIntervalStart) {
      const elapsed = minutesBetween(existing.currentIntervalStart, now)
      await prisma.studySession.update({ where: { id: existing.id }, data: { accumulatedMins: { increment: elapsed }, currentIntervalStart: null, endAt: now, durationMins: { set: existing.accumulatedMins + elapsed }, status: 'STOPPED' } })
    } else {
      await prisma.studySession.update({ where: { id: existing.id }, data: { endAt: new Date(), status: 'STOPPED' } })
    }
  }

  const now = new Date()
  const session = await prisma.studySession.create({ data: { taskId: data.taskId, resourceId: data.resourceId, notes: data.notes, category: data.category, startAt: now, currentIntervalStart: now, accumulatedMins: 0, status: 'ACTIVE' } })

  try {
    revalidatePath('/study-sessions')
  } catch {}

  return session
}

export async function pauseSessionAction(formData: FormData) {
  'use server'
  const { id } = parseSessionIdForm(formData)
  const session = await prisma.studySession.findUnique({ where: { id } })
  if (!session) throw new Error('Session not found')
  if (session.status !== 'ACTIVE' || !session.currentIntervalStart) throw new Error('Session is not active')

  const now = new Date()
  const elapsed = minutesBetween(session.currentIntervalStart, now)

  await prisma.studySession.update({ where: { id }, data: { accumulatedMins: { increment: elapsed }, currentIntervalStart: null, status: 'PAUSED' } })

  try { revalidatePath('/study-sessions') } catch {}
}

export async function resumeSessionAction(formData: FormData) {
  'use server'
  const { id } = parseSessionIdForm(formData)
  const session = await prisma.studySession.findUnique({ where: { id } })
  if (!session) throw new Error('Session not found')
  if (session.status !== 'PAUSED') throw new Error('Session is not paused')

  const now = new Date()
  await prisma.studySession.update({ where: { id }, data: { currentIntervalStart: now, status: 'ACTIVE' } })

  try { revalidatePath('/study-sessions') } catch {}
}

export async function stopSessionAction(formData: FormData) {
  'use server'
  const { id } = parseSessionIdForm(formData)
  const session = await prisma.studySession.findUnique({ where: { id } })
  if (!session) throw new Error('Session not found')
  if (session.status === 'STOPPED') return

  const now = new Date()
  let total = session.accumulatedMins
  if (session.currentIntervalStart) {
    total = total + minutesBetween(session.currentIntervalStart, now)
  }

  await prisma.studySession.update({ where: { id }, data: { accumulatedMins: total, currentIntervalStart: null, endAt: now, durationMins: total, status: 'STOPPED' } })

  try { revalidatePath('/study-sessions') } catch {}
}

export async function getActiveSession() {
  return prisma.studySession.findFirst({ where: { status: 'ACTIVE' } })
}

export async function listSessions({ limit = 50 }: { limit?: number } = {}) {
  return prisma.studySession.findMany({ orderBy: { createdAt: 'desc' }, take: limit })
}
