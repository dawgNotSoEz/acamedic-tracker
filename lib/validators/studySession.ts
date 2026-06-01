import { z } from 'zod'

export const startSessionSchema = z.object({
  taskId: z.string().uuid().optional(),
  resourceId: z.string().uuid().optional(),
  notes: z.string().optional(),
  category: z.string().optional(),
})

export const sessionIdSchema = z.object({ id: z.string().uuid() })

export type StartSessionInput = z.infer<typeof startSessionSchema>
export type SessionIdInput = z.infer<typeof sessionIdSchema>

function getFormValue(form: FormData, key: string): string | undefined {
  const v = form.get(key)
  if (v === null) return undefined
  const s = String(v).trim()
  return s === '' ? undefined : s
}

export function parseStartSessionForm(form: FormData): StartSessionInput {
  const taskId = getFormValue(form, 'taskId')
  const resourceId = getFormValue(form, 'resourceId')
  const notes = getFormValue(form, 'notes')
  const category = getFormValue(form, 'category')
  return startSessionSchema.parse({ taskId, resourceId, notes, category })
}

export function parseSessionIdForm(form: FormData): SessionIdInput {
  const id = getFormValue(form, 'id') ?? ''
  return sessionIdSchema.parse({ id })
}
