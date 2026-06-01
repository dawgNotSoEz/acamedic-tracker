import React from 'react'
import WeekCard from './WeekCard'

export default function WeeksList({ weeks }: { weeks?: any[] }) {
  if (!weeks || weeks.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="text-slate-300">No weeks yet. Add a week to get started.</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {weeks.map((w) => (
        <WeekCard key={w.id} week={w} />
      ))}
    </div>
  )
}
