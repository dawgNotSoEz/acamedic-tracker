export const dynamic = 'force-dynamic';

import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProgressBar from "@/app/components/ProgressBar";

export default async function RoadmapsPage() {
  let roadmaps: any[] = [];
  let isOffline = false;

  try {
    roadmaps = await prisma.roadmap.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        weeks: true,
        tasks: true,
      },
    });
  } catch (e) {
    isOffline = true;
    roadmaps = [];
  }

  return (
    <div className="pt-6 px-4 md:px-8 max-w-4xl mx-auto pb-20 select-none">
      {/* Offline Mode Banner */}
      {isOffline && (
        <div className="mb-4 px-3 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono rounded flex items-center gap-2">
          <span>⚠️</span>
          <span>Offline Mode: Unable to reach database server.</span>
        </div>
      )}

      {/* Header section */}
      <div className="mb-6 flex items-center justify-between border-b border-border/80 pb-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground font-sans">Roadmaps</h1>
          <p className="text-xs text-muted mt-0.5">Manage your learning pathways and milestones</p>
        </div>
        <Link
          href="/roadmaps/create"
          className="px-3.5 py-1.5 bg-accent hover:bg-accent-light text-background text-xs font-semibold rounded-md transition-all shadow-sm shadow-accent/15"
        >
          + New Roadmap
        </Link>
      </div>

      {/* Roadmaps List Grid */}
      <div className="space-y-4">
        {roadmaps.length === 0 ? (
          <div className="bg-surface border border-border rounded-lg p-10 text-center">
            <p className="text-sm text-muted">No learning roadmaps found</p>
            <Link
              href="/roadmaps/create"
              className="inline-block mt-4 px-4 py-2 bg-accent hover:bg-accent-light rounded-lg text-background text-xs font-semibold transition-all shadow-sm shadow-accent/10"
            >
              Create your first roadmap
            </Link>
          </div>
        ) : (
          roadmaps.map((roadmap) => {
            const completedTasks = roadmap.tasks.filter(
              (t: any) => t.status === "DONE"
            ).length;
            const totalTasks = roadmap.tasks.length;
            const progress =
              totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

            return (
              <Link
                key={roadmap.id}
                href={`/roadmaps/${roadmap.id}`}
                className="group block bg-surface border border-border rounded-lg p-5 hover:border-accent/40 hover:bg-surface-subtle/10 transition-all duration-150"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors truncate">
                      {roadmap.title}
                    </h2>
                    {roadmap.description && (
                      <p className="text-xs text-muted mt-1 truncate max-w-2xl">{roadmap.description}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold font-mono text-accent">{progress}%</div>
                    <div className="text-[9px] font-mono text-muted uppercase tracking-wider">Complete</div>
                  </div>
                </div>

                {/* Modern High-Precision Progress Bar */}
                <div className="mb-4">
                  <ProgressBar percent={progress} showLabel={false} />
                </div>

                {/* High Density Meta Info */}
                <div className="flex items-center gap-3 text-[10px] font-mono text-muted">
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-muted">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M3 9h18M9 21V9" />
                    </svg>
                    {roadmap.weeks.length} weeks
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-muted">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                    {totalTasks} tasks
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    {completedTasks}/{totalTasks} completed
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
