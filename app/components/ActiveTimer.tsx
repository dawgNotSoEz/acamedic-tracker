"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { startSessionAction, stopSessionAction, pauseSessionAction, resumeSessionAction } from "@/app/study-sessions/actions";

type Props = {
  initialTask: { id: string; title: string; elapsedSeconds: number; running: boolean } | null;
  allPendingTasks?: { id: string; title: string }[];
};

export default function ActiveTimer({ initialTask, allPendingTasks = [] }: Props) {
  const router = useRouter();
  const [running, setRunning] = useState(initialTask ? initialTask.running : false);
  const [seconds, setSeconds] = useState(initialTask ? initialTask.elapsedSeconds : 0);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [sessionNotes, setSessionNotes] = useState("");
  const [sessionCategory, setSessionCategory] = useState("General");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Sync state if initialTask changes (e.g. Server Component re-renders with fresh data)
  useEffect(() => {
    if (initialTask) {
      setRunning(initialTask.running);
      setSeconds(initialTask.elapsedSeconds);
    } else {
      setRunning(false);
      setSeconds(0);
    }
  }, [initialTask]);

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running]);

  async function handlePause() {
    if (!initialTask) return;
    setRunning(false);
    try {
      const formData = new FormData();
      formData.append("id", initialTask.id);
      await pauseSessionAction(formData);
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  }

  async function handleResume() {
    if (!initialTask) return;
    setRunning(true);
    try {
      const formData = new FormData();
      formData.append("id", initialTask.id);
      await resumeSessionAction(formData);
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  }

  async function handleStop() {
    if (!initialTask) return;
    setRunning(false);
    try {
      const formData = new FormData();
      formData.append("id", initialTask.id);
      await stopSessionAction(formData);
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  }

  async function handleStart() {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (selectedTaskId) formData.append("taskId", selectedTaskId);
      if (sessionNotes) formData.append("notes", sessionNotes);
      if (sessionCategory) formData.append("category", sessionCategory);
      await startSessionAction(formData);
      
      setSelectedTaskId("");
      setSessionNotes("");
      setIsSubmitting(false);
      router.refresh();
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  }

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  // Render onboarding focus session form if no active session is running
  if (!initialTask) {
    return (
      <div className="bg-surface border border-border rounded-lg p-5 space-y-4">
        <div className="border-b border-border/60 pb-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted">Focus Cockpit</span>
          <h4 className="text-sm font-semibold text-foreground mt-0.5">Start Focus Session</h4>
          <p className="text-[11px] text-muted mt-1 leading-normal">
            Select an active learning task or type custom notes to start a real-time focus log.
          </p>
        </div>

        <div className="space-y-3">
          {/* Task Dropdown Selection */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-muted uppercase">Select Task</label>
            {allPendingTasks.length === 0 ? (
              <div className="text-[11px] text-muted bg-background/30 border border-border/60 rounded px-2.5 py-1.5 font-mono">
                No active tasks found. Type custom notes below instead.
              </div>
            ) : (
              <select
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="w-full bg-background border border-border/80 rounded px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-accent"
              >
                <option value="">-- Custom focus session --</option>
                {allPendingTasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Session Notes */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-muted uppercase">Session Notes</label>
            <input
              type="text"
              placeholder="e.g. OWASP practice, learning AD, etc."
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              className="w-full bg-background border border-border/80 rounded px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-accent"
            />
          </div>

          {/* Domain Category */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-muted uppercase">Domain Category</label>
            <select
              value={sessionCategory}
              onChange={(e) => setSessionCategory(e.target.value)}
              className="w-full bg-background border border-border/80 rounded px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-accent"
            >
              <option value="General">General Study</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Networks">Networks</option>
              <option value="Blockchain">Blockchain</option>
              <option value="DSA">DSA Practice</option>
              <option value="WebDev">Full Stack Dev</option>
            </select>
          </div>

          {/* Start Session Trigger Button */}
          <button
            onClick={handleStart}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-accent hover:bg-accent-light disabled:bg-accent/40 text-background text-xs font-semibold rounded-md transition-all shadow-sm shadow-accent/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M8 5.14v14c0 .86.94 1.39 1.66.9l10-7a1 1 0 0 0 0-1.8l-10-7A1 1 0 0 0 8 5.14Z"/>
            </svg>
            {isSubmitting ? "Starting..." : "Start Focus Session"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-5 space-y-4">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted">Focus Session</span>
          <h4 className="text-sm font-medium text-foreground truncate mt-0.5 max-w-[200px]" title={initialTask.title}>
            {initialTask.title}
          </h4>
        </div>
        <span className="flex h-2 w-2 relative shrink-0">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${running ? "bg-accent" : "bg-muted"}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${running ? "bg-accent" : "bg-muted"}`}></span>
        </span>
      </div>

      {/* Clock Counter Display */}
      <div className="flex flex-col items-center justify-center py-6 bg-background/50 border border-border/80 rounded-md">
        <span className="text-4xl font-bold font-mono tracking-tight text-accent select-all">
          {mins.toString().padStart(2, "0")}:{secs.toString().padStart(2, "0")}
        </span>
        <span className="text-[10px] font-mono text-muted tracking-wide mt-1.5 uppercase">
          Elapsed Time
        </span>
      </div>

      {/* Modern High-Density Controls */}
      <div className="flex items-center gap-2">
        {running ? (
          <button
            onClick={handlePause}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-surface-subtle border border-border hover:bg-border/60 hover:text-foreground text-muted text-xs font-medium rounded-md transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <rect x="6" y="4" width="4" height="16" rx="1"/>
              <rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>
            Pause
          </button>
        ) : (
          <button
            onClick={handleResume}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-accent hover:bg-accent-light text-background text-xs font-semibold rounded-md transition-all shadow-sm shadow-accent/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M8 5.14v14c0 .86.94 1.39 1.66.9l10-7a1 1 0 0 0 0-1.8l-10-7A1 1 0 0 0 8 5.14Z"/>
            </svg>
            Resume
          </button>
        )}
        
        <button
          onClick={handleStop}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-surface-subtle border border-border hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-400 text-muted text-xs font-medium rounded-md transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
            <rect x="4" y="4" width="16" height="16" rx="1"/>
          </svg>
          Stop
        </button>
      </div>
    </div>
  );
}
