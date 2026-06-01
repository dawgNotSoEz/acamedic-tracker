type Props = { title: string; value: string; subtitle?: string }

export default function StatsCard({ title, value, subtitle }: Props) {
  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <div className="text-sm text-slate-400">{title}</div>
      <div className="mt-2 text-xl font-semibold">{value}</div>
      {subtitle && <div className="text-xs text-slate-500 mt-1">{subtitle}</div>}
    </div>
  )
}
