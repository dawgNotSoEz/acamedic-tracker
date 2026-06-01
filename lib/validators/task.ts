import { z } from 'zod'

export const TaskStatusEnum = z.enum(['TODO', 'IN_PROGRESS', 'DONE'])
export const PriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH'])

export const taskCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  estimateMins: z.number().int().nonnegative().optional(),
  priority: PriorityEnum.optional().default('MEDIUM'),
  status: TaskStatusEnum.optional().default('TODO'),
  category: z.string().optional(),
  roadmapId: z.string().uuid().optional(),
  weekId: z.string().uuid().optional(),
  dayId: z.string().uuid().optional(),
})

export const taskUpdateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  estimateMins: z.number().int().nonnegative().optional(),
  priority: PriorityEnum.optional(),
  status: TaskStatusEnum.optional(),
  category: z.string().optional(),
  roadmapId: z.string().uuid().optional(),
  weekId: z.string().uuid().optional(),
  dayId: z.string().uuid().optional(),
})

export type TaskCreateInput = z.infer<typeof taskCreateSchema>
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>

function getFormValue(form: FormData, key: string): string | undefined {
  const v = form.get(key)
  if (v === null) return undefined
  const s = String(v).trim()
  return s === '' ? undefined : s
}

export function parseTaskCreateForm(form: FormData): TaskCreateInput {
  const title = getFormValue(form, 'title') ?? ''
  const description = getFormValue(form, 'description')
  const estimateRaw = getFormValue(form, 'estimateMins')
  const estimateMins = estimateRaw ? Number(estimateRaw) : undefined
  const priority = (getFormValue(form, 'priority') as TaskCreateInput['priority']) ?? undefined
  const status = (getFormValue(form, 'status') as TaskCreateInput['status']) ?? undefined
  const category = getFormValue(form, 'category')
  const roadmapId = getFormValue(form, 'roadmapId')
  const weekId = getFormValue(form, 'weekId')
  const dayId = getFormValue(form, 'dayId')

  return taskCreateSchema.parse({ title, description, estimateMins, priority, status, category, roadmapId, weekId, dayId })
}

export function parseTaskUpdateForm(form: FormData): TaskUpdateInput {
  const id = getFormValue(form, 'id') ?? ''
  const title = getFormValue(form, 'title')
  const description = getFormValue(form, 'description')
  const estimateRaw = getFormValue(form, 'estimateMins')
  const estimateMins = estimateRaw ? Number(estimateRaw) : undefined
  const priority = (getFormValue(form, 'priority') as TaskUpdateInput['priority']) ?? undefined
  const status = (getFormValue(form, 'status') as TaskUpdateInput['status']) ?? undefined
  const category = getFormValue(form, 'category')
  const roadmapId = getFormValue(form, 'roadmapId')
  const weekId = getFormValue(form, 'weekId')
  const dayId = getFormValue(form, 'dayId')

  return taskUpdateSchema.parse({ id, title, description, estimateMins, priority, status, category, roadmapId, weekId, dayId })
}
