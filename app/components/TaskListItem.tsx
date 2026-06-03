import React from "react";

type Task = {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority?: "LOW" | "MEDIUM" | "HIGH";
  estimateMins?: number | null;
  category?: string | null;
};

export default function TaskListItem({ task }: { task: Task }) {
  const isCompleted = task.status === "DONE";

  const priorityDots = {
    LOW: "bg-zinc-500",
    MEDIUM: "bg-amber-500/80",
    HIGH: "bg-red-500",
  };

  const priorityLabels = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
  };

  const statusIcons = {
    TODO: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[14px] h-[14px] text-muted">
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
    IN_PROGRESS: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[14px] h-[14px] text-accent animate-pulse">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
    ),
    DONE: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-[14px] h-[14px] text-emerald-500">
        <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.1" />
        <polyline points="9 11 12 14 22 4" className="stroke-emerald-500" strokeDasharray="none" />
      </svg>
    ),
  };

  return (
    <div
      className={`group flex items-center justify-between gap-3 px-3 py-2.5 bg-surface border border-border rounded-md hover:border-border/80 hover:bg-surface-subtle/30 transition-all duration-150 ${
        isCompleted ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Status Indicator */}
        <div className="shrink-0">
          {statusIcons[task.status]}
        </div>

        {/* Task Title */}
        <span
          className={`text-[13px] text-foreground font-sans truncate ${
            isCompleted ? "line-through text-muted" : ""
          }`}
        >
          {task.title}
        </span>

        {/* Category micro-tag */}
        {task.category && (
          <span className="shrink-0 text-[10px] font-mono text-muted bg-surface-subtle border border-border/80 px-1.5 py-0.5 rounded leading-none">
            {task.category}
          </span>
        )}
      </div>

      {/* Metadata Indicators */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Estimated Duration */}
        {task.estimateMins && (
          <span className="text-[11px] font-mono text-muted flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-muted/80">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 14 14"/>
            </svg>
            {task.estimateMins}m
          </span>
        )}

        {/* Priority Badge */}
        {task.priority && (
          <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-surface-subtle border border-border/60 rounded text-[10px] text-muted font-sans">
            <span className={`w-1.5 h-1.5 rounded-full ${priorityDots[task.priority]}`} />
            <span>{priorityLabels[task.priority]}</span>
          </div>
        )}
      </div>
    </div>
  );
}
