type Props = {
  currentStreak: number;
  hoursToday: number;
  weeklyProgress: number;
};

export default function KPIBadges({ currentStreak, hoursToday, weeklyProgress }: Props) {
  return (
    <div className="flex gap-4">
      {/* Current Streak */}
      <div className="bg-surface border border-border rounded-lg px-4 py-3">
        <div className="text-metadata">Current Streak</div>
        <div className="text-2xl font-bold mt-1">{currentStreak}</div>
        <div className="text-xs text-muted mt-1">days in a row</div>
      </div>

      {/* Hours Today */}
      <div className="bg-surface border border-border rounded-lg px-4 py-3">
        <div className="text-metadata">Hours Today</div>
        <div className="text-2xl font-bold mt-1">{hoursToday.toFixed(1)}</div>
        <div className="text-xs text-muted mt-1">study hours</div>
      </div>

      {/* Weekly Progress */}
      <div className="bg-surface border border-border rounded-lg px-4 py-3">
        <div className="text-metadata">Weekly Progress</div>
        <div className="text-2xl font-bold mt-1">{weeklyProgress}%</div>
        <div className="text-xs text-muted mt-1">of goals</div>
      </div>
    </div>
  );
}
