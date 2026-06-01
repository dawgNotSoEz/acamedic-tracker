"use client"

import React from 'react'
import { createTaskAction, updateTaskAction } from '../actions'

type TaskProps = {
  task?: {
    id: string
    title: string
    description?: string | null
    estimateMins?: number | null
    priority?: string | null
    category?: string | null
  }
}

export default function TaskForm({ task }: TaskProps) {
  const isEdit = Boolean(task)

  return (
    <form action={isEdit ? updateTaskAction : createTaskAction} className="space-y-4">
      {isEdit && <input type="hidden" name="id" defaultValue={task!.id} />}

      <div>
        <label className="block text-sm font-medium">Title</label>
        <input name="title" defaultValue={task?.title ?? ''} required className="mt-1 block w-full" />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea name="description" defaultValue={task?.description ?? ''} className="mt-1 block w-full" />
      </div>

      <div>
        <label className="block text-sm font-medium">Estimate (minutes)</label>
        <input name="estimateMins" type="number" defaultValue={task?.estimateMins ?? ''} className="mt-1 block w-full" />
      </div>

      <div>
        <label className="block text-sm font-medium">Priority</label>
        <select name="priority" defaultValue={task?.priority ?? 'MEDIUM'} className="mt-1 block w-full">
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Category</label>
        <input name="category" defaultValue={task?.category ?? ''} className="mt-1 block w-full" />
      </div>

      <div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          {isEdit ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  )
}
