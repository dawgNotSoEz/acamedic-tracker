export const dynamic = 'force-dynamic';

import React from "react";
import { getActiveSession, listSessions } from "./actions";
import ActiveSession from "./components/ActiveSession";
import Link from "next/link";

export default async function SessionsPage() {
  let active = null;
  let recent: any[] = [];
  let isOffline = false;

  try {
    active = await getActiveSession();
    recent = await listSessions({ limit: 20 });
  } catch (e) {
    isOffline = true;
    recent = [];
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

      {/* Header */}
      <div className="mb-6 pb-4 border-b border-border/80">
        <h1 className="text-xl font-semibold tracking-tight text-foreground font-sans">Study Sessions</h1>
        <p className="text-xs text-muted mt-0.5">Track your focused work time and study logs</p>
      </div>

      {/* Active Session Component */}
      <section className="mb-8">
        <ActiveSession session={active as any} />
      </section>

      {/* Recent Sessions */}
      <section>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/40">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <h2 className="text-[13px] font-mono uppercase tracking-wider text-foreground">Recent Logged Sessions</h2>
        </div>
        
        <div className="space-y-2">
          {recent.length === 0 ? (
            <div className="bg-surface border border-border rounded-lg p-8 text-center">
              <p className="text-xs text-muted">No focus study sessions recorded yet</p>
            </div>
          ) : (
            recent.map((s) => (
              <div
                key={s.id}
                className="flex items-start justify-between gap-4 p-4 bg-surface border border-border rounded-lg hover:border-border/80 transition-all duration-150"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {s.notes ?? "(No notes logged)"}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono text-muted">
                    <span className="px-1.5 py-0.5 bg-surface-subtle border border-border/60 rounded text-[9px] font-mono uppercase">
                      {s.status}
                    </span>
                    <span>•</span>
                    <span>{s.durationMins ?? s.accumulatedMins} minutes focused</span>
                    <span>•</span>
                    <span>{new Date(s.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
