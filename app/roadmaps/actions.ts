"use server"

import { prisma } from '../../lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createRoadmapAction(formData: FormData) {
  'use server'
  const title = String(formData.get('title') ?? '')
  if (!title) throw new Error('Title is required')
  const description = formData.get('description') ? String(formData.get('description')) : null

  await prisma.roadmap.create({ data: { title, description } })

  try {
    revalidatePath('/roadmaps')
  } catch {}
}

export async function addWeekAction(formData: FormData) {
  'use server'
  const roadmapId = String(formData.get('roadmapId') ?? '')
  if (!roadmapId) throw new Error('roadmapId required')

  const number = Number(formData.get('number'))
  const title = formData.get('title') ? String(formData.get('title')) : null
  const startDate = formData.get('startDate') ? new Date(String(formData.get('startDate'))) : null
  const endDate = formData.get('endDate') ? new Date(String(formData.get('endDate'))) : null

  await prisma.week.create({ data: { roadmapId, number, title, startDate, endDate } })

  try {
    revalidatePath(`/roadmaps/${roadmapId}`)
    revalidatePath('/roadmaps')
  } catch {}
}

export async function addDayAction(formData: FormData) {
  'use server'
  const weekId = String(formData.get('weekId') ?? '')
  if (!weekId) throw new Error('weekId required')

  const dayNumber = Number(formData.get('dayNumber'))
  const date = formData.get('date') ? new Date(String(formData.get('date'))) : null
  const title = formData.get('title') ? String(formData.get('title')) : null

  const day = await prisma.day.create({ data: { weekId, dayNumber, date, title } })

  // Revalidate
  try {
    // find roadmap id for revalidation
    const week = await prisma.week.findUnique({ where: { id: weekId } })
    if (week) revalidatePath(`/roadmaps/${week.roadmapId}`)
  } catch {}

  return day
}

export async function assignTaskToDayAction(formData: FormData) {
  'use server'
  const taskId = String(formData.get('taskId') ?? '')
  const dayId = String(formData.get('dayId') ?? '')
  if (!taskId || !dayId) throw new Error('taskId and dayId required')

  const day = await prisma.day.findUnique({ where: { id: dayId }, include: { week: true } })
  if (!day) throw new Error('Day not found')

  const week = day.week
  if (!week) throw new Error('Associated week not found')

  await prisma.task.update({
    where: { id: taskId },
    data: { dayId: day.id, weekId: week.id, roadmapId: week.roadmapId },
  })

  try {
    revalidatePath(`/roadmaps/${week.roadmapId}`)
    revalidatePath(`/tasks/${taskId}`)
  } catch {}
}

export async function deleteWeekAction(formData: FormData) {
  'use server'
  const id = String(formData.get('id') ?? '')
  if (!id) throw new Error('week id required')

  // delete days first (and optionally handle tasks)
  await prisma.day.deleteMany({ where: { weekId: id } })
  await prisma.week.delete({ where: { id } })

  try {
    revalidatePath('/roadmaps')
  } catch {}
}

export async function deleteDayAction(formData: FormData) {
  'use server'
  const id = String(formData.get('id') ?? '')
  if (!id) throw new Error('day id required')

  await prisma.day.delete({ where: { id } })

  try {
    // revalidate parent roadmap if possible
    // fetch week to get roadmap
    // Note: this is best-effort
  } catch {}
}
