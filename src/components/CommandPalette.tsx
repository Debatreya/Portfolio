"use client";

import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarResults,
  KBarSearch,
  useMatches,
} from "kbar";
import { useRouter } from "next/navigation";
import type React from "react";

export function CommandPalette({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const actions = [
    {
      id: "home",
      name: "Home",
      shortcut: ["h"],
      keywords: "home dashboard index",
      perform: () => router.push("/"),
    },
    {
      id: "resume",
      name: "Professional Resume",
      shortcut: ["r"],
      keywords: "cv resume experience education",
      perform: () => router.push("/resume"),
    },
    {
      id: "projects",
      name: "Project Gallery",
      shortcut: ["p"],
      keywords: "projects open source work",
      perform: () => router.push("/projects"),
    },
    {
      id: "til",
      name: "Knowledge Base (TIL)",
      shortcut: ["t"],
      keywords: "til writing blog learn",
      perform: () => router.push("/writing/til"),
    },
    {
      id: "lab",
      name: "The Lab",
      shortcut: ["l"],
      keywords: "lab experiments code",
      perform: () => router.push("/lab"),
    },
    {
      id: "contact",
      name: "Book a Coffee Chat",
      shortcut: ["c"],
      keywords: "contact talk schedule meeting cal.com email",
      perform: () => window.open("https://cal.com/debatreya", "_blank"),
    },
    {
      id: "theme",
      name: "Toggle Theme",
      shortcut: ["d"],
      keywords: "theme dark light mode",
      perform: () => {
        // Toggle theme logic will go here if needed to be exposed globally
        // For now, next-themes system preference handles the default.
        const currentTheme = document.documentElement.className.includes("dark")
          ? "light"
          : "dark";
        document.documentElement.className = currentTheme;
      },
    },
  ];

  return (
    <KBarProvider actions={actions}>
      <KBarPortal>
        <KBarPositioner className="z-[100] bg-black/50 backdrop-blur-sm px-4 flex items-start justify-center pt-[20vh]">
          <KBarAnimator className="w-full max-w-xl bg-background border rounded-2xl shadow-2xl overflow-hidden">
            <KBarSearch
              className="w-full px-6 py-4 text-lg bg-transparent border-b outline-none text-foreground placeholder-muted-foreground"
              defaultPlaceholder="Type a command or search..."
            />
            <RenderResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  );
}

function RenderResults() {
  const { results, rootActionId } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {item}
          </div>
        ) : (
          <div
            className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${
              active
                ? "bg-accent text-accent-foreground"
                : "text-foreground hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-2">
              {item.icon && <span className="w-4 h-4">{item.icon}</span>}
              <div className="flex flex-col">
                <span className="font-medium">{item.name}</span>
                {item.subtitle && (
                  <span className="text-xs text-muted-foreground">
                    {item.subtitle}
                  </span>
                )}
              </div>
            </div>
            {item.shortcut?.length ? (
              <div className="flex gap-1">
                {item.shortcut.map((sc) => (
                  <kbd
                    key={sc}
                    className="px-2 py-1 text-xs font-medium bg-background border rounded text-muted-foreground"
                  >
                    {sc}
                  </kbd>
                ))}
              </div>
            ) : null}
          </div>
        )
      }
    />
  );
}
