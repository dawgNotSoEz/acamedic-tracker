export const dynamic = 'force-dynamic';

import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import WeekForm from "../components/WeekForm";
import DayForm from "../components/DayForm";
import ProgressBar from "@/app/components/ProgressBar";

type Props = { params: { id: string } };

export default async function Page({ params }: Props) {
  let roadmap = null;
  let tasks: any[] = [];
  let isOffline = false;

  try {
    roadmap = await prisma.roadmap.findUnique({
      where: { id: params.id },
      include: {
        weeks: {
          include: {
            days: {
              include: { tasks: true },
            },
            tasks: true,
          },
        },
        tasks: true,
      },
    });

    if (roadmap) {
      tasks = await prisma.task.findMany({
        where: {
          OR: [{ roadmapId: roadmap.id }, { roadmapId: null }],
        },
        select: { id: true, title: true },
      });
    }
  } catch (e) {
    isOffline = true;
  }

  if (!roadmap) {
    return (
      <div className="pt-6 px-4 md:px-8 max-w-4xl mx-auto pb-20 select-none text-center space-y-4 mt-20">
        <span className="text-4xl">⚠️</span>
        <h2 className="text-lg font-semibold text-foreground">Roadmap Not Found</h2>
        <p className="text-xs text-muted">The requested learning syllabus does not exist or has been deleted.</p>
        <Link href="/roadmaps" className="inline-block text-xs font-mono text-accent hover:underline">
          ← Return to learning pathways
        </Link>
      </div>
    );
  }

  const completedTasks = roadmap.tasks.filter((t: any) => t.status === "DONE").length;
  const totalTasks = roadmap.tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="pt-6 px-4 md:px-8 max-w-6xl mx-auto pb-20 select-none">
      {/* Offline Mode Banner */}
      {isOffline && (
        <div className="mb-4 px-3 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono rounded flex items-center gap-2">
          <span>⚠️</span>
          <span>Offline Mode: Unable to reach database server.</span>
        </div>
      )}

      {/* Dynamic Header */}
      <div className="mb-6 pb-5 border-b border-border/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/roadmaps" className="text-xs text-muted hover:text-accent flex items-center gap-1 mb-1.5 font-mono">
            ← Back to Roadmaps
          </Link>
          <h1 className="text-xl font-semibold tracking-tight text-foreground font-sans">{roadmap.title}</h1>
          {roadmap.description && (
            <p className="text-xs text-muted mt-1 max-w-2xl">{roadmap.description}</p>
          )}
        </div>

        {/* Progress HUD */}
        <div className="flex items-center gap-4 bg-surface/50 border border-border/60 rounded-md px-3.5 py-2 text-[12px] shrink-0">
          <div className="text-right">
            <div className="text-sm font-bold font-mono text-accent">{progress}%</div>
            <div className="text-[9px] font-mono text-muted uppercase tracking-wider">Progress</div>
          </div>
          <div className="w-20 shrink-0">
            <ProgressBar percent={progress} />
          </div>
          <div className="w-[1px] h-4 bg-border/80" />
          <div className="text-right">
            <div className="text-sm font-bold font-mono text-foreground">{roadmap.weeks.length}</div>
            <div className="text-[9px] font-mono text-muted uppercase tracking-wider">Weeks</div>
          </div>
        </div>
      </div>

      {/* Structured Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Columns: Weeks Outline */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <h2 className="text-[13px] font-mono uppercase tracking-wider text-foreground">Syllabus Outline</h2>
          </div>

          {roadmap.weeks.length === 0 ? (
            <div className="bg-surface border border-border rounded-lg p-10 text-center">
              <p className="text-xs text-muted">No weeks added to this syllabus yet.</p>
            </div>
          ) : (
            roadmap.weeks
              .sort((a: any, b: any) => a.number - b.number)
              .map((week: any) => {
                const wCompleted = week.tasks.filter((t: any) => t.status === "DONE").length;
                const wTotal = week.tasks.length;
                const wProgress = wTotal > 0 ? Math.round((wCompleted / wTotal) * 100) : 0;

                return (
                  <div key={week.id} className="bg-surface border border-border rounded-lg p-5 space-y-4">
                    <div className="flex items-start justify-between gap-4 pb-3 border-b border-border/40">
                      <div>
                        <div className="text-xs font-semibold text-foreground font-sans">
                          Week {week.number}: {week.title || "Untitled Week"}
                        </div>
                        {week.startDate && (
                          <div className="text-[10px] font-mono text-muted mt-0.5">
                            {new Date(week.startDate).toLocaleDateString()} —{" "}
                            {week.endDate ? new Date(week.endDate).toLocaleDateString() : "Present"}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[10px] font-mono text-muted">{wTotal} tasks</span>
                        <div className="w-16">
                          <ProgressBar percent={wProgress} />
                        </div>
                      </div>
                    </div>

                    {/* Days within Week */}
                    <div className="space-y-3 pl-2">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-muted mb-1.5">Syllabus Days</div>
                      {week.days.length === 0 ? (
                        <p className="text-xs text-muted/65 italic pl-2">No active days scheduled. Add a day on the side dashboard.</p>
                      ) : (
                        week.days
                          .sort((a: any, b: any) => a.dayNumber - b.dayNumber)
                          .map((day: any) => (
                            <div
                              key={day.id}
                              className="p-3 bg-background/30 border border-border/50 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-border/80 transition-all duration-150"
                            >
                              <div>
                                <div className="text-[12px] font-medium text-foreground">
                                  Day {day.dayNumber} {day.title && `— ${day.title}`}
                                </div>
                                {day.date && (
                                  <div className="text-[9px] font-mono text-muted mt-0.5">
                                    {new Date(day.date).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                              <div className="text-[10px] font-mono bg-surface border border-border/80 text-muted px-2 py-0.5 rounded shrink-0 self-start sm:self-center">
                                {day.tasks.length} tasks assigned
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                );
              })
          )}
        </div>

        {/* Right 1 Column: Widget Drawer Forms */}
        <div className="space-y-6">
          {/* Add Week Widget */}
          <div className="bg-surface border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-1.5 border-b border-border/40 pb-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-muted">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M12 8v8M8 12h8" />
              </svg>
              <h3 className="text-[11px] font-mono uppercase tracking-wider text-foreground">Add Syllabus Week</h3>
            </div>
            <WeekForm roadmapId={roadmap.id} />
          </div>

          {/* Add Day / Assign Task Widget */}
          <div className="bg-surface border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-1.5 border-b border-border/40 pb-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-muted">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <h3 className="text-[11px] font-mono uppercase tracking-wider text-foreground">Schedule / Assign</h3>
            </div>

            {roadmap.weeks.length === 0 ? (
              <p className="text-xs text-muted py-2 italic text-center">Add a week before scheduling days.</p>
            ) : (
              <div>
                <DayForm
                  weekId={roadmap.weeks[0]?.id || ""}
                  tasks={tasks}
                  days={roadmap.weeks.flatMap((w: any) =>
                    w.days.map((d: any) => ({
                      id: d.id,
                      label: `W${w.number}D${d.dayNumber}: ${d.title || "Untitled"}`,
                    }))
                  )}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
