export const dynamic = 'force-dynamic';

import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ResourcesPage() {
  let resources: any[] = [];
  let isOffline = false;

  try {
    resources = await prisma.resource.findMany({
      include: { tags: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    isOffline = true;
    resources = [];
  }

  const difficultyColors = {
    EASY: "border-emerald-500/20 text-emerald-400 bg-emerald-500/5",
    MEDIUM: "border-amber-500/20 text-amber-400 bg-amber-500/5",
    HARD: "border-rose-500/20 text-rose-400 bg-rose-500/5",
  };

  return (
    <div className="pt-6 px-4 md:px-8 max-w-4xl mx-auto pb-20 select-none">
      {/* Offline Mode Banner */}
      {isOffline && (
        <div className="mb-4 px-3 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono rounded flex items-center gap-2">
          <span>⚠️</span>
          <span>Offline Mode: Unable to reach database server.</span>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-6 flex items-center justify-between border-b border-border/80 pb-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground font-sans">Resources</h1>
          <p className="text-xs text-muted mt-0.5">Your organized study materials and reference guides</p>
        </div>
        <Link
          href="/resources/create"
          className="px-3.5 py-1.5 bg-accent hover:bg-accent-light text-background text-xs font-semibold rounded-md transition-all shadow-sm shadow-accent/15"
        >
          + New Resource
        </Link>
      </div>

      {/* Resources List */}
      <div className="space-y-3">
        {resources.length === 0 ? (
          <div className="bg-surface border border-border rounded-lg p-10 text-center">
            <p className="text-xs text-muted">No resources saved yet</p>
            <Link
              href="/resources/create"
              className="inline-block mt-4 px-4 py-2 bg-accent hover:bg-accent-light rounded-lg text-background text-xs font-semibold transition-all shadow-sm shadow-accent/10"
            >
              Add your first resource
            </Link>
          </div>
        ) : (
          resources.map((r) => (
            <Link
              key={r.id}
              href={`/resources/${r.id}`}
              className="group block bg-surface border border-border rounded-lg p-5 hover:border-accent/40 hover:bg-surface-subtle/10 transition-all duration-150"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors truncate">
                    {r.title}
                  </h2>
                  <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-muted">
                    {r.category && (
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3">
                          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                        </svg>
                        {r.category}
                      </span>
                    )}
                    <span>•</span>
                    {r.difficulty && (
                      <span className={`px-2 py-0.5 border rounded-full text-[9px] font-mono font-medium leading-none ${difficultyColors[r.difficulty as keyof typeof difficultyColors] || difficultyColors.MEDIUM}`}>
                        {r.difficulty}
                      </span>
                    )}
                  </div>

                  {/* Tags list */}
                  {r.tags.length > 0 && (
                    <div className="mt-3.5 flex gap-1.5 flex-wrap">
                      {r.tags.map((t: any) => (
                        <span
                          key={t.tag.id}
                          className="px-2 py-0.5 bg-surface-subtle border border-border/80 rounded text-[9px] font-mono text-muted"
                        >
                          #{t.tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-muted group-hover:text-accent transition-colors text-sm shrink-0 self-center">→</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
