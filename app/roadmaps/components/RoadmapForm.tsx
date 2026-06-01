"use client"

import React from 'react'
import { createRoadmapAction } from '../actions'

export default function RoadmapForm() {
  return (
    <form action={createRoadmapAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input name="title" required className="mt-1 block w-full" />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea name="description" className="mt-1 block w-full" />
      </div>

      <div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create Roadmap</button>
      </div>
    </form>
  )
}
