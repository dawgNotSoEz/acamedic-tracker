export const dynamic = 'force-dynamic';

import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import TaskListItem from "@/app/components/TaskListItem";

export default async function TasksPage() {
  let tasks: any[] = [];
  let isOffline = false;

  try {
    tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    isOffline = true;
    tasks = [];
  }

  // Group tasks by status
  const todoTasks = tasks.filter((t) => t.status === "TODO");
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS");
  const doneTasks = tasks.filter((t) => t.status === "DONE");

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
      <div className="mb-6 flex items-center justify-between border-b border-border/85 pb-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground font-sans">Tasks</h1>
          <p className="text-xs text-muted mt-0.5">All your learning pipeline tasks</p>
        </div>
        <Link
          href="/tasks/create"
          className="px-3.5 py-1.5 bg-accent hover:bg-accent-light text-background text-xs font-semibold rounded-md transition-all shadow-sm shadow-accent/15"
        >
          + New Task
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="bg-surface border border-border rounded-lg p-10 text-center max-w-md mx-auto mt-12 space-y-4">
          <div className="space-y-2">
            <span className="text-3xl">📋</span>
            <h3 className="text-sm font-semibold text-foreground">Plan Your Study Operations</h3>
            <p className="text-xs text-muted">
              Your Kanban board is currently empty. Plan and schedule tasks to track your daily progress and focus hours.
            </p>
          </div>
          <Link
            href="/tasks/create"
            className="inline-block px-4 py-2 bg-accent hover:bg-accent-light rounded-lg text-background text-xs font-semibold transition-all shadow-sm shadow-accent/10"
          >
            Create your first task
          </Link>
        </div>
      ) : (
        /* Task Kanban Columns */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* To Do */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
              <h2 className="text-[13px] font-mono uppercase tracking-wider text-foreground">To Do</h2>
              <span className="text-[10px] font-mono bg-surface border border-border/80 text-muted px-1.5 py-0.5 rounded ml-auto">
                {todoTasks.length}
              </span>
            </div>
            <div className="space-y-2 bg-surface/20 border border-border/60 rounded-lg p-3 min-h-[300px]">
              {todoTasks.length === 0 ? (
                <p className="text-xs text-muted text-center py-8">No tasks in backlog</p>
              ) : (
                todoTasks.map((task) => (
                  <TaskListItem key={task.id} task={task as any} />
                ))
              )}
            </div>
          </div>

          {/* In Progress */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <h2 className="text-[13px] font-mono uppercase tracking-wider text-foreground">In Progress</h2>
              <span className="text-[10px] font-mono bg-surface border border-border/80 text-muted px-1.5 py-0.5 rounded ml-auto">
                {inProgressTasks.length}
              </span>
            </div>
            <div className="space-y-2 bg-surface/30 border border-border/70 rounded-lg p-3 min-h-[300px]">
              {inProgressTasks.length === 0 ? (
                <p className="text-xs text-muted text-center py-8">No tasks active</p>
              ) : (
                inProgressTasks.map((task) => (
                  <TaskListItem key={task.id} task={task as any} />
                ))
              )}
            </div>
          </div>

          {/* Done */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <h2 className="text-[13px] font-mono uppercase tracking-wider text-foreground">Done</h2>
              <span className="text-[10px] font-mono bg-surface border border-border/80 text-muted px-1.5 py-0.5 rounded ml-auto">
                {doneTasks.length}
              </span>
            </div>
            <div className="space-y-2 bg-surface/20 border border-border/60 rounded-lg p-3 min-h-[300px]">
              {doneTasks.length === 0 ? (
                <p className="text-xs text-muted text-center py-8">No tasks completed yet</p>
              ) : (
                doneTasks.map((task) => (
                  <TaskListItem key={task.id} task={task as any} />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
