import React from 'react'

export default function Progress({ percent = 0, className = '' }: { percent?: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, percent ?? 0))
  return (
    <div className={`w-full bg-slate-700 h-3 rounded ${className}`}>
      <div className="h-3 bg-emerald-500 rounded" style={{ width: `${pct}%` }} />
    </div>
  )
}
