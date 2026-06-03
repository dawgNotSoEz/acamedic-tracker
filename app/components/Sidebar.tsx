"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-expanded");
    if (saved !== null) {
      setExpanded(saved === "true");
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !expanded;
    setExpanded(newState);
    localStorage.setItem("sidebar-expanded", String(newState));
  };

  const navItems: NavItem[] = [
    {
      href: "/",
      label: "Dashboard",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      ),
    },
    {
      href: "/roadmaps",
      label: "Roadmaps",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
          <circle cx="6" cy="6" r="3" />
          <circle cx="18" cy="18" r="3" />
          <path d="M9 6h9a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H9" />
        </svg>
      ),
    },
    {
      href: "/tasks",
      label: "Tasks",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
    },
    {
      href: "/resources",
      label: "Resources",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M6 6h10" />
          <path d="M6 10h10" />
        </svg>
      ),
    },
    {
      href: "/study-sessions",
      label: "Sessions",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      href: "/analytics",
      label: "Analytics",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-3 3" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav
        className={`hidden md:flex md:flex-col fixed top-0 left-0 h-screen bg-surface border-r border-border transition-all duration-300 z-40 ${
          expanded ? "w-[220px]" : "w-16"
        }`}
      >
        {/* Brand / Logo */}
        <div className="h-14 border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold text-accent font-mono">CS</span>
            </div>
            {expanded && (
              <span className="text-sm font-semibold tracking-tight text-foreground transition-opacity duration-300 font-sans">
                CyberSprint
              </span>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-4 space-y-1 px-2.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3 px-3 py-2 rounded-md transition-all group overflow-hidden ${
                  isActive
                    ? "bg-surface-subtle text-accent font-medium"
                    : "text-muted hover:text-foreground hover:bg-surface-subtle"
                }`}
              >
                {/* Active left bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-accent rounded-r" />
                )}
                
                <span className={`shrink-0 transition-transform ${isActive ? "text-accent" : "text-muted group-hover:text-foreground"}`}>
                  {item.icon}
                </span>

                {expanded ? (
                  <span className="text-[13px] font-sans truncate transition-opacity duration-300">
                    {item.label}
                  </span>
                ) : (
                  <div className="absolute left-16 bg-surface border border-border px-2 py-1 rounded text-xs text-foreground opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150 whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-border p-2.5 space-y-1">
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-muted hover:text-foreground hover:bg-surface-subtle transition-all group relative"
          >
            <span className="shrink-0 text-muted group-hover:text-foreground">
              {expanded ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                  <polyline points="11 17 6 12 11 7" />
                  <polyline points="18 17 13 12 18 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                  <polyline points="13 17 18 12 13 7" />
                  <polyline points="6 17 11 12 6 7" />
                </svg>
              )}
            </span>
            {expanded ? (
              <span className="text-[13px] font-sans truncate">Collapse Menu</span>
            ) : (
              <div className="absolute left-16 bg-surface border border-border px-2 py-1 rounded text-xs text-foreground opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150 whitespace-nowrap z-50">
                Expand Menu
              </div>
            )}
          </button>
        </div>
      </nav>

      {/* Spacer to push desktop page content beside the sidebar */}
      <div className={`hidden md:block transition-all duration-300 shrink-0 ${expanded ? "w-[220px]" : "w-16"}`} />

      {/* Mobile Navigation Dock */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-surface border-t border-border flex items-center justify-around z-40 px-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive ? "text-accent" : "text-muted hover:text-foreground"
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-sans mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
