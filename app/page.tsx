export const dynamic = 'force-dynamic';

import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getActiveSession } from "@/app/study-sessions/actions";
import { getAnalytics } from "@/app/analytics/actions";
import ProgressBar from "@/app/components/ProgressBar";
import TaskListItem from "@/app/components/TaskListItem";
import ActiveTimer from "@/app/components/ActiveTimer";

export default async function Dashboard() {
  let activeSession = null;
  
  // Calculate standard default last 7 days for analytics fallback in case database query fails
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    return { date: d.toISOString().slice(0, 10), hours: 0.0 };
  });

  let analytics = {
    currentStreak: 0,
    hoursToday: 0.0,
    weeklyProgress: 0,
    taskCompletion: { percent: 0 },
    weekly: last7Days,
  };

  try {
    const rawActive = await getActiveSession();
    if (rawActive) {
      let taskTitle = "Independent Study";
      if (rawActive.taskId) {
        const t = await prisma.task.findUnique({ where: { id: rawActive.taskId } });
        if (t) taskTitle = t.title;
      } else if (rawActive.notes) {
        taskTitle = rawActive.notes;
      }
      
      let elapsedSeconds = 0;
      if (rawActive.currentIntervalStart) {
        elapsedSeconds = Math.floor((Date.now() - new Date(rawActive.currentIntervalStart).getTime()) / 1000) + (rawActive.accumulatedMins * 60);
      } else {
        elapsedSeconds = rawActive.accumulatedMins * 60;
      }

      activeSession = {
        id: rawActive.id,
        title: taskTitle,
        elapsedSeconds,
        running: rawActive.status === "ACTIVE",
      };
    }
  } catch (e) {
    console.error("Error fetching active session:", e);
  }

  try {
    const rawAnalytics = await getAnalytics();
    const today = new Date().toISOString().slice(0, 10);
    const todayRecord = rawAnalytics.weekly.find((w) => w.date === today);
    const hoursToday = todayRecord ? todayRecord.hours : 0.0;

    analytics = {
      currentStreak: rawAnalytics.currentStreak || 0,
      hoursToday: hoursToday || 0.0,
      weeklyProgress: rawAnalytics.taskCompletion.percent || 0,
      taskCompletion: rawAnalytics.taskCompletion,
      weekly: rawAnalytics.weekly && rawAnalytics.weekly.length > 0 ? rawAnalytics.weekly : last7Days,
    };
  } catch (e) {
    console.error("Error fetching analytics:", e);
  }

  // Fetch current active roadmap
  let activeRoadmap = null;
  try {
    const dbRoadmap = await prisma.roadmap.findFirst({
      orderBy: { createdAt: "desc" },
      include: {
        weeks: {
          orderBy: { number: "asc" },
          include: {
            days: {
              orderBy: { dayNumber: "asc" },
              include: { tasks: true },
            },
            tasks: true,
          },
        },
        tasks: true,
      },
    });

    if (dbRoadmap) {
      const completedTasks = dbRoadmap.tasks.filter((t) => t.status === "DONE").length;
      const totalTasks = dbRoadmap.tasks.length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      activeRoadmap = {
        id: dbRoadmap.id,
        title: dbRoadmap.title,
        progress: progress,
        weeks: dbRoadmap.weeks.map((w) => {
          const wCompleted = w.tasks.filter((t) => t.status === "DONE").length;
          const wTotal = w.tasks.length;
          const wProgress = wTotal > 0 ? Math.round((wCompleted / wTotal) * 100) : 0;
          return {
            id: w.id,
            number: w.number,
            title: w.title || `Week ${w.number}`,
            progress: wProgress,
            tasksCount: wTotal,
            days: w.days.map((d) => ({
              id: d.id,
              dayNumber: d.dayNumber,
              title: d.title || `Day ${d.dayNumber}`,
              tasks: d.tasks,
            })),
          };
        }),
      };
    }
  } catch (e) {
    console.error("Error fetching active roadmap:", e);
  }

  // Fetch today's real tasks from backlog
  let todayTasksList: any[] = [];
  try {
    const dbTasks = await prisma.task.findMany({
      where: { status: { in: ["TODO", "IN_PROGRESS"] } },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      take: 4,
    });
    todayTasksList = dbTasks.map((t) => ({
      id: t.id,
      title: t.title,
      status: t.status,
      priority: t.priority,
      estimateMins: t.estimateMins,
      category: t.category,
    }));
  } catch (e) {
    console.error("Error fetching tasks:", e);
  }

  // Fetch upcoming real tasks from backlog
  let upcomingTasksList: any[] = [];
  try {
    const dbUpcoming = await prisma.task.findMany({
      where: { status: "TODO" },
      orderBy: { createdAt: "desc" },
      skip: todayTasksList.length,
      take: 3,
    });
    upcomingTasksList = dbUpcoming.map((t) => ({
      id: t.id,
      title: t.title,
      status: t.status,
      priority: t.priority,
      estimateMins: t.estimateMins,
      category: t.category,
    }));
  } catch (e) {
    console.error("Error fetching upcoming tasks:", e);
  }

  // Fetch resources
  let resourceList: any[] = [];
  try {
    const dbResources = await prisma.resource.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
    });
    resourceList = dbResources.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category || "Reference",
    }));
  } catch (e) {
    console.error("Error fetching resources:", e);
  }

  // Fetch pending tasks to support selects in ActiveTimer when no focus session is active
  let allPendingTasks: any[] = [];
  try {
    const dbPending = await prisma.task.findMany({
      where: { status: { in: ["TODO", "IN_PROGRESS"] } },
      select: { id: true, title: true },
      orderBy: { createdAt: "desc" },
    });
    allPendingTasks = dbPending;
  } catch (e) {
    console.error("Error fetching pending tasks:", e);
  }

  return (
    <div className="min-h-screen px-4 md:px-8 py-6 max-w-7xl mx-auto pb-24 font-sans select-none">
      {/* Header Cockpit */}
      <section className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/80">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">CyberSprint</h1>
          <p className="text-xs text-muted mt-0.5">Premium Study Operating System</p>
        </div>

        {/* High-Density Horizontal Status Bar */}
        <div className="flex items-center gap-4 bg-surface/60 border border-border/60 rounded-md px-3.5 py-2 text-[12px]">
          <div className="flex items-center gap-1.5 font-sans">
            <span className="text-orange-500">🔥</span>
            <span className="text-foreground font-semibold">{analytics.currentStreak}</span>
            <span className="text-muted text-[11px]">day streak</span>
          </div>
          <div className="w-[1px] h-3 bg-border/80" />
          <div className="flex items-center gap-1.5 font-sans">
            <span className="text-accent">⏱️</span>
            <span className="text-foreground font-semibold">{analytics.hoursToday.toFixed(1)}h</span>
            <span className="text-muted text-[11px]">focused today</span>
          </div>
          <div className="w-[1px] h-3 bg-border/80" />
          <div className="flex items-center gap-1.5 font-sans">
            <span className="text-emerald-500">✓</span>
            <span className="text-foreground font-semibold">{analytics.weeklyProgress}%</span>
            <span className="text-muted text-[11px]">goals complete</span>
          </div>
        </div>
      </section>

      {/* Active Roadmap Banner */}
      <section className="mb-6">
        {!activeRoadmap ? (
          <div className="bg-surface border border-border rounded-lg p-8 text-center space-y-4">
            <div className="max-w-md mx-auto space-y-2">
              <span className="text-3xl">🧭</span>
              <h3 className="text-sm font-semibold text-foreground">Plan Your Learning Pathway</h3>
              <p className="text-xs text-muted">
                Welcome to CyberSprint. Build a structured learning roadmap with weeks, days, and tasks to map out and track your training curriculum.
              </p>
            </div>
            <Link
              href="/roadmaps/create"
              className="inline-block px-4 py-2 bg-accent hover:bg-accent-light rounded-lg text-background text-xs font-semibold transition-all shadow-sm shadow-accent/10"
            >
              + Create Roadmap
            </Link>
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-lg p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted">Active Roadmap</span>
                <h2 className="text-base font-semibold text-foreground mt-0.5">{activeRoadmap.title}</h2>
              </div>
              <div className="flex items-center gap-3 sm:text-right shrink-0">
                <div>
                  <div className="text-sm font-semibold font-mono text-accent">{activeRoadmap.progress}%</div>
                  <div className="text-[10px] text-muted leading-none">Roadmap Complete</div>
                </div>
                <div className="w-24 sm:w-28 shrink-0">
                  <ProgressBar percent={activeRoadmap.progress} />
                </div>
              </div>
            </div>

            {/* Collapsible Weeks - Linear Disclosure Panel */}
            <div className="border border-border/60 rounded-md overflow-hidden bg-background/30 divide-y divide-border/40">
              {activeRoadmap.weeks.map((week) => (
                <details key={week.id} className="group" open={week.number === 1}>
                  <summary className="flex items-center justify-between cursor-pointer list-none select-none px-4 py-3 hover:bg-surface-subtle/30 transition-all duration-150">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-muted transition-transform group-open:rotate-90 group-open:text-accent">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </span>
                      <span className="text-[13px] font-medium text-foreground truncate">
                        Week {week.number}: {week.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 pl-3">
                      <span className="text-[10px] font-mono text-muted">{week.tasksCount} tasks</span>
                      <div className="w-16 sm:w-20 hidden xs:block">
                        <ProgressBar percent={week.progress} />
                      </div>
                    </div>
                  </summary>
                  <div className="px-4 pb-4 pt-1 bg-surface/10 border-t border-border/20 space-y-3 pl-9">
                    {week.days && week.days.length > 0 ? (
                      week.days.map((day) => (
                        <div key={day.id} className="space-y-1.5">
                          <div className="text-[11px] font-medium text-muted uppercase tracking-wide">
                            Day {day.dayNumber}: {day.title}
                          </div>
                          <div className="space-y-1.5">
                            {day.tasks && day.tasks.length > 0 ? (
                              day.tasks.map((task) => (
                                <TaskListItem key={task.id} task={task as any} />
                              ))
                            ) : (
                              <div className="text-xs text-muted/60 pl-2">No tasks assigned to this day.</div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-muted/60 py-1">No days populated yet. Click roadmap details to manage.</div>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Main Command Grid Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1 & 2: Tasks List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Tasks */}
          <div className="bg-surface border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/40">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <h3 className="text-[13px] font-mono uppercase tracking-wider text-foreground">Today's Tasks</h3>
              </div>
              <Link href="/tasks" className="text-[11px] text-accent hover:text-accent-light hover:underline font-mono">
                View all tasks
              </Link>
            </div>
            {todayTasksList.length === 0 ? (
              <div className="text-center py-8 bg-background/25 border border-dashed border-border/80 rounded-md">
                <p className="text-xs text-muted">No focus tasks scheduled for today</p>
                <Link
                  href="/tasks/create"
                  className="inline-block mt-3 px-3 py-1.5 bg-surface-subtle border border-border hover:bg-border/60 hover:text-foreground text-muted text-[11px] font-medium rounded-md transition-all"
                >
                  + Create Task
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {todayTasksList.map((task) => (
                  <TaskListItem key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-surface border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/40">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-muted" />
                <h3 className="text-[13px] font-mono uppercase tracking-wider text-foreground">Upcoming Pipeline</h3>
              </div>
              <Link href="/tasks/create" className="text-[11px] text-muted hover:text-foreground font-mono">
                + Create Task
              </Link>
            </div>
            {upcomingTasksList.length === 0 ? (
              <p className="text-xs text-muted text-center py-6">No upcoming tasks in backlog</p>
            ) : (
              <div className="space-y-2">
                {upcomingTasksList.map((task) => (
                  <TaskListItem key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Focus Cockpit & Analytics */}
        <div className="space-y-6">
          {/* Active focus timer cockpit */}
          <ActiveTimer
            initialTask={activeSession}
            allPendingTasks={allPendingTasks}
          />

          {/* Mini Analytics Activity Preview */}
          <div className="bg-surface border border-border rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted">Weekly Activity</span>
              <Link href="/analytics" className="text-[10px] text-accent hover:text-accent-light font-mono">
                Full Metrics
              </Link>
            </div>

            {/* Micro-sparklines (Vertical Grid) */}
            <div className="flex items-end justify-between h-14 pt-2">
              {analytics.weekly.map((w, i) => {
                const maxHours = 6.0; // Cap at 6 hours for visual scale
                const barHeightPct = Math.max(2, Math.min((w.hours / maxHours) * 100, 100));
                
                return (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1 group relative">
                    <div className="w-[10px] bg-background/60 border border-border/40 rounded-t h-12 flex items-end overflow-hidden">
                      <div
                        className="bg-accent/80 group-hover:bg-accent w-full transition-all duration-300 rounded-t"
                        style={{ height: `${barHeightPct}%` }}
                      />
                    </div>
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-16 bg-surface border border-border px-1.5 py-0.5 rounded text-[9px] text-foreground opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 font-mono whitespace-nowrap z-50">
                      {w.hours.toFixed(1)}h
                    </div>
                    <span className="text-[9px] font-mono text-muted uppercase">
                      {new Date(w.date).toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1)}
                    </span>
                  </div>
                );
              })}
            </div>
            
            <div className="text-[11px] font-mono text-muted text-center pt-1 border-t border-border/20">
              Total weekly focus: <span className="text-foreground font-semibold">{analytics.weekly.reduce((a, b) => a + b.hours, 0.0).toFixed(1)}h</span>
            </div>
          </div>

          {/* Resources Mini Box */}
          <div className="bg-surface border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/40">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted">Recent Resources</span>
              <Link href="/resources" className="text-[10px] text-muted hover:text-foreground font-mono">
                Library
              </Link>
            </div>
            {resourceList.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-xs text-muted">No resources saved yet</p>
                <Link href="/resources/create" className="inline-block text-[10px] text-accent hover:underline mt-1 font-mono">
                  Add a Resource
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {resourceList.map((resource) => (
                  <Link
                    key={resource.id}
                    href={`/resources/${resource.id}`}
                    className="flex items-center justify-between p-2 rounded border border-border/60 hover:border-accent/40 bg-background/25 hover:bg-surface-subtle/25 transition-all group"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-sans text-foreground truncate group-hover:text-accent transition-colors">
                        {resource.title}
                      </div>
                      <div className="text-[9px] font-mono text-muted mt-0.5">{resource.category}</div>
                    </div>
                    <span className="text-muted group-hover:text-accent text-xs transition-colors pl-2 shrink-0">→</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
