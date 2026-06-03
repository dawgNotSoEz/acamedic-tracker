type Props = { title: string; value: string; subtitle?: string; icon?: string };

export default function StatsCard({ title, value, subtitle, icon }: Props) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-metadata">{title}</div>
          <div className="mt-2 text-2xl font-bold">{value}</div>
          {subtitle && <div className="text-xs text-muted mt-1">{subtitle}</div>}
        </div>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
    </div>
  );
}
