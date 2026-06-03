"use server"

import { prisma } from '../../lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createTaskAction(formData: FormData) {
  'use server'
  const title = String(formData.get('title') ?? '')
  if (!title) throw new Error('Title is required')

  const description = formData.get('description')
    ? String(formData.get('description'))
    : null
  const estimateMins = formData.get('estimateMins')
    ? Number(formData.get('estimateMins'))
    : null
  const priority = (formData.get('priority') as any) ?? 'MEDIUM'
  const category = formData.get('category') ? String(formData.get('category')) : null

  await prisma.task.create({
    data: {
      title,
      description,
      estimateMins,
      priority,
      category,
    },
  })

  // Revalidate the tasks listing path if you have one
  try {
    revalidatePath('/tasks')
  } catch {}
}

export async function updateTaskAction(formData: FormData) {
  'use server'
  const id = String(formData.get('id') ?? '')
  if (!id) throw new Error('Task id is required')

  const title = String(formData.get('title') ?? '')
  if (!title) throw new Error('Title is required')

  const description = formData.get('description')
    ? String(formData.get('description'))
    : null
  const estimateMins = formData.get('estimateMins')
    ? Number(formData.get('estimateMins'))
    : null
  const priority = (formData.get('priority') as any) ?? 'MEDIUM'
  const category = formData.get('category') ? String(formData.get('category')) : null

  await prisma.task.update({
    where: { id },
    data: { title, description, estimateMins, priority, category },
  })

  try {
    revalidatePath('/tasks')
  } catch {}
}

export async function deleteTaskAction(formData: FormData) {
  'use server'
  const id = String(formData.get('id') ?? '')
  if (!id) throw new Error('Task id is required')

  await prisma.task.delete({ where: { id } })

  try {
    revalidatePath('/tasks')
  } catch {}
}

export async function completeTaskAction(formData: FormData) {
  'use server'
  const id = String(formData.get('id') ?? '')
  if (!id) throw new Error('Task id is required')

  await prisma.task.update({ where: { id }, data: { status: 'DONE' } })

  try {
    revalidatePath('/tasks')
  } catch {}
}
