"use client"

import React from 'react'
import { createResourceAction, updateResourceAction } from '../actions'

type ResourceProps = {
  resource?: {
    id: string
    title: string
    url?: string | null
    category?: string | null
    difficulty?: string | null
    tags?: { id: string; tag: { id: string; name: string } }[]
  }
}

export default function ResourceForm({ resource }: ResourceProps) {
  const isEdit = Boolean(resource)
  const tagsValue = resource?.tags?.map((t) => t.tag.name).join(', ') ?? ''

  return (
    <form action={isEdit ? updateResourceAction : createResourceAction} className="space-y-4">
      {isEdit && <input type="hidden" name="id" defaultValue={resource!.id} />}

      <div>
        <label className="block text-sm font-medium">Title</label>
        <input name="title" defaultValue={resource?.title ?? ''} required className="mt-1 block w-full" />
      </div>

      <div>
        <label className="block text-sm font-medium">URL</label>
        <input name="url" defaultValue={resource?.url ?? ''} className="mt-1 block w-full" />
      </div>

      <div>
        <label className="block text-sm font-medium">Category</label>
        <input name="category" defaultValue={resource?.category ?? ''} className="mt-1 block w-full" />
      </div>

      <div>
        <label className="block text-sm font-medium">Difficulty</label>
        <select name="difficulty" defaultValue={resource?.difficulty ?? 'MEDIUM'} className="mt-1 block w-full">
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Tags (comma separated)</label>
        <input name="tags" defaultValue={tagsValue} className="mt-1 block w-full" />
      </div>

      <div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          {isEdit ? 'Update Resource' : 'Create Resource'}
        </button>
      </div>
    </form>
  )
}
