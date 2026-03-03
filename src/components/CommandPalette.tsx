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
import { useTheme } from "next-themes";
import type React from "react";

export function CommandPalette({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();

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
      perform: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
    },
  ];

  return (
    <KBarProvider actions={actions}>
      <KBarPortal>
        <KBarPositioner className="z-[100] bg-black/60 backdrop-blur-sm px-4 flex items-start justify-center pt-[20vh]">
          <KBarAnimator className="w-full max-w-2xl bg-background border border-border rounded-xl shadow-2xl overflow-hidden ring-1 ring-border">
            <KBarSearch
              className="w-full px-6 py-4 text-base font-mono bg-transparent border-b border-border outline-none text-foreground placeholder-muted-foreground focus:ring-0"
              defaultPlaceholder="_"
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
  const { results } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div className="px-5 py-3 text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest mt-2 border-b border-border">
            {item}
          </div>
        ) : (
          <div
            className={`px-5 py-3 flex items-center justify-between cursor-pointer transition-colors border-l-2 border-transparent ${
              active
                ? "bg-primary/10 border-l-primary text-primary"
                : "text-foreground hover:bg-muted/50"
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
              <div className="flex gap-1.5 opacity-50">
                {item.shortcut.map((sc) => (
                  <kbd
                    key={sc}
                    className="px-1.5 py-0.5 min-w-[20px] text-[10px] font-mono flex items-center justify-center bg-muted border border-border rounded-sm text-muted-foreground uppercase"
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
