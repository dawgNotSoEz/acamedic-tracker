type Props = { percent: number }

export default function ProgressBar({ percent }: Props) {
  return (
    <div className="w-full bg-slate-700 rounded-full h-3">
      <div className="bg-green-500 h-3 rounded-full" style={{ width: `${percent}%` }} />
    </div>
  )
}
