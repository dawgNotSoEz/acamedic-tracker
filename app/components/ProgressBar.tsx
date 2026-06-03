type Props = { percent: number; showLabel?: boolean };

export default function ProgressBar({ percent, showLabel = false }: Props) {
  const pct = Math.max(0, Math.min(percent, 100));

  return (
    <div className="w-full">
      <div className="relative h-[3px] bg-surface-subtle rounded-full overflow-hidden border border-border/40">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1.5 text-[11px] font-mono text-muted text-right">{pct}%</div>
      )}
    </div>
  );
}
