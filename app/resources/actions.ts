"use server"

import { prisma } from '../../lib/prisma'
import { revalidatePath } from 'next/cache'

async function upsertTags(names: string[]) {
  const trimmed = names.map((n) => n.trim()).filter(Boolean)
  if (trimmed.length === 0) return []

  // Upsert tags and return their ids
  const tags = await Promise.all(
    trimmed.map(async (name) => {
      const tag = await prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name },
      })
      return tag
    })
  )
  return tags
}

export async function createResourceAction(formData: FormData) {
  'use server'
  const title = String(formData.get('title') ?? '')
  if (!title) throw new Error('Title is required')

  const url = formData.get('url') ? String(formData.get('url')) : null
  const category = formData.get('category') ? String(formData.get('category')) : null
  const difficulty = (formData.get('difficulty') as any) ?? 'MEDIUM'
  const tagsRaw = formData.get('tags') ? String(formData.get('tags')) : ''
  const tagNames = tagsRaw.split(',').map((t) => t.trim()).filter(Boolean)

  const resource = await prisma.resource.create({
    data: { title, url, category, difficulty, type: url ? "LINK" : "NOTE" },
  })

  if (tagNames.length > 0) {
    const tags = await upsertTags(tagNames)
    await Promise.all(
      tags.map((tag) =>
        prisma.resourceTag.create({ data: { resourceId: resource.id, tagId: tag.id } })
      )
    )
  }

  try {
    revalidatePath('/resources')
  } catch {}
}

export async function updateResourceAction(formData: FormData) {
  'use server'
  const id = String(formData.get('id') ?? '')
  if (!id) throw new Error('Resource id required')

  const title = String(formData.get('title') ?? '')
  if (!title) throw new Error('Title is required')

  const url = formData.get('url') ? String(formData.get('url')) : null
  const category = formData.get('category') ? String(formData.get('category')) : null
  const difficulty = (formData.get('difficulty') as any) ?? 'MEDIUM'
  const tagsRaw = formData.get('tags') ? String(formData.get('tags')) : ''
  const tagNames = tagsRaw.split(',').map((t) => t.trim()).filter(Boolean)

  await prisma.resource.update({ where: { id }, data: { title, url, category, difficulty } })

  // Reset tags: delete existing and recreate
  await prisma.resourceTag.deleteMany({ where: { resourceId: id } })
  if (tagNames.length > 0) {
    const tags = await upsertTags(tagNames)
    await Promise.all(
      tags.map((tag) => prisma.resourceTag.create({ data: { resourceId: id, tagId: tag.id } }))
    )
  }

  try {
    revalidatePath('/resources')
  } catch {}
}

export async function deleteResourceAction(formData: FormData) {
  'use server'
  const id = String(formData.get('id') ?? '')
  if (!id) throw new Error('Resource id required')

  // delete join rows then resource
  await prisma.resourceTag.deleteMany({ where: { resourceId: id } })
  await prisma.resource.delete({ where: { id } })

  try {
    revalidatePath('/resources')
  } catch {}
}

export async function getResource(id: string) {
  return prisma.resource.findUnique({
    where: { id },
    include: { tags: { include: { tag: true } } },
  })
}
