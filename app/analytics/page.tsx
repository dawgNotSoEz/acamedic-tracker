export const dynamic = 'force-dynamic';

import React from "react";
import Link from "next/link";
import { getAnalytics } from "./actions";
import WeeklyChart from "./components/WeeklyChart";
import MonthlyChart from "./components/MonthlyChart";
import CategoryChart from "./components/CategoryChart";

export default async function AnalyticsPage() {
  let data = null;
  let isOffline = false;

  try {
    data = await getAnalytics();
  } catch (e) {
    isOffline = true;
    data = {
      totalStudyHours: 0.0,
      weekly: Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - 6 + i);
        return { date: d.toISOString().slice(0, 10), hours: 0.0 };
      }),
      monthly: Array.from({ length: 30 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - 29 + i);
        return { date: d.toISOString().slice(0, 10), hours: 0.0 };
      }),
      hoursByCategory: [],
      taskCompletion: { percent: 0, total: 0, done: 0 },
      currentStreak: 0,
    };
  }

  const weeklyHours = data.weekly.reduce((s: number, d: any) => s + d.hours, 0);

  return (
    <div className="pt-6 px-4 md:px-8 max-w-6xl mx-auto pb-20 select-none">
      {/* Offline Mode Banner */}
      {isOffline && (
        <div className="mb-4 px-3 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono rounded flex items-center gap-2">
          <span>⚠️</span>
          <span>Offline Mode: Unable to reach database server.</span>
        </div>
      )}

      {/* Header section */}
      <div className="mb-6 pb-4 border-b border-border/80">
        <h1 className="text-xl font-semibold tracking-tight text-foreground font-sans">Analytics</h1>
        <p className="text-xs text-muted mt-0.5">Your study metrics, streaks, and focus insights</p>
      </div>

      {/* Empty State Banner if no study hours are recorded */}
      {data.totalStudyHours === 0 && (
        <div className="mb-6 p-4 bg-accent/5 border border-accent/20 rounded-lg flex items-start gap-3 select-none">
          <span className="text-lg shrink-0">📊</span>
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-foreground font-sans">No focus study data available yet</h4>
            <p className="text-[11px] text-muted leading-normal">
              Your analytics dashboard currently has no logged entries. Focus sessions of 30+ minutes on your active tasks will automatically populate your weekly, monthly, and domain-breakdown activity graphs.
            </p>
            <Link href="/" className="inline-block text-[10px] text-accent hover:underline font-mono mt-1">
              ← Go to Dashboard Focus Cockpit
            </Link>
          </div>
        </div>
      )}

      {/* High Density Metric HUD Cockpit */}
      <section className="mb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* HUD Item 1 */}
          <div className="bg-surface border border-border rounded-lg p-4 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted flex items-center gap-1">
              ⏱️ Total Time
            </span>
            <div className="text-xl font-bold font-mono tracking-tight text-foreground">
              {data.totalStudyHours.toFixed(1)}h
            </div>
            <div className="text-[9px] font-mono text-muted">All-time learning</div>
          </div>

          {/* HUD Item 2 */}
          <div className="bg-surface border border-border rounded-lg p-4 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted flex items-center gap-1">
              📈 Weekly Average
            </span>
            <div className="text-xl font-bold font-mono tracking-tight text-foreground">
              {weeklyHours.toFixed(1)}h
            </div>
            <div className="text-[9px] font-mono text-muted">Last 7 days focused</div>
          </div>

          {/* HUD Item 3 */}
          <div className="bg-surface border border-border rounded-lg p-4 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted flex items-center gap-1">
              🔥 Streak
            </span>
            <div className="text-xl font-bold font-mono tracking-tight text-accent">
              {data.currentStreak} days
            </div>
            <div className="text-[9px] font-mono text-muted">Consecutive learning days</div>
          </div>

          {/* HUD Item 4 */}
          <div className="bg-surface border border-border rounded-lg p-4 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted flex items-center gap-1">
              ✓ Completion Rate
            </span>
            <div className="text-xl font-bold font-mono tracking-tight text-foreground">
              {data.taskCompletion.percent}%
            </div>
            <div className="text-[9px] font-mono text-muted">
              {data.taskCompletion.done}/{data.taskCompletion.total} tasks completed
            </div>
          </div>
        </div>
      </section>

      {/* Grid for Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Weekly Activities */}
        <div className="bg-surface border border-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/40">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <h2 className="text-[12px] font-mono uppercase tracking-wider text-foreground">Weekly Activity (7 Days)</h2>
          </div>
          <div className="pt-2">
            <WeeklyChart data={data.weekly} />
          </div>
        </div>

        {/* Monthly Activities */}
        <div className="bg-surface border border-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/40">
            <span className="w-1.5 h-1.5 rounded-full bg-muted" />
            <h2 className="text-[12px] font-mono uppercase tracking-wider text-foreground">Monthly Activity (30 Days)</h2>
          </div>
          <div className="pt-2">
            <MonthlyChart data={data.monthly} />
          </div>
        </div>
      </section>

      {/* Category Breakdown */}
      <section className="bg-surface border border-border rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/40">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <h2 className="text-[12px] font-mono uppercase tracking-wider text-foreground">Hours by Domain Category</h2>
        </div>
        <div className="pt-2">
          <CategoryChart data={data.hoursByCategory} />
        </div>
      </section>
    </div>
  );
}
